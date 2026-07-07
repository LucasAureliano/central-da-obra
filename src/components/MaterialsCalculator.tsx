import { useState } from 'react';
import { Calculator, ArrowLeft, Ruler } from 'lucide-react';

export function MaterialsCalculator({ onBack }: { onBack?: () => void }) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [brickType, setBrickType] = useState('9x19x19');
  
  // Tipos de blocos/tijolos e seu rendimento médio (unidades por m2 considerando argamassa)
  const brickData: Record<string, { name: string; perM2: number }> = {
    '9x19x19': { name: 'Bloco Cerâmico 9x19x19 (Furo Baiano)', perM2: 25 },
    '14x19x29': { name: 'Bloco de Concreto 14x19x29', perM2: 17 },
    '9x19x29': { name: 'Bloco Cerâmico 9x19x29', perM2: 17 },
  };

  const calculate = () => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!w || !h) return null;

    const area = w * h;
    const bricks = Math.ceil(area * brickData[brickType].perM2);
    // Argamassa estimada (0.015 m3 por m2 de parede, cimento + areia)
    // Rendimento: 1 saco cimento (50kg) faz ~30m2. Vamos usar 1.5kg por m2
    const cementBags = Math.ceil((area * 1.5) / 50);
    const sandM3 = (area * 0.015).toFixed(2);

    return { area, bricks, cementBags, sandM3 };
  };

  const result = calculate();

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      {onBack && (
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} /> Voltar
        </button>
      )}

      <div className="animate-stagger-1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,107,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calculator size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>Calculadora de Materiais</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Estimativa de Alvenaria (Tijolos e Argamassa)</p>
        </div>
      </div>

      <div className="glass-panel animate-stagger-2" style={{ padding: 24, borderRadius: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16 }}>Dimensões da Parede</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Largura (metros)</label>
            <div style={{ position: 'relative' }}>
              <Ruler size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="number" 
                className="input-premium" 
                placeholder="Ex: 5.0"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                style={{ paddingLeft: 36, backgroundColor: 'var(--bg-input-glass)' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Altura (metros)</label>
            <div style={{ position: 'relative' }}>
              <Ruler size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="number" 
                className="input-premium" 
                placeholder="Ex: 2.8"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={{ paddingLeft: 36, backgroundColor: 'var(--bg-input-glass)' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Tipo de Bloco/Tijolo</label>
          <select 
            className="input-premium" 
            value={brickType}
            onChange={(e) => setBrickType(e.target.value)}
            style={{ backgroundColor: 'var(--bg-input-glass)', appearance: 'none' }}
          >
            {Object.entries(brickData).map(([key, data]) => (
              <option key={key} value={key}>{data.name}</option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="glass-panel animate-stagger-3" style={{ padding: 24, borderRadius: 24, backgroundColor: 'rgba(255, 107, 0, 0.05)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 20 }}>Resultados Estimados</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Área Total</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.area.toFixed(2)} m²</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Quantidade de Blocos (Média)</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.bricks} und</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Sacos de Cimento (50kg)</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.cementBags} saco(s)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Areia Média (m³)</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.sandM3} m³</span>
          </div>

          <div style={{ marginTop: 24, padding: 12, borderRadius: 12, backgroundColor: 'var(--bg-input-glass)', fontSize: 12, color: 'var(--text-muted)' }}>
            <strong>Nota:</strong> Este é um cálculo estimado que não inclui perdas (recomenda-se adicionar 10% de margem) nem áreas de esquadrias (portas e janelas).
          </div>
        </div>
      )}
    </div>
  );
}
