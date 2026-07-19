import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Layers, Ruler, Scissors, Box } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface BaseboardCalcProps {
  onBack: () => void;
}

export function BaseboardCalc({ onBack }: BaseboardCalcProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    perimetro: '',
    vãos: '',
    barra: '2.4',
    perda: '10'
  });

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const p = parseFloat(data.perimetro) || 0;
    const v = parseFloat(data.vãos) || 0;
    const b = parseFloat(data.barra) || 2.4;
    const perda = parseFloat(data.perda) || 10;
    
    const linearReal = Math.max(0, p - v);
    const linearComPerda = linearReal * (1 + (perda / 100));
    
    const barras = Math.ceil(linearComPerda / b);

    return { 
      linearReal: linearReal.toFixed(2),
      linearComPerda: linearComPerda.toFixed(2),
      barras
    };
  };

  const results = step === 5 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Layers size={28} color="#F59E0B" />
        Calculadora de Rodapés
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Cálculo de barras e perdas para pisos e rodapés.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Perímetro do Ambiente</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Soma de todas as paredes.</p>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.perimetro}
                  onChange={e => setData({ ...data, perimetro: e.target.value })}
                  placeholder="Ex: 14"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>m</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Scissors size={20} /> Desconto de Vãos</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Portas ou aberturas onde não haverá rodapé.</p>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.vãos}
                  onChange={e => setData({ ...data, vãos: e.target.value })}
                  placeholder="Ex: 0.8"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>m</span>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Box size={20} /> Tamanho da Barra</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Qual o comprimento de cada barra vendida?</p>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.barra}
                  onChange={e => setData({ ...data, barra: e.target.value })}
                  placeholder="Ex: 2.4"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>m</span>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Scissors size={20} /> Margem de Perda</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['5', '10', '15'].map(perda => (
                  <button 
                    key={perda}
                    onClick={() => setData({ ...data, perda })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.perda === perda ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.perda === perda ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.perda === perda ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.perda === perda ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {perda}% {perda === '10' && '(Recomendado)'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && results && (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#F59E0B" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Rodapés Calculados</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 24, background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>Total de Barras Necessárias</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#F59E0B' }}>{results.barras} un.</div>
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Resumo de Medidas</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Metragem Linear Real</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.linearReal} m</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total com {data.perda}% de Perda</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.linearComPerda} m</span>
                  </li>
                </ul>
              </div>

              <SmartResultActions 
                tags={['baseboard']}
                onGeneratePDF={() => alert('PDF Gerado!')}
                onAddBudget={() => alert('Adicionado ao Orçamento')}
                onAddShoppingList={() => alert('Adicionado à Lista de Compras')}
                onSaveHistory={() => alert('Salvo no Histórico')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {step < 5 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button 
              onClick={prevStep} 
              disabled={step === 1}
              className="btn-secondary" 
              style={{ flex: 1, padding: 16, opacity: step === 1 ? 0 : 1 }}
            >
              Voltar
            </button>
            <button 
              onClick={nextStep}
              className="btn-primary" 
              style={{ flex: 2, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {step === 4 ? 'Calcular' : 'Avançar'}
              {step < 4 && <ArrowRight size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
