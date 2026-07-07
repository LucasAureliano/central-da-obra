import { useState, useMemo } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { SearchableSelect } from './SearchableSelect';
import type { SelectOption } from './SearchableSelect';
import { Grid3X3, Info } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';

const tileOptions: SelectOption[] = [
  { id: 'ceramica', title: 'Cerâmica', subtitle: 'Piso cerâmico comum', category: 'Frios', isFavorite: true },
  { id: 'porcelanato', title: 'Porcelanato', subtitle: 'Piso de alta resistência e acabamento', category: 'Frios', isFavorite: true },
  { id: 'vinilico', title: 'Piso Vinílico', subtitle: 'Em manta ou régua', category: 'Quentes', isRecent: true },
  { id: 'laminado', title: 'Piso Laminado', subtitle: 'Madeira processada', category: 'Quentes' },
  { id: 'granito', title: 'Granito', subtitle: 'Pedra natural', category: 'Pedras Naturais' },
  { id: 'marmore', title: 'Mármore', subtitle: 'Pedra nobre', category: 'Pedras Naturais' },
  { id: 'fulget', title: 'Fulget', subtitle: 'Granilha lavada', category: 'Especiais' },
  { id: 'cimento', title: 'Cimento Queimado', subtitle: 'Acabamento rústico', category: 'Especiais' },
  { id: 'pedra', title: 'Pedra Miracema/São Tomé', subtitle: 'Pedras rústicas externas', category: 'Pedras Naturais' },
];

const sizeOptions: SelectOption[] = [
  { id: '60x60', title: '60 × 60 cm', category: 'Comuns', isFavorite: true },
  { id: '80x80', title: '80 × 80 cm', category: 'Comuns', isFavorite: true },
  { id: '90x90', title: '90 × 90 cm', category: 'Grandes Formatos' },
  { id: '120x120', title: '120 × 120 cm', category: 'Grandes Formatos' },
  { id: '20x120', title: '20 × 120 cm (Régua)', category: 'Amadeirados' },
  { id: '30x30', title: '30 × 30 cm', category: 'Pequenos' }
];

