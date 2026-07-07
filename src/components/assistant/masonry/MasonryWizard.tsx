import { useState } from 'react';
import { ArrowLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { MasonryResult } from './MasonryResult';
import type { AssistantMode } from '../SmartAssistant';

export type MasonryData = {
  material: string;
  purpose: string;
  width: number;
  height: number;
  hasOpenings: boolean;
  openingsArea: number; // m2
  finishings: string[]; // 'chapisco', 'reboco', 'pintura'
};

export function MasonryWizard({ mode, onBack, onHome }: { mode: AssistantMode, onBack: () => void, onHome: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<MasonryData>({
    material: '',
    purpose: '',
    width: 0,
    height: 0,
    hasOpenings: false,
    openingsArea: 0,
    finishings: []
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const updateData = (updates: Partial<MasonryData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // Renderiza a etapa atual
  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      {step < 6 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} /> Voltar
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Etapa {step} de 5</span>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Qual bloco será utilizado?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Tijolo Baiano (9x19x19)', 'Bloco de Concreto (14x19x39)', 'Tijolo Maciço (5x9x19)'].map(mat => (
              <SelectableCard 
                key={mat} 
                title={mat} 
                selected={data.material === mat} 
                onClick={() => { updateData({ material: mat }); setTimeout(nextStep, 300); }} 
              />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Qual a finalidade?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Parede Interna (Divisória)', 'Parede Externa (Fachada)', 'Muro de Divisa'].map(pur => (
              <SelectableCard 
                key={pur} 
                title={pur} 
                selected={data.purpose === pur} 
                onClick={() => { updateData({ purpose: pur }); setTimeout(nextStep, 300); }} 
              />
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Medidas principais</h2>
          
          <div className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Comprimento da Parede (m)</label>
              <input 
                type="number" 
                className="input-premium" 
                placeholder="Ex: 5.0"
                value={data.width || ''}
                onChange={e => updateData({ width: parseFloat(e.target.value) })}
                style={{ backgroundColor: 'var(--bg-input-glass)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Altura (Pé Direito) (m)</label>
              <input 
                type="number" 
                className="input-premium" 
                placeholder="Ex: 2.8"
                value={data.height || ''}
                onChange={e => updateData({ height: parseFloat(e.target.value) })}
                style={{ backgroundColor: 'var(--bg-input-glass)' }}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ color: 'var(--text-main)', fontWeight: 600 }}>Existem vãos?</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Portas ou janelas para descontar.</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => updateData({ hasOpenings: false })}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: !data.hasOpenings ? 'var(--color-primary)' : 'var(--bg-input-glass)', color: !data.hasOpenings ? '#fff' : 'var(--text-main)' }}
              >Não</button>
              <button 
                onClick={() => updateData({ hasOpenings: true })}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: data.hasOpenings ? 'var(--color-primary)' : 'var(--bg-input-glass)', color: data.hasOpenings ? '#fff' : 'var(--text-main)' }}
              >Sim</button>
            </div>
          </div>

          {data.hasOpenings && (
            <div className="glass-panel animate-fade-in" style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Área total a descontar (m²)</label>
              <input 
                type="number" 
                className="input-premium" 
                placeholder="Ex: 3.5 (1 porta + 1 janela)"
                value={data.openingsArea || ''}
                onChange={e => updateData({ openingsArea: parseFloat(e.target.value) })}
                style={{ backgroundColor: 'var(--bg-input-glass)' }}
              />
            </div>
          )}

          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: 16, borderRadius: 16 }}
            disabled={!data.width || !data.height}
            onClick={nextStep}
          >
            Próximo <ChevronRight size={20} />
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Acabamentos</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>O que será aplicado sobre a alvenaria?</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {[
              { id: 'chapisco', label: 'Chapisco (Aderência)' },
              { id: 'reboco', label: 'Emboço/Reboco (Massa Única)' },
              { id: 'massa', label: 'Massa Corrida/Acrílica' },
              { id: 'pintura', label: 'Pintura (Tinta)' }
            ].map(fin => {
              const isSelected = data.finishings.includes(fin.id);
              return (
                <div 
                  key={fin.id}
                  className="glass-panel card-premium-interactive"
                  onClick={() => {
                    const newFins = isSelected 
                      ? data.finishings.filter(f => f !== fin.id)
                      : [...data.finishings, fin.id];
                    updateData({ finishings: newFins });
                  }}
                  style={{ 
                    padding: '16px 20px', 
                    borderRadius: 16, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid transparent'
                  }}
                >
                  <span style={{ color: 'var(--text-main)', fontWeight: isSelected ? 600 : 400 }}>{fin.label}</span>
                  <div style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent' }}>
                    {isSelected && <Check size={16} color="#fff" />}
                  </div>
                </div>
              )
            })}
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8 }}
            onClick={nextStep}
          >
            <Sparkles size={20} /> Gerar Orçamento Inteligente
          </button>
        </div>
      )}

      {step === 5 && (
        <MasonryResult data={data} mode={mode} onHome={onHome} />
      )}
    </div>
  );
}

function SelectableCard({ title, selected, onClick }: { title: string, selected: boolean, onClick: () => void }) {
  return (
    <div 
      className="glass-panel card-premium-interactive"
      onClick={onClick}
      style={{ 
        padding: 20, 
        borderRadius: 16, 
        border: selected ? '2px solid var(--color-primary)' : '2px solid transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 16 }}>{title}</span>
      {selected && <Check size={20} color="var(--color-primary)" />}
    </div>
  );
}
