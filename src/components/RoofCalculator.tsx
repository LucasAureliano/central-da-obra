import { useState } from 'react';
import { ArrowLeft, Hammer, Ruler } from 'lucide-react';

export function RoofCalculator({ onBack }: { onBack: () => void }) {
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [tileType, setTileType] = useState('francesa');
  
  // Rendimento telhas por m2
  const tileData: Record<string, { name: string; perM2: number }> = {
    'francesa': { name: 'Cerâmica Francesa', perM2: 16 },
    'romana': { name: 'Cerâmica Romana', perM2: 16 },
    'portuguesa': { name: 'Cerâmica Portuguesa', perM2: 17 },
    'fibrocimento': { name: 'Fibrocimento 2.44x1.10m', perM2: 0.45 }, // aprox 1 telha a cada 2.2m2
  };

  const calculate = () => {
    const w = parseFloat(width);
    const l = parseFloat(length);
    if (!w || !l) return null;

    // Área plana
    const flatArea = w * l;
    // Fator de inclinação médio (30% inclinação -> hipotenusa ~1.044)
    const slopedArea = flatArea * 1.05; 
    
    const tiles = Math.ceil(slopedArea * tileData[tileType].perM2);
    
    // Estimativa bruta de madeiramento para telhado cerâmico (m linear)
    // Valores médios práticos por m2
    let rafters = 0; // Caibros
    let battens = 0; // Ripas
    
    if (tileType !== 'fibrocimento') {
      rafters = Math.ceil(slopedArea * 2.5);
      battens = Math.ceil(slopedArea * 3.5);
    }

    return { slopedArea, tiles, rafters, battens };
  };

  const result = calculate();

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="animate-stagger-1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Hammer size={24} color="#8B5CF6" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>Telhados</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Estimativa de Telhas e Madeiramento</p>
        </div>
      </div>

      <div className="glass-panel animate-stagger-2" style={{ padding: 24, borderRadius: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Largura Base (m)</label>
            <div style={{ position: 'relative' }}>
              <Ruler size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="number" 
                className="input-premium" 
                placeholder="Ex: 6.0"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                style={{ paddingLeft: 36, backgroundColor: 'var(--bg-input-glass)' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Comprimento (m)</label>
            <div style={{ position: 'relative' }}>
              <Ruler size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="number" 
                className="input-premium" 
                placeholder="Ex: 10.0"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                style={{ paddingLeft: 36, backgroundColor: 'var(--bg-input-glass)' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Tipo de Telha</label>
          <select 
            className="input-premium" 
            value={tileType}
            onChange={(e) => setTileType(e.target.value)}
            style={{ backgroundColor: 'var(--bg-input-glass)', appearance: 'none' }}
          >
            {Object.entries(tileData).map(([key, data]) => (
              <option key={key} value={key}>{data.name}</option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="glass-panel animate-stagger-3" style={{ padding: 24, borderRadius: 24, backgroundColor: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#8B5CF6', marginBottom: 20 }}>Resultados (Considerando Inclinação Média de 30%)</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Área Inclinada Estimada</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.slopedArea.toFixed(2)} m²</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Telhas Necessárias</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.tiles} unidades</span>
          </div>
          
          {tileType !== 'fibrocimento' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Caibros (m Linear)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>~ {result.rafters} m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ripas (m Linear)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>~ {result.battens} m</span>
              </div>
            </>
          )}

          <div style={{ marginTop: 24, padding: 12, borderRadius: 12, backgroundColor: 'var(--bg-input-glass)', fontSize: 12, color: 'var(--text-muted)' }}>
            <strong>Nota:</strong> Este é um cálculo estimado paramétrico. O madeiramento real depende muito do projeto estrutural (tesouras, terças, vãos). Adicione sempre 10% de margem de perda nas telhas.
          </div>
        </div>
      )}
    </div>
  );
}
