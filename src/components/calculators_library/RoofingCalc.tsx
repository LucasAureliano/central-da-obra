import { useState } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { SearchableSelect } from './SearchableSelect';
import type { SelectOption } from './SearchableSelect';
import { Home, Info } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';

const roofTileOptions: SelectOption[] = [
  { id: 'ceramica', title: 'Telha Cerâmica (Barro)', subtitle: 'Romana, Portuguesa, Francesa. Alto peso e caimento.', category: 'Tradicionais', isFavorite: true },
  { id: 'concreto', title: 'Telha de Concreto', subtitle: 'Maior resistência e durabilidade. Alto peso.', category: 'Tradicionais' },
  { id: 'fibrocimento', title: 'Telha de Fibrocimento', subtitle: 'Leve e econômica. Baixo caimento.', category: 'Econômicas', isFavorite: true },
  { id: 'termoacustica', title: 'Telha Metálica Termoacústica (Sanduíche)', subtitle: 'Isolamento térmico e acústico. Estrutura leve.', category: 'Metálicas' },
  { id: 'shingle', title: 'Telha Shingle', subtitle: 'Estética premium. Requer compensado.', category: 'Premium' }
];

const scopeOptions: SelectOption[] = [
  { id: 'both', title: 'Telhas + Estrutura', subtitle: 'Cálculo completo do telhado', category: 'Escopo', isFavorite: true },
  { id: 'tiles', title: 'Apenas Telhas', subtitle: 'Não incluir vigas/caibros/ripas', category: 'Escopo' },
  { id: 'structure', title: 'Apenas Estrutura', subtitle: 'Não incluir telhas', category: 'Escopo' }
];

