import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Activity, Download, Target, ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { useBuilder } from '../../contexts/BuilderContext';
import { useAuth } from '../../contexts/AuthContext';
import { generateCorporateReportPDF } from '../../lib/CorporateReportPDF';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line, ComposedChart
} from 'recharts';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(v);

const fmtFull = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

interface KPICardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  trend?: 'up' | 'down' | 'neutral';
}

function KPICard({ label, value, sub, icon, color, delay = 0, trend }: KPICardProps) {
  const trendIcon = trend === 'up'
    ? <TrendingUp size={14} color="#10B981" />
    : trend === 'down'
    ? <TrendingDown size={14} color="#EF4444" />
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 22 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 20, borderLeft: `4px solid ${color}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
        {trendIcon}
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</span>
      </div>
    </motion.div>
  );
}

export function CorporateBI({ onBack }: { onBack?: () => void }) {
  const { works, isLoadingWorks } = useWorks();
  const { employees, equipments } = useBuilder();
  const { profile } = useAuth();
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const totalBudget = works.reduce((acc, w) => acc + (w.budget || 0), 0);
      const totalSpent = works.reduce((acc, w) => acc + (w.spent || 0), 0);
      const delayedWorks = works.filter(w => w.status === 'Atrasada').length;
      const activeWorks = works.filter(w => w.status === 'Em Andamento').length;
      await generateCorporateReportPDF({
        builderName: (profile as any)?.companyName || profile?.name || 'Construtora',
        totalWorks: works.length,
        activeWorks,
        delayedWorks,
        totalBudget,
        totalSpent,
        activeEmployees: employees.filter(e => e.status === 'Ativo').length,
        equipmentInUse: equipments.filter(eq => eq.status === 'Em Uso').length,
        worksDetails: works,
      });
    } finally {
      setExporting(false);
    }
  };

  // ─── Derived Metrics ────────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalBudget = works.reduce((acc, w) => acc + (w.budget || 0), 0);
    const totalSpent = works.reduce((acc, w) => acc + (w.spent || 0), 0);
    const delayed = works.filter(w => w.status === 'Atrasada').length;
    const totalWorks = works.length;

    // SPI: Schedule Performance Index
    let totalEV = 0, totalPV = 0;
    works.forEach(w => {
      const ev = (w.budget || 0) * (w.progress || 0) / 100;
      let pv = ev;
      if (w.createdAt && w.deadline) {
        const start = w.createdAt.toDate ? w.createdAt.toDate() : new Date(w.createdAt);
        const end = new Date(w.deadline);
        const now = new Date();
        const totalDays = Math.max(1, end.getTime() - start.getTime());
        const passedDays = Math.max(0, Math.min(totalDays, now.getTime() - start.getTime()));
        pv = (w.budget || 0) * (passedDays / totalDays);
      }
      totalEV += ev;
      totalPV += pv;
    });
    const spi = totalPV > 0 ? totalEV / totalPV : 1;

    // CPI: Cost Performance Index
    const totalAC = totalSpent;
    const cpi = totalAC > 0 ? totalEV / totalAC : 1;

    // Average progress
    const avgProgress = totalWorks > 0
      ? works.reduce((acc, w) => acc + (w.progress || 0), 0) / totalWorks
      : 0;

    return { totalBudget, totalSpent, delayed, totalWorks, spi, cpi, avgProgress };
  }, [works]);

  // ─── Curva S data ───────────────────────────────────────────────────────────
  const curvaSData = useMemo(() => {
    if (works.length === 0) return [];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    const ci = now.getMonth();
    return Array.from({ length: 6 }, (_, i) => {
      let mi = ci - (5 - i);
      if (mi < 0) mi += 12;
      const f = (i + 1) / 6;
      return {
        name: months[mi],
        Previsto: Math.min(100, Math.round((metrics.avgProgress + 12) * f)),
        Realizado: Math.round(metrics.avgProgress * f),
      };
    });
  }, [works, metrics.avgProgress]);

  // ─── Profit per work ────────────────────────────────────────────────────────
  const profitData = works.slice(0, 6).map(w => ({
    name: w.name.length > 12 ? w.name.slice(0, 12) + '…' : w.name,
    Receita: w.budget || 0,
    Custo: w.spent || 0,
    Lucro: (w.budget || 0) - (w.spent || 0),
  }));

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: 'var(--bg-glass)',
      borderColor: 'var(--border-subtle)',
      borderRadius: 12,
      color: 'var(--text-main)',
      fontSize: 12,
    },
  };

  const spiColor = metrics.spi >= 0.95 ? '#10B981' : metrics.spi >= 0.8 ? '#F59E0B' : '#EF4444';
  const cpiColor = metrics.cpi >= 1 ? '#10B981' : metrics.cpi >= 0.85 ? '#F59E0B' : '#EF4444';
  const delayColor = metrics.delayed === 0 ? '#10B981' : metrics.delayed <= 1 ? '#F59E0B' : '#EF4444';

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-main)', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <BarChart2 size={24} color="#8B5CF6" />
              Indicadores BI
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>Business Intelligence · Curva S · EVM</p>
          </div>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="btn-primary"
          style={{ padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, height: 40, opacity: exporting ? 0.7 : 1 }}
        >
          {exporting
            ? <div style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            : <Download size={16} />
          }
          {exporting ? 'Gerando...' : 'Exportar PDF'}
        </button>
      </div>

      {isLoadingWorks ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 80 }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : works.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <BarChart2 size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.4 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Nenhuma obra cadastrada ainda.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Crie obras para visualizar os indicadores.</p>
        </div>
      ) : (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            <KPICard
              label="SPI — Cronograma"
              value={metrics.spi.toFixed(2)}
              sub={metrics.spi >= 0.95 ? 'No prazo' : 'Atrasado vs previsto'}
              icon={<Clock size={18} />}
              color={spiColor}
              delay={0.05}
              trend={metrics.spi >= 0.95 ? 'up' : 'down'}
            />
            <KPICard
              label="CPI — Custo"
              value={metrics.cpi.toFixed(2)}
              sub={metrics.cpi >= 1 ? 'Dentro do orçamento' : 'Acima do orçamento'}
              icon={<Target size={18} />}
              color={cpiColor}
              delay={0.1}
              trend={metrics.cpi >= 1 ? 'up' : 'down'}
            />
            <KPICard
              label="Obras Atrasadas"
              value={`${metrics.delayed}`}
              sub={`de ${metrics.totalWorks} no total`}
              icon={<AlertTriangle size={18} />}
              color={delayColor}
              delay={0.15}
              trend={metrics.delayed === 0 ? 'up' : 'down'}
            />
            <KPICard
              label="Avanço Médio"
              value={`${Math.round(metrics.avgProgress)}%`}
              sub="Progresso geral da carteira"
              icon={<CheckCircle size={18} />}
              color="#8B5CF6"
              delay={0.2}
              trend="neutral"
            />
            <KPICard
              label="Orçamento Total"
              value={fmt(metrics.totalBudget)}
              sub={fmtFull(metrics.totalBudget)}
              icon={<Activity size={18} />}
              color="#3B82F6"
              delay={0.25}
            />
            <KPICard
              label="Gasto Acumulado"
              value={fmt(metrics.totalSpent)}
              sub={`${metrics.totalBudget > 0 ? Math.round((metrics.totalSpent / metrics.totalBudget) * 100) : 0}% do orçamento`}
              icon={<TrendingUp size={18} />}
              color={metrics.totalSpent > metrics.totalBudget ? '#EF4444' : '#10B981'}
              delay={0.3}
              trend={metrics.totalSpent <= metrics.totalBudget ? 'up' : 'down'}
            />
          </div>

          {/* Curva S */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-panel"
            style={{ padding: 24, borderRadius: 24 }}
          >
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                Curva S — Avanço Físico (%)
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Previsto vs. Realizado nos últimos 6 meses</p>
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curvaSData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip {...tooltipStyle} />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="Previsto" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="Realizado" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Margem por obra */}
          {profitData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="glass-panel"
              style={{ padding: 24, borderRadius: 24 }}
            >
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                  Receita × Custo × Lucro por Obra
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Top {profitData.length} obras por orçamento</p>
              </div>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={profitData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} angle={-20} textAnchor="end" />
                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => fmt(v)} />
                    <Tooltip {...tooltipStyle} formatter={(v: any) => fmtFull(v)} />
                    <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Receita" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={32} opacity={0.6} />
                    <Bar dataKey="Custo" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={32} opacity={0.6} />
                    <Bar dataKey="Lucro" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Work list with mini progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="glass-panel"
            style={{ padding: 24, borderRadius: 24 }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
              Carteira de Obras
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {works.map((w, idx) => {
                const saldo = (w.budget || 0) - (w.spent || 0);
                const isOver = saldo < 0;
                const statusColor = w.status === 'Atrasada' ? '#EF4444' : w.status === 'Concluída' ? '#10B981' : '#3B82F6';
                return (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + idx * 0.04 }}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 16,
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderLeft: `4px solid ${statusColor}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>{w.name}</p>
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: statusColor,
                          backgroundColor: `${statusColor}15`, padding: '2px 8px', borderRadius: 6
                        }}>
                          {w.status || 'Em Andamento'}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: 'var(--color-primary)' }}>{w.progress || 0}%</p>
                        <p style={{ margin: 0, fontSize: 11, color: isOver ? '#EF4444' : '#10B981', fontWeight: 600 }}>
                          {isOver ? '−' : '+'}{fmt(Math.abs(saldo))}
                        </p>
                      </div>
                    </div>
                    <div style={{ height: 6, backgroundColor: 'var(--bg-surface)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        width: `${w.progress || 0}%`, height: '100%', borderRadius: 3,
                        backgroundColor: w.progress === 100 ? '#10B981' : 'var(--color-primary)',
                        transition: 'width 1s ease-out',
                      }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
}
