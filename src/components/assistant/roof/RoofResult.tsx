import { CheckCircle2, ListChecks, Home } from 'lucide-react';
import type { RoofData } from './RoofWizard';
import type { AssistantMode } from '../SmartAssistant';

export function RoofResult({ data, mode, onHome }: { data: RoofData, mode: AssistantMode, onHome: () => void }) {
  
  const calculate = () => {
    const eavesM = (data.eaves || 0) / 100;
    // Add eaves to width and length depending on shape (simplification)
    let w = data.width;
    let l = data.length;
    
    if (data.shape === 'Quatro Águas') {
      w += (eavesM * 2);
      l += (eavesM * 2);
    } else if (data.shape === 'Duas Águas') {
      w += (eavesM * 2);
      l += (eavesM * 2);
    } else if (data.shape === 'Uma Água (Caimento simples)') {
      w += eavesM;
      l += eavesM;
    }

    const flatArea = w * l;
    const slopeMultiplier = data.tileType.includes('Fibrocimento') || data.tileType.includes('Metálica') ? 1.02 : 1.05; // 10% slope vs 30% slope
    const slopedArea = flatArea * slopeMultiplier;
    
    const lossMargin = mode === 'pro' ? 1.05 : 1.10;
    
    let tilesPerM2 = 16;
    if (data.tileType.includes('Portuguesa')) tilesPerM2 = 17;
    if (data.tileType.includes('Fibrocimento')) tilesPerM2 = 0.45; // ~2.2m2 per tile
    if (data.tileType.includes('Metálica')) tilesPerM2 = 0.35; 

    const totalTiles = Math.ceil(slopedArea * tilesPerM2 * lossMargin);
    
    // Madeiramento (Metros Lineares) - Simplificado
    let wood = [];
    if (!data.tileType.includes('Fibrocimento') && !data.tileType.includes('Metálica')) {
      wood.push({ name: 'Caibros (5x6cm)', qty: Math.ceil(slopedArea * 2.5) + ' m linear' });
      wood.push({ name: 'Ripas (1.5x5cm)', qty: Math.ceil(slopedArea * 3.5) + ' m linear' });
      if (mode === 'pro') wood.push({ name: 'Terças (6x12cm ou 6x16cm)', qty: Math.ceil(slopedArea * 0.8) + ' m linear' });
    } else {
      wood.push({ name: 'Estrutura leve / Terças', qty: Math.ceil(slopedArea * 1.5) + ' m linear' });
    }

    return { slopedArea: slopedArea.toFixed(2), totalTiles, wood };
  };

  const result = calculate();

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <CheckCircle2 size={32} color="#10B981" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Telhado Calculado</h2>
        <p style={{ color: 'var(--text-muted)' }}>Cálculo processado no Modo {mode === 'pro' ? 'Profissional' : 'Rápido'}.</p>
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 24, backgroundColor: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#8B5CF6', fontWeight: 700, marginBottom: 16 }}>Resumo da Cobertura</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Área Inclinada</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{result.slopedArea} m²</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Formato</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{data.shape.split(' ')[0]} {data.shape.split(' ')[1]}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Telhas</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-muted)' }}>{data.tileType}</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.totalTiles} und</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, marginTop: 8 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Madeiramento Estimado</h4>
          {result.wood.map((w, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>{w.name}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{w.qty}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>* O madeiramento pode variar bastante dependendo dos vãos livres e tipo de tesoura estrutural escolhida no projeto.</p>
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
