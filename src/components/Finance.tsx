import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Building2, AlertCircle } from 'lucide-react';
import { EmptyState3D } from './EmptyState3D';

export function Finance() {
  const { user, isGuest } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Totals
  const [totalSpent, setTotalSpent] = useState(0);
  const [worksCount, setWorksCount] = useState(0);
  
  // Recent transactions mock (we could implement a real one later)
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);

  useEffect(() => {
    const fetchGlobalFinance = async () => {
      if (!user || isGuest) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all works
        const qWorks = query(collection(db, 'works'), where('userId', '==', user.uid));
        const worksSnapshot = await getDocs(qWorks);
        
        let total = 0;
        let expensesList: any[] = [];
        
        for (const doc of worksSnapshot.docs) {
          const workData = doc.data();
          const workName = workData.name;
          
          // Fetch calculations for this work to get real costs
          const qCalcs = query(collection(db, `works/${doc.id}/calculations`));
          const calcsSnapshot = await getDocs(qCalcs);
          
          calcsSnapshot.docs.forEach(calcDoc => {
            const calc = calcDoc.data();
            let calcCost = 0;
            
            if (calc.materials && Array.isArray(calc.materials)) {
              calc.materials.forEach((m: any) => {
                if (m.isPurchased && m.total) {
                  calcCost += m.total;
                  expensesList.push({
                    id: Math.random().toString(36).substr(2, 9),
                    title: m.name,
                    work: workName,
                    amount: m.total,
                    date: calc.savedAt?.toDate ? calc.savedAt.toDate() : new Date(),
                    type: 'material'
                  });
                }
              });
            } else if (calc.totalCost) {
              // Legacy or generic total
              calcCost += calc.totalCost;
              expensesList.push({
                id: Math.random().toString(36).substr(2, 9),
                title: calc.category || 'Orçamento',
                work: workName,
                amount: calc.totalCost,
                date: calc.savedAt?.toDate ? calc.savedAt.toDate() : new Date(),
                type: 'general'
              });
            }
            
            total += calcCost;
          });
        }
        
        // Sort expenses by date descending
        expensesList.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        setTotalSpent(total);
        setWorksCount(worksSnapshot.size);
        setRecentExpenses(expensesList.slice(0, 10)); // Top 10 recent
        
      } catch (error) {
        console.error("Error fetching finance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalFinance();
  }, [user, isGuest]);

  if (loading) {
    return (
      <div className="screen-content animate-fade-in" style={{ padding: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Financeiro</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton-glass" style={{ height: 140, borderRadius: 24 }} />
          <div className="skeleton-glass" style={{ height: 80, borderRadius: 16 }} />
          <div className="skeleton-glass" style={{ height: 80, borderRadius: 16 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content animate-fade-in" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Visão Global</h1>
      
      {totalSpent === 0 ? (
        <EmptyState3D 
          icon={<DollarSign size={40} />}
          title="Nenhum gasto registrado"
          description="Você ainda não registrou orçamentos ou compras de materiais em suas obras."
        />
      ) : (
        <>
          {/* Main Dashboard Card */}
          <div className="glass-panel animate-slide-up" style={{ padding: 24, borderRadius: 24, marginBottom: 24, background: 'linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%)', color: '#FFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, opacity: 0.9 }}>
              <Wallet size={24} />
              <span style={{ fontSize: 15, fontWeight: 500 }}>Total Gasto (Todas as Obras)</span>
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: -1 }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
            </h2>
            <div style={{ display: 'flex', gap: 16, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Obras Ativas</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <Building2 size={16} />
                  <span>{worksCount} obras</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Tendência</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#10B981' }}>
                  <TrendingUp size={16} />
                  <span>Saudável</span>
                </div>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Gastos Recentes</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentExpenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                Nenhuma despesa recente.
              </div>
            ) : (
              recentExpenses.map((exp) => (
                <div key={exp.id} className="glass-panel" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                      <TrendingDown size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)' }}>{exp.title}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{exp.work}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#EF4444' }}>
                      -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(exp.amount)}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {exp.date.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div style={{ marginTop: 24, padding: 16, backgroundColor: 'var(--color-primary-alpha)', borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AlertCircle size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: 'var(--color-primary)', lineHeight: 1.5 }}>
              O módulo Financeiro consolidado junta todas as suas despesas atreladas às calculadoras e orçamentos. Cadastre materiais em suas obras e marque-os como comprados para que apareçam aqui!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
