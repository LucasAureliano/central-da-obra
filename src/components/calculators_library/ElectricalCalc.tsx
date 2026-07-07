import { useState } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { SearchableSelect } from './SearchableSelect';
import type { SelectOption } from './SearchableSelect';
import { Zap, Info } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';

const levelOptions: SelectOption[] = [
  { id: 'basic', title: 'Padrão Básico (Econômico)', subtitle: 'Média de 5 pontos por cômodo (1 interr., 3 tomadas, 1 teto)', category: 'Padrão', isFavorite: true },
  { id: 'standard', title: 'Padrão Médio (Padrão)', subtitle: 'Média de 7 pontos por cômodo (interruptores duplos, 5 tomadas)', category: 'Padrão', isFavorite: true },
  { id: 'high', title: 'Padrão Alto (Conforto)', subtitle: 'Média de 12 pontos por cômodo (paralelos, 8 tomadas, arandelas)', category: 'Padrão' }
];

const scopeOptions: SelectOption[] = [
  { id: 'all', title: 'Instalação Completa', subtitle: 'Eletrodutos, cabos, e caixinhas', category: 'Escopo', isFavorite: true },
  { id: 'infra', title: 'Apenas Infraestrutura', subtitle: 'Eletrodutos e caixinhas (sem cabos)', category: 'Escopo' },
  { id: 'cabling', title: 'Apenas Cabeamento', subtitle: 'Apenas fios e cabos', category: 'Escopo' }
];

