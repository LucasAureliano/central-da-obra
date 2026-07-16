import { useState } from 'react';
import { BaseCalculatorLayout, type CalcResultItem, type CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';
import { Layers } from 'lucide-react';
import { InputMethodSelector } from './InputMethodSelector';
import { WizardEngine, type WizardStep } from './WizardEngine';

export function IsolatedFootingCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  const [method, setMethod] = useState<'dimensions'|'direct'>('dimensions');
  const [w, setW] = useState('');
  const [l, setL] = useState('');
  const [h, setH] = useState('');
  const [directVol, setDirectVol] = useState('');
  const [qty, setQty] = useState('1');
  
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const calculate = () => {
    let singleVolume = 0;
    let singleFormArea = 0;

    if (method === 'dimensions') {
      const width = parseFloat(w) || 0;
      const length = parseFloat(l) || 0;
      const height = parseFloat(h) || 0;
      
      singleVolume = width * length * height;
      singleFormArea = (width + length) * 2 * height;
    } else {
      singleVolume = parseFloat(directVol) || 0;
      singleFormArea = Coefficients.structure.woodFormSqMPerM3 * singleVolume;
    }

    const count = parseInt(qty) || 1;
    const totalVolume = singleVolume * count;
    const totalFormArea = singleFormArea * count;
    
    const volWithLoss = totalVolume * Coefficients.losses.concrete;
    const totalSteel = volWithLoss * Coefficients.structure.steelKgPerM3;

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
    
    setShowResults(true);
  };

  if (showResults && results) {
    return (
      <BaseCalculatorLayout
        title="Sapata Isolada"
        description="Fundações diretas"
        icon={<Layers size={24} />}
        tip="As taxas de aço são estimativas. Siga o projeto estrutural."
        structuralWarning={true}
        onBack={() => setShowResults(false)}
        results={results}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  const isDimValid = method === 'direct' || (parseFloat(w) > 0 && parseFloat(l) > 0 && parseFloat(h) > 0);
  const isVolValid = method === 'dimensions' || parseFloat(directVol) > 0;
  
  const steps: WizardStep[] = [
    {
      id: 'method',
      title: 'Método de cálculo',
      subtitle: 'Como deseja informar os dados da sapata?',
      isValid: true,
      content: (
        <InputMethodSelector 
          value={method} 
          onChange={m => { setMethod(m); setTimeout(handleNext, 300); }} 
          title=""
          dimLabel="Informar dimensões (L × C × A)"
          dirLabel="Já possuo o volume (m³)"
        />
      ),
      hideNextButton: true
    },
    {
      id: 'dimensions',
      title: method === 'dimensions' ? 'Dimensões da Sapata' : 'Volume da Sapata',
      subtitle: 'Informe as medidas de UMA unidade base.',
      isValid: method === 'dimensions' ? isDimValid : isVolValid,
      content: (
        <div>
          {method === 'dimensions' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Largura (m)</label>
                  <input type="number" className="input-premium" value={w} onChange={e => setW(e.target.value)} placeholder="0.8" autoFocus />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Comprimento (m)</label>
                  <input type="number" className="input-premium" value={l} onChange={e => setL(e.target.value)} placeholder="0.8" />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Altura do Rodapé/Base (m)</label>
                <input type="number" className="input-premium" value={h} onChange={e => setH(e.target.value)} placeholder="0.4" />
              </div>
            </>
          ) : (
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Volume de 1 Sapata (m³)</label>
              <input type="number" className="input-premium" value={directVol} onChange={e => setDirectVol(e.target.value)} placeholder="0.25" autoFocus />
            </div>
          )}
        </div>
      )
    },
    {
      id: 'qty',
      title: 'Quantidade',
      subtitle: 'Quantas sapatas iguais a essa existem no projeto?',
      isValid: parseInt(qty) > 0,
      nextLabel: 'Calcular',
      content: (
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Quantidade de Sapatas</label>
          <input type="number" className="input-premium" value={qty} onChange={e => setQty(e.target.value)} placeholder="12" autoFocus />
        </div>
      )
    }
  ];

  return (
    <WizardEngine
      title="Cálculo de Sapata"
      icon={<Layers size={24} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={calculate}
    />
  );
}
