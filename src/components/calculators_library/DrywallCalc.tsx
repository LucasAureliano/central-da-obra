import { useState } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { Layers, FilePlus, X, Info } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';

export function DrywallCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [target, setTarget] = useState('parede');
  const [inputMethod, setInputMethod] = useState('');
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  
  const [hasOpenings, setHasOpenings] = useState<boolean | null>(null);
  const [openings, setOpenings] = useState([{ w: '', h: '', qty: '1' }]);
  
  const addOpening = () => setOpenings([...openings, { w: '', h: '', qty: '1' }]);
  
  const [boardType, setBoardType] = useState('');
  
  // New States for Wall Structure and Acoustics
  const [wallStructure, setWallStructure] = useState<'simples'|'dupla'>('simples');
  const [hasAcoustics, setHasAcoustics] = useState<boolean | null>(null);

  const [lossRate, setLossRate] = useState('5'); // 5%

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
    const areaComPerda = netArea * loss;

    const coef = Coefficients.drywall;
    
    const boardNames: Record<string, string> = {
      'st': 'Standard (Branca)',
      'ru': 'Resistente à Umidade (Verde)',
      'rf': 'Resistente ao Fogo (Rosa)'
    };

    // Chapas de 1.20 x 2.40 = 2.88m2 cada
    // Se for parede dupla, usa o dobro de chapas
    const structureMultiplier = wallStructure === 'dupla' ? 2 : 1;
    const sqMetersNeeded = areaComPerda * coef.boardsSqMPerM2 * structureMultiplier;
    const boards = Math.ceil(sqMetersNeeded / 2.88);
    
    // Parede dupla usa um pouco mais de montantes e parafusos (ajuste empírico leve, +30% de estrutura extra para reforço duplo)
    const studsMl = areaComPerda * coef.studsMlPerM2 * (wallStructure === 'dupla' ? 1.3 : 1);
    const studs = Math.ceil(studsMl / 3); // barras de 3m
    
    const tracksMl = areaComPerda * coef.tracksMlPerM2 * (wallStructure === 'dupla' ? 1.3 : 1);
    const tracks = Math.ceil(tracksMl / 3); // barras de 3m
    
    const screws = Math.ceil(areaComPerda * coef.screwsPerM2 * structureMultiplier);
    const screwsBox = Math.ceil(screws / 1000); // caixa c/ 1000
    
    const jointCompoundKg = areaComPerda * coef.jointCompoundKgPerM2 * structureMultiplier;
    const jointCompoundBucket = Math.ceil(jointCompoundKg / 5); // balde 5kg
    
    const tapeMl = areaComPerda * coef.jointTapeMlPerM2 * structureMultiplier;
    const tapeRolls = Math.ceil(tapeMl / 90); // rolo 90m

    // Acoustics
    let acousticRolls = 0;
    if (hasAcoustics) {
      const acousticSqm = areaComPerda; // 1 layer of acoustic wool inside the wall
      acousticRolls = Math.ceil(acousticSqm / 15); // Rolo padrão Lã de PET 15m²
    }

    const metrics: CalcResultItem[] = [
      { label: 'Área Líquida', value: netArea.toFixed(2), unit: 'm²', highlight: true },
      { label: 'Chapas Necessárias', value: boards.toString(), unit: 'unidades', highlight: true },
      { label: 'Perda Considerada', value: `${lossRate}`, unit: '%' },
    ];

    const materials: CalcMaterial[] = [
      { name: `Chapa Drywall ${boardNames[boardType]} (1,20x2,40m)`, quantity: boards, unit: 'unid.' },
      { name: 'Montantes de 90mm (Barra 3m)', quantity: studs, unit: 'barras' },
      { name: 'Guias de 90mm (Barra 3m)', quantity: tracks, unit: 'barras' },
      { name: 'Parafusos Trombeta TA 25 (Cx 1000)', quantity: screwsBox, unit: 'caixa(s)' },
      { name: 'Massa para Junta (Balde 5kg)', quantity: jointCompoundBucket, unit: 'balde(s)' },
      { name: 'Fita Telada ou Papel (Rolo 90m)', quantity: tapeRolls, unit: 'rolo(s)' }
    ];

    if (hasAcoustics) {
      materials.push({ name: 'Lã de Vidro / PET (Rolo 15m²)', quantity: acousticRolls, unit: 'rolo(s)' });
    }

    return { metrics, materials, boardNames };
  };

  const steps: WizardStep[] = [
    {
      id: 'target',
      title: 'O que será construído com Drywall?',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {[
            { id: 'parede', title: 'Parede Divisória', desc: 'Parede simples com 1 chapa de cada lado' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => { setTarget(opt.id); handleNext(); }}
              className={target === opt.id ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
              style={{
                padding: 20, borderRadius: 16, textAlign: 'left',
                backgroundColor: target === opt.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                border: `1px solid ${target === opt.id ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <h4 style={{ fontSize: 18, fontWeight: 700, color: target === opt.id ? 'var(--color-primary)' : 'var(--text-main)' }}>{opt.title}</h4>
              <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{opt.desc}</p>
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
      title: inputMethod === 'area' ? 'Qual a área total?' : 'Dimensões da parede',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inputMethod === 'area' ? (
            <div className="input-group">
              <label>Área Total (m²)</label>
              <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 12.5" />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Comprimento (m)</label>
                <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 4.5" />
              </div>
              <div className="input-group">
                <label>Altura (m)</label>
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
      title: 'Existem portas ou janelas nesta parede?',
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
                <input type="number" value={op.w} onChange={e => { const n = [...openings]; n[i].w = e.target.value; setOpenings(n); }} placeholder="0.80" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Alt. (m)</label>
                <input type="number" value={op.h} onChange={e => { const n = [...openings]; n[i].h = e.target.value; setOpenings(n); }} placeholder="2.10" />
              </div>
              <div className="input-group" style={{ width: 80 }}>
                <label>Qtd</label>
                <input type="number" value={op.qty} onChange={e => { const n = [...openings]; n[i].qty = e.target.value; setOpenings(n); }} placeholder="1" />
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
      id: 'structure',
      title: 'Estrutura da Parede',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {[
            { id: 'simples', title: 'Parede Simples (1 chapa por lado)', desc: 'Ideal para divisões internas comuns.' },
            { id: 'dupla', title: 'Parede Dupla (2 chapas por lado)', desc: 'Maior resistência mecânica e acústica.' },
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => { setWallStructure(opt.id as any); handleNext(); }}
              className={wallStructure === opt.id ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
              style={{
                padding: 16, borderRadius: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4,
                backgroundColor: wallStructure === opt.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                border: `1px solid ${wallStructure === opt.id ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, color: wallStructure === opt.id ? 'var(--color-primary)' : 'var(--text-main)' }}>{opt.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      ),
      isValid: !!wallStructure,
      hideNextButton: true
    },
    {
      id: 'board_type',
      title: 'Qual o tipo de chapa?',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {[
            { id: 'st', title: 'Standard (ST - Branca)', desc: 'Para ambientes secos (salas, quartos, escritórios)' },
            { id: 'ru', title: 'Resistente à Umidade (RU - Verde)', desc: 'Para áreas molhadas (banheiros, cozinhas)' },
            { id: 'rf', title: 'Resistente ao Fogo (RF - Rosa)', desc: 'Para rotas de fuga e áreas com risco de incêndio' },
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => { setBoardType(opt.id); handleNext(); }}
              className={boardType === opt.id ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
              style={{
                padding: 16, borderRadius: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4,
                backgroundColor: boardType === opt.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                border: `1px solid ${boardType === opt.id ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, color: boardType === opt.id ? 'var(--color-primary)' : 'var(--text-main)' }}>{opt.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      ),
      isValid: !!boardType,
      hideNextButton: true
    },
    {
      id: 'acoustics',
      title: 'Isolamento Acústico / Térmico',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <button onClick={() => { setHasAcoustics(true); handleNext(); }} className={hasAcoustics === true ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasAcoustics === true ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasAcoustics === true ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasAcoustics === true ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Com Isolamento (Lã)
          </button>
          <button onClick={() => { setHasAcoustics(false); handleNext(); }} className={hasAcoustics === false ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasAcoustics === false ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasAcoustics === false ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasAcoustics === false ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Sem Isolamento
          </button>
        </div>
      ),
      isValid: hasAcoustics !== null,
      hideNextButton: true
    },
    {
      id: 'loss',
      title: 'Ajustes Finais',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="input-group">
            <label>Taxa de Perda (%)</label>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Recomendamos 5% para quebras e recortes nas chapas.</p>
            <input type="number" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>

          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              O sistema calculará todos os insumos periféricos automaticamente (perfis de 90mm, parafusos, fita e massa para junta).
            </p>
          </div>
        </div>
      ),
      isValid: parseFloat(lossRate) >= 0
    }
  ];

  if (showResults) {
    const { metrics, materials, boardNames } = calculateResults();
    return (
      <BaseCalculatorLayout
        title="Assistente de Drywall"
        description="Cálculo detalhado de chapas e estrutura."
        icon={<Layers size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            `Área considerada: ${netAreaCalc().toFixed(2)}m². Parede divisória simples.`,
            `Montantes a cada 60cm. Chapa: ${boardNames[boardType]}.`
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente de Drywall"
      icon={<Layers size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