export function ElectricalCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  // States
  const [level, setLevel] = useState<SelectOption | null>(null);
  const [scope, setScope] = useState<SelectOption | null>(null);

  const [inputMethod, setInputMethod] = useState('');
  const [rooms, setRooms] = useState('');
  const [directPoints, setDirectPoints] = useState('');
  
  const [lossRate, setLossRate] = useState('10'); // 10%

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  // Math
  const calculateTotalPoints = () => {
    let totalPoints = 0;
    
    if (inputMethod === 'points') {
      totalPoints = parseInt(directPoints) || 0;
    } else {
      const numRooms = parseInt(rooms) || 0;
      let pointsPerRoom = 7; // standard
      if (level?.id === 'basic') pointsPerRoom = 5;
      if (level?.id === 'high') pointsPerRoom = 12;
      
      totalPoints = numRooms * pointsPerRoom;
    }
    return Math.max(0, totalPoints);
  };

  const calculateResults = () => {
    const totalPoints = calculateTotalPoints();
    const loss = 1 + ((parseFloat(lossRate) || 0) / 100);
    
    const metrics: CalcResultItem[] = [
      { label: 'Total de Pontos Estimado', value: totalPoints.toString(), unit: 'pontos', highlight: true },
      { label: 'Perda Considerada', value: `${lossRate}`, unit: '%' },
    ];

    const materials: CalcMaterial[] = [];

    // Infraestrutura (Eletrodutos e Caixas)
    if (scope?.id === 'all' || scope?.id === 'infra') {
      const conduitMl = totalPoints * Coefficients.mep.electrical.conduitMlPerPoint * loss;
      const conduitRolls = Math.ceil(conduitMl / 50); // Rolos 50m

      metrics.splice(1, 0, { label: 'Eletrodutos (Mangueiras)', value: conduitMl.toFixed(1), unit: 'm', highlight: true });

      materials.push({ name: 'Eletroduto Corrugado (Rolo 50m)', quantity: conduitRolls, unit: 'rolos' });
      
      const box4x2 = Math.ceil(totalPoints * 0.8 * loss);
      const boxCeiling = Math.ceil(totalPoints * 0.2 * loss);
      materials.push({ name: 'Caixa de Embutir 4x2 (Parede)', quantity: box4x2, unit: 'unid.' });
      materials.push({ name: 'Caixa de Embutir Octogonal (Teto)', quantity: boxCeiling, unit: 'unid.' });
    }

    // Cabeamento
    if (scope?.id === 'all' || scope?.id === 'cabling') {
      const cableMl = totalPoints * Coefficients.mep.electrical.cableMlPerPoint * loss;
      const cableRolls = Math.ceil(cableMl / 100); // Rolos 100m

      metrics.splice(1, 0, { label: 'Estimativa de Cabos', value: cableMl.toFixed(1), unit: 'm', highlight: true });

      materials.push({ name: 'Fios/Cabos Flexíveis BWF (Rolo 100m)', quantity: cableRolls, unit: 'rolos' });
      if (scope?.id === 'cabling') {
        materials.push({ name: 'Fita Isolante (20m)', quantity: Math.ceil(totalPoints / 20), unit: 'rolos' });
      }
    }

    return { metrics, materials };
  };

  const steps: WizardStep[] = [
    {
      id: 'level',
      title: 'Qual será o padrão da instalação elétrica?',
      content: (
        <SearchableSelect 
          options={levelOptions} 
          selectedId={level?.id} 
          onSelect={(opt) => { setLevel(opt); handleNext(); }}
        />
      ),
      isValid: !!level,
      hideNextButton: true
    },
    {
      id: 'scope',
      title: 'O que deseja calcular?',
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
      title: 'Como deseja informar os pontos?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => { setInputMethod('rooms'); handleNext(); }} className={inputMethod === 'rooms' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'rooms' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'rooms' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'rooms' ? 'var(--color-primary)' : 'var(--text-main)' }}>Por número de cômodos</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Estimativa baseada no padrão de instalação escolhido.</p>
          </button>
          <button onClick={() => { setInputMethod('points'); handleNext(); }} className={inputMethod === 'points' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'points' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'points' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'points' ? 'var(--color-primary)' : 'var(--text-main)' }}>Já sei a quantidade de pontos</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Informar o total exato do projeto.</p>
          </button>
        </div>
      ),
      isValid: !!inputMethod,
      hideNextButton: true
    },
    {
      id: 'points',
      title: inputMethod === 'rooms' ? 'Quantos cômodos há na construção?' : 'Total de pontos elétricos',
      content: (
        <div className="input-group">
          {inputMethod === 'rooms' ? (
            <>
              <label>Número Total de Cômodos</label>
              <input type="number" value={rooms} onChange={e => setRooms(e.target.value)} placeholder="Ex: 8" />
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
                Conte salas, quartos, banheiros, cozinhas, corredores, etc.
              </p>
            </>
          ) : (
            <>
              <label>Total de Pontos (Tomadas + Interruptores + Teto)</label>
              <input type="number" value={directPoints} onChange={e => setDirectPoints(e.target.value)} placeholder="Ex: 45" />
            </>
          )}
        </div>
      ),
      isValid: inputMethod === 'rooms' ? parseInt(rooms) > 0 : parseInt(directPoints) > 0
    },
    {
      id: 'loss_rate',
      title: 'Taxa de Perdas (Fios e Mangueiras)',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Margem de Perda (%)</label>
            <input type="number" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>
          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              Para elétrica, recomendamos <strong>10%</strong> devido a sobras nas caixinhas, perdas nos cortes e passagens difíceis.
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
        title="Assistente de Elétrica"
        description="Estimativa de cabos, conduítes e caixinhas."
        icon={<Zap size={24} />}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            inputMethod === 'rooms' ? `Estimativa para ${rooms} cômodos no padrão ${level?.title}.` : 'Cálculo baseado no total exato de pontos informados.',
            scope?.id === 'cabling' ? 'Atenção: A cor dos cabos varia (Fase, Neutro, Terra). A quantidade total refere-se à soma de todas as vias.' : 'A proporção padrão é 80% caixas de parede (4x2) e 20% caixas de teto (octogonais).'
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente de Elétrica"
      icon={<Zap size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
    />
  );
}
