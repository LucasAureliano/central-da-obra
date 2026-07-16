import { useState } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { Brush, FilePlus, X, Info } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';

const textureYields: Record<string, { kgPerM2: number, name: string }> = {
  grafiato: { kgPerM2: 3.5, name: 'Grafiato' },
  projetada: { kgPerM2: 2.5, name: 'Textura Projetada' },
  rolada: { kgPerM2: 1.5, name: 'Textura Rolada / Lisa' },
};

const surfaceMultipliers: Record<string, number> = {
  lisa: 1.0,
  irregular: 1.2,
  bloco: 1.5, // Bloco aparente consome muito
};

export function TextureCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [target, setTarget] = useState('');
  const [inputMethod, setInputMethod] = useState('');
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  
  const [hasOpenings, setHasOpenings] = useState<boolean | null>(null);
  const [openings, setOpenings] = useState([{ w: '', h: '', qty: '1' }]);
  
  const addOpening = () => setOpenings([...openings, { w: '', h: '', qty: '1' }]);
  
  const [textureType, setTextureType] = useState('');
  const [surfaceType, setSurfaceType] = useState('');
  
  const [sealerCoats, setSealerCoats] = useState('1');

  const [lossRate, setLossRate] = useState('10'); // 10%

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  // Math
  const getBaseArea = () => {
    let baseArea = 0;
    if (inputMethod === 'area') {
      baseArea = parseFloat(area) || 0;
    } else {
      baseArea = (parseFloat(width) || 0) * (parseFloat(height) || 0);
    }
    return baseArea;
  };

  const getOpeningsArea = () => {
    let desc = 0;
    if (hasOpenings) {
      openings.forEach(op => {
        desc += (parseFloat(op.w) || 0) * (parseFloat(op.h) || 0) * (parseInt(op.qty) || 1);
      });
    }
    return desc;
  };

  const netAreaCalc = () => {
    return Math.max(0, getBaseArea() - getOpeningsArea());
  };

  const calculateResults = () => {
    const netArea = netAreaCalc();
    const loss = 1 + ((parseFloat(lossRate) || 0) / 100);
    const surfMult = surfaceMultipliers[surfaceType] || 1.0;
    
    const typeInfo = textureYields[textureType] || textureYields.grafiato;
    const baseYield = typeInfo.kgPerM2;
    const finalYield = baseYield * surfMult; // kg per m²
    
    const areaComPerda = netArea * loss;
    const totalKg = areaComPerda * finalYield;
    
    const containerKg = textureType === 'projetada' ? 20 : 25; // Sacos de 20kg para projetada, Barricas 25kg para grafiato
    const containers = Math.ceil(totalKg / containerKg);
    
    // Selador/Fundo
    let sealer18L = 0;
    const coats = parseInt(sealerCoats) || 0;
    if (coats > 0) {
      const sealerYield = 10; // 10m2/L por demão
      const sealerLiters = (areaComPerda * coats) / sealerYield;
      sealer18L = Math.ceil(sealerLiters / 18);
    }

    const metrics: CalcResultItem[] = [
      { label: 'Área Líquida', value: netArea.toFixed(2), unit: 'm²', highlight: true },
      { label: 'Peso Total Estimado', value: totalKg.toFixed(1), unit: 'kg', highlight: true },
      { label: 'Consumo Médio', value: finalYield.toFixed(2), unit: 'kg/m²' },
      { label: 'Perda Considerada', value: `${lossRate}`, unit: '%' },
    ];

    const materials: CalcMaterial[] = [
      { name: `${typeInfo.name} (${containerKg}kg)`, quantity: containers, unit: 'Embalagem(ns)' },
    ];

    if (sealer18L > 0) {
      materials.push({ name: 'Fundo Preparador na mesma cor (Lata 18L)', quantity: sealer18L, unit: 'Lata(s)' });
    }

    return { metrics, materials };
  };

  const steps: WizardStep[] = [
    {
      id: 'target',
      title: 'Onde será aplicada a textura?',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {['Fachada Externa', 'Muro', 'Parede Interna', 'Teto', 'Colunas/Vigas', 'Outro'].map(opt => (
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
      title: 'Como deseja informar as medidas?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => { setInputMethod('area'); handleNext(); }} className={inputMethod === 'area' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'area' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'area' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'area' ? 'var(--color-primary)' : 'var(--text-main)' }}>Já sei a área (m²)</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Informar apenas a metragem quadrada total.</p>
          </button>
          <button onClick={() => { setInputMethod('dim'); handleNext(); }} className={inputMethod === 'dim' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'dim' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--text-main)' }}>Largura × Altura</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>O sistema calculará a área automaticamente.</p>
          </button>
        </div>
      ),
      isValid: !!inputMethod,
      hideNextButton: true
    },
    {
      id: 'dimensions',
      title: inputMethod === 'area' ? 'Qual a área total?' : 'Dimensões da superfície',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inputMethod === 'area' ? (
            <div className="input-group">
              <label>Área Total (m²)</label>
              <input type="number" className="input-premium" value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 50" />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Largura / Comprimento (m)</label>
                <input type="number" className="input-premium" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 10" />
              </div>
              <div className="input-group">
                <label>Altura (m)</label>
                <input type="number" className="input-premium" value={height} onChange={e => setHeight(e.target.value)} placeholder="Ex: 2.8" />
              </div>
            </>
          )}
        </div>
      ),
      isValid: inputMethod === 'area' ? parseFloat(area) > 0 : (parseFloat(width) > 0 && parseFloat(height) > 0)
    },
    {
      id: 'openings_ask',
      title: 'Existem portas ou janelas nesta área?',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <button onClick={() => { setHasOpenings(true); handleNext(); }} className={hasOpenings === true ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasOpenings === true ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasOpenings === true ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasOpenings === true ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Sim
          </button>
          <button onClick={() => { setHasOpenings(false); handleNext(); }} className={hasOpenings === false ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasOpenings === false ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasOpenings === false ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasOpenings === false ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Não
          </button>
        </div>
      ),
      isValid: hasOpenings !== null,
      hideNextButton: true
    },
    ...(hasOpenings ? [{
      id: 'openings_list',
      title: 'Adicione os vãos (Portas e Janelas)',
      subtitle: 'Eles serão descontados da área total.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {openings.map((op, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', backgroundColor: 'var(--bg-surface)', padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Larg. (m)</label>
                <input type="number" className="input-premium" value={op.w} onChange={e => { const n = [...openings]; n[i].w = e.target.value; setOpenings(n); }} placeholder="0.80" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Alt. (m)</label>
                <input type="number" className="input-premium" value={op.h} onChange={e => { const n = [...openings]; n[i].h = e.target.value; setOpenings(n); }} placeholder="2.10" />
              </div>
              <div className="input-group" style={{ width: 80 }}>
                <label>Qtd</label>
                <input type="number" className="input-premium" value={op.qty} onChange={e => { const n = [...openings]; n[i].qty = e.target.value; setOpenings(n); }} placeholder="1" />
              </div>
              <button onClick={() => { setOpenings(openings.filter((_, idx) => idx !== i)); }} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 12 }}>
                <X size={20} />
              </button>
            </div>
          ))}
          
          {getOpeningsArea() > getBaseArea() && (
            <div style={{ padding: 16, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              Erro: A área dos vãos ({getOpeningsArea().toFixed(2)} m²) é maior que a área total da parede ({getBaseArea().toFixed(2)} m²). Reduza os vãos ou aumente a área.
            </div>
          )}

          <button onClick={addOpening} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, border: '1px dashed var(--border-strong)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>
            <FilePlus size={20} /> Adicionar outro vão
          </button>
        </div>
      ),
      isValid: (openings.every(op => parseFloat(op.w) > 0 && parseFloat(op.h) > 0 && parseInt(op.qty) > 0) || openings.length === 0) && getOpeningsArea() <= getBaseArea()
    }] : []),
    {
      id: 'texture_type',
      title: 'Qual tipo de textura?',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {[
            { id: 'grafiato', title: 'Grafiato (Rústico)', desc: 'Efeito arranhado, consumo de aprox. 3.5kg/m²' },
            { id: 'projetada', title: 'Textura Projetada', desc: 'Aplicada com pistola, consumo de aprox. 2.5kg/m²' },
            { id: 'rolada', title: 'Textura Rolada (Lisa)', desc: 'Efeito com rolos especiais, consumo de aprox. 1.5kg/m²' },
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => { setTextureType(opt.id); handleNext(); }}
              className={textureType === opt.id ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
              style={{
                padding: 16, borderRadius: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4,
                backgroundColor: textureType === opt.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                border: `1px solid ${textureType === opt.id ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, color: textureType === opt.id ? 'var(--color-primary)' : 'var(--text-main)' }}>{opt.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      ),
      isValid: !!textureType,
      hideNextButton: true
    },
    {
      id: 'surface',
      title: 'Situação da superfície base',
      subtitle: 'Isso afeta a espessura necessária e o consumo da textura.',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {[
            { id: 'lisa', title: 'Emassada / Lisa', desc: 'Pronta para aplicação, consumo padrão' },
            { id: 'irregular', title: 'Reboco Grosso / Irregular', desc: 'Aumenta o consumo em ~20% para cobrir imperfeições' },
            { id: 'bloco', title: 'Bloco Aparente', desc: 'Não recomendado direto no bloco, consome ~50% a mais' },
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => { setSurfaceType(opt.id); handleNext(); }}
              className={surfaceType === opt.id ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
              style={{
                padding: 16, borderRadius: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4,
                backgroundColor: surfaceType === opt.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                border: `1px solid ${surfaceType === opt.id ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, color: surfaceType === opt.id ? 'var(--color-primary)' : 'var(--text-main)' }}>{opt.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      ),
      isValid: !!surfaceType,
      hideNextButton: true
    },
    {
      id: 'sealer',
      title: 'Fundo Preparador (Selador)',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="input-group">
            <label>Quantas demãos de fundo preparador?</label>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Recomendado aplicar na mesma cor da textura para evitar manchas no fundo dos arranhões.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['0', '1', '2'].map(n => (
                <button 
                  key={n}
                  onClick={() => setSealerCoats(n)}
                  style={{ flex: 1, padding: '12px 0', borderRadius: 12, backgroundColor: sealerCoats === n ? 'var(--color-primary)' : 'var(--bg-surface)', color: sealerCoats === n ? '#fff' : 'var(--text-main)', border: `1px solid ${sealerCoats === n ? 'var(--color-primary)' : 'var(--border-subtle)'}`, fontWeight: 600, cursor: 'pointer' }}
                >
                  {n === '0' ? 'Nenhuma' : n}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      isValid: true
    },
    {
      id: 'loss',
      title: 'Ajustes Finais',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="input-group">
            <label>Taxa de Perda (%)</label>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Texturas têm muita queda no chão. Recomendamos mínimo de 10%.</p>
            <input type="number" className="input-premium" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>

          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              O sistema incluirá <strong>fundo preparador na mesma cor</strong> para evitar manchas no fundo dos veios do Grafiato.
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
        title="Assistente de Textura"
        description="Cálculo detalhado de grafiato e texturas."
        icon={<Brush size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [`Área considerada: ${netAreaCalc().toFixed(2)}m². Textura: ${textureYields[textureType]?.name}. Superfície: ${surfaceType}.`]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente de Texturas"
      icon={<Brush size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
