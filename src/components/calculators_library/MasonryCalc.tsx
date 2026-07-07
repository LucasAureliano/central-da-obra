import { useState, useMemo } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { SearchableSelect } from './SearchableSelect';
import type { SelectOption } from './SearchableSelect';
import { Grid, Info, Plus, Trash2 } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';

const blockOptions: SelectOption[] = [
  { id: 'baiano_9x19x19', title: 'Tijolo Baiano (9x19x19cm)', subtitle: 'Alvenaria de vedação', category: 'Cerâmicos', isFavorite: true },
  { id: 'ceramico_11.5x14x24', title: 'Bloco Cerâmico (11.5x14x24cm)', subtitle: 'Vedação padrão', category: 'Cerâmicos', isFavorite: true },
  { id: 'estrutural_14x19x39', title: 'Bloco de Concreto Estrutural (14x19x39cm)', subtitle: 'Função estrutural/Muros', category: 'Concreto' },
  { id: 'estrutural_19x19x39', title: 'Bloco de Concreto Estrutural (19x19x39cm)', subtitle: 'Maior resistência', category: 'Concreto' },
  { id: 'macico_5x9x19', title: 'Tijolo Maciço (5x9x19cm)', subtitle: 'Aparente ou estrutural antiga', category: 'Maciços' }
];

