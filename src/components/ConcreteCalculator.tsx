import { useState } from 'react';
import { ArrowLeft, Droplet, Cylinder } from 'lucide-react';

export function ConcreteCalculator({ onBack }: { onBack: () => void }) {
  const [volume, setVolume] = useState('');
  const [fck, setFck] = useState('20');
  
  // Rendimentos por 1m3 de concreto baseado no FCK
  // valores aproximados para (Sacos 50kg, Areia m3, Brita m3, Água Litros)
  const concreteData: Record<string, { cement: number; sand: number; gravel: number; water: number }> = {
    '15': { cement: 5, sand: 0.72, gravel: 0.60, water: 180 }, // Traço mais fraco
    '20': { cement: 6, sand: 0.65, gravel: 0.65, water: 190 }, // Uso geral
    '25': { cement: 7, sand: 0.60, gravel: 0.70, water: 200 }, // Estrutural leve
    '30': { cement: 8, sand: 0.55, gravel: 0.75, water: 210 }, // Estrutural pesado
  };

  const calculate = () => {
    const v = parseFloat(volume);
    if (!v) return null;

    const data = concreteData[fck];
    return {
      cementBags: Math.ceil(v * data.cement),
      sandM3: (v * data.sand).toFixed(2),
      gravelM3: (v * data.gravel).toFixed(2),
      waterL: Math.ceil(v * data.water)
    };
  };

  const result = calculate();

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="animate-stagger-1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Droplet size={24} color="#3B82F6" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>Traço de Concreto</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cálculo de materiais por FCK</p>
        </div>
      </div>

      <div className="glass-panel animate-stagger-2" style={{ padding: 24, borderRadius: 24, marginBottom: 24 }}>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Volume de Concreto (m³)</label>
          <div style={{ position: 'relative' }}>
            <Cylinder size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="number" 
              className="input-premium" 
              placeholder="Ex: 5.5"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              style={{ paddingLeft: 36, backgroundColor: 'var(--bg-input-glass)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Resistência Desejada (FCK)</label>
          <select 
            className="input-premium" 
            value={fck}
            onChange={(e) => setFck(e.target.value)}
            style={{ backgroundColor: 'var(--bg-input-glass)', appearance: 'none' }}
          >
            <option value="15">15 MPa (Magro / Contrapiso)</option>
            <option value="20">20 MPa (Uso Geral / Calçadas)</option>
            <option value="25">25 MPa (Estrutural Padrão)</option>
            <option value="30">30 MPa (Estrutural Pesado)</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="glass-panel animate-stagger-3" style={{ padding: 24, borderRadius: 24, backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#3B82F6', marginBottom: 20 }}>Quantidades Necessárias</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Cimento (Sacos 50kg)</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.cementBags} sacos</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Areia Média</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.sandM3} m³</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Brita (Pedra)</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.gravelM3} m³</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Água Estimada</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.waterL} Litros</span>
          </div>

          <div style={{ marginTop: 24, padding: 12, borderRadius: 12, backgroundColor: 'var(--bg-input-glass)', fontSize: 12, color: 'var(--text-muted)' }}>
            <strong>Atenção:</strong> A quantidade de água pode variar dependendo da umidade da areia no local. Sempre faça o ajuste fino da trabalhabilidade (slump) na obra.
          </div>
        </div>
      )}
    </div>
  );
}
