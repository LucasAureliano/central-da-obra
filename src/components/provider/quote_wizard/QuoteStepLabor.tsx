import { Users, AlertCircle, DollarSign } from 'lucide-react';

interface QuoteStepLaborProps {
  labor: { workers: number; days: number; dailyRate: number };
  setLabor: (labor: any) => void;
  totalLabor: number;
}

export function QuoteStepLabor({ labor, setLabor, totalLabor }: QuoteStepLaborProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(30, 58, 138, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <Users size={24} />
          </div>
          <div style={{ flex: 1 }} className="input-group">
            <label style={{ color: 'var(--text-main)' }}>Profissionais Envolvidos</label>
            <input type="number" className="input-field" value={labor.workers} onChange={e => setLabor({...labor, workers: Number(e.target.value)})} style={{ fontSize: 20, fontWeight: 700 }} />
          </div>
        </div>
        
        <div style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <AlertCircle size={24} />
          </div>
          <div style={{ flex: 1 }} className="input-group">
            <label style={{ color: 'var(--text-main)' }}>Dias de Trabalho</label>
            <input type="number" className="input-field" value={labor.days} onChange={e => setLabor({...labor, days: Number(e.target.value)})} style={{ fontSize: 20, fontWeight: 700 }} />
          </div>
        </div>

        <div style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
            <DollarSign size={24} />
          </div>
          <div style={{ flex: 1 }} className="input-group">
            <label style={{ color: 'var(--text-main)' }}>Valor da Diária (R$)</label>
            <input type="number" className="input-field" value={labor.dailyRate} onChange={e => setLabor({...labor, dailyRate: Number(e.target.value)})} style={{ fontSize: 20, fontWeight: 700 }} />
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, backgroundColor: 'var(--color-primary)', color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: 14, opacity: 0.8, display: 'block', marginBottom: 4 }}>Cálculo Automático de Mão de Obra</span>
          <span style={{ fontSize: 13, opacity: 0.6 }}>{labor.workers} pessoas × {labor.days} dias × R$ {labor.dailyRate}</span>
        </div>
        <span style={{ fontSize: 28, fontWeight: 800 }}>R$ {totalLabor.toFixed(2)}</span>
      </div>
    </div>
  );
}
