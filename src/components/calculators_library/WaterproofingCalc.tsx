import { useState } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { ShieldCheck, Info } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';

export function WaterproofingCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [inputMethod, setInputMethod] = useState('');
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  
  const [rodapes, setRodapes] = useState('0.2');
  
  const [type, setType] = useState<'asphaltic'|'polymeric'>('asphaltic');
  const [coats, setCoats] = useState('3');
  
  const [hasDrains, setHasDrains] = useState<boolean | null>(null);
  
  const [protection, setProtection] = useState<boolean | null>(null);

  const [lossRate, setLossRate] = useState('10'); // 10%

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const calculateResults = () => {
    let baseArea = 0;
    let skirtingArea = 0;
    
    const w = parseFloat(width) || 0;
    const l = parseFloat(length) || 0;
    const r = parseFloat(rodapes) || 0;

    if (inputMethod === 'area') {
      baseArea = parseFloat(area) || 0;
      // Aproximação de perímetro para área informada diretamente (assumindo forma quadrada)
      const perimeter = Math.sqrt(baseArea) * 4;
      skirtingArea = perimeter * r;
    } else {
      baseArea = w * l;
      skirtingArea = (w + l) * 2 * r;
    }

    const totalArea = baseArea + skirtingArea;
    const lossMultiplier = 1 + (parseFloat(lossRate) / 100 || 0);
    const areaWithLoss = totalArea * lossMultiplier;

    const coatsNum = parseInt(coats) || 3;
    const kgPerM2PerCoat = type === 'asphaltic' ? 1.0 : 1.33; // Approx.
    const finalKgPerM2 = kgPerM2PerCoat * coatsNum;
    
    const totalKg = areaWithLoss * finalKgPerM2;
    const containerKg = 18; // Balde padrão de 18kg
    const containers = Math.ceil(totalKg / containerKg);

    // Manta Bidim/Tela de poliéster para reforços (ralos e quinas)
    let bidimSqm = Math.ceil(skirtingArea); // Tela em todas as quinas
    if (hasDrains) {
      bidimSqm += 2; // Extra para ralos
    }

    const metrics: CalcResultItem[] = [
      { label: 'Área do Piso', value: baseArea.toFixed(2), unit: 'm²' },
      { label: 'Área do Rodapé', value: skirtingArea.toFixed(2), unit: 'm²' },
      { label: 'Área Total + Perdas', value: areaWithLoss.toFixed(2), unit: 'm²', highlight: true },
      { label: 'Peso Total Estimado', value: totalKg.toFixed(1), unit: 'kg', highlight: true }
    ];

    const materials: CalcMaterial[] = [
      { name: type === 'asphaltic' ? 'Emulsão Asfáltica (Balde 18kg)' : 'Argamassa Polimérica (Caixa 18kg)', quantity: containers, unit: 'embalagem(ns)' },
      { name: 'Tela de Poliéster (Reforços e Quinas)', quantity: bidimSqm, unit: 'm²' }
    ];

    if (protection) {
      // Argamassa de proteção mecânica
      const protectionVol = totalArea * 0.03; // 3cm de contrapiso
      const sand = (protectionVol * 1.2).toFixed(2); // Areia
      const cement = Math.ceil(protectionVol * 6); // Sacos de cimento
      materials.push({ name: 'Cimento (Proteção Mecânica 3cm)', quantity: cement, unit: 'saco(s)' });
      materials.push({ name: 'Areia (Proteção Mecânica)', quantity: parseFloat(sand), unit: 'm³' });
    }

    return { metrics, materials, totalArea };
  };

  const steps: WizardStep[] = [
    {
      id: 'method',
      title: 'Como deseja informar as medidas?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => { setInputMethod('area'); handleNext(); }} className={inputMethod === 'area' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'area' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'area' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'area' ? 'var(--color-primary)' : 'var(--text-main)' }}>Já sei a área base (m²)</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Informar a metragem quadrada do piso.</p>
          </button>
          <button onClick={() => { setInputMethod('dim'); handleNext(); }} className={inputMethod === 'dim' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'dim' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--text-main)' }}>Largura × Comprimento</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>O sistema calculará o rodapé exato com base no perímetro.</p>
          </button>
        </div>
      ),
      isValid: !!inputMethod,
      hideNextButton: true
    },
    {
      id: 'dimensions',
      title: inputMethod === 'area' ? 'Área e Rodapés' : 'Dimensões do Ambiente',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inputMethod === 'area' ? (
            <div className="input-group">
              <label>Área Base do Piso (m²)</label>
              <input type="number" className="input-premium" value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 15.5" />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Largura (m)</label>
                <input type="number" className="input-premium" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 3.5" />
              </div>
              <div className="input-group">
                <label>Comprimento (m)</label>
                <input type="number" className="input-premium" value={length} onChange={e => setLength(e.target.value)} placeholder="Ex: 4.5" />
              </div>
            </>
          )}
          
          <div className="input-group" style={{ marginTop: 16 }}>
            <label>Altura do Rodapé Impermeável (m)</label>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Recomendado subir no mínimo 20cm (0.2m) nas paredes.</p>
            <input type="number" className="input-premium" value={rodapes} onChange={e => setRodapes(e.target.value)} placeholder="Ex: 0.2" />
          </div>
        </div>
      ),
      isValid: inputMethod === 'area' ? parseFloat(area) > 0 : (parseFloat(width) > 0 && parseFloat(length) > 0)
    },
    {
      id: 'product_type',
      title: 'Qual produto será utilizado?',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {[
            { id: 'asphaltic', title: 'Emulsão Asfáltica (Manta Líquida Preta)', desc: 'Ideal para lajes, floreiras e áreas expostas.' },
            { id: 'polymeric', title: 'Argamassa Polimérica (Base Cimento)', desc: 'Ideal para banheiros, caixas d\'água e áreas frias internas.' },
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => { setType(opt.id as any); handleNext(); }}
              className={type === opt.id ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
              style={{
                padding: 16, borderRadius: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4,
                backgroundColor: type === opt.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                border: `1px solid ${type === opt.id ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, color: type === opt.id ? 'var(--color-primary)' : 'var(--text-main)' }}>{opt.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      ),
      isValid: !!type,
      hideNextButton: true
    },
    {
      id: 'technical_details',
      title: 'Detalhes Técnicos',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="input-group">
            <label>Existem ralos ou tubulações emergentes no local?</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => setHasDrains(true)} style={{ flex: 1, padding: '12px', borderRadius: 12, backgroundColor: hasDrains === true ? 'var(--color-primary)' : 'var(--bg-surface)', color: hasDrains === true ? '#fff' : 'var(--text-main)', border: `1px solid ${hasDrains === true ? 'var(--color-primary)' : 'var(--border-subtle)'}`, fontWeight: 600 }}>Sim</button>
              <button onClick={() => setHasDrains(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, backgroundColor: hasDrains === false ? 'var(--color-primary)' : 'var(--bg-surface)', color: hasDrains === false ? '#fff' : 'var(--text-main)', border: `1px solid ${hasDrains === false ? 'var(--color-primary)' : 'var(--border-subtle)'}`, fontWeight: 600 }}>Não</button>
            </div>
          </div>

          <div className="input-group">
            <label>Haverá Contrapiso / Proteção Mecânica sobre a impermeabilização?</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => setProtection(true)} style={{ flex: 1, padding: '12px', borderRadius: 12, backgroundColor: protection === true ? 'var(--color-primary)' : 'var(--bg-surface)', color: protection === true ? '#fff' : 'var(--text-main)', border: `1px solid ${protection === true ? 'var(--color-primary)' : 'var(--border-subtle)'}`, fontWeight: 600 }}>Sim</button>
              <button onClick={() => setProtection(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, backgroundColor: protection === false ? 'var(--color-primary)' : 'var(--bg-surface)', color: protection === false ? '#fff' : 'var(--text-main)', border: `1px solid ${protection === false ? 'var(--color-primary)' : 'var(--border-subtle)'}`, fontWeight: 600 }}>Não</button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Quantidade de Demãos Cruzadas</label>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Geralmente 3 para áreas comuns e 4 para alto tráfego/pressão.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['2', '3', '4', '5'].map(n => (
                <button 
                  key={n}
                  onClick={() => setCoats(n)}
                  style={{ flex: 1, padding: '12px 0', borderRadius: 12, backgroundColor: coats === n ? 'var(--color-primary)' : 'var(--bg-surface)', color: coats === n ? '#fff' : 'var(--text-main)', border: `1px solid ${coats === n ? 'var(--color-primary)' : 'var(--border-subtle)'}`, fontWeight: 600, cursor: 'pointer' }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      isValid: hasDrains !== null && protection !== null
    },
    {
      id: 'loss',
      title: 'Ajustes Finais',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="input-group">
            <label>Taxa de Perda (%)</label>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Recomendamos 10% de margem de segurança.</p>
            <input type="number" className="input-premium" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>

          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              A tela de poliéster é essencial para <strong>todas as quinas (meia-cana)</strong> e ao redor de ralos para evitar trincas estruturais.
            </p>
          </div>
        </div>
      ),
      isValid: parseFloat(lossRate) >= 0
    }
  ];

  if (showResults) {
    const { metrics, materials, totalArea } = calculateResults();
    return (
      <BaseCalculatorLayout
        title="Assistente de Impermeabilização"
        description="Cálculo detalhado de mantas e reforços."
        icon={<ShieldCheck size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            `Área total impermeabilizada (incluindo rodapés): ${totalArea.toFixed(2)}m².`,
            `Aplicar ${coats} demãos cruzadas respeitando o tempo de secagem do fabricante.`
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Impermeabilização"
      icon={<ShieldCheck size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
