import { useState } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { SearchableSelect } from './SearchableSelect';
import type { SelectOption } from './SearchableSelect';
import { Paintbrush2, FilePlus, X, Info } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';

// Tinta rendimento base
const targetOptions: SelectOption[] = [
  { id: 'interna', title: 'Pintura Interna (Paredes)', subtitle: 'Padrão para salas, quartos, corredores', category: 'Ambientes', isFavorite: true },
  { id: 'externa', title: 'Pintura Externa', subtitle: 'Paredes externas expostas ao tempo', category: 'Ambientes', isFavorite: true },
  { id: 'fachada', title: 'Fachada', subtitle: 'Pintura de alta resistência / Textura', category: 'Ambientes' },
  { id: 'muro', title: 'Muro', subtitle: 'Pintura de contorno do terreno', category: 'Ambientes' },
  { id: 'teto', title: 'Teto / Forro', subtitle: 'Pintura sobre laje ou gesso', category: 'Superfícies Específicas' },
  { id: 'piso', title: 'Piso', subtitle: 'Tinta Epóxi ou PU de alta resistência', category: 'Superfícies Específicas' },
  { id: 'madeira', title: 'Madeira', subtitle: 'Portas, janelas, pergolados', category: 'Materiais Especiais' },
  { id: 'metal', title: 'Metal', subtitle: 'Portões, grades, estruturas metálicas', category: 'Materiais Especiais' }
];

