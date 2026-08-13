import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, Activity, Download, Filter, Target, ArrowLeft } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { useBuilder } from '../../contexts/BuilderContext';
import { useAuth } from '../../contexts/AuthContext';
import { generateCorporateReportPDF } from '../../lib/CorporateReportPDF';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line, ComposedChart } from 'recharts';

export function CorporateBI({ onBack }: { onBack?: () => void }) {
  const { works, isLoadingWorks } = useWorks();
  const { employees, equipments } = useBuilder();
  const { profile } = useAuth();

  const handleExportPDF = async () => {
    const totalBudget = works.reduce((acc, w) => acc + (w.budget || 0), 0);
    const totalSpent = works.reduce((acc, w) => acc + (w.spent || 0), 0);
    const delayedWorks = works.filter(w => w.status === 'Atrasada').length;
    const activeWorks = works.filter(w => w.status === 'Em Andamento').length;

    await generateCorporateReportPDF({
      builderName: profile?.name || 'Construtora',
      totalWorks: works.length,
      activeWorks,
      delayedWorks,
      totalBudget,
      totalSpent,
      activeEmployees: employees.filter(e => e.status === 'Ativo').length,
      equipmentInUse: equipments.filter(eq => eq.status === 'Em Uso').length,
      worksDetails: works
    });
  };

  // Dynamic Curva S (Avanço Físico)
  // Baseado no progresso médio das obras ativas
  const curvaSData = useMemo(() => {
    if (works.length === 0) return [];
    
    // Simulate S-Curve based on actual average progress vs expected
    const avgProgress = works.reduce((acc, w) => acc + (w.progress || 0), 0) / works.length;
    // Expected progress could be calculated based on start/end dates if available
    // For now, we project a standard S-curve reaching the current average progress
    const now = new Date();
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonthIndex = now.getMonth();
    
    const data = [];
    for (let i = 5; i >= 0; i--) {
      let monthIdx = currentMonthIndex - i;
      if (monthIdx < 0) monthIdx += 12;
      
      const factor = 1 - (i * 0.2); // Simple linear approach for the last 6 months
      
      data.push({
        name: months[monthIdx],
        Previsto: Math.min(100, Math.round((avgProgress + 10) * factor)),
        Realizado: Math.round(avgProgress * factor)
      });
    }
    return data;
  }, [works]);

  const profitByWorkData = works.map(w => ({
    name: w.name,
    Receita: w.budget || 0,
    Custo: w.spent || 0,
    Lucro: (w.budget || 0) - (w.spent || 0),
    Margem: w.budget ? (((w.budget - (w.spent || 0)) / w.budget) * 100).toFixed(1) : 0
  }));

  const globalStatus = {
    totalWorks: works.length,
    delayedWorks: works.filter(w => w.status === 'Atrasada').length,
    totalBudget: works.reduce((acc, w) => acc + (w.budget || 0), 0),
    totalSpent: works.reduce((acc, w) => acc + (w.spent || 0), 0)
  };

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      <header className="page-header" style={{ marginBottom: 24, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} className="back-button">
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <BarChart2 size={28} color="#8B5CF6" />
              Indicadores BI
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Business Intelligence e Curva S</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleExportPDF} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, height: 40 }}>
            <Download size={18} />
            Exportar Relatório
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={16} color="#3B82F6" /> SPI (Schedule Performance Index)
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>
                {(() => {
                   let totalEV = 0;
                   let totalPV = 0;
                   works.forEach(w => {
                     const ev = (w.budget || 0) * (w.progress || 0) / 100;
                     let pv = ev;
                     if (w.createdAt && w.deadline) {
                       const start = w.createdAt.toDate ? w.createdAt.toDate() : new Date(w.createdAt);
                       const end = new Date(w.deadline);
                       const now = new Date();
                       const totalDays = (end.getTime() - start.getTime()) || 1;
                       const passedDays = Math.max(0, Math.min(totalDays, now.getTime() - start.getTime()));
                       pv = (w.budget || 0) * (passedDays / totalDays);
                     }
                     totalEV += ev;
                     totalPV += pv;
                   });
                   if (totalPV === 0) return '1.00';
                   return (totalEV / totalPV).toFixed(2);
                })()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Cronograma vs Previsto (Ideal = 1.0)</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Target size={16} color="#10B981" /> CPI (Cost Performance Index)
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>
                {(() => {
                   let totalEV = 0;
                   let totalAC = 0;
                   works.forEach(w => {
                     totalEV += (w.budget || 0) * (w.progress || 0) / 100;
                     totalAC += (w.spent || 0);
                   });
                   if (totalAC === 0) return '1.00';
                   return (totalEV / totalAC).toFixed(2);
                })()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Custo vs Valor Agregado (Ideal &gt; 1.0)</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <PieChart size={16} color="#F59E0B" /> Atraso Geral
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>
                  {globalStatus.totalWorks > 0 ? Math.round((globalStatus.delayedWorks / globalStatus.totalWorks) * 100) : 0}%
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Obras da carteira atrasadas</div>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            {/* Curva S */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Curva S Agregada (Avanço Físico %)</h3>
              <div style={{ height: 320, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curvaSData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-subtle)', borderRadius: 12, color: 'var(--text-main)' }}
                    />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="Previsto" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="Realizado" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Margem de Lucro por Obra */}
          {profitByWorkData.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Margem Líquida por Obra</h3>
              <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={profitByWorkData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-subtle)', borderRadius: 12, color: 'var(--text-main)' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="Lucro" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="Margem" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

        </div>
      )}
    </div>
  );
}
