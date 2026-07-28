import { Activity, Target, BarChart3, ArrowLeft } from 'lucide-react';

export function CorporateBI({ onBack }: { onBack?: () => void }) {

  // Curva S Mock Data points for Physical vs Financial
  const sCurvePoints = [
    { month: 'Jan', physical: 8, financial: 10 },
    { month: 'Fev', physical: 18, financial: 22 },
    { month: 'Mar', physical: 32, financial: 35 },
    { month: 'Abr', physical: 48, financial: 45 },
    { month: 'Mai', physical: 65, financial: 60 },
    { month: 'Jun', physical: 82, financial: 78 },
  ];

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Indicadores BI & Curva S</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Dashboards analíticos de avanço físico vs financeiro corporativo</p>
          </div>
        </div>
      </div>

      {/* 1. CURVA S DE PROGRESSO */}
      <div className="glass-panel" style={{ padding: 22, borderRadius: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="#8B5CF6" /> Curva S Executiva (Avanço Físico x Financeiro)
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Média acumulada de todas as obras ativas</span>
          </div>

          <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 700 }}>
            <span style={{ color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 4 }}>● Físico (%)</span>
            <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 4 }}>● Financeiro (%)</span>
          </div>
        </div>

        {/* Visual S-Curve Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingTop: 20, borderBottom: '1px solid var(--border-subtle)' }}>
          {sCurvePoints.map(pt => (
            <div key={pt.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 4 }}>
              <div style={{ width: '60%', display: 'flex', gap: 3, alignItems: 'flex-end', height: '80%' }}>
                {/* Physical Bar */}
                <div style={{ flex: 1, height: `${pt.physical}%`, backgroundColor: '#8B5CF6', borderRadius: '4px 4px 0 0' }} />
                {/* Financial Bar */}
                <div style={{ flex: 1, height: `${pt.financial}%`, backgroundColor: '#F59E0B', borderRadius: '4px 4px 0 0' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{pt.month}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
          Avanço Físico Atual: <strong style={{ color: '#8B5CF6' }}>82%</strong> • Desembolso Financeiro: <strong style={{ color: '#F59E0B' }}>78%</strong> (Obra no prazo e dentro do custo)
        </div>
      </div>

      {/* 2. PRODUTIVIDADE E COMPRAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div className="glass-panel" style={{ padding: 18, borderRadius: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Target size={16} color="#10B981" /> Produtividade de Campo
          </h4>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#10B981', display: 'block' }}>94.2%</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Cumprimento de metas semanais de cronograma</span>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={16} color="#3B82F6" /> Eficiência de Suprimentos
          </h4>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#3B82F6', display: 'block' }}>91.5%</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Compras entregues dentro do prazo previsto</span>
        </div>
      </div>
    </div>
  );
}