export function FloorTileCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [inputMethod, setInputMethod] = useState('');
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  
  const [tileType, setTileType] = useState<SelectOption | null>(null);
  
  const [tileSizeObj, setTileSizeObj] = useState<SelectOption | null>(null);
  const [customTileW, setCustomTileW] = useState('');
  const [customTileL, setCustomTileL] = useState('');

  const [pattern, setPattern] = useState('');
  
  const [hasSkirting, setHasSkirting] = useState<boolean | null>(null);
  const [skirtHeight, setSkirtHeight] = useState('10'); // 10 cm
  const [skirtLength, setSkirtLength] = useState(''); // If empty, calculate approx

  const [doubleBond, setDoubleBond] = useState<boolean | null>(null);
  
  const [groutJoint, setGroutJoint] = useState('2'); // mm
  
  const [lossRate, setLossRate] = useState('10');

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const parsedBaseArea = useMemo(() => {
    if (inputMethod === 'area') return parseFloat(area) || 0;
    return (parseFloat(width) || 0) * (parseFloat(length) || 0);
  }, [inputMethod, area, width, length]);

  const parsedTileSize = useMemo(() => {
    if (tileSizeObj?.id === 'custom') {
      return { w: parseFloat(customTileW) || 0, l: parseFloat(customTileL) || 0 };
    }
    if (tileSizeObj) {
      const parts = tileSizeObj.id.split('x');
      return { w: parseFloat(parts[0]), l: parseFloat(parts[1]) };
    }
    return { w: 0, l: 0 };
  }, [tileSizeObj, customTileW, customTileL]);

  // Adjust default loss rate when pattern changes
  const handlePatternSelect = (p: string) => {
    setPattern(p);
    if (p === 'alinhado') setLossRate('10');
    else if (p === 'diagonal') setLossRate('15');
    else setLossRate('20'); // espinha / escama
    handleNext();
  };

  const calculateResults = () => {
    const baseArea = parsedBaseArea;
    
    // Skirting area
    let skirtArea = 0;
    const sH = parseFloat(skirtHeight) || 10;
    if (hasSkirting) {
      let sL = parseFloat(skirtLength);
      if (!sL || isNaN(sL)) {
        if (inputMethod === 'dim') sL = ((parseFloat(width) || 0) + (parseFloat(length) || 0)) * 2;
        else sL = Math.sqrt(baseArea) * 4; // Approx perimeter of a square
      }
      skirtArea = sL * (sH / 100);
    }

    const totalArea = baseArea + skirtArea;
    const lossMultiplier = 1 + (parseFloat(lossRate) / 100 || 0.1);
    const areaWithLoss = totalArea * lossMultiplier;

    // Tile Area
    let tileQty = 0;
    let tArea = 0;
    if (parsedTileSize.w > 0 && parsedTileSize.l > 0) {
      tArea = (parsedTileSize.w / 100) * (parsedTileSize.l / 100);
      tileQty = Math.ceil(areaWithLoss / tArea);
    }

    // Boxes (Assume ~2m2 or 1.5m2 per box average if we don't know exact. Or just don't calculate boxes if we don't have box sizes. Let's assume user buys by m2 or pieces)
    // Most floors are sold by m2.
    
    // Argamassa
    // Simple colagem: 4 to 5 kg/m2
    // Dupla colagem: 7 to 8 kg/m2
    const kgPerM2 = doubleBond ? 8 : Coefficients.finishes.floor.mortarKgPerM2;
    const mortarKg = Math.ceil(areaWithLoss * kgPerM2);
    const mortarBags = Math.ceil(mortarKg / 20); // 20kg bags

    // Rejunte (Approximate formula: ((L+W)/(L*W)) * H * E * 1.58 )
    let groutKg = Math.ceil(areaWithLoss * Coefficients.finishes.floor.groutKgPerM2); // Fallback
    if (parsedTileSize.w > 0 && parsedTileSize.l > 0) {
      const tileL_mm = parsedTileSize.l * 10;
      const tileW_mm = parsedTileSize.w * 10;
      const joint_mm = parseFloat(groutJoint) || 2;
      const tileThickness_mm = 8; // Espessura média assumida: 8mm
      const groutKgPerM2 = ((tileL_mm + tileW_mm) / (tileL_mm * tileW_mm)) * tileThickness_mm * joint_mm * 1.58;
      groutKg = Math.ceil(areaWithLoss * groutKgPerM2);
    }

    const metrics: CalcResultItem[] = [
      { label: 'Área Total a Revestir', value: totalArea.toFixed(2), unit: 'm²', highlight: true },
      { label: 'Área com Perdas', value: areaWithLoss.toFixed(2), unit: 'm²' },
      { label: 'Qtd. de Peças', value: tileQty || '-', unit: 'und', highlight: true },
      { label: 'Taxa de Perda', value: lossRate, unit: '%' }
    ];

    const materials: CalcMaterial[] = [
      { name: 'Piso / Revestimento', quantity: areaWithLoss.toFixed(2), unit: 'm² (comprados)' },
      { name: 'Argamassa', quantity: mortarBags, unit: 'Saco(s) de 20kg' },
      { name: 'Rejunte', quantity: groutKg, unit: 'kg' },
    ];

    return { metrics, materials, totalArea, areaWithLoss };
  };

  const steps: WizardStep[] = [
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
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--text-main)' }}>Comprimento × Largura</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>O sistema calculará a área automaticamente.</p>
          </button>
        </div>
      ),
      isValid: !!inputMethod,
      hideNextButton: true
    },
    {
      id: 'dimensions',
      title: inputMethod === 'area' ? 'Qual a área pronta?' : 'Dimensões do ambiente',
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
                <label>Comprimento (m)</label>
                <input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="Ex: 5" />
              </div>
              <div className="input-group">
                <label>Largura (m)</label>
                <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 4" />
              </div>
            </>
          )}
        </div>
      ),
      isValid: parsedBaseArea > 0
    },
    {
      id: 'tile_type',
      title: 'Qual tipo de revestimento?',
      content: (
        <SearchableSelect 
          options={tileOptions} 
          selectedId={tileType?.id} 
          onSelect={(opt) => { setTileType(opt); handleNext(); }}
          onCustomSelect={() => { setTileType({ id: 'custom', title: 'Outro (Personalizado)' }); handleNext(); }}
          searchPlaceholder="Pesquisar revestimento..."
        />
      ),
      isValid: !!tileType,
      hideNextButton: true
    },
    {
      id: 'tile_size',
      title: 'Qual a dimensão da peça?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SearchableSelect 
            options={sizeOptions} 
            selectedId={tileSizeObj?.id} 
            onSelect={(opt) => { 
              setTileSizeObj(opt); 
              handleNext(); 
            }}
            onCustomSelect={() => {
              setTileSizeObj({ id: 'custom', title: 'Outro (Personalizado)' });
            }}
            searchPlaceholder="Pesquisar tamanho (ex: 60x60)..."
          />
          {tileSizeObj?.id === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16, padding: 16, backgroundColor: 'var(--bg-surface)', borderRadius: 16 }}>
              <div className="input-group">
                <label>Largura (cm)</label>
                <input type="number" value={customTileW} onChange={e => setCustomTileW(e.target.value)} placeholder="Ex: 15" />
              </div>
              <div className="input-group">
                <label>Comprimento (cm)</label>
                <input type="number" value={customTileL} onChange={e => setCustomTileL(e.target.value)} placeholder="Ex: 90" />
              </div>
            </div>
          )}
        </div>
      ),
      isValid: !!tileSizeObj && (tileSizeObj.id !== 'custom' || (parseFloat(customTileW) > 0 && parseFloat(customTileL) > 0)),
      hideNextButton: tileSizeObj?.id !== 'custom' && !!tileSizeObj
    },
    {
      id: 'pattern',
      title: 'Qual o sentido da instalação?',
      subtitle: 'O formato da paginação afeta a quantidade de recortes e perdas de material.',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {[
            { id: 'alinhado', title: 'Alinhado / Reto', desc: 'Paginação tradicional. Menor perda (~10%).' },
            { id: 'diagonal', title: 'Diagonal (45°)', desc: 'Cria sensação de amplitude. Perda média (~15%).' },
            { id: 'espinha', title: 'Espinha de Peixe', desc: 'Para réguas amadeiradas. Maior perda (~20%).' },
            { id: 'escama', title: 'Escama de Peixe', desc: 'Similar à espinha, alinhamento lateral. Maior perda (~20%).' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => handlePatternSelect(opt.id)}
              className={pattern === opt.id ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
              style={{
                padding: 16, borderRadius: 16, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4,
                backgroundColor: pattern === opt.id ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                border: `1px solid ${pattern === opt.id ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, color: pattern === opt.id ? 'var(--color-primary)' : 'var(--text-main)' }}>{opt.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      ),
      isValid: !!pattern,
      hideNextButton: true
    },
    {
      id: 'skirting',
      title: 'O ambiente terá rodapé?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <button onClick={() => { setHasSkirting(true); }} className={hasSkirting === true ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasSkirting === true ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasSkirting === true ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasSkirting === true ? 'var(--color-primary)' : 'var(--text-main)' }}>
              Sim
            </button>
            <button onClick={() => { setHasSkirting(false); handleNext(); }} className={hasSkirting === false ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasSkirting === false ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasSkirting === false ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasSkirting === false ? 'var(--color-primary)' : 'var(--text-main)' }}>
              Não
            </button>
          </div>

          {hasSkirting === true && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, backgroundColor: 'var(--bg-surface)', padding: 16, borderRadius: 16 }}>
              <div className="input-group">
                <label>Altura do rodapé (cm)</label>
                <input type="number" value={skirtHeight} onChange={e => setSkirtHeight(e.target.value)} placeholder="10" />
              </div>
              <div className="input-group">
                <label>Comprimento do rodapé (m) - Opcional</label>
                <input type="number" value={skirtLength} onChange={e => setSkirtLength(e.target.value)} placeholder="Deixe em branco para aprox." />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Se vazio, o sistema estimará o perímetro.</span>
              </div>
            </div>
          )}
        </div>
      ),
      isValid: hasSkirting !== null && (hasSkirting === false || parseFloat(skirtHeight) > 0)
    },
    {
      id: 'double_bond',
      title: 'Aplicará com dupla colagem?',
      subtitle: 'Peças maiores que 30x30cm exigem argamassa na peça e no contrapiso.',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <button onClick={() => { setDoubleBond(true); handleNext(); }} className={doubleBond === true ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: doubleBond === true ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${doubleBond === true ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: doubleBond === true ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Sim
          </button>
          <button onClick={() => { setDoubleBond(false); handleNext(); }} className={doubleBond === false ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: doubleBond === false ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${doubleBond === false ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: doubleBond === false ? 'var(--color-primary)' : 'var(--text-main)' }}>
            Não
          </button>
        </div>
      ),
      isValid: doubleBond !== null,
      hideNextButton: true
    },
    {
      id: 'grout_joint',
      title: 'Espaçamento do Rejunte',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Tamanho da Junta de Dilatação (mm)</label>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>Exemplo: 2mm para porcelanato retificado, 5mm para cerâmica comum.</p>
            <input type="number" value={groutJoint} onChange={e => setGroutJoint(e.target.value)} placeholder="Ex: 2" />
          </div>
        </div>
      ),
      isValid: parseFloat(groutJoint) > 0
    },
    {
      id: 'loss_rate',
      title: 'Ajuste de Perdas',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Margem de Perda/Recorte (%)</label>
            <input type="number" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>
          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              O sistema pré-configurou <strong>{lossRate}%</strong> baseado no padrão <strong>"{pattern}"</strong>. Você pode alterar se desejar.
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
        title="Assistente de Pisos"
        description="Cálculo detalhado de revestimentos e argamassa."
        icon={<Grid3X3 size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            `Revestimento escolhido: ${tileType?.title}. Dimensão da peça: ${tileSizeObj?.id}. Padrão de instalação: ${pattern}.`,
            `Área base: ${parsedBaseArea.toFixed(2)}m². Rodapé adicionou: ${(totalArea - parsedBaseArea).toFixed(2)}m² à área.`
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente de Pisos e Revestimentos"
      icon={<Grid3X3 size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
