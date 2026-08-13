import { DollarSign } from 'lucide-react';

interface QuoteStepCostsProps {
  costs: { freight: number; displacement: number; rental: number; others: number };
  setCosts: (costs: any) => void;
  totalCosts: number;
}

export function QuoteStepCosts({ costs, setCosts, totalCosts }: QuoteStepCostsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      {[
        { key: 'freight', title: 'Frete / Logística', desc: 'Transporte de materiais e entulho' },
        { key: 'displacement', title: 'Deslocamento', desc: 'Custos de viagem e pedágio' },
        { key: 'rental', title: 'Locação', desc: 'Aluguel de andaimes ou máquinas' },
        { key: 'others', title: 'Outros Custos', desc: 'Taxas, ART, etc.' }
      ].map((item) => (
        <div key={item.key} className="glass-panel" style={{ padding: 20, borderRadius: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, border: '1px solid var(--border-subtle)' }}>
          <div style={{ flex: '1 1 200px' }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>{item.title}</h4>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
          </div>
          <div className="input-icon-wrapper" style={{ width: 140 }}>
            <DollarSign size={20} />
            <input 
              type="number" 
              className="input-field" 
              style={{ fontWeight: 700, fontSize: 16 }}
              value={(costs as any)[item.key]} 
              onChange={e => setCosts({...costs, [item.key]: Number(e.target.value)})} 
            />
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 20, color: 'var(--text-main)', marginTop: 8 }}>
        Total Adicional: R$ {totalCosts.toFixed(2)}
      </div>
    </div>
  );
}