export function WallPaintCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [target, setTarget] = useState<SelectOption | null>(null);
  
  const [surfaceType, setSurfaceType] = useState('');
  
  const [coats, setCoats] = useState('2');
  
  const [inputMethod, setInputMethod] = useState('');
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  
  const [hasOpenings, setHasOpenings] = useState<boolean | null>(null);
  const [openings, setOpenings] = useState([{ id: Date.now(), w: '', h: '', qty: '1' }]);
  
  const [lossRate, setLossRate] = useState('10'); // 10%

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  // Math
  const netAreaCalc = () => {
    let baseArea = 0;
    if (inputMethod === 'area') {
      baseArea = parseFloat(area) || 0;
    } else {
      baseArea = (parseFloat(width) || 0) * (parseFloat(height) || 0);
    }
    
    let desc = 0;
    if (hasOpenings) {
      openings.forEach(op => {
        desc += (parseFloat(op.w) || 0) * (parseFloat(op.h) || 0) * (parseInt(op.qty) || 1);
      });
    }
    return Math.max(0, baseArea - desc);
  };

  const calculateResults = () => {
    const netArea = netAreaCalc();
    const numCoats = parseInt(coats) || 2;
    const loss = 1 + ((parseFloat(lossRate) || 0) / 100);
    
    // Logic for Yield based on target and surface
    let baseYield = Coefficients.finishes.paint.acrylic.yieldM2PerLiter; // default 10m2/L/coat
    let paintName = 'Tinta Acrílica Fosca';
    
    if (target?.id === 'teto') { baseYield = Coefficients.finishes.paint.acrylic.yieldM2PerLiter; paintName = 'Tinta PVA (Teto)'; }
    if (target?.id === 'piso') { baseYield = Coefficients.finishes.paint.epoxy.yieldM2PerLiter; paintName = 'Tinta Epóxi Piso'; }
    if (target?.id === 'madeira' || target?.id === 'metal') { baseYield = Coefficients.finishes.paint.enamel.yieldM2PerLiter; paintName = 'Esmalte Sintético'; }
    if (target?.id === 'fachada') { baseYield = Coefficients.finishes.paint.acrylic.yieldM2PerLiter; paintName = 'Tinta Emborrachada (Fachada)'; }
    if (target?.id === 'externa') { paintName = 'Tinta Acrílica Premium Exterior'; }

    // Surface modifiers
    let surfMult = 1.0;
    let needsSealer = false;
    let needsPutty = false;
    let puttyRatio = 0; // % of area that needs putty

    if (surfaceType === 'novo') {
      surfMult = 0.7; // Absorve muito
      needsSealer = true;
      needsPutty = true;
      puttyRatio = 1.0; // 100% da área precisa de massa
    } else if (surfaceType === 'lisa') {
      surfMult = 1.1; // Já pintada, rende bem
      needsSealer = false;
      needsPutty = false;
    } else if (surfaceType === 'reparos') {
      surfMult = 0.9;
      needsSealer = false;
      needsPutty = true;
      puttyRatio = 0.3; // 30% da área precisa de reparo com massa
    } else if (surfaceType === 'gesso') {
      surfMult = 0.85;
      needsSealer = true; // Fundo preparador para gesso
      needsPutty = true;
      puttyRatio = 1.0;
    }

    const finalYield = baseYield * surfMult; // m² per liter per coat
    
    const totalAreaDemao = netArea * numCoats;
    const areaComPerda = totalAreaDemao * loss;
    
    const litersRequired = areaComPerda / finalYield;
    
    const cans18L = Math.floor(litersRequired / 18);
    const rem = litersRequired - (cans18L * 18);
    const gallons36L = Math.ceil(rem / 3.6);

    const metrics: CalcResultItem[] = [
      { label: 'Área a Pintar', value: netArea.toFixed(2), unit: 'm²', highlight: true },
      { label: 'Total Litros Tinta', value: litersRequired.toFixed(1), unit: 'L', highlight: true },
      { label: 'Demãos', value: `${numCoats}`, unit: 'demãos' },
    ];

    const materials: CalcMaterial[] = [];
    
    if (cans18L > 0) materials.push({ name: `${paintName} (Latas 18L)`, quantity: cans18L, unit: 'Lata(s)' });
    if (gallons36L > 0) materials.push({ name: `${paintName} (Galões 3.6L)`, quantity: gallons36L, unit: 'Galão(ões)' });

    // Inteligência Técnica: Cálculo de Complementos
    if (needsSealer) {
      const sealerYield = Coefficients.finishes.paint.sealer.yieldM2PerLiter; // 8m2/L
      const sealerLiters = netArea / sealerYield;
      const sealer18L = Math.ceil(sealerLiters / 18);
      
      const sealerName = surfaceType === 'gesso' ? 'Fundo Preparador para Gesso (18L)' : 'Selador Acrílico (18L)';
      materials.push({ name: sealerName, quantity: sealer18L > 0 ? sealer18L : 1, unit: 'Lata(s)' });
      metrics.push({ label: 'Fundo/Selador', value: 'Recomendado', unit: 'obrigatório' });
    }

    if (needsPutty) {
      const puttyArea = netArea * puttyRatio;
      const puttyKg = puttyArea / 2.5; // Rendimento médio 2.5m² por Kg (2 demãos)
      const puttyBags = Math.ceil(puttyKg / 25); // Barricas de 25kg ou 28kg
      
      const pName = (target?.id === 'interna' || target?.id === 'teto') ? 'Massa Corrida PVA (Barrica 25kg)' : 'Massa Acrílica (Barrica 25kg)';
      materials.push({ name: pName, quantity: puttyBags > 0 ? puttyBags : 1, unit: 'Barrica(s)' });
    }

    // Fitas e Rolos
    materials.push({ name: 'Rolo de Lã (Anti-respingo) 23cm', quantity: Math.ceil(netArea / 100), unit: 'unid.' });
    materials.push({ name: 'Fita Crepe (Rolo 50m)', quantity: Math.ceil(netArea / 50), unit: 'rolos' });

    return { metrics, materials };
  };

  const addOpening = () => {
    setOpenings([...openings, { id: Date.now(), w: '', h: '', qty: '1' }]);
  };
  const removeOpening = (id: number) => {
    setOpenings(openings.filter(op => op.id !== id));
  };

  const steps: WizardStep[] = [
    {
      id: 'target',
      title: 'O que você vai pintar?',
      content: (
        <SearchableSelect 
          options={targetOptions} 
          selectedId={target?.id} 
          onSelect={(opt) => { setTarget(opt); handleNext(); }}
          searchPlaceholder="Pesquisar local ou material..."
          onCustomSelect={() => {
            setTarget({ id: 'custom', title: 'Superfície Personalizada', category: 'Outros' });
            handleNext();
          }}
        />
      ),
      isValid: !!target,
      hideNextButton: true
    },
    {
      id: 'surface',
      title: 'Qual a situação atual da superfície?',
      subtitle: 'Isso define a necessidade de massa corrida, selador e altera o rendimento da tinta.',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {[
            { id: 'novo', title: 'Novo no reboco', desc: 'Parede bruta. Sistema calculará Selador Acrílico e Massa para toda a área.' },
            { id: 'lisa', title: 'Repintura lisa', desc: 'Superfície pronta, sem falhas. O cálculo será apenas para a Tinta, com alto rendimento.' },
            { id: 'reparos', title: 'Repintura com reparos', desc: 'Parede com buracos/descascados. Calculará Massa para reparos parciais.' },
            { id: 'gesso', title: 'Gesso / Drywall', desc: 'Superfície muito lisa. Requer Fundo Preparador específico para não descascar.' },
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
      id: 'coats',
      title: 'Demãos necessárias',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="input-group">
            <label>Quantas demãos deseja aplicar?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { n: '1', desc: 'Repintura da mesma cor' },
                { n: '2', desc: 'Padrão recomendado' },
                { n: '3', desc: 'Mudança drástica de cor' }
              ].map(opt => (
                <button 
                  key={opt.n}
                  onClick={() => { setCoats(opt.n); handleNext(); }}
                  style={{ 
                    padding: '16px 12px', borderRadius: 16, 
                    backgroundColor: coats === opt.n ? 'var(--color-primary)' : 'var(--bg-surface)', 
                    color: coats === opt.n ? '#fff' : 'var(--text-main)', 
                    border: `1px solid ${coats === opt.n ? 'var(--color-primary)' : 'var(--border-subtle)'}`, 
                    fontWeight: 600, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                  }}
                  className="card-premium-interactive"
                >
                  <span style={{ fontSize: 24 }}>{opt.n}</span>
                  <span style={{ fontSize: 12, opacity: 0.8, textAlign: 'center' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      isValid: parseInt(coats) > 0,
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
              <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 50" />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Comprimento Total (m)</label>
                <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 10" />
              </div>
              <div className="input-group">
                <label>Altura / Pé-direito (m)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Ex: 2.8" />
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
    hasOpenings === true ? {
      id: 'openings_list',
      title: 'Adicione os vãos (Portas/Janelas)',
      subtitle: 'Eles serão descontados da área total para o cálculo exato de material.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {openings.map((op, i) => (
            <div key={op.id} style={{ display: 'flex', gap: 12, alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: 16, borderRadius: 16 }}>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Larg. (m)</label>
                  <input type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-main)' }} value={op.w} onChange={e => { const n = [...openings]; n[i].w = e.target.value; setOpenings(n); }} placeholder="0.80" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Alt. (m)</label>
                  <input type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-main)' }} value={op.h} onChange={e => { const n = [...openings]; n[i].h = e.target.value; setOpenings(n); }} placeholder="2.10" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Qtd</label>
                  <input type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-main)' }} value={op.qty} onChange={e => { const n = [...openings]; n[i].qty = e.target.value; setOpenings(n); }} placeholder="1" />
                </div>
              </div>
              <button onClick={() => removeOpening(op.id)} style={{ padding: 8, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
          ))}
          <button onClick={addOpening} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, border: '1px dashed var(--border-strong)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>
            <FilePlus size={20} /> Adicionar outro vão
          </button>
        </div>
      ),
      isValid: openings.every(op => parseFloat(op.w) > 0 && parseFloat(op.h) > 0 && parseInt(op.qty) > 0) || openings.length === 0
    } : null,
    {
      id: 'loss_rate',
      title: 'Taxa de Perdas',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Margem de Segurança (%)</label>
            <input type="number" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>
          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              O padrão de pintura recomenda <strong>10%</strong> para cobrir perdas no rolo, na bandeja e possíveis derramamentos.
            </p>
          </div>
        </div>
      ),
      isValid: parseFloat(lossRate) >= 0
    }
  ].filter(Boolean) as WizardStep[];

  if (showResults) {
    const { metrics, materials } = calculateResults();
    return (
      <BaseCalculatorLayout
        title="Assistente de Pintura"
        description="Cálculo inteligente de tintas, massa e fundos preparadores."
        icon={<Paintbrush2 size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            `Alvo: ${target?.title}. Superfície: ${surfaceType}.`,
            `Cálculo técnico realizou ajustes baseados na absorção da superfície escolhida.`
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente de Pintura"
      icon={<Paintbrush2 size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
