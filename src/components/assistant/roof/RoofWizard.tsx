import { useState } from 'react';
import { ArrowLeft, Check, Sparkles, ChevronRight } from 'lucide-react';
import { RoofResult } from './RoofResult';
import type { AssistantMode } from '../SmartAssistant';

export type RoofData = {
  tileType: string;
  shape: string;
  width: number;
  length: number;
  eaves: number; // Beiral
};

export function RoofWizard({ mode, onBack, onHome }: { mode: AssistantMode, onBack: () => void, onHome: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RoofData>({
    tileType: '',
    shape: '',
    width: 0,
    length: 0,
    eaves: 0
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const updateData = (updates: Partial<RoofData>) => setData(prev => ({ ...prev, ...updates }));

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      {step < 5 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} /> Voltar
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Etapa {step} de 4</span>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Qual o tipo de telha?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Cerâmica Francesa', 'Cerâmica Romana', 'Cerâmica Portuguesa', 'Fibrocimento', 'Metálica (Sanduíche)'].map(mat => (
              <SelectableCard key={mat} title={mat} selected={data.tileType === mat} onClick={() => { updateData({ tileType: mat }); setTimeout(nextStep, 300); }} />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Qual o formato do telhado?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Uma Água (Caimento simples)', 'Duas Águas', 'Quatro Águas', 'Telhado Embutido (Platibanda)'].map(pur => (
              <SelectableCard key={pur} title={pur} selected={data.shape === pur} onClick={() => { updateData({ shape: pur }); setTimeout(nextStep, 300); }} />
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Dimensões da Cobertura</h2>
          <div className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Largura da Edificação (m)</label>
              <input type="number" className="input-premium" placeholder="Ex: 6.0" value={data.width || ''} onChange={e => updateData({ width: parseFloat(e.target.value) })} style={{ backgroundColor: 'var(--bg-input-glass)' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Comprimento da Edificação (m)</label>
              <input type="number" className="input-premium" placeholder="Ex: 10.0" value={data.length || ''} onChange={e => updateData({ length: parseFloat(e.target.value) })} style={{ backgroundColor: 'var(--bg-input-glass)' }} />
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16 }} disabled={!data.width || !data.length} onClick={nextStep}>
            Próximo <ChevronRight size={20} />
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Detalhes Técnicos</h2>
          <div className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Tamanho do Beiral (cm)</label>
            <input type="number" className="input-premium" placeholder="Ex: 60" value={data.eaves || ''} onChange={e => updateData({ eaves: parseFloat(e.target.value) })} style={{ backgroundColor: 'var(--bg-input-glass)' }} />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Beiral é a parte do telhado que avança além da parede. Deixe em 0 se for embutido.</p>
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8 }} onClick={nextStep}>
            <Sparkles size={20} /> Gerar Orçamento
          </button>
        </div>
      )}

      {step === 5 && <RoofResult data={data} mode={mode} onHome={onHome} />}
    </div>
  );
}

function SelectableCard({ title, selected, onClick }: { title: string, selected: boolean, onClick: () => void }) {
  return (
    <div className="glass-panel card-premium-interactive" onClick={onClick} style={{ padding: 20, borderRadius: 16, border: selected ? '2px solid var(--color-primary)' : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 16 }}>{title}</span>
      {selected && <Check size={20} color="var(--color-primary)" />}
    </div>
  );
}
