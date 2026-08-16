import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, ArrowLeft, Download, Search, Filter } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export function BuilderCorporateFinance({ onBack }: { onBack: () => void }) {
  const { works, isLoadingWorks } = useWorks();
  const [period, setPeriod] = useState('Anual');

  // Generate aggregate financial data across all works
  const { totalBudget, totalSpent, totalExpectedProfit, worksData } = useMemo(() => {
    let budget = 0;
    let spent = 0;
    let expectedProfit = 0;
    
    const wData = works.map(w => {
      budget += w.budget || 0;
      spent += w.spent || 0;
      expectedProfit += w.expectedProfit || 0;
      
      return {
        name: w.name,
        Orçamento: w.budget || 0,
        Custo: w.spent || 0,
        Margem: (w.expectedProfit || 0) - (w.spent || 0) // Simulação de margem
      };
    });

    return { totalBudget: budget, totalSpent: spent, totalExpectedProfit: expectedProfit, worksData: wData };
  }, [works]);

  const profitMargin = totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0;
  
  // Dynamic cashflow data generation based on works
  const cashflowData = useMemo(() => {
    if (works.length === 0) return [];
    
    // Simulate cashflow distribution based on actual works data
    const now = new Date();
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonthIndex = now.getMonth();
    
    const data = [];
    // Go back 5 months + current month
    for (let i = 5; i >= 0; i--) {
      let monthIdx = currentMonthIndex - i;
      if (monthIdx < 0) monthIdx += 12;
      
      // Distribute total budget and spent across the last 6 months (simplified model)
      const factor = 1 - (i * 0.1); // Recent months have higher weight
      data.push({
        name: months[monthIdx],
        Entradas: Math.round((totalBudget / 6) * factor),
        Saídas: Math.round((totalSpent / 6) * factor)
      });
    }
    return data;
  }, [works, totalBudget, totalSpent]);

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      <header className="page-header" style={{ marginBottom: 24, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <DollarSign size={28} color="#10B981" />
            Financeiro Corporativo
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>DRE e Fluxo de Caixa Consolidado</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-premium"
            style={{ padding: '8px 16px', height: 40 }}
          >
            <option value="Mensal">Mensal</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Semestral">Semestral</option>
            <option value="Anual">Anual</option>
          </select>
          <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, height: 40 }}>
            <Download size={18} />
            Exportar DRE
          </button>
        </div>
      </header>

      {isLoadingWorks ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Main KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={16} color="#3B82F6" /> VGV Total (Orçamentos)
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>
                R$ {(totalBudget / 1000000).toFixed(2)}M
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingDown size={16} color="#EF4444" /> Custo Realizado
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>
                R$ {(totalSpent / 1000000).toFixed(2)}M
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel" style={{ padding: 20, borderRadius: 20, borderLeft: profitMargin > 15 ? '4px solid #10B981' : '4px solid #F59E0B' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <DollarSign size={16} color="#10B981" /> Margem Bruta
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>
                  {profitMargin.toFixed(1)}%
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Média global</div>
              </div>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            {/* Cashflow Chart */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Fluxo de Caixa Consolidado (YTD)</h3>
              <div style={{ height: 320, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-subtle)', borderRadius: 12, color: 'var(--text-main)' }}
                      formatter={(value: any) => [`${formatCurrency(Number(value))}`, undefined]}
                    />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="Entradas" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorEntradas)" />
                    <Area type="monotone" dataKey="Saídas" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSaidas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* DRE Summary */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>DRE Resumido</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Receita Operacional Bruta</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(totalBudget)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Impostos s/ Receita (Est.)</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>- {formatCurrency((totalBudget * 0.06))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>Receita Líquida</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency((totalBudget * 0.94))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Custos Diretos (Obras)</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>- {formatCurrency(totalSpent)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>Lucro Bruto</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#10B981' }}>{formatCurrency(((totalBudget * 0.94) - totalSpent))}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Perfomance por Obra (BarChart) */}
          {worksData.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Performance por Obra (Realizado x Orçado)</h3>
              <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={worksData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-subtle)', borderRadius: 12, color: 'var(--text-main)' }}
                      formatter={(value: any) => [`${formatCurrency(Number(value))}`, undefined]}
                      itemStyle={{ fontWeight: 600 }}
                    />
                    <Legend />
                    <Bar dataKey="Orçamento" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="Custo" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

        </div>
      )}
    </div>
  );
}
