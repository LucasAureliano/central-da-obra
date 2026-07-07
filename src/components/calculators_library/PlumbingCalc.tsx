import { useState } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { SearchableSelect } from './SearchableSelect';
import type { SelectOption } from './SearchableSelect';
import { Droplets, Info } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';

const systemOptions: SelectOption[] = [
  { id: 'cold', title: 'Água Fria (PVC Soldável)', subtitle: 'Tubulação marrom padrão para água fria', category: 'Sistemas', isFavorite: true },
  { id: 'hot_cpvc', title: 'Água Quente (CPVC/Aquatherm)', subtitle: 'Tubulação bege para água quente', category: 'Sistemas' },
  { id: 'hot_ppr', title: 'Água Quente (PPR)', subtitle: 'Tubulação verde termofundida', category: 'Sistemas' },
  { id: 'sewer', title: 'Esgoto Sanitário (PVC Branco)', subtitle: 'Tubulação branca para esgoto e ventilação', category: 'Sistemas', isFavorite: true }
];

export function PlumbingCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [system, setSystem] = useState<SelectOption | null>(null);

  const [inputMethod, setInputMethod] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [kitchens, setKitchens] = useState('');
  const [laundries, setLaundries] = useState('');
  const [directPoints, setDirectPoints] = useState('');
  
  const [lossRate, setLossRate] = useState('15'); // 15%

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  // Math
  const calculateTotalPoints = () => {
    let totalPoints = 0;
    
    if (inputMethod === 'points') {
      totalPoints = parseInt(directPoints) || 0;
    } else {
      const wcs = parseInt(bathrooms) || 0;
      const kits = parseInt(kitchens) || 0;
      const launds = parseInt(laundries) || 0;
      
      if (system?.id === 'sewer') {
        // Pontos de esgoto: Vaso, ralo, pia, tanque, etc
        totalPoints = (wcs * 4) + (kits * 2) + (launds * 2);
      } else if (system?.id === 'hot_cpvc' || system?.id === 'hot_ppr') {
        // Água quente: chuveiro, pia WC, pia cozinha
        totalPoints = (wcs * 2) + (kits * 1) + (launds * 0);
      } else {
        // Água fria: Chuveiro, Pia, Vaso, Ducha, Filtro, Tanque, Maquina
        totalPoints = (wcs * 4) + (kits * 3) + (launds * 2);
      }
    }
    return Math.max(0, totalPoints);
  };

  const calculateResults = () => {
    const totalPoints = calculateTotalPoints();
    const loss = 1 + ((parseFloat(lossRate) || 0) / 100);
    
    const metrics: CalcResultItem[] = [
      { label: 'Pontos Estimados', value: totalPoints.toString(), unit: 'pontos', highlight: true },
      { label: 'Perda Considerada', value: `${lossRate}`, unit: '%' },
    ];

    const materials: CalcMaterial[] = [];

    if (system?.id === 'sewer') {
      // Esgoto mescla tubos de 100mm e 50mm/40mm. Faremos uma estimativa genérica.
      const pipeMl_100 = totalPoints * 1.5 * loss;
      const pipeMl_50 = totalPoints * 2.0 * loss;
      
      metrics.splice(1, 0, { label: 'Tubulação Estimada (Total)', value: (pipeMl_100 + pipeMl_50).toFixed(1), unit: 'm', highlight: true });

      materials.push({ name: 'Tubo Esgoto PVC 100mm (Barra 6m)', quantity: Math.ceil(pipeMl_100 / 6), unit: 'barras' });
      materials.push({ name: 'Tubo Esgoto PVC 50mm (Barra 6m)', quantity: Math.ceil(pipeMl_50 / 6), unit: 'barras' });
      materials.push({ name: 'Conexões Diversas (Curvas, Joelhos, Tês, Y)', quantity: Math.ceil(totalPoints * 4 * loss), unit: 'unid.' });
      materials.push({ name: 'Adesivo Plástico para PVC (Frasco 850g)', quantity: Math.ceil(totalPoints / 20), unit: 'frascos' });

    } else {
      // Água (Fria ou Quente)
      const pipeMl = totalPoints * Coefficients.mep.hydraulic.pipeMlPerPoint * loss;
      metrics.splice(1, 0, { label: 'Tubulação Estimada', value: pipeMl.toFixed(1), unit: 'm', highlight: true });

      const pipeBars = Math.ceil(pipeMl / (system?.id === 'hot_ppr' ? 3 : 6)); // PPR muitas vezes vem em barras de 3m
      const fittings = Math.ceil(totalPoints * Coefficients.mep.hydraulic.fittingsPerPoint * loss);

      if (system?.id === 'hot_cpvc') {
        materials.push({ name: 'Tubo CPVC Aquatherm 22mm (Barra 3m)', quantity: pipeBars*2, unit: 'barras' });
        materials.push({ name: 'Conexões CPVC 22mm', quantity: fittings, unit: 'unid.' });
        materials.push({ name: 'Adesivo Plástico CPVC (Frasco 175g)', quantity: Math.ceil((fittings / 40) * 0.175), unit: 'frascos' });
      } else if (system?.id === 'hot_ppr') {
        materials.push({ name: 'Tubo PPR 22mm (Barra 3m)', quantity: pipeBars, unit: 'barras' });
        materials.push({ name: 'Conexões PPR 22mm (Termofusão)', quantity: fittings, unit: 'unid.' });
      } else {
        // Água Fria
        materials.push({ name: 'Tubo Soldável PVC 25mm (Barra 6m)', quantity: pipeBars, unit: 'barras' });
        materials.push({ name: 'Conexões PVC 25mm (Joelhos, Tês, Luvas)', quantity: fittings, unit: 'unid.' });
        materials.push({ name: 'Adesivo Plástico (Cola PVC 175g)', quantity: Math.ceil((fittings / 50) * 0.175), unit: 'frascos' });
        materials.push({ name: 'Fita Veda Rosca (Rolo 18m)', quantity: Math.ceil(totalPoints / 2), unit: 'rolos' });
      }
    }

    return { metrics, materials };
  };

  const steps: WizardStep[] = [
    {
      id: 'system',
      title: 'Qual sistema deseja calcular?',
      content: (
        <SearchableSelect 
          options={systemOptions} 
          selectedId={system?.id} 
          onSelect={(opt) => { setSystem(opt); handleNext(); }}
        />
      ),
      isValid: !!system,
      hideNextButton: true
    },
    {
      id: 'method',
      title: 'Como deseja calcular os materiais?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => { setInputMethod('rooms'); handleNext(); }} className={inputMethod === 'rooms' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'rooms' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'rooms' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'rooms' ? 'var(--color-primary)' : 'var(--text-main)' }}>Por Cômodos Úmidos</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Estimativa automática baseada em banheiros, cozinhas e áreas de serviço.</p>
          </button>
          <button onClick={() => { setInputMethod('points'); handleNext(); }} className={inputMethod === 'points' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'points' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'points' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'points' ? 'var(--color-primary)' : 'var(--text-main)' }}>Já tenho o projeto hidráulico</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Informar o total exato de pontos (saídas de água/esgoto) da casa.</p>
          </button>
        </div>
      ),
      isValid: !!inputMethod,
      hideNextButton: true
    },
    {
      id: 'dimensions',
      title: inputMethod === 'points' ? 'Total de Pontos' : 'Quantidade de Cômodos Úmidos',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inputMethod === 'points' ? (
            <div className="input-group">
              <label>Quantidade de Pontos ({system?.title})</label>
              <input type="number" value={directPoints} onChange={e => setDirectPoints(e.target.value)} placeholder="Ex: 15" />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Banheiros Completos</label>
                <input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} placeholder="Ex: 2" />
              </div>
              <div className="input-group">
                <label>Cozinhas</label>
                <input type="number" value={kitchens} onChange={e => setKitchens(e.target.value)} placeholder="Ex: 1" />
              </div>
              <div className="input-group">
                <label>Lavanderias / Área de Serviço</label>
                <input type="number" value={laundries} onChange={e => setLaundries(e.target.value)} placeholder="Ex: 1" />
              </div>
            </>
          )}
        </div>
      ),
      isValid: inputMethod === 'points' ? parseInt(directPoints) > 0 : (parseInt(bathrooms) > 0 || parseInt(kitchens) > 0 || parseInt(laundries) > 0)
    },
    {
      id: 'loss_rate',
      title: 'Taxa de Perdas (Tubos e Conexões)',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Margem de Perda (%)</label>
            <input type="number" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>
          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              Para hidráulica, o padrão do mercado é estimar <strong>15%</strong> de perdas para cobrir recortes de tubulação e conexões extras não mapeadas.
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
        title="Assistente Hidrossanitário"
        description="Estimativa de tubulação, conexões e colas."
        icon={<Droplets size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            `Sistema calculado: ${system?.title}.`,
            inputMethod === 'rooms' ? 'O cálculo por cômodos é uma estimativa estatística. Para orçamento final, consulte um projeto executivo.' : 'A estimativa de conexões é proporcional à quantidade de tubos e pontos.'
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente Hidrossanitário"
      icon={<Droplets size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
