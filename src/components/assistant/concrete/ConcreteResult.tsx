import { CheckCircle2, ListChecks, Home } from 'lucide-react';
import type { ConcreteData } from './ConcreteWizard';
import type { AssistantMode } from '../SmartAssistant';

export function ConcreteResult({ data, mode, onHome }: { data: ConcreteData, mode: AssistantMode, onHome: () => void }) {
  
  const calculate = () => {
    const v = data.volume;
    const lossMargin = mode === 'pro' ? 1.05 : 1.10;
    
    const concreteData: Record<string, { cement: number; sand: number; gravel: number; water: number }> = {
      '15': { cement: 5, sand: 0.72, gravel: 0.60, water: 180 },
      '20': { cement: 6, sand: 0.65, gravel: 0.65, water: 190 },
      '25': { cement: 7, sand: 0.60, gravel: 0.70, water: 200 },
      '30': { cement: 8, sand: 0.55, gravel: 0.75, water: 210 },
    };

    const ratio = concreteData[data.fck];
    
    return {
      cementBags: Math.ceil((v * ratio.cement) * lossMargin),
      sandM3: ((v * ratio.sand) * lossMargin).toFixed(2),
      gravelM3: ((v * ratio.gravel) * lossMargin).toFixed(2),
      waterL: Math.ceil((v * ratio.water) * lossMargin)
    };
  };

  const result = calculate();

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <CheckCircle2 size={32} color="#10B981" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Traço Calculado</h2>
        <p style={{ color: 'var(--text-muted)' }}>Cálculo processado no Modo {mode === 'pro' ? 'Profissional' : 'Rápido'}.</p>
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 24, backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#3B82F6', fontWeight: 700, marginBottom: 16 }}>Resumo do Volume</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Volume Base</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{data.volume.toFixed(2)} m³</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Resistência</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>FCK {data.fck}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Materiais Necessários</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-muted)' }}>Cimento (50kg)</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.cementBags} sacos</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-muted)' }}>Areia Média</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.sandM3} m³</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-muted)' }}>Brita (Pedra)</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.gravelM3} m³</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Água Estimada</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.waterL} Litros</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>* A quantidade de água pode variar devido à umidade da areia. O excedente ({mode === 'pro' ? '5%' : '10%'}) já está embutido por conta de perdas no processo.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn-primary" style={{ padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <ListChecks size={20} /> Salvar como Obra
        </button>
        <button onClick={onHome} style={{ padding: 16, borderRadius: 16, border: 'none', background: 'transparent', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <Home size={20} /> Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}
