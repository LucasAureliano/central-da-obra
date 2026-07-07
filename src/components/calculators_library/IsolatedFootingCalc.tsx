import { useState } from 'react';
import { BaseCalculatorLayout, type CalcResultItem, type CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';
import { Sparkles, Layers } from 'lucide-react';
import { InputMethodSelector } from './InputMethodSelector';

export function IsolatedFootingCalc({ onBack }: { onBack: () => void }) {
  const [method, setMethod] = useState<'dimensions'|'direct'>('dimensions');
  const [w, setW] = useState('');
  const [l, setL] = useState('');
  const [h, setH] = useState('');
  const [directVol, setDirectVol] = useState('');
  const [qty, setQty] = useState('1');
  
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    let singleVolume = 0;
    let singleFormArea = 0;

    if (method === 'dimensions') {
      const width = parseFloat(w) || 0;
      const length = parseFloat(l) || 0;
      const height = parseFloat(h) || 0;
      if (width === 0 || length === 0 || height === 0) return;
      
      singleVolume = width * length * height;
      singleFormArea = (width + length) * 2 * height;
    } else {
      singleVolume = parseFloat(directVol) || 0;
      // Aproximação conservadora para área de fôrma se temos apenas o volume
      singleFormArea = Coefficients.structure.woodFormSqMPerM3 * singleVolume;
    }

    if (singleVolume <= 0) return;

    const count = parseInt(qty) || 1;
    const totalVolume = singleVolume * count;
    const totalFormArea = singleFormArea * count;
    
    // Perda padrão do concreto
    const volWithLoss = totalVolume * Coefficients.losses.concrete;
    const totalSteel = volWithLoss * Coefficients.structure.steelKgPerM3;

    // Calcular materiais básicos para o concreto (traço 25MPa padrão)
    const ratio = Coefficients.concrete.mixes['25'];
    const cement = Math.ceil(volWithLoss * ratio.cement);
    const sand = (volWithLoss * ratio.sand).toFixed(2);
    const gravel = (volWithLoss * ratio.gravel).toFixed(2);

    const metrics: CalcResultItem[] = [
      { label: 'Volume Total de Concreto', value: volWithLoss.toFixed(2), unit: 'm³', highlight: true },
      { label: 'Aço Armado', value: totalSteel.toFixed(0), unit: 'kg', highlight: true }
    ];

    const materials: CalcMaterial[] = [
      { name: 'Concreto Usinado (25MPa) OU', quantity: Math.ceil(volWithLoss * 10) / 10, unit: 'm³' },
      { name: 'Cimento (Saco 50kg)', quantity: cement, unit: 'sacos' },
      { name: 'Areia', quantity: sand, unit: 'm³' },
      { name: 'Brita', quantity: gravel, unit: 'm³' },
      { name: 'Aço / Ferragem', quantity: totalSteel.toFixed(0), unit: 'kg' },
      { name: 'Tábua Pinho (Fôrma)', quantity: Math.ceil(totalFormArea), unit: 'm²' }
    ];

    setResults({
      mainMetrics: metrics,
      materials,
      observations: [
        'Considerado concreto fck 25MPa.',
        `Considerada margem de perda de ${(Coefficients.losses.concrete - 1)*100}% no volume.`,
        `Taxa de aço estimada: ${Coefficients.structure.steelKgPerM3}kg/m³.`
      ]
    });
  };

  return (
    <BaseCalculatorLayout
      title="Sapata Isolada"
      description="Calcule escavação, fôrma, concreto e aço para fundações diretas."
      icon={<Layers size={32} />}
      tip="A quantidade de aço é uma estimativa baseada em taxas médias (80kg/m³). Siga sempre o projeto estrutural."
      onBack={onBack}
      results={results}
    >
      <div className="glass-panel" style={{ padding: 20, borderRadius: 24 }}>
        <InputMethodSelector 
          value={method} 
          onChange={setMethod} 
          title="Como deseja informar as medidas de cada sapata?"
          dimLabel="Informar dimensões (L × C × A)"
          dirLabel="Já possuo o volume (m³)"
        />

        {method === 'dimensions' ? (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>Dimensões de 1 Sapata (Base)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Largura (m)</label>
                <input type="number" className="input-premium" value={w} onChange={e => setW(e.target.value)} placeholder="Ex: 0.8" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Comprimento (m)</label>
                <input type="number" className="input-premium" value={l} onChange={e => setL(e.target.value)} placeholder="Ex: 0.8" />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Altura do Rodapé/Base (m)</label>
              <input type="number" className="input-premium" value={h} onChange={e => setH(e.target.value)} placeholder="Ex: 0.4" />
            </div>
          </>
        ) : (
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Volume de 1 Sapata (m³)</label>
            <input type="number" className="input-premium" value={directVol} onChange={e => setDirectVol(e.target.value)} placeholder="Ex: 0.25" />
          </div>
        )}

        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>Multiplicador</h3>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Quantidade de Sapatas Iguais</label>
          <input type="number" className="input-premium" value={qty} onChange={e => setQty(e.target.value)} placeholder="Ex: 12" />
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8 }} onClick={calculate}>
          <Sparkles size={20} /> Calcular Sapata
        </button>
      </div>
    </BaseCalculatorLayout>
  );
}
