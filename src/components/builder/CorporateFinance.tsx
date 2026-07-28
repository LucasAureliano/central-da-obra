import { ArrowLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function CorporateFinance({ onBack }: { onBack?: () => void }) {
  const totalRevenue = 4850000;
  const totalExpenses = 3620000;
  const netProfit = 1230000;

  const topProfitableWorks = [
    { name: 'Residencial Alpha', revenue: 1800000, margin: 28 },
    { name: 'Edifício Horizonte', revenue: 2200000, margin: 22 },
    { name: 'Villa Toscana', revenue: 850000, margin: 31 },
  ];

  const categoryBreakdown = [
    { category: 'Mão de Obra & Empreiteiros', percentage: 42, color: '#3B82F6' },
    { category: 'Materiais & Suprimentos', percentage: 38, color: '#8B5CF6' },
    { category: 'Equipamentos & Máquinas', percentage: 12, color: '#F59E0B' },
    { category: 'Encargos & Administrativo', percentage: 8, color: '#10B981' },
  ];

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Financeiro Corporativo</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>DRE, margem de lucro por obra e fluxo de caixa executivo</p>
          </div>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 20, borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Receita Total Contratada</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#10B981' }}>{fmt(totalRevenue)}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
            <ArrowUpRight size={12} color="#10B981" /> +12.4% este mês
          </span>
        </div>

        <div className="glass-panel" style={{ padding: 16, borderRadius: 20, borderLeft: '4px solid #EF4444' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Custos & Despesas Operacionais</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)' }}>{fmt(totalExpenses)}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
            <ArrowDownRight size={12} color="#EF4444" /> DRE Operacional
          </span>
        </div>

        <div className="glass-panel" style={{ padding: 16, borderRadius: 20, borderLeft: '4px solid #3B82F6' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Lucro Líquido Real</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#3B82F6' }}>{fmt(netProfit)}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>Margem Média: <strong>25.3%</strong></span>
        </div>
      </div>

      {/* Despesas por Categoria */}
      <div className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 14 }}>Despesas por Centro de Custo</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {categoryBreakdown.map(cat => (
            <div key={cat.category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
                <span>{cat.category}</span>
                <span style={{ color: cat.color }}>{cat.percentage}%</span>
              </div>
              <div style={{ height: 8, backgroundColor: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${cat.percentage}%`, height: '100%', backgroundColor: cat.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rentabilidade por Obra */}
      <div className="glass-panel" style={{ padding: 20, borderRadius: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 14 }}>Obras Mais Rentáveis</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topProfitableWorks.map(w => (
            <div key={w.name} style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 2px' }}>{w.name}</h4>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Contrato: {fmt(w.revenue)}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: 8 }}>
                  +{w.margin}% Margem
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