export function MasonryCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [blockType, setBlockType] = useState<SelectOption | null>(null);
  const [customBlockName, setCustomBlockName] = useState('');
  const [customYield, setCustomYield] = useState('');

  const [inputMethod, setInputMethod] = useState('');
  
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const [hasOpenings, setHasOpenings] = useState<boolean | null>(null);
  const [openings, setOpenings] = useState<{ id: string; w: string; h: string; q: string }[]>([]);

  const [mortarType, setMortarType] = useState('');
  
  const [lossRate, setLossRate] = useState('10'); // 10% perda de blocos padrão

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const parsedBaseArea = useMemo(() => {
    if (inputMethod === 'area') return parseFloat(area) || 0;
    return (parseFloat(width) || 0) * (parseFloat(height) || 0);
  }, [inputMethod, area, width, height]);

  const openingsArea = useMemo(() => {
    if (!hasOpenings) return 0;
    return openings.reduce((acc, o) => acc + ((parseFloat(o.w) || 0) * (parseFloat(o.h) || 0) * (parseInt(o.q) || 1)), 0);
  }, [hasOpenings, openings]);

  const netArea = Math.max(0, parsedBaseArea - openingsArea);

  const addOpening = () => {
    setOpenings(prev => [...prev, { id: Math.random().toString(), w: '', h: '', q: '1' }]);
  };

  const updateOpening = (id: string, field: 'w'|'h'|'q', value: string) => {
    setOpenings(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const removeOpening = (id: string) => {
    setOpenings(prev => prev.filter(o => o.id !== id));
  };

  const calculateResults = () => {
    const lossMultiplier = 1 + (parseFloat(lossRate) / 100 || 0);
    
    // @ts-ignore
    let blockYield = Coefficients.masonry[blockType?.id]?.yieldM2 || parseFloat(customYield) || 25; // Default 25
    
    const totalBlocks = Math.ceil(netArea * blockYield * lossMultiplier);

    const metrics: CalcResultItem[] = [
      { label: 'Área Total', value: parsedBaseArea.toFixed(2), unit: 'm²' },
      { label: 'Desconto de Vãos', value: openingsArea.toFixed(2), unit: 'm²' },
      { label: 'Área Líquida', value: netArea.toFixed(2), unit: 'm²', highlight: true },
      { label: 'Qtd. de Blocos', value: totalBlocks, unit: 'und', highlight: true }
    ];

    const materials: CalcMaterial[] = [];
    const blockName = blockType?.id === 'custom' ? (customBlockName || 'Bloco Personalizado') : blockType?.title;
    materials.push({ name: blockName || 'Blocos', quantity: totalBlocks, unit: 'und' });

    // Mortar calculations (approximate)
    // Argamassa Convencional: ~15kg a 20kg por m2
    // Argamassa Pronta: ~15kg a 20kg por m2
    // Cola estrutural (polimérica): ~1.5kg a 2kg por m2
    
    if (mortarType === 'pronta') {
      const kg = Math.ceil(netArea * 18); // 18kg/m2 avg
      materials.push({ name: 'Argamassa Pronta', quantity: Math.ceil(kg / 20), unit: 'sacos 20kg' });
    } else if (mortarType === 'polimerica') {
      const kg = Math.ceil(netArea * 1.5); // 1.5kg/m2 avg
      materials.push({ name: 'Argamassa Polimérica (Cola)', quantity: kg, unit: 'kg' });
    } else if (mortarType === 'convencional') {
      // Traço 1:2:8 (cimento, cal, areia) - aprox 5kg cimento, 5kg cal, 0.03m3 areia por m2
      const cimento = Math.ceil(netArea * 5 / 50); // sacos 50kg
      const cal = Math.ceil(netArea * 5 / 20); // sacos 20kg
      const areia = (netArea * 0.03).toFixed(2);
      
      materials.push({ name: 'Cimento (50kg)', quantity: cimento, unit: 'saco(s)' });
      materials.push({ name: 'Cal / Filito (20kg)', quantity: cal, unit: 'saco(s)' });
      materials.push({ name: 'Areia Média', quantity: areia, unit: 'm³' });
    }

    return { metrics, materials };
  };

  const steps: WizardStep[] = [
    {
      id: 'block_type',
      title: 'Qual tipo de bloco ou tijolo?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SearchableSelect 
            options={blockOptions} 
            selectedId={blockType?.id} 
            onSelect={(opt) => { setBlockType(opt); handleNext(); }}
            onCustomSelect={() => { setBlockType({ id: 'custom', title: 'Outro (Personalizado)' }); }}
            searchPlaceholder="Pesquisar bloco ou tijolo..."
          />
          {blockType?.id === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, backgroundColor: 'var(--bg-surface)', padding: 16, borderRadius: 16 }}>
              <div className="input-group">
                <label>Nome do Bloco</label>
                <input type="text" value={customBlockName} onChange={e => setCustomBlockName(e.target.value)} placeholder="Ex: Bloco de vidro" />
              </div>
              <div className="input-group">
                <label>Rendimento (Blocos por m²)</label>
                <input type="number" value={customYield} onChange={e => setCustomYield(e.target.value)} placeholder="Ex: 25" />
              </div>
            </div>
          )}
        </div>
      ),
      isValid: !!blockType && (blockType.id !== 'custom' || parseFloat(customYield) > 0),
      hideNextButton: blockType?.id !== 'custom'
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
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--text-main)' }}>Comprimento × Altura</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>O sistema calculará a área automaticamente.</p>
          </button>
        </div>
      ),
      isValid: !!inputMethod,
      hideNextButton: true
    },
    {
      id: 'dimensions',
      title: inputMethod === 'area' ? 'Qual a área da parede?' : 'Dimensões da parede',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inputMethod === 'area' ? (
            <div className="input-group">
              <label>Área Total (m²)</label>
              <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 14" />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Comprimento (m)</label>
                <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 5.0" />
              </div>
              <div className="input-group">
                <label>Altura (m)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Ex: 2.8" />
              </div>
            </>
          )}
        </div>
      ),
      isValid: parsedBaseArea > 0
    },
    {
      id: 'openings_ask',
      title: 'Existem portas ou janelas?',
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
    hasOpenings !== false ? {
      id: 'openings_detail',
      title: 'Adicionar Vãos (Portas/Janelas)',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {openings.map((op) => (
            <div key={op.id} style={{ display: 'flex', gap: 12, alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: 16, borderRadius: 16 }}>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Larg. (m)</label>
                  <input type="number" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }} value={op.w} onChange={e => updateOpening(op.id, 'w', e.target.value)} placeholder="0.8" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Alt. (m)</label>
                  <input type="number" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }} value={op.h} onChange={e => updateOpening(op.id, 'h', e.target.value)} placeholder="2.1" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qtd.</label>
                  <input type="number" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }} value={op.q} onChange={e => updateOpening(op.id, 'q', e.target.value)} min="1" />
                </div>
              </div>
              <button onClick={() => removeOpening(op.id)} style={{ padding: 8, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button onClick={addOpening} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, border: '1px dashed var(--border-strong)', backgroundColor: 'transparent', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>
            <Plus size={20} /> Adicionar Vão
          </button>
        </div>
      ),
      isValid: true
    } : null,
    {
      id: 'mortar_type',
      title: 'Tipo de assentamento',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {[
            { id: 'convencional', title: 'Argamassa Convencional (Obra)', desc: 'Preparo na obra (Cimento, Cal, Areia).' },
            { id: 'pronta', title: 'Argamassa Pronta', desc: 'Em sacos de 20kg, basta adicionar água.' },
            { id: 'polimerica', title: 'Argamassa Polimérica (Cola)', desc: 'Massa pronta em bisnaga (alta produtividade).' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => { setMortarType(opt.id); handleNext(); }}
              className={mortarType === opt.id ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
              style={{
                padding: 16, borderRadius: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4,
                backgroundColor: mortarType === opt.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                border: `1px solid ${mortarType === opt.id ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, color: mortarType === opt.id ? 'var(--color-primary)' : 'var(--text-main)' }}>{opt.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      ),
      isValid: !!mortarType,
      hideNextButton: true
    },
    {
      id: 'loss_rate',
      title: 'Taxa de Quebras e Perdas',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Margem de Perda (%)</label>
            <input type="number" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>
          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              O padrão do mercado para blocos e tijolos é <strong>10%</strong> para cobrir quebras no transporte e cortes nas extremidades.
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
        title="Assistente de Alvenaria"
        description="Cálculo detalhado de blocos e argamassa de assentamento."
        icon={<Grid size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            hasOpenings ? `Foram descontados ${openingsArea.toFixed(2)}m² de vãos na parede.` : 'Nenhum desconto de vãos efetuado.',
            mortarType === 'convencional' ? 'O traço da argamassa convencional assumido é 1:2:8.' : 'A argamassa polimérica não deve ser usada para alvenaria estrutural sem laudo do fabricante.'
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente de Alvenaria"
      icon={<Grid size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
