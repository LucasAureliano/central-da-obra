import { useState } from 'react';
import { BaseCalculatorLayout, type CalcResultItem } from './BaseCalculatorLayout';
import { Ruler } from 'lucide-react';
import { WizardEngine, type WizardStep } from './WizardEngine';

export function BlondelCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  const [h, setH] = useState('');
  
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const calculate = () => {
    const height = parseFloat(h) || 0;
    
    // Fórmula de Blondel: 2E + P = 64cm
    // Espelho ideal (E): ~17cm a 18cm
    
    const minE = 16;
    const maxE = 18.5;
    const bestE = 17.5;
    
    // Altura total em cm
    const totalH_cm = height * 100;
    
    let numSteps = Math.round(totalH_cm / bestE);
    if (numSteps < 1) numSteps = 1;
    
    const E = totalH_cm / numSteps;
    const P = 64 - (2 * E);
    
    let isIdeal = true;
    if (E < minE || E > maxE || P < 25 || P > 30) {
      isIdeal = false;
    }

    const metrics: CalcResultItem[] = [
      { label: 'Número de Degraus', value: numSteps.toString(), unit: 'un', highlight: true },
      { label: 'Espelho (Altura)', value: E.toFixed(1), unit: 'cm', highlight: true },
      { label: 'Pisada (Profundidade)', value: P.toFixed(1), unit: 'cm', highlight: true }
    ];

    setResults({
      mainMetrics: metrics,
      materials: [],
      observations: [
        `Baseado na fórmula de Blondel (2E + P = 64).`,
        isIdeal 
          ? 'As proporções estão dentro da norma (Ideal).'
          : 'ATENÇÃO: As proporções resultantes podem ficar desconfortáveis. Considere ajustar o espaço ou patamares.'
      ]
    });
    
    setShowResults(true);
  };

  if (showResults && results) {
    return (
      <BaseCalculatorLayout
        title="Fórmula de Blondel"
        description="Dimensionamento de Escadas"
        icon={<Ruler size={24} color="#8B5CF6" />}
        tip="O espelho ideal é entre 16cm e 18.5cm, e a pisada entre 25cm e 30cm."
        onBack={() => setShowResults(false)}
        results={results}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  const steps: WizardStep[] = [
    {
      id: 'height',
      title: 'Altura Total',
      subtitle: 'Informe a altura do pé direito (piso a piso).',
      isValid: parseFloat(h) > 0,
      nextLabel: 'Calcular',
      content: (
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Pé Direito (m)</label>
          <input type="number" className="input-premium" value={h} onChange={e => setH(e.target.value)} placeholder="Ex: 2.80" autoFocus />
        </div>
      )
    }
  ];

  return (
    <WizardEngine
      title="Fórmula de Blondel"
      icon={<Ruler size={24} color="#8B5CF6" />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={calculate}
    />
  );
}
