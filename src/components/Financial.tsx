import { useState, useEffect } from 'react';
import { 
  ArrowLeft, TrendingUp, TrendingDown, DollarSign, 
  Wallet, PieChart, Building2, FileText, ShoppingCart
} from 'lucide-react';
import { EmptyState } from './EmptyState';
import { AnimatedCounter } from './AnimatedCounter';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

export function Financial({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [worksCount, setWorksCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch Works to calculate Total Budget
    const worksQuery = query(collection(db, 'works'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(worksQuery, async (snapshot) => {
      let budgetSum = 0;
      let spentSum = 0;
      let txs: any[] = [];
      
      setWorksCount(snapshot.docs.length);

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        
        let budgetVal = 0;
        if (data.budget !== undefined) {
          if (typeof data.budget === 'number') {
            budgetVal = data.budget;
          } else if (typeof data.budget === 'string') {
            const cleanStr = data.budget.replace(/[^0-9,-]+/g, "").replace(",", ".");
            budgetVal = parseFloat(cleanStr) || 0;
          }
          budgetSum += budgetVal;
        }

        // Fetch calculations subcollection to sum actual spent costs
        const calcQuery = collection(db, 'works', docSnap.id, 'calculations');
        const calcSnap = await getDocs(calcQuery);
        
        calcSnap.forEach(calcDoc => {
          const calcData = calcDoc.data();
          if (calcData.totalCost) {
            spentSum += calcData.totalCost;
            
            txs.push({
              id: calcDoc.id,
              title: `Material: ${calcData.calcType || 'Cálculo'}`,
              workName: data.name,
              amount: calcData.totalCost,
              type: 'expense',
              date: calcData.savedAt?.toDate ? calcData.savedAt.toDate() : new Date()
            });
          }
        });
      }

      setTotalBudget(budgetSum);
      setTotalSpent(spentSum);
      
      // Sort transactions by date descending
      txs.sort((a, b) => b.date.getTime() - a.date.getTime());
      setRecentTransactions(txs.slice(0, 10)); // Top 10
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const balance = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 120 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>

      <div className="flex-space-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="text-2xl font-black">Painel Financeiro</h1>
          <p className="text-xs text-muted">Gestão consolidada das suas {worksCount} obras</p>
        </div>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Wallet size={24} color="#10B981" />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton-glass" style={{ height: 160, width: '100%', borderRadius: 24 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="skeleton-glass" style={{ height: 100, borderRadius: 20 }} />
            <div className="skeleton-glass" style={{ height: 100, borderRadius: 20 }} />
          </div>
          <div className="skeleton-glass" style={{ height: 80, width: '100%', borderRadius: 16 }} />
        </div>
      ) : (
        <>
          {/* Main Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {/* Balance Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel" 
              style={{ padding: 24, borderRadius: 24, background: 'linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%)', color: '#FFF' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.9 }}>Orçamento Disponível</span>
                <DollarSign size={20} opacity={0.9} />
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, marginBottom: 8, letterSpacing: -1 }}>
                <AnimatedCounter value={balance} format="currency" />
              </h2>
              <p style={{ fontSize: 13, opacity: 0.8, margin: 0 }}>
                Total orçado nas obras: R$ {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </motion.div>

            {/* Sub Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="glass-panel" style={{ padding: 16, borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-danger)', marginBottom: 8 }}>
                  <TrendingDown size={16} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Custo Total</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  <AnimatedCounter value={totalSpent} format="currency" />
                </h3>
              </div>
              
              <div className="glass-panel" style={{ padding: 16, borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F59E0B', marginBottom: 8 }}>
                  <PieChart size={16} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>% Comprometido</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  <AnimatedCounter value={percentSpent} format="percentage" />
                </h3>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: 32 }}>
            <div className="flex-space-between" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Consumo do Orçamento Geral</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: percentSpent > 80 ? 'var(--color-danger)' : 'var(--color-primary)' }}>{percentSpent.toFixed(1)}%</span>
            </div>
            <div style={{ height: 8, backgroundColor: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentSpent, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', backgroundColor: percentSpent > 80 ? 'var(--color-danger)' : 'var(--color-primary)', borderRadius: 4 }} 
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
            <button className="btn-secondary" style={{ padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, backgroundColor: 'rgba(16, 185, 129, 0.05)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={20} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Nova Receita</span>
            </button>
            <button className="btn-secondary" style={{ padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingDown size={20} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Nova Despesa</span>
            </button>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex-space-between" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Custos Recentes das Obras</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Ver tudo
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div style={{ marginTop: 16 }}>
                <EmptyState
                  icon={<FileText size={40} />}
                  title="Nenhum Custo Registrado"
                  description="Você ainda não salvou nenhum cálculo nas suas obras. Adicione cálculos e salve-os para acompanhar as despesas."
                  actionLabel="Ir para Calculadoras"
                  onAction={onBack}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentTransactions.map((tx, idx) => (
                  <div key={idx} className="glass-panel card-premium-interactive" style={{ padding: 16, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingCart size={18} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0, marginBottom: 2 }}>{tx.title}</h4>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Building2 size={10} /> {tx.workName}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444', display: 'block' }}>
                        - R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {tx.date.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
