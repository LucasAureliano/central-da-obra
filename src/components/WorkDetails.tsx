import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, MapPin, Calendar, DollarSign, Activity } from 'lucide-react';
import { TimelineView } from './works/TimelineView';
import { DocumentsView } from './works/DocumentsView';
import { BudgetList } from './works/BudgetList';
import { WorkDiary } from './works/WorkDiary';
import { useAuth } from '../contexts/AuthContext';

interface WorkDetailsProps {
  workId: string;
  onBack: () => void;
}

export function WorkDetails({ workId, onBack }: WorkDetailsProps) {
  const { profile } = useAuth();
  const [work, setWork] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'resumo' | 'cronograma' | 'financas' | 'orcamento' | 'diario' | 'documentos'>('resumo');
  const [calculations, setCalculations] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const docRef = doc(db, 'works', workId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setWork({ id: snap.id, ...snap.data() });
      }
    });

    const calcsQuery = collection(db, 'works', workId, 'calculations');
    const unsubscribeCalcs = onSnapshot(calcsQuery, (snap) => {
      const calcs: any[] = [];
      let spent = 0;
      snap.forEach(c => {
        const data = c.data();
        calcs.push({ id: c.id, ...data });
        if (data.totalCost) {
          spent += data.totalCost;
        }
      });
      // Sort by date descending
      calcs.sort((a, b) => {
        const dateA = a.savedAt?.toDate ? a.savedAt.toDate() : new Date();
        const dateB = b.savedAt?.toDate ? b.savedAt.toDate() : new Date();
        return dateB.getTime() - dateA.getTime();
      });
      setCalculations(calcs);
      setTotalSpent(spent);
    });

    return () => {
      unsubscribe();
      unsubscribeCalcs();
    };
  }, [workId]);

  if (!work) {
    return (
      <div className="screen-content animate-fade-in" style={{ padding: 20, textAlign: 'center' }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: 100 }}>
      {/* Header Imagem */}
      <div style={{ height: 200, position: 'relative' }}>
        <img 
          src={work.image || 'https://images.unsplash.com/photo-1541888081622-19e5d424b94a?q=80&w=600&auto=format&fit=crop'} 
          alt={work.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
        
        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: 24, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          <span className={`status-chip ${work.progress === 100 ? 'status-active' : work.progress > 50 ? 'status-warning' : 'status-danger'}`} style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#FFF', marginBottom: 8, display: 'inline-block' }}>
            {work.status || 'Em Andamento'}
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#FFF', marginBottom: 4 }}>{work.name}</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} />
            {work.address || 'Endereço não informado'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveTab('resumo')}
          style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: activeTab === 'resumo' ? 700 : 600, color: activeTab === 'resumo' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'resumo' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 8, cursor: 'pointer' }}
        >
          Resumo
        </button>
        <button 
          onClick={() => setActiveTab('cronograma')}
          style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: activeTab === 'cronograma' ? 700 : 600, color: activeTab === 'cronograma' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'cronograma' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 8, cursor: 'pointer' }}
        >
          Cronograma
        </button>
        {profile?.role !== 'owner' && (
          <button 
            onClick={() => setActiveTab('financas')}
            style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: activeTab === 'financas' ? 700 : 600, color: activeTab === 'financas' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'financas' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 8, cursor: 'pointer' }}
          >
            Finanças
          </button>
        )}
        <button 
          onClick={() => setActiveTab('orcamento')}
          style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: activeTab === 'orcamento' ? 700 : 600, color: activeTab === 'orcamento' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'orcamento' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 8, cursor: 'pointer' }}
        >
          Orçamento
        </button>
        <button 
          onClick={() => setActiveTab('diario')}
          style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: activeTab === 'diario' ? 700 : 600, color: activeTab === 'diario' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'diario' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 8, cursor: 'pointer' }}
        >
          Diário
        </button>
        <button 
          onClick={() => setActiveTab('documentos')}
          style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: activeTab === 'documentos' ? 700 : 600, color: activeTab === 'documentos' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'documentos' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 8, cursor: 'pointer' }}
        >
          Documentos
        </button>
      </div>

      {/* Content */}
      {activeTab === 'resumo' && (
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {profile?.role !== 'owner' && (
              <div className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <DollarSign size={16} /> <span style={{ fontSize: 12, fontWeight: 600 }}>Orçamento</span>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{work.budget || 'N/A'}</p>
              </div>
            )}
            <div className="glass-panel" style={{ padding: 16, borderRadius: 16, gridColumn: profile?.role === 'owner' ? 'span 2' : 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 8 }}>
                <Calendar size={16} /> <span style={{ fontSize: 12, fontWeight: 600 }}>Prazo</span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{work.deadline || 'N/A'}</p>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={18} color="var(--color-primary)" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>Progresso Geral</h3>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary)' }}>{work.progress || 0}%</span>
            </div>
            <div style={{ height: 8, backgroundColor: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${work.progress || 0}%`, height: '100%', backgroundColor: work.progress === 100 ? 'var(--color-success)' : 'var(--color-primary)', borderRadius: 4, transition: 'width 1s ease-out' }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
              Baseado nas tarefas concluídas no Cronograma.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'cronograma' && (
        <TimelineView workId={workId} />
      )}

      {activeTab === 'diario' && (
        <WorkDiary workId={workId} />
      )}

      {activeTab === 'documentos' && (
        <DocumentsView workId={work.id} />
      )}

      {activeTab === 'orcamento' && (
        <BudgetList workId={workId} calculations={calculations} />
      )}

      {activeTab === 'financas' && (
        <div style={{ padding: 20 }}>
          <div className="glass-panel" style={{ padding: 24, borderRadius: 16, marginBottom: 24, background: 'linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%)', color: '#FFF' }}>
            <h3 style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Custo Total Registrado</h3>
            <p style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
              R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {work.budget && (
              <p style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
                Orçamento inicial: {work.budget}
              </p>
            )}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>
            Despesas da Obra ({calculations.length})
          </h3>
          
          <div className="animate-fade-in" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Histórico de Despesas</h3>
            {calculations.length > 0 ? (
              calculations.map((calc, idx) => (
                <div key={calc.id || idx} className="glass-panel" style={{ padding: 16, borderRadius: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)' }}>{calc.calcType || 'Cálculo Genérico'}</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(calc.savedAt?.toDate?.() || Date.now()).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#EF4444' }}>
                    - R$ {calc.totalCost ? calc.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Nenhum cálculo salvo nesta obra.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'documentos' && (
        <div className="animate-fade-in">
          <DocumentsView workId={work.id} />
        </div>
      )}
    </div>
  );
}
