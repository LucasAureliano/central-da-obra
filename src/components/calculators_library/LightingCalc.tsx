import { useState } from 'react';
import { BaseCalculatorLayout, type CalcResultItem, type CalcMaterial } from './BaseCalculatorLayout';
import { Lightbulb } from 'lucide-react';
import { WizardEngine, type WizardStep } from './WizardEngine';
import { CopilotTip } from '../assistant/CopilotTip';

type LuminaireType = 'spot' | 'plafon' | 'pendente' | 'led-strip' | 'arandela' | 'lustre' | 'trilho' | 'perfil-led';

interface LuminaireSpec {
  name: string;
  icon: string;
  lumensPerUnit: number; // lm por unidade
  watts: number;
  colorTempMin: number; // K min
  colorTempMax: number; // K max
  colorTempName: string;
  efficiency: number; // fator de utilização (0-1)
  description: string;
  bestFor: string;
}

const LUMINAIRE_SPECS: Record<LuminaireType, LuminaireSpec> = {
  spot: {
    name: 'Spot Embutido',
    icon: '💡',
    lumensPerUnit: 700,
    watts: 9,
    colorTempMin: 2700,
    colorTempMax: 6500,
    colorTempName: 'Quente a Fria (ajustável)',
    efficiency: 0.55,
    description: 'Spot embutido em gesso ou forro, direcionável.',
    bestFor: 'Salas, quartos, hall, cozinhas e lojas'
  },
  plafon: {
    name: 'Plafon de Sobrepor',
    icon: '🔆',
    lumensPerUnit: 1200,
    watts: 15,
    colorTempMin: 3000,
    colorTempMax: 6500,
    colorTempName: 'Neutra ou Fria',
    efficiency: 0.75,
    description: 'Luminária de teto sobreposta, difusão ampla.',
    bestFor: 'Quartos, banheiros, corredores e garagens'
  },
  pendente: {
    name: 'Pendente',
    icon: '🏮',
    lumensPerUnit: 800,
    watts: 10,
    colorTempMin: 2700,
    colorTempMax: 3000,
    colorTempName: 'Quente (2700–3000K)',
    efficiency: 0.60,
    description: 'Luminária suspensa por cabo ou haste.',
    bestFor: 'Mesas de jantar, balcões, iluminação decorativa'
  },
  'led-strip': {
    name: 'Fita LED',
    icon: '〰️',
    lumensPerUnit: 1000,
    watts: 14.4,
    colorTempMin: 2700,
    colorTempMax: 6500,
    colorTempName: 'Quente a Fria (por metro)',
    efficiency: 0.65,
    description: 'Fita LED flexível aplicada em sancas e rodateto. Cálculo por metro linear.',
    bestFor: 'Sancas, armários, atrás de painéis, iluminação indireta'
  },
  arandela: {
    name: 'Arandela',
    icon: '🕯️',
    lumensPerUnit: 500,
    watts: 7,
    colorTempMin: 2700,
    colorTempMax: 3000,
    colorTempName: 'Quente (2700–3000K)',
    efficiency: 0.45,
    description: 'Luminária de parede. Luz complementar e decorativa.',
    bestFor: 'Quartos (cabeceiras), corredores, fachadas e banheiros'
  },
  lustre: {
    name: 'Lustre / Chandelier',
    icon: '✨',
    lumensPerUnit: 3000,
    watts: 40,
    colorTempMin: 2700,
    colorTempMax: 3000,
    colorTempName: 'Quente (2700–3000K)',
    efficiency: 0.60,
    description: 'Lustre central para iluminação geral e decorativa.',
    bestFor: 'Salas de jantar, salões, hall de entrada'
  },
  trilho: {
    name: 'Trilho de Spots',
    icon: '🔦',
    lumensPerUnit: 700,
    watts: 9,
    colorTempMin: 2700,
    colorTempMax: 5000,
    colorTempName: 'Ajustável por spot',
    efficiency: 0.55,
    description: 'Sistema de trilho com spots direcionáveis. Flexível.',
    bestFor: 'Cozinhas, galerias, estúdios, lojas e ateliês'
  },
  'perfil-led': {
    name: 'Perfil de LED (Linear)',
    icon: '▬',
    lumensPerUnit: 1500,
    watts: 20,
    colorTempMin: 3000,
    colorTempMax: 5000,
    colorTempName: 'Neutra (3000–5000K)',
    efficiency: 0.70,
    description: 'Perfil de alumínio com LED linear. Alto conforto visual.',
    bestFor: 'Escritórios, salas de reunião, bancadas técnicas'
  }
};