export function RoofingCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [tileType, setTileType] = useState<SelectOption | null>(null);
  const [scope, setScope] = useState<SelectOption | null>(null);

  const [inputMethod, setInputMethod] = useState('');
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  
  const [hasEaves, setHasEaves] = useState<boolean | null>(null);
  const [eaves, setEaves] = useState('0.5'); // Beiral 50cm default
  
  const [roofWaters, setRoofWaters] = useState('2'); // Número de águas
  const [lossRate, setLossRate] = useState('10'); // 10% perdas default

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  // Math
  const netAreaCalc = () => {
    let roofArea = 0;
    
    if (inputMethod === 'area') {
      roofArea = parseFloat(area) || 0;
    } else {
      const w = parseFloat(width) || 0;
      const l = parseFloat(length) || 0;
      const beiral = hasEaves ? (parseFloat(eaves) || 0) : 0;
      
      // Adiciona o beiral nas extremidades pertinentes
      // Simplificação: 2 lados para largura, 2 lados para comprimento se for 4 águas.
      // Se for 2 águas, o beiral entra em 2 lados apenas no sentido do caimento, e em 2 lados na empena.
      // Para simplificar e garantir segurança, adicionamos em todos os lados do contorno da planta.
      const totalW = w + (beiral * 2);
      const totalL = l + (beiral * 2);
      
      // Fator multiplicador de inclinação média
      let inclFactor = 1.05; // ~30% inclinação (Cerâmica, Concreto, Shingle)
      if (tileType?.id === 'fibrocimento' || tileType?.id === 'termoacustica') {
        inclFactor = 1.01; // ~10% inclinação
      }
      
      roofArea = (totalW * totalL) * inclFactor;
    }
    return Math.max(0, roofArea);
  };

  const calculateResults = () => {
    const roofArea = netAreaCalc();
    const loss = 1 + ((parseFloat(lossRate) || 0) / 100);
    const areaWithLoss = roofArea * loss;

    const metrics: CalcResultItem[] = [
      { label: 'Área Plana (Projeção)', value: (inputMethod === 'area' ? parseFloat(area) : (parseFloat(width)*parseFloat(length))).toFixed(2), unit: 'm²' },
      { label: 'Área Inclinada c/ Perda', value: areaWithLoss.toFixed(2), unit: 'm²', highlight: true },
      { label: 'Perda Considerada', value: `${lossRate}`, unit: '%' },
    ];

    const materials: CalcMaterial[] = [];

    // TILE CALCULATION
    if (scope?.id === 'both' || scope?.id === 'tiles') {
      let yieldUn = 16; // Cerâmica padrão Romana/Portuguesa
      let tileName = 'Telhas';
      let unit = 'und';
      let isM2 = false;

      switch(tileType?.id) {
        case 'ceramica': yieldUn = Coefficients.roof.tiles.ceramic.yieldUnPerM2; tileName = 'Telha Cerâmica'; break;
        case 'concreto': yieldUn = 10.5; tileName = 'Telha de Concreto'; break;
        case 'fibrocimento': yieldUn = Coefficients.roof.tiles.fibrocement.yieldUnPerM2; tileName = 'Telha Fibrocimento 2.44x1.10m'; break; // ~0.4 chapas por m2
        case 'termoacustica': yieldUn = 1; tileName = 'Telha Termoacústica'; isM2 = true; unit = 'm²'; break;
        case 'shingle': yieldUn = 1; tileName = 'Pacote Telha Shingle'; isM2 = true; unit = 'm²'; break; // Vende por pacote que faz X m2
      }

      const totalTiles = isM2 ? Math.ceil(areaWithLoss) : Math.ceil(areaWithLoss * yieldUn);
      materials.push({ name: tileName, quantity: totalTiles, unit });

      // Cumeeiras
      if (parseInt(roofWaters) > 1) {
        let maxDim = Math.max(parseFloat(width)||0, parseFloat(length)||0);
        if (inputMethod === 'area') maxDim = Math.sqrt(roofArea);
        
        let ridgeTiles = 0;
        if (tileType?.id === 'ceramica' || tileType?.id === 'concreto') {
          ridgeTiles = Math.ceil(maxDim * 3 * loss); // ~3 por metro linear
        } else {
          ridgeTiles = Math.ceil(maxDim * 1 * loss); // Peças maiores (1m)
        }
        materials.push({ name: 'Cumeeiras', quantity: ridgeTiles, unit: 'und' });
      }

      // Fixação
      if (tileType?.id === 'fibrocimento' || tileType?.id === 'termoacustica') {
        materials.push({ name: 'Kit Fixação (Parafuso)', quantity: Math.ceil(totalTiles * (isM2 ? 4 : 2)), unit: 'unid.' });
      }
    }

    // STRUCTURE CALCULATION
    if (scope?.id === 'both' || scope?.id === 'structure') {
      let vigaMl = 0;
      let caibroMl = 0;
      let ripaMl = 0;
      let pregosKg = 0;

      if (tileType?.id === 'ceramica' || tileType?.id === 'concreto') {
        // Estrutura completa (pesada)
        vigaMl = Math.ceil(areaWithLoss * Coefficients.roof.wood.vigaMlPerM2);
        caibroMl = Math.ceil(areaWithLoss * Coefficients.roof.wood.caibroMlPerM2);
        ripaMl = Math.ceil(areaWithLoss * Coefficients.roof.wood.ripaMlPerM2);
        pregosKg = Math.ceil(areaWithLoss * 0.15); // 150g por m2
      } else if (tileType?.id === 'shingle') {
        // Shingle usa OSB/Compensado
        vigaMl = Math.ceil(areaWithLoss * 1.0);
        caibroMl = Math.ceil(areaWithLoss * 2.5);
        materials.push({ name: 'Chapas OSB/Compensado (15mm)', quantity: Math.ceil(areaWithLoss / 2.88), unit: 'chapas' });
        materials.push({ name: 'Subcobertura Asfáltica', quantity: Math.ceil(areaWithLoss), unit: 'm²' });
        pregosKg = Math.ceil(areaWithLoss * 0.20);
      } else {
        // Estrutura leve (termoacustica, fibrocimento)
        vigaMl = Math.ceil(areaWithLoss * 1.5); // Apenas terças/vigas espaçadas
        pregosKg = Math.ceil(areaWithLoss * 0.05);
      }

      if (vigaMl > 0) materials.push({ name: 'Vigas / Terças (Madeira ou Perfil Metálico)', quantity: vigaMl, unit: 'ml' });
      if (caibroMl > 0) materials.push({ name: 'Caibros', quantity: caibroMl, unit: 'ml' });
      if (ripaMl > 0) materials.push({ name: 'Ripas', quantity: ripaMl, unit: 'ml' });
      if (pregosKg > 0) materials.push({ name: 'Pregos / Parafusos Estruturais', quantity: pregosKg, unit: 'kg' });
    }

    return { metrics, materials };
  };

  const steps: WizardStep[] = [
    {
      id: 'tile_type',
      title: 'Qual o tipo de telha?',
      content: (
        <SearchableSelect 
          options={roofTileOptions} 
          selectedId={tileType?.id} 
          onSelect={(opt) => { setTileType(opt); handleNext(); }}
          searchPlaceholder="Pesquisar tipo de telha..."
        />
      ),
      isValid: !!tileType,
      hideNextButton: true
    },
    {
      id: 'scope',
      title: 'O que você quer calcular?',
      content: (
        <SearchableSelect 
          options={scopeOptions} 
          selectedId={scope?.id} 
          onSelect={(opt) => { setScope(opt); handleNext(); }}
        />
      ),
      isValid: !!scope,
      hideNextButton: true
    },
    {
      id: 'method',
      title: 'Como deseja informar as medidas?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => { setInputMethod('area'); handleNext(); }} className={inputMethod === 'area' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'area' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'area' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'area' ? 'var(--color-primary)' : 'var(--text-main)' }}>Já sei a área (m²)</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Informar apenas a metragem quadrada da projeção.</p>
          </button>
          <button onClick={() => { setInputMethod('dim'); handleNext(); }} className={inputMethod === 'dim' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'dim' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--text-main)' }}>Comprimento × Largura</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Para calcular baseado nas paredes externas.</p>
          </button>
        </div>
      ),
      isValid: !!inputMethod,
      hideNextButton: true
    },
    {
      id: 'dimensions',
      title: inputMethod === 'area' ? 'Qual a área de projeção?' : 'Medidas externas (sem beiral)',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inputMethod === 'area' ? (
            <div className="input-group">
              <label>Área em Planta (m²)</label>
              <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 50" />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Comprimento Externo (m)</label>
                <input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="Ex: 10" />
              </div>
              <div className="input-group">
                <label>Largura Externa (m)</label>
                <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 5" />
              </div>
            </>
          )}
        </div>
      ),
      isValid: inputMethod === 'area' ? parseFloat(area) > 0 : (parseFloat(width) > 0 && parseFloat(length) > 0)
    },
    inputMethod !== 'area' ? {
      id: 'eaves_ask',
      title: 'O telhado terá beiral?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <button onClick={() => { setHasEaves(true); handleNext(); }} className={hasEaves === true ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasEaves === true ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasEaves === true ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasEaves === true ? 'var(--color-primary)' : 'var(--text-main)' }}>
              Sim
            </button>
            <button onClick={() => { setHasEaves(false); handleNext(); }} className={hasEaves === false ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 20, borderRadius: 16, textAlign: 'center', fontWeight: 600, fontSize: 16, backgroundColor: hasEaves === false ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${hasEaves === false ? 'var(--color-primary)' : 'var(--border-subtle)'}`, color: hasEaves === false ? 'var(--color-primary)' : 'var(--text-main)' }}>
              Não
            </button>
          </div>
          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              O beiral é a parte do telhado que avança além das paredes, protegendo a casa da chuva.
            </p>
          </div>
        </div>
      ),
      isValid: hasEaves !== null,
      hideNextButton: true
    } : null,
    (hasEaves === true && inputMethod !== 'area') ? {
      id: 'eaves_size',
      title: 'Tamanho do beiral',
      content: (
        <div className="input-group">
          <label>Tamanho do beiral (m)</label>
          <input type="number" value={eaves} onChange={e => setEaves(e.target.value)} placeholder="Ex: 0.60" step="0.1" />
        </div>
      ),
      isValid: parseFloat(eaves) > 0
    } : null,
    {
      id: 'waters',
      title: 'Quantas águas (quedas) o telhado terá?',
      content: (
        <div className="input-group">
          <label>Número de Águas</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
            {['1', '2', '3', '4'].map(num => (
              <button 
                key={num}
                onClick={() => setRoofWaters(num)}
                style={{
                  padding: 12, borderRadius: 8, textAlign: 'center', fontWeight: 600,
                  backgroundColor: roofWaters === num ? 'var(--color-primary)' : 'var(--bg-elevated)',
                  color: roofWaters === num ? '#fff' : 'var(--text-main)',
                  border: 'none', cursor: 'pointer'
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      ),
      isValid: !!roofWaters
    },
    {
      id: 'loss_rate',
      title: 'Taxa de Perdas',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Margem de Perda (%)</label>
            <input type="number" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>
          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              Para telhados com muitos recortes (várias águas), o desperdício é maior. O padrão é entre <strong>5% e 15%</strong>.
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
        title="Assistente de Cobertura"
        description="Cálculo detalhado de telhas e estrutura do telhado."
        icon={<Home size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            hasEaves && inputMethod === 'dim' ? `Considerado beiral de ${eaves}m em todo o contorno.` : 'Cálculo com medidas exatas informadas, sem beirais adicionais.',
            `Considerada inclinação média padrão para telha ${tileType?.title}.`
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente de Cobertura"
      icon={<Home size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
