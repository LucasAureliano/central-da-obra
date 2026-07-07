import { useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { ConcreteResult } from './ConcreteResult';
import type { AssistantMode } from '../SmartAssistant';

export type ConcreteData = {
  element: string;
  fck: string;
  volume: number;
};

export function ConcreteWizard({ mode, onBack, onHome }: { mode: AssistantMode, onBack: () => void, onHome: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ConcreteData>({
    element: '',
    fck: '',
    volume: 0
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  const updateData = (updates: Partial<ConcreteData>) => setData(prev => ({ ...prev, ...updates }));

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
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>O que será concretado?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Piso / Contrapiso', 'Laje', 'Fundação (Sapatas)', 'Pilares e Vigas'].map(el => (
              <SelectableCard key={el} title={el} selected={data.element === el} onClick={() => { updateData({ element: el }); setTimeout(nextStep, 300); }} />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Qual a resistência (FCK)?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { id: '15', title: '15 MPa', desc: 'Concreto Magro / Contrapiso' },
              { id: '20', title: '20 MPa', desc: 'Uso Geral / Calçadas' },
              { id: '25', title: '25 MPa', desc: 'Estrutural Padrão' },
              { id: '30', title: '30 MPa', desc: 'Estrutural Pesado' }
            ].map(fck => (
              <div 
                key={fck.id}
                className="glass-panel card-premium-interactive"
                onClick={() => { updateData({ fck: fck.id }); setTimeout(nextStep, 300); }}
                style={{ padding: 20, borderRadius: 16, border: data.fck === fck.id ? '2px solid var(--color-primary)' : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  <span style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 18, display: 'block' }}>{fck.title}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{fck.desc}</span>
                </div>
                {data.fck === fck.id && <Check size={20} color="var(--color-primary)" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Volume de Concreto</h2>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button 
              onClick={() => updateData({ inputMethod: 'dimensions' } as any)}
              className="card-premium-interactive"
              style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: (data as any).inputMethod !== 'volume' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)', background: (data as any).inputMethod !== 'volume' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', color: (data as any).inputMethod !== 'volume' ? 'var(--color-primary)' : 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}
            >
              Por Medidas
            </button>
            <button 
              onClick={() => updateData({ inputMethod: 'volume', width: 0, length: 0, depth: 0 } as any)}
              className="card-premium-interactive"
              style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: (data as any).inputMethod === 'volume' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)', background: (data as any).inputMethod === 'volume' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', color: (data as any).inputMethod === 'volume' ? 'var(--color-primary)' : 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}
            >
              Inserir m³ Direto
            </button>
          </div>

          <div className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}>
            {(data as any).inputMethod === 'volume' ? (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Volume Total (m³)</label>
                <input 
                  type="number" 
                  className="input-premium" 
                  placeholder="Ex: 5.5" 
                  value={data.volume || ''} 
                  onChange={e => updateData({ volume: parseFloat(e.target.value) || 0 })} 
                  style={{ backgroundColor: 'var(--bg-input-glass)' }} 
                />
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Largura (m)</label>
                  <input 
                    type="number" 
                    className="input-premium" 
                    placeholder="Ex: 4.0" 
                    value={(data as any).width || ''} 
                    onChange={e => {
                      const w = parseFloat(e.target.value) || 0;
                      const l = (data as any).length || 0;
                      const d = (data as any).depth || 0;
                      updateData({ volume: w * l * d, width: w } as any);
                    }} 
                    style={{ backgroundColor: 'var(--bg-input-glass)' }} 
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Comprimento (m)</label>
                  <input 
                    type="number" 
                    className="input-premium" 
                    placeholder="Ex: 5.0" 
                    value={(data as any).length || ''} 
                    onChange={e => {
                      const l = parseFloat(e.target.value) || 0;
                      const w = (data as any).width || 0;
                      const d = (data as any).depth || 0;
                      updateData({ volume: w * l * d, length: l } as any);
                    }} 
                    style={{ backgroundColor: 'var(--bg-input-glass)' }} 
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Espessura / Profundidade (m)</label>
                  <input 
                    type="number" 
                    className="input-premium" 
                    placeholder="Ex: 0.15 (15cm)" 
                    value={(data as any).depth || ''} 
                    onChange={e => {
                      const d = parseFloat(e.target.value) || 0;
                      const w = (data as any).width || 0;
                      const l = (data as any).length || 0;
                      updateData({ volume: w * l * d, depth: d } as any);
                    }} 
                    style={{ backgroundColor: 'var(--bg-input-glass)' }} 
                  />
                </div>
              </>
            )}

            <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#3B82F6', fontWeight: 600 }}>Volume Calculado:</span>
              <span style={{ fontSize: 16, color: 'var(--text-main)', fontWeight: 700 }}>{data.volume > 0 ? data.volume.toFixed(2) : '0.00'} m³</span>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8 }} disabled={!data.volume} onClick={nextStep}>
            <Sparkles size={20} /> Calcular Traço
          </button>
        </div>
      )}

      {step === 4 && <ConcreteResult data={data} mode={mode} onHome={onHome} />}
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
