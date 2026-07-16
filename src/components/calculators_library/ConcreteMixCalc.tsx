import { useState, useMemo } from 'react';
import { WizardEngine } from './WizardEngine';
import type { WizardStep } from './WizardEngine';
import { SearchableSelect } from './SearchableSelect';
import type { SelectOption } from './SearchableSelect';
import { Layers, Frame, Box, HardHat, Droplet, Info, Gauge } from 'lucide-react';
import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import type { CalcResultItem, CalcMaterial } from './BaseCalculatorLayout';
import { Coefficients } from './calcCoefficients';

const concreteElements: SelectOption[] = [
  { id: 'laje_maciça', title: 'Laje Maciça', subtitle: 'Piso ou teto estrutural', category: 'Lajes', isFavorite: true, icon: <Layers size={18} color="#8B5CF6" /> },
  { id: 'viga', title: 'Viga', subtitle: 'Elemento horizontal de suporte', category: 'Estrutura Principal', isFavorite: true, icon: <Frame size={18} color="#F59E0B" /> },
  { id: 'pilar', title: 'Pilar / Coluna', subtitle: 'Elemento vertical de suporte', category: 'Estrutura Principal', icon: <Box size={18} color="#10B981" /> },
  { id: 'sapata', title: 'Sapata', subtitle: 'Fundação isolada ou corrida', category: 'Fundações', icon: <HardHat size={18} color="#64748B" /> },
  { id: 'contrapiso', title: 'Contrapiso / Calçada', subtitle: 'Camada de regularização', category: 'Pisos', icon: <Droplet size={18} color="#3B82F6" /> }
];

const fckOptions: SelectOption[] = [
  { id: '15', title: '15 MPa (Magro)', subtitle: 'Calçadas, contrapisos não estruturais', category: 'Baixa Resistência', icon: <Gauge size={18} color="#94A3B8" /> },
  { id: '20', title: '20 MPa', subtitle: 'Fundação de pequeno porte, pisos leves', category: 'Estrutural Básico', isFavorite: true, icon: <Gauge size={18} color="#3B82F6" /> },
  { id: '25', title: '25 MPa', subtitle: 'Vigas, pilares e lajes residenciais', category: 'Estrutural Padrão', isFavorite: true, icon: <Gauge size={18} color="#10B981" /> },
  { id: '30', title: '30 MPa', subtitle: 'Estruturas de múltiplos pavimentos', category: 'Alta Resistência', icon: <Gauge size={18} color="#F59E0B" /> },
  { id: '35', title: '35 MPa', subtitle: 'Obras de grande porte e pontes', category: 'Alta Resistência', icon: <Gauge size={18} color="#EF4444" /> }
];