const ROOM_LUX_PRESETS: { label: string; value: number; desc: string }[] = [
  { label: 'Circulação / Corredor', value: 150, desc: 'Áreas de passagem e garagens' },
  { label: 'Quarto — Geral', value: 150, desc: 'Iluminação geral de dormitório' },
  { label: 'Sala de Estar', value: 200, desc: 'Ambiente de convivência' },
  { label: 'Cozinha — Geral', value: 300, desc: 'Iluminação ambiente de cozinha' },
  { label: 'Escritório / Home Office', value: 500, desc: 'NBR 8995-1: trabalho contínuo' },
  { label: 'Bancada de Trabalho', value: 500, desc: 'Cozinha, bancada técnica' },
  { label: 'Desenho Técnico / Oficina', value: 750, desc: 'Alta precisão visual' },
  { label: 'Sala Cirúrgica / Minucioso', value: 1000, desc: 'Trabalho de alta precisão' },
];

export function LightingCalc({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [w, setW] = useState('');
  const [l, setL] = useState('');
  const [height, setHeight] = useState('2.8');
  const [lux, setLux] = useState('300');
  const [luminaireType, setLuminaireType] = useState<LuminaireType>('spot');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const calculate = () => {
    const width = parseFloat(w) || 0;
    const length = parseFloat(l) || 0;
    const ceilingHeight = parseFloat(height) || 2.8;
    const targetLux = parseFloat(lux) || 300;
    const spec = LUMINAIRE_SPECS[luminaireType];

    const area = width * length;

    // Método dos Lúmens (NBR 8995-1): N = (E × A) / (Φ × η)
    // E = iluminância desejada (lux), A = área (m²), Φ = fluxo por luminária (lm), η = fator utilização
    const totalLumensNeeded = (targetLux * area) / spec.efficiency;
    let quantity: number;
    let unitLabel: string;

    if (luminaireType === 'led-strip') {
      // Fita LED: cálculo por metro linear do perímetro
      const perimeter = 2 * (width + length);
      quantity = Math.ceil(perimeter);
      unitLabel = 'm';
    } else {
      quantity = Math.ceil(totalLumensNeeded / spec.lumensPerUnit);
      unitLabel = 'un';
    }

    const totalWatts = quantity * spec.watts;
    const totalLumens = quantity * spec.lumensPerUnit;
    const realLux = (totalLumens * spec.efficiency) / area;

    const colorTempCategory = spec.colorTempMin <= 3000
      ? '🌡️ Luz Quente — Confortável, aconchegante. Ideal para espaços de descanso.'
      : spec.colorTempMin <= 4000
      ? '⚪ Luz Neutra — Equilibrada, produtiva. Ideal para cozinhas e escritórios.'
      : '🔵 Luz Fria — Estimulante, de alta visibilidade. Ideal para trabalho técnico.';

    const metrics: CalcResultItem[] = [
      { label: `${luminaireType === 'led-strip' ? 'Fita LED Necessária' : 'Quantidade de Luminárias'}`, value: quantity.toString(), unit: unitLabel, highlight: true },
      { label: 'Fluxo Luminoso Total', value: totalLumens.toLocaleString('pt-BR'), unit: 'lm', highlight: true },
      { label: 'Iluminância Resultante', value: realLux.toFixed(0), unit: 'lux' },
      { label: 'Potência Total Instalada', value: totalWatts.toFixed(0), unit: 'W' },
      { label: 'Temperatura de Cor', value: `${spec.colorTempMin}`, unit: 'K' },
      { label: 'Área do Ambiente', value: area.toFixed(1), unit: 'm²' },
      { label: 'Iluminância Meta (NBR)', value: targetLux.toString(), unit: 'lux' },
    ];

    const materials: CalcMaterial[] = luminaireType === 'led-strip'
      ? [
          { name: `Fita LED (${spec.colorTempMin}K)`, quantity, unit: 'm' },
          { name: 'Fonte de alimentação 12V/24V', quantity: Math.ceil(quantity / 5), unit: 'un' },
          { name: 'Perfil de alumínio com difusor', quantity, unit: 'm' },
          { name: 'Controlador dimmer', quantity: 1, unit: 'un' },
        ]
      : [
          { name: `${spec.name} (${spec.watts}W / ${spec.lumensPerUnit}lm)`, quantity, unit: unitLabel },
          { name: 'Fiação elétrica (fase + neutro)', quantity: Math.ceil(quantity * 2 * ceilingHeight / 10) * 10, unit: 'm' },
          { name: 'Interruptor / dimmer', quantity: Math.ceil(quantity / 4), unit: 'un' },
        ];

    setResults({
      mainMetrics: metrics,
      materials,
      observations: [
        colorTempCategory,
        `Luminária: ${spec.name}. ${spec.description}`,
        `Melhor uso: ${spec.bestFor}.`,
        `Fator de utilização aplicado: ${(spec.efficiency * 100).toFixed(0)}% (ambiente com refletância média).`,
        'Cálculo pelo Método dos Lúmens conforme NBR ISO 8995-1.',
        'Recomenda-se projeto detalhado em DIALux para distribuição precisa.',
      ]
    });

    setShowResults(true);
  };

  if (showResults && results) {
    return (
      <BaseCalculatorLayout
        title="Projeto Luminotécnico"
        description="Resultado do dimensionamento"
        icon={<Lightbulb size={24} color="#F59E0B" />}
        tip="Considere circuitos independentes para iluminação geral e de acento."
        onBack={() => setShowResults(false)}
        results={results}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  // Luminaire Selector Cards
  const renderLuminaireSelector = () => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
        Tipo de Luminária
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {(Object.entries(LUMINAIRE_SPECS) as [LuminaireType, LuminaireSpec][]).map(([key, spec]) => (
          <button
            key={key}
            onClick={() => setLuminaireType(key)}
            style={{
              padding: '12px 10px',
              borderRadius: 14,
              border: luminaireType === key
                ? '2px solid var(--color-primary)'
                : '1px solid var(--border-subtle)',
              backgroundColor: luminaireType === key
                ? 'var(--color-primary-alpha)'
                : 'var(--bg-elevated)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{spec.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{spec.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{spec.watts}W · {spec.lumensPerUnit}lm</div>
          </button>
        ))}
      </div>
      {luminaireType && (
        <div style={{
          marginTop: 12, padding: 12,
          borderRadius: 12,
          backgroundColor: 'var(--color-primary-alpha)',
          borderLeft: '3px solid var(--color-primary)',
          fontSize: 12,
          color: 'var(--text-main)',
          lineHeight: 1.5
        }}>
          <strong>Melhor uso:</strong> {LUMINAIRE_SPECS[luminaireType].bestFor}
        </div>
      )}
    </div>
  );

  const steps: WizardStep[] = [
    {
      id: 'luminaire',
      title: 'Tipo de Luminária',
      subtitle: 'Escolha a luminária para este ambiente.',
      isValid: true,
      content: renderLuminaireSelector()
    },
    {
      id: 'dimensions',
      title: 'Dimensões do Ambiente',
      subtitle: 'Informe largura, comprimento e pé-direito.',
      isValid: parseFloat(w) > 0 && parseFloat(l) > 0,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <CopilotTip tip={parseFloat(w) * parseFloat(l) > 30 ? 'Ambientes maiores que 30m² se beneficiam de circuitos independentes e zoneamento.' : null} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Largura (m)</label>
              <input type="number" className="input-premium" value={w} onChange={e => setW(e.target.value)} placeholder="Ex: 4.0" autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Comprimento (m)</label>
              <input type="number" className="input-premium" value={l} onChange={e => setL(e.target.value)} placeholder="Ex: 5.0" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Pé-direito (m)</label>
            <input type="number" className="input-premium" value={height} onChange={e => setHeight(e.target.value)} placeholder="Ex: 2.8" />
          </div>
        </div>
      )
    },
    {
      id: 'lux',
      title: 'Iluminância Necessária',
      subtitle: 'Qual o nível de iluminação para este ambiente? (NBR 8995-1)',
      isValid: parseFloat(lux) > 0,
      nextLabel: 'Calcular',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ROOM_LUX_PRESETS.map(preset => (
            <button
              key={preset.value + preset.label}
              onClick={() => setLux(preset.value.toString())}
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                border: lux === preset.value.toString()
                  ? '2px solid var(--color-primary)'
                  : '1px solid var(--border-subtle)',
                backgroundColor: lux === preset.value.toString()
                  ? 'var(--color-primary-alpha)'
                  : 'var(--bg-elevated)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.15s',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{preset.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{preset.desc}</div>
              </div>
              <span style={{
                fontSize: 15, fontWeight: 800,
                color: lux === preset.value.toString() ? 'var(--color-primary)' : 'var(--text-muted)',
                minWidth: 60, textAlign: 'right'
              }}>
                {preset.value} lux
              </span>
            </button>
          ))}
        </div>
      )
    }
  ];

  return (
    <WizardEngine
      title="Projeto Luminotécnico"
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
