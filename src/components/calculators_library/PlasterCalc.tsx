import { useState } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { Sparkles, Info } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';

export function PlasterCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [target, setTarget] = useState('');
  const [inputMethod, setInputMethod] = useState('');
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  
  // New States for Sanca and Lighting
  const [hasSanca, setHasSanca] = useState<boolean | null>(null);
  const [hasSpots, setHasSpots] = useState<boolean | null>(null);
  
  const [lossRate, setLossRate] = useState('8'); // 8%

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  // Math
  const netAreaCalc = () => {
    let baseArea = 0;
    if (inputMethod === 'area') {
      baseArea = parseFloat(area) || 0;
    } else {
      baseArea = (parseFloat(width) || 0) * (parseFloat(length) || 0);
    }
    return Math.max(0, baseArea);
  };

  const calculateResults = () => {
    const totalArea = netAreaCalc();
    const lossMultiplier = 1 + ((parseFloat(lossRate) || 0) / 100);
    
    const coef = Coefficients.plaster;

    // Base is 2.77 plates per m2 (since each plate is 0.6*0.6 = 0.36m2, 1/0.36 = 2.77)
    // Sanca adds about 20% more plates (for the sides/drop details) and a lot more wire/sisal
    const sancaMultiplier = hasSanca ? 1.2 : 1;
    const plates = Math.ceil(totalArea * 2.77 * sancaMultiplier * lossMultiplier);
    
    // Spots require reinforcement (more wire and sisal)
    const spotsMultiplier = hasSpots ? 1.3 : 1;
    
    const wireKg = (totalArea * coef.wireKgPerM2 * sancaMultiplier * spotsMultiplier * lossMultiplier).toFixed(1);
    const sisalKg = (totalArea * coef.sisalKgPerM2 * sancaMultiplier * spotsMultiplier * lossMultiplier).toFixed(1);
    const gluePlasterKg = (totalArea * coef.gluePlasterKgPerM2 * sancaMultiplier * lossMultiplier).toFixed(1);
    const glueBags = Math.ceil(parseFloat(gluePlasterKg) / 5); // sacos de 5kg

    const metrics: CalcResultItem[] = [
      { label: 'Área do Forro', value: totalArea.toFixed(2), unit: 'm²', highlight: true },
      { label: 'Placas 60x60cm', value: plates.toString(), unit: 'unid.', highlight: true },
      { label: 'Perda Considerada', value: `${lossRate}`, unit: '%' },
    ];

    const materials: CalcMaterial[] = [
      { name: 'Plaquinhas de Gesso (60x60cm)', quantity: plates, unit: 'unid.' },
      { name: 'Arame Galvanizado nº 18', quantity: parseFloat(wireKg), unit: 'kg' },
      { name: 'Sisal/Estopa', quantity: parseFloat(sisalKg), unit: 'kg' },
      { name: 'Gesso Cola (Saco 5kg)', quantity: glueBags, unit: 'saco(s)' }
    ];

    return { metrics, materials };
  };

  const steps: WizardStep[] = [
    {
      id: 'target',
      title: 'Em qual ambiente será feito o forro?',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {['Sala', 'Quarto', 'Cozinha', 'Banheiro', 'Corredor', 'Outro'].map(opt => (
            <button 
              key={opt}
              onClick={() => { setTarget(opt); handleNext(); }}
              className={target === opt ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
              style={{
                padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16,
                backgroundColor: target === opt ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                border: `1px solid ${target === opt ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                color: target === opt ? 'var(--color-primary)' : 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      isValid: !!target,
      hideNextButton: true
    },
    {
      id: 'method',
      title: 'Como deseja informar as medidas do teto?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => { setInputMethod('area'); handleNext(); }} className={inputMethod === 'area' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'area' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'area' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'area' ? 'var(--color-primary)' : 'var(--text-main)' }}>Já sei a área (m²)</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Informar apenas a metragem quadrada total.</p>
          </button>
          <button onClick={() => { setInputMethod('dim'); handleNext(); }} className={inputMethod === 'dim' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'dim' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--text-main)' }}>Largura × Comprimento</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>O sistema calculará a área automaticamente.</p>
          </button>
        </div>
      ),
      isValid: !!inputMethod,
      hideNextButton: true
    },
    {
      id: 'dimensions',
      title: inputMethod === 'area' ? 'Qual a área total do teto?' : 'Dimensões do teto',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inputMethod === 'area' ? (
            <div className="input-group">
              <label>Área Total (m²)</label>
              <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 15.5" />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Largura (m)</label>
                <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 3.5" />
              </div>
              <div className="input-group">
                <label>Comprimento (m)</label>
                <input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="Ex: 4.5" />
              </div>
            </>
          )}
        </div>
      ),
      isValid: inputMethod === 'area' ? parseFloat(area) > 0 : (parseFloat(width) > 0 && parseFloat(length) > 0)
    },
    {
      id: 'details_sanca',
      title: 'Haverá detalhes no forro? (Sanca, Rebaixo, Tabica)',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <button onClick={() => { setHasSanca(true); handleNext(); }} className={hasSanca === true ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasSanca === true ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasSanca === true ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasSanca === true ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Sim (Sanca/Detalhes)
          </button>
          <button onClick={() => { setHasSanca(false); handleNext(); }} className={hasSanca === false ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasSanca === false ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasSanca === false ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasSanca === false ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Não (Forro Liso)
          </button>
        </div>
      ),
      isValid: hasSanca !== null,
      hideNextButton: true
    },
    {
      id: 'details_spots',
      title: 'Haverá muitos spots de iluminação embutida?',
      subtitle: 'Isso requer reforço extra no teto para não rachar.',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <button onClick={() => { setHasSpots(true); handleNext(); }} className={hasSpots === true ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasSpots === true ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasSpots === true ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasSpots === true ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Sim (Muitos recortes)
          </button>
          <button onClick={() => { setHasSpots(false); handleNext(); }} className={hasSpots === false ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasSpots === false ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasSpots === false ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasSpots === false ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Não (Básico)
          </button>
        </div>
      ),
      isValid: hasSpots !== null,
      hideNextButton: true
    },
    {
      id: 'loss',
      title: 'Ajustes Finais',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="input-group">
            <label>Taxa de Perda (%)</label>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Recomendamos 8% para quebras no transporte e recortes das plaquinhas.</p>
            <input type="number" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>

          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              O cálculo de amarração (arame, sisal e gesso cola) é feito proporcionalmente à área informada usando padrões técnicos.
            </p>
          </div>
        </div>
      ),
      isValid: parseFloat(lossRate) >= 0
    }
  ];

  if (showResults) {
    const { metrics, materials } = calculateResults();
    return (
      <BaseCalculatorLayout
        title="Assistente de Gesso"
        description="Cálculo para forro em plaquinhas 60x60cm."
        icon={<Sparkles size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            `Área considerada: ${netAreaCalc().toFixed(2)}m² no ambiente ${target}.`,
            'Forro suspenso tradicional com plaquinhas 60x60cm amarradas.'
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente de Gesso"
      icon={<Sparkles size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