export function ConcreteMixCalc({ onBack, onNavigate }: { onBack: () => void, onNavigate?: (tab: string, param?: string) => void }) {
  const [step, setStep] = useState(0);

  // States
  const [targetElement, setTargetElement] = useState<SelectOption | null>(null);
  const [customElement, setCustomElement] = useState('');
  
  const [inputMethod, setInputMethod] = useState('');
  
  const [volume, setVolume] = useState('');
  
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [thickness, setThickness] = useState('');

  const [fck, setFck] = useState<SelectOption | null>(null);
  
  const [isReadyMix, setIsReadyMix] = useState<boolean | null>(null);
  const [lossRate, setLossRate] = useState(String(Math.round(Coefficients.losses.concrete * 100 - 100))); // linked to coefficients

  const [showResults, setShowResults] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const parsedVolume = useMemo(() => {
    if (inputMethod === 'volume') return parseFloat(volume) || 0;
    return (parseFloat(width) || 0) * (parseFloat(length) || 0) * (parseFloat(thickness) || 0);
  }, [inputMethod, volume, width, length, thickness]);

  const calculateResults = () => {
    const baseVol = parsedVolume;
    const lossMultiplier = 1 + (parseFloat(lossRate) / 100 || 0);
    const totalVolume = baseVol * lossMultiplier;

    const metrics: CalcResultItem[] = [
      { label: 'Volume Líquido', value: baseVol.toFixed(2), unit: 'm³', highlight: true },
      { label: 'Volume c/ Perda', value: totalVolume.toFixed(2), unit: 'm³' },
      { label: 'Taxa de Perda', value: lossRate, unit: '%' }
    ];

    if (fck) {
      metrics.push({ label: 'Resistência FCK', value: fck.id, unit: 'MPa', highlight: true });
    }

    const materials: CalcMaterial[] = [];

    if (isReadyMix) {
      materials.push({
        name: 'Concreto Usinado',
        quantity: totalVolume.toFixed(2),
        unit: 'm³'
      });
    } else if (fck?.id) {
      // Find the mix ratio
      const mixKey = fck.id as keyof typeof Coefficients.concrete.mixes;
      const ratio = Coefficients.concrete.mixes[mixKey] || Coefficients.concrete.mixes['25'];
      
      const cement = Math.ceil(totalVolume * ratio.cement);
      const sand = (totalVolume * ratio.sand).toFixed(2);
      const gravel = (totalVolume * ratio.gravel).toFixed(2);
      const water = Math.ceil(totalVolume * ratio.water);

      materials.push({ name: 'Cimento (Saco 50kg)', quantity: cement, unit: 'saco(s)' });
      materials.push({ name: 'Areia Média', quantity: sand, unit: 'm³' });
      materials.push({ name: 'Brita (Pedra)', quantity: gravel, unit: 'm³' });
      materials.push({ name: 'Água', quantity: water, unit: 'L' });
    }

    return { metrics, materials };
  };

  const steps: WizardStep[] = [
    {
      id: 'target',
      title: 'Qual elemento será concretado?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SearchableSelect 
            options={concreteElements} 
            selectedId={targetElement?.id} 
            onSelect={(opt) => { setTargetElement(opt); handleNext(); }}
            onCustomSelect={() => { setTargetElement({ id: 'custom', title: 'Outro (Personalizado)' }); }}
            searchPlaceholder="Pesquisar elemento estrutural..."
          />
          {targetElement?.id === 'custom' && (
            <div className="input-group" style={{ marginTop: 16, backgroundColor: 'var(--bg-surface)', padding: 16, borderRadius: 16 }}>
              <label>Nome do Elemento (Opcional)</label>
              <input type="text" value={customElement} onChange={e => setCustomElement(e.target.value)} placeholder="Ex: Muro de arrimo" />
            </div>
          )}
        </div>
      ),
      isValid: !!targetElement,
      hideNextButton: targetElement?.id !== 'custom'
    },
    {
      id: 'method',
      title: 'Como deseja informar as medidas?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => { setInputMethod('volume'); handleNext(); }} className={inputMethod === 'volume' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'volume' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'volume' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'volume' ? 'var(--color-primary)' : 'var(--text-main)' }}>Já sei o volume (m³)</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Informar apenas a metragem cúbica.</p>
          </button>
          <button onClick={() => { setInputMethod('dim'); handleNext(); }} className={inputMethod === 'dim' ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: inputMethod === 'dim' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: inputMethod === 'dim' ? 'var(--color-primary)' : 'var(--text-main)' }}>Dimensões (C × L × A)</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>O sistema calculará o volume automaticamente.</p>
          </button>
        </div>
      ),
      isValid: !!inputMethod,
      hideNextButton: true
    },
    {
      id: 'dimensions',
      title: inputMethod === 'volume' ? 'Qual o volume da concretagem?' : 'Dimensões da concretagem',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inputMethod === 'volume' ? (
            <div className="input-group">
              <label>Volume Total (m³)</label>
              <input type="number" className="input-premium" value={volume} onChange={e => setVolume(e.target.value)} placeholder="Ex: 5.5" />
            </div>
          ) : (
            <>
              <div className="input-group">
                <label>Comprimento (m)</label>
                <input type="number" className="input-premium" value={length} onChange={e => setLength(e.target.value)} placeholder="Ex: 10" />
              </div>
              <div className="input-group">
                <label>Largura (m)</label>
                <input type="number" className="input-premium" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 0.15" />
              </div>
              <div className="input-group">
                <label>Altura / Profundidade (m)</label>
                <input type="number" className="input-premium" value={thickness} onChange={e => setThickness(e.target.value)} placeholder="Ex: 0.40" />
              </div>
            </>
          )}
        </div>
      ),
      isValid: parsedVolume > 0
    },
    {
      id: 'fck',
      title: 'Qual a resistência do concreto (FCK)?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SearchableSelect 
            options={fckOptions} 
            selectedId={fck?.id} 
            onSelect={(opt) => { setFck(opt); handleNext(); }}
            onCustomSelect={() => { setFck({ id: 'custom', title: 'Outro FCK' }); }}
            searchPlaceholder="Pesquisar FCK..."
          />
          {fck?.id === 'custom' && (
            <div className="input-group" style={{ marginTop: 16, backgroundColor: 'var(--bg-surface)', padding: 16, borderRadius: 16 }}>
              <label>FCK Personalizado (MPa)</label>
              <input type="number" className="input-premium" onChange={e => setFck({ id: e.target.value || 'custom', title: `${e.target.value} MPa` })} placeholder="Ex: 45" />
            </div>
          )}
        </div>
      ),
      isValid: !!fck && fck.id !== 'custom',
      hideNextButton: fck?.id !== 'custom'
    },
    {
      id: 'is_ready_mix',
      title: 'Como o concreto será fornecido?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => { setIsReadyMix(true); handleNext(); }} className={isReadyMix === true ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: isReadyMix === true ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${isReadyMix === true ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: isReadyMix === true ? 'var(--color-primary)' : 'var(--text-main)' }}>Concreto Usinado (Caminhão)</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Para pedir diretamente na concreteira.</p>
          </button>
          <button onClick={() => { setIsReadyMix(false); handleNext(); }} className={isReadyMix === false ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'} style={{ padding: 24, borderRadius: 16, textAlign: 'left', backgroundColor: isReadyMix === false ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', border: `1px solid ${isReadyMix === false ? 'var(--color-primary)' : 'var(--border-subtle)'}` }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: isReadyMix === false ? 'var(--color-primary)' : 'var(--text-main)' }}>Virado na Obra (Betoneira)</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Calcularemos Areia, Brita e Cimento.</p>
          </button>
        </div>
      ),
      isValid: isReadyMix !== null,
      hideNextButton: true
    },
    {
      id: 'loss_rate',
      title: 'Ajuste de Perdas',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Margem de Perda (%)</label>
            <input type="number" className="input-premium" value={lossRate} onChange={e => setLossRate(e.target.value)} />
          </div>
          <div style={{ backgroundColor: 'rgba(255,160,87,0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={20} color="#FFA057" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5 }}>
              É padrão adicionar <strong>5%</strong> no volume pedido ou preparado para evitar faltas na hora da concretagem.
            </p>
          </div>
        </div>
      ),
      isValid: parseFloat(lossRate) >= 0
    }
  ];

  if (showResults) {
    const { metrics, materials } = calculateResults();
    const elemName = targetElement?.id === 'custom' ? (customElement || 'Personalizado') : targetElement?.title;
    return (
      <BaseCalculatorLayout
        title="Assistente de Concretagem"
        description="Cálculo detalhado de concreto estrutural."
        icon={<Droplet size={24} />}
        structuralWarning={true}
        onBack={() => setShowResults(false)}
        results={{
          mainMetrics: metrics,
          materials: materials,
          observations: [
            `Elemento: ${elemName}.`,
            isReadyMix ? 'Concreto usinado: O resultado indica o volume exato a ser solicitado à concreteira.' : `Traço utilizado: Tabela base para FCK ${fck?.id} MPa.`
          ]
        }}
      >
        <div />
      </BaseCalculatorLayout>
    );
  }

  return (
    <WizardEngine
      title="Assistente de Concretagem"
      icon={<Droplet size={20} />}
      steps={steps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      onCancel={onBack}
      onFinish={() => setShowResults(true)}
      guideId="concreto-armado"
      onOpenGuide={onNavigate ? (id) => onNavigate('central-tecnica', id) : undefined}
    />
  );
}
