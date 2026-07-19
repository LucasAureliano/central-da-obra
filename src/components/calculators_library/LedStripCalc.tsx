import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Zap, Ruler, BatteryCharging, Palette } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface LedStripCalcProps {
  onBack: () => void;
}

export function LedStripCalc({ onBack }: LedStripCalcProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    comprimento: '',
    tipo: '',
    potencia: ''
  });

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const comp = parseFloat(data.comprimento) || 0;
    const potMetro = parseFloat(data.potencia) || 0;
    
    const potenciaTotal = comp * potMetro;
    
    // A fonte deve ter 20% a 30% de margem de segurança
    const potenciaFonte = potenciaTotal * 1.3;
    
    // Suggest standard power supply sizes
    const standardSizes = [12, 24, 36, 60, 100, 150, 200, 250, 300, 400, 500];
    const fonteIdeal = standardSizes.find(s => s >= potenciaFonte) || Math.ceil(potenciaFonte / 100) * 100;

    const amperagem = (fonteIdeal / 12).toFixed(1); // Assumindo fita 12V na maioria dos casos comerciais

    return { 
      potenciaTotal: potenciaTotal.toFixed(1),
      potenciaFonte: fonteIdeal,
      amperagem,
      driver: `${fonteIdeal}W (12V - ${amperagem}A)`
    };
  };

  const results = step === 4 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Zap size={28} color="#F43F5E" />
        Calculadora Fita LED
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Dimensionamento de fontes e drivers.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Comprimento Total</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.comprimento}
                  onChange={e => setData({ ...data, comprimento: e.target.value })}
                  placeholder="Ex: 10"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>metros</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Palette size={20} /> Tipo de Fita LED</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['COB (Luz Contínua)', 'SMD 2835 (Decorativa)', 'SMD 5050 (Forte/RGB)'].map(tipo => (
                  <button 
                    key={tipo}
                    onClick={() => setData({ ...data, tipo })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.tipo === tipo ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.tipo === tipo ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.tipo === tipo ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.tipo === tipo ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><BatteryCharging size={20} /> Potência por Metro</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { val: '4.8', label: '4.8 W/m (Decorativa fraca)' },
                  { val: '10', label: '10 W/m (Intermediária)' },
                  { val: '14.4', label: '14.4 W/m (Forte / COB)' },
                  { val: '24', label: '24 W/m (Extra forte)' },
                ].map(pot => (
                  <button 
                    key={pot.val}
                    onClick={() => setData({ ...data, potencia: pot.val })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.potencia === pot.val ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.potencia === pot.val ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.potencia === pot.val ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.potencia === pot.val ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {pot.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && results && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#F43F5E" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Dimensionamento da Fonte</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Potência da Fita</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>{results.potenciaTotal}W</div>
                </div>
                <div className="card-premium" style={{ padding: 16, background: 'linear-gradient(145deg, rgba(244, 63, 94, 0.1) 0%, rgba(244, 63, 94, 0.02) 100%)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Fonte Ideal (+30%)</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#F43F5E' }}>{results.potenciaFonte}W</div>
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Especificação do Driver</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Recomendação de Compra</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Fonte Chaveada {results.driver}</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Margem de Segurança</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>30% (Aplicada)</span>
                  </li>
                </ul>
              </div>

              <SmartResultActions 
                tags={['led-strip', 'lighting']}
                onGeneratePDF={() => alert('PDF Gerado!')}
                onAddBudget={() => alert('Adicionado ao Orçamento')}
                onAddShoppingList={() => alert('Adicionado à Lista de Compras')}
                onSaveHistory={() => alert('Salvo no Histórico')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {step < 4 && (
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
              {step === 3 ? 'Calcular' : 'Avançar'}
              {step < 3 && <ArrowRight size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
