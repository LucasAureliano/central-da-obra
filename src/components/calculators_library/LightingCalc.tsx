import { useState } from 'react';
import { BaseCalculatorLayout, type CalcResultItem, type CalcMaterial } from './BaseCalculatorLayout';
import { Lightbulb } from 'lucide-react';
import { WizardEngine, type WizardStep } from './WizardEngine';

export function LightingCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  const [w, setW] = useState('');
  const [l, setL] = useState('');
  const [lux, setLux] = useState('300'); // Padrão escritório/quarto
  
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const calculate = () => {
    const width = parseFloat(w) || 0;
    const length = parseFloat(l) || 0;
    const targetLux = parseFloat(lux) || 300;
    
    const area = width * length;
    const totalLumens = area * targetLux;
    
    // Estimativa de lâmpada LED comum de 9W (aprox 800 lumens)
    const lumensPerLamp = 800;
    const totalLamps = Math.ceil(totalLumens / lumensPerLamp);

    const metrics: CalcResultItem[] = [
      { label: 'Fluxo Luminoso Total', value: totalLumens.toFixed(0), unit: 'lm', highlight: true },
      { label: 'Lâmpadas Necessárias (LED 9W)', value: totalLamps.toString(), unit: 'un', highlight: true }
    ];

    const materials: CalcMaterial[] = [
      { name: 'Lâmpada LED 9W (800lm)', quantity: totalLamps, unit: 'un' },
      { name: 'Luminária / Plafon', quantity: totalLamps, unit: 'un' }
    ];

    setResults({
      mainMetrics: metrics,
      materials,
      observations: [
        'Cálculo simplificado (Método dos Lúmens).',
        `Nível de iluminância desejado: ${targetLux} lux.`,
        'Recomenda-se projeto detalhado em software como DIALux para precisão.'
      ]
    });
    
    setShowResults(true);
  };

  if (showResults && results) {
    return (
      <BaseCalculatorLayout
        title="Cálculo Luminotécnico"
        description="Estimar iluminação baseada na norma"
        icon={<Lightbulb size={24} color="#F59E0B" />}
        tip="Esta é uma estimativa simplificada. Consulte um arquiteto."
        onBack={() => setShowResults(false)}
        results={results}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  const steps: WizardStep[] = [
    {
      id: 'dimensions',
      title: 'Dimensões do Ambiente',
      subtitle: 'Informe as medidas do cômodo.',
      isValid: parseFloat(w) > 0 && parseFloat(l) > 0,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Largura (m)</label>
            <input type="number" className="input-premium" value={w} onChange={e => setW(e.target.value)} placeholder="Ex: 3.0" autoFocus />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Comprimento (m)</label>
            <input type="number" className="input-premium" value={l} onChange={e => setL(e.target.value)} placeholder="Ex: 4.0" />
          </div>
        </div>
      )
    },
    {
      id: 'lux',
      title: 'Iluminância Desejada',
      subtitle: 'Quantos Lux (lumens/m²) o ambiente precisa?',
      isValid: parseFloat(lux) > 0,
      nextLabel: 'Calcular',
      content: (
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Nível de Lux (NBR 8995-1)</label>
          <select className="input-premium" value={lux} onChange={e => setLux(e.target.value)} autoFocus>
            <option value="150">150 lux (Quarto - Geral, Circulação)</option>
            <option value="300">300 lux (Sala de Estar, Cozinha - Geral)</option>
            <option value="500">500 lux (Escritório, Leitura, Cozinha - Bancada)</option>
            <option value="750">750 lux (Desenho técnico, Oficina)</option>
            <option value="1000">1000 lux (Trabalho minucioso)</option>
          </select>
        </div>
      )
    }
  ];

  return (
    <WizardEngine
      title="Cálculo Luminotécnico"
      icon={<Lightbulb size={24} color="#F59E0B" />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={calculate}
    />
  );
}
