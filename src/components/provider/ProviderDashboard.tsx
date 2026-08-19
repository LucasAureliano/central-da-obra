import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, Activity, Briefcase, FileText, Plus, CalendarDays } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

// Basic TiltCard mockup since we can't easily import the exact one from Dashboard without refactoring
const TiltCard = ({ children, style, onClick }: any) => (
  <div onClick={onClick} style={{ cursor: 'pointer', ...style, transition: 'transform 0.2s' }} 
       onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
       onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
    {children}
  </div>
);

export function ProviderDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user, profile } = useAuth();
  
  // States for real data
  const [servicesCount, setServicesCount] = useState(0);
  const [activeClientsCount, setActiveClientsCount] = useState(0);
  const [monthlyQuotes, setMonthlyQuotes] = useState(0);
  const [expectedBilling, setExpectedBilling] = useState(0);
  const [receivedBilling, setReceivedBilling] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [nextAppointments, setNextAppointments] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubscribes: any[] = [];

    // 1. Services in progress
    const qServices = query(collection(db, 'users', user.uid, 'services'), where('status', 'in', ['Agendado', 'Em andamento', 'Em Execução']));
    unsubscribes.push(onSnapshot(qServices, (snap) => setServicesCount(snap.size)));

    // 2. Active Clients
    const qClients = query(collection(db, 'users', user.uid, 'clients'));
    unsubscribes.push(onSnapshot(qClients, (snap) => setActiveClientsCount(snap.size)));

    // 3. Quotes (to calculate monthly quotes value and conversion rate)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);
    const qQuotes = query(collection(db, 'users', user.uid, 'quotes'));
    unsubscribes.push(onSnapshot(qQuotes, (snap) => {
      let thisMonthTotal = 0;
      let totalQuotes = 0;
      let approvedQuotes = 0;

      snap.forEach(doc => {
        const data = doc.data();
        totalQuotes++;
        if (data.status === 'Aprovado') approvedQuotes++;

        const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        if (date >= startOfMonth) {
          thisMonthTotal += (data.totalValue || data.value || 0);
        }
      });
      setMonthlyQuotes(thisMonthTotal);
      setConversionRate(totalQuotes > 0 ? Math.round((approvedQuotes / totalQuotes) * 100) : 0);
    }));

    // 4. Billing (Expected vs Received)
    const qReceipts = query(collection(db, 'users', user.uid, 'receipts'));
    unsubscribes.push(onSnapshot(qReceipts, (snap) => {
      let expected = 0;
      let received = 0;
      let overdue = 0;
      snap.forEach(doc => {
        const data = doc.data();
        const date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
        
        // Only consider this month's receipts for expected billing
        if (date >= startOfMonth) {
          if (data.status === 'Recebido') received += data.amount;
          else expected += data.amount;
        }

        if (data.status === 'Vencido') overdue++;
      });
      setExpectedBilling(expected + received);
      setReceivedBilling(received);

      // Generate Insight for overdue
      if (overdue > 0) {
        setInsights(prev => {
          const others = prev.filter(i => i.id !== 'overdue');
          return [...others, { id: 'overdue', type: 'delayed', title: 'Pagamentos Vencidos', message: `Você possui ${overdue} recebimento(s) vencido(s).` }];
        });
      }
    }));

    // 5. Next Appointments (Agenda)
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const qAgenda = query(collection(db, 'users', user.uid, 'agenda'));
    unsubscribes.push(onSnapshot(qAgenda, (snap) => {
      const appointments: any[] = [];
      let visitsTomorrow = 0;
      snap.forEach(doc => {
        const data = doc.data();
        const date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
        if (date >= today) appointments.push({ ...data, date });

        if (date >= tomorrow && date < dayAfter) visitsTomorrow++;
      });
      appointments.sort((a,b) => a.date.getTime() - b.date.getTime());
      setNextAppointments(appointments.slice(0, 4));

      // Generate Insight for tomorrow's visits
      if (visitsTomorrow > 0) {
        setInsights(prev => {
          const others = prev.filter(i => i.id !== 'visits');
          return [...others, { id: 'visits', type: 'info', title: 'Visitas Amanhã', message: `Você possui ${visitsTomorrow} compromisso(s) agendado(s) para amanhã.` }];
        });
      }
    }));

    // 6. Latest Quotes
    const qLatestQuotes = query(collection(db, 'users', user.uid, 'quotes'));
    unsubscribes.push(onSnapshot(qLatestQuotes, (snap) => {
      const data: any[] = [];
      snap.forEach(d => data.push({id: d.id, ...d.data()}));
      data.sort((a,b) => (b.createdAt?.toDate?.() || new Date(b.createdAt)).getTime() - (a.createdAt?.toDate?.() || new Date(a.createdAt)).getTime());
      setLatestQuotes(data.slice(0, 3));
    }));

    // 7. Latest Clients
    const qLatestClients = query(collection(db, 'users', user.uid, 'clients'));
    unsubscribes.push(onSnapshot(qLatestClients, (snap) => {
      const data: any[] = [];
      snap.forEach(d => data.push({id: d.id, ...d.data()}));
      setLatestClients(data.slice(0, 3));
    }));

    // 8. Latest Receipts
    unsubscribes.push(onSnapshot(qReceipts, (snap) => {
      const data: any[] = [];
      snap.forEach(d => data.push({id: d.id, ...d.data()}));
      data.sort((a,b) => (b.date?.toDate?.() || new Date(b.date)).getTime() - (a.date?.toDate?.() || new Date(a.date)).getTime());
      setLatestReceipts(data.slice(0, 3));
    }));

    return () => unsubscribes.forEach(u => u());
  }, [user]);

  const [latestQuotes, setLatestQuotes] = useState<any[]>([]);
  const [latestClients, setLatestClients] = useState<any[]>([]);
  const [latestReceipts, setLatestReceipts] = useState<any[]>([]);

  const fmt = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div style={{ padding: '24px 20px', paddingBottom: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
            Olá, {(profile as any)?.displayName || user?.displayName || 'Profissional'} - {(profile as any)?.specialty || localStorage.getItem('pendingSpecialty') || 'Prestador de Serviço'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Bem-vindo ao seu painel.</span>
            <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', borderRadius: 12, fontWeight: 800 }}>
              {(profile as any)?.specialty || localStorage.getItem('pendingSpecialty') || 'Prestador de Serviço'}
            </span>
          </div>
        </div>
      </div>
  
      {/* INSIGHTS */}
      {insights.length > 0 && (
        <>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Insights</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {insights.map(insight => (
              <div key={insight.id} style={{ 
                padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)', 
                borderLeft: `4px solid ${insight.type === 'delayed' ? '#EF4444' : '#3B82F6'}`,
                display: 'flex', gap: 12, alignItems: 'center'
              }}>
                {insight.type === 'delayed' ? <AlertCircle size={20} color="#EF4444" /> : <Activity size={20} color="#3B82F6" />}
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{insight.title}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MINHA EMPRESA - SUPER CARD */}
      <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Minha Empresa</h2>
      
      <div style={{ backgroundColor: 'var(--bg-base)', borderRadius: 24, padding: 24, border: '1px solid var(--border-subtle)', marginBottom: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* ATALHOS REAIS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
          <button className="btn-primary" style={{ padding: '12px 4px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }} onClick={() => onNavigate('novo-orcamento')}>
            <Plus size={20} />
            <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>+ Orçamento</span>
          </button>
          <button className="btn-secondary" style={{ padding: '12px 4px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }} onClick={() => onNavigate('obras')}>
            <Briefcase size={20} />
            <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>Obras</span>
          </button>
          <button className="btn-secondary" style={{ padding: '12px 4px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }} onClick={() => onNavigate('meus-servicos')}>
            <Activity size={20} />
            <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>Serviços</span>
          </button>
          <button className="btn-secondary" style={{ padding: '12px 4px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }} onClick={() => onNavigate('agenda-completa')}>
            <CalendarDays size={20} />
            <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>Agenda</span>
          </button>
        </div>

        {/* ESTATÍSTICAS INTEGRADAS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ backgroundColor: 'var(--bg-body)', padding: 16, borderRadius: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Serviços Ativos</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>{servicesCount}</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-body)', padding: 16, borderRadius: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Clientes Ativos</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-primary)' }}>{activeClientsCount}</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-body)', padding: 16, borderRadius: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Orçamento (Mês)</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{fmt(monthlyQuotes)}</div>
            <div style={{ fontSize: 11, color: 'var(--color-success)', marginTop: 4 }}>{conversionRate}% aprovadas</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-body)', padding: 16, borderRadius: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Faturamento (Mês)</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{fmt(receivedBilling)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Prev: {fmt(expectedBilling)}</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-body)', padding: 16, borderRadius: 16, gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Próximos Atendimentos</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{nextAppointments.length} agendados</div>
              </div>
              <button onClick={() => onNavigate('agenda-completa')} style={{ padding: '6px 12px', borderRadius: 8, backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Ver Agenda</button>
            </div>
          </div>
        </div>
      </div>

      {/* AGENDA */}
      <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Agenda</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {nextAppointments.length > 0 ? nextAppointments.map((app, idx) => (
          <div key={idx} style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)', borderLeft: '4px solid #F59E0B' }} onClick={() => onNavigate('agenda-completa')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{app.title}</p>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {formatDate(app.date)}
              </span>
            </div>
            {app.clientName && <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Cliente: {app.clientName}</p>}
          </div>
        )) : (
          <div style={{ padding: 20, textAlign: 'center', backgroundColor: 'var(--bg-base)', borderRadius: 16, border: '1px dashed var(--border-subtle)' }} onClick={() => onNavigate('agenda-completa')}>
             <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Sem agendamentos próximos.</p>
          </div>
        )}
      </div>

      {/* ORÇAMENTOS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Orçamentos Recentes</h2>
        <button onClick={() => onNavigate('orcamentos')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Ver Todos</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {latestQuotes.length > 0 ? latestQuotes.map(q => (
          <div key={q.id} style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{q.clientName || 'Cliente'}</p>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.status}</span>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{fmt(q.totalValue || q.value || 0)}</div>
          </div>
        )) : (
          <div style={{ padding: 20, textAlign: 'center', backgroundColor: 'var(--bg-base)', borderRadius: 16, border: '1px dashed var(--border-subtle)' }} onClick={() => onNavigate('orcamentos')}>
             <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Nenhum orçamento recente.</p>
          </div>
        )}
      </div>

      {/* RECEBIMENTOS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Recebimentos</h2>
        <button onClick={() => onNavigate('recebimentos')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Ver Todos</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {latestReceipts.length > 0 ? latestReceipts.map(r => (
          <div key={r.id} style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${r.status === 'Recebido' ? '#10B981' : r.status === 'Vencido' ? '#EF4444' : '#F59E0B'}` }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{r.description || 'Recebimento'}</p>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.status}</span>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{fmt(r.amount || 0)}</div>
          </div>
        )) : (
          <div style={{ padding: 20, textAlign: 'center', backgroundColor: 'var(--bg-base)', borderRadius: 16, border: '1px dashed var(--border-subtle)' }} onClick={() => onNavigate('recebimentos')}>
             <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Nenhum recebimento registrado.</p>
          </div>
        )}
      </div>

      {/* MEUS CLIENTES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Meus Clientes</h2>
        <button onClick={() => onNavigate('clientes')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Ver Todos</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {latestClients.length > 0 ? latestClients.map(c => (
          <div key={c.id} style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{c.name}</p>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.phone || c.email || 'Sem contato'}</span>
            </div>
          </div>
        )) : (
          <div style={{ padding: 20, textAlign: 'center', backgroundColor: 'var(--bg-base)', borderRadius: 16, border: '1px dashed var(--border-subtle)' }} onClick={() => onNavigate('clientes')}>
             <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Nenhum cliente cadastrado.</p>
          </div>
        )}
      </div>

      {/* CENTRAL DE CÁLCULOS */}
      <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Central de Cálculos</h2>
      <div style={{ marginBottom: 32 }} onClick={() => onNavigate('calculos')}>
        <TiltCard style={{ padding: 20, borderRadius: 16, background: 'linear-gradient(135deg, var(--color-primary), #60A5FA)', color: '#FFF', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} color="#FFF" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Assistentes Pro</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, opacity: 0.9 }}>Calculadoras de materiais e serviços</p>
          </div>
        </TiltCard>
      </div>

      {/* DICAS */}
      <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Dicas para o seu Negócio</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: 16, borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 700, color: '#10B981' }}>Fidelize seus clientes</h4>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Mantenha sua agenda atualizada e envie lembretes automáticos para não perder visitas técnicas.</p>
        </div>
        <div style={{ padding: 16, borderRadius: 16, backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 700, color: '#F59E0B' }}>Apresentação Profissional</h4>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Sempre envie orçamentos detalhados através do app para transmitir mais confiança.</p>
        </div>
      </div>

    </div>
  );
}
