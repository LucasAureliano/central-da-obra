import { useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { PaintResult } from './PaintResult';
import type { AssistantMode } from '../SmartAssistant';

export type PaintData = {
  surface: string;
  condition: string;
  area: number;
};

export function PaintWizard({ mode, onBack, onHome }: { mode: AssistantMode, onBack: () => void, onHome: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PaintData>({
    surface: '',
    condition: '',
    area: 0
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const updateData = (updates: Partial<PaintData>) => setData(prev => ({ ...prev, ...updates }));

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      {step < 4 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} /> Voltar
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Etapa {step} de 3</span>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Qual o tipo de superfície?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Parede Interna (Alvenaria)', 'Fachada Externa', 'Teto / Gesso', 'Madeira / Portas', 'Metal / Portões'].map(sur => (
              <SelectableCard key={sur} title={sur} selected={data.surface === sur} onClick={() => { updateData({ surface: sur }); setTimeout(nextStep, 300); }} />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Qual o estado atual?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Nova (Nunca Pintada, no reboco)', 'Repintura Simples (Boa condição)', 'Descascando / Precisando de Massa'].map(cond => (
              <SelectableCard key={cond} title={cond} selected={data.condition === cond} onClick={() => { updateData({ condition: cond }); setTimeout(nextStep, 300); }} />
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Área da Superfície</h2>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button 
              onClick={() => updateData({ inputMethod: 'dimensions' } as any)}
              className="card-premium-interactive"
              style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: (data as any).inputMethod !== 'area' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)', background: (data as any).inputMethod !== 'area' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', color: (data as any).inputMethod !== 'area' ? 'var(--color-primary)' : 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}
            >
              Por Medidas (LxA)
            </button>
            <button 
              onClick={() => updateData({ inputMethod: 'area', width: 0, height: 0 } as any)}
              className="card-premium-interactive"
              style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: (data as any).inputMethod === 'area' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)', background: (data as any).inputMethod === 'area' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', color: (data as any).inputMethod === 'area' ? 'var(--color-primary)' : 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}
            >
              Inserir m² Direto
            </button>
          </div>

          <div className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}>
            {(data as any).inputMethod === 'area' ? (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Área Total (m²)</label>
                <input 
                  type="number" 
                  className="input-premium" 
                  placeholder="Ex: 45.0" 
                  value={data.area || ''} 
                  onChange={e => updateData({ area: parseFloat(e.target.value) || 0 })} 
                  style={{ backgroundColor: 'var(--bg-input-glass)' }} 
                />
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Largura / Comprimento (m)</label>
                  <input 
                    type="number" 
                    className="input-premium" 
                    placeholder="Ex: 5.0" 
                    value={(data as any).width || ''} 
                    onChange={e => {
                      const w = parseFloat(e.target.value) || 0;
                      const h = (data as any).height || 0;
                      updateData({ area: w * h, width: w } as any);
                    }} 
                    style={{ backgroundColor: 'var(--bg-input-glass)' }} 
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Altura (m)</label>
                  <input 
                    type="number" 
                    className="input-premium" 
                    placeholder="Ex: 2.8" 
                    value={(data as any).height || ''} 
                    onChange={e => {
                      const h = parseFloat(e.target.value) || 0;
                      const w = (data as any).width || 0;
                      updateData({ area: w * h, height: h } as any);
                    }} 
                    style={{ backgroundColor: 'var(--bg-input-glass)' }} 
                  />
                </div>
              </>
            )}
            
            <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#3B82F6', fontWeight: 600 }}>Área Total Calculada:</span>
              <span style={{ fontSize: 16, color: 'var(--text-main)', fontWeight: 700 }}>{data.area > 0 ? data.area.toFixed(2) : '0.00'} m²</span>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8 }} disabled={!data.area} onClick={nextStep}>
            <Sparkles size={20} /> Calcular Tintas
          </button>
        </div>
      )}

      {step === 4 && <PaintResult data={data} mode={mode} onHome={onHome} />}
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
