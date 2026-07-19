import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Wind, Maximize, Users, Monitor, Sun } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface AirConditioningCalcProps {
  onBack: () => void;
}

export function AirConditioningCalc({ onBack }: AirConditioningCalcProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    area: '',
    pessoas: '2',
    equipamentos: '1',
    sol: ''
  });

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const area = parseFloat(data.area) || 0;
    const pessoas = parseInt(data.pessoas) || 0;
    const equips = parseInt(data.equipamentos) || 0;
    
    // Regra básica: 600 BTUs por m². Se pegar sol da tarde/o dia todo, 800 BTUs por m².
    const baseBtuPorM2 = data.sol === 'Tarde' || data.sol === 'Dia Todo' ? 800 : 600;
    
    let btus = area * baseBtuPorM2;
    
    // Adicionar carga por pessoas (desconta a 1ª pessoa que já estaria no cálculo base)
    if (pessoas > 1) {
      btus += (pessoas - 1) * 600;
    }
    
    // Adicionar carga por equipamentos eletrônicos
    btus += equips * 600;

    // Arredondar para os tamanhos comerciais mais comuns
    const comerciais = [7000, 9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000];
    let btuComercial = comerciais.find(c => c >= btus) || Math.ceil(btus / 1000) * 1000;

    return { 
      btusCalculado: btus.toLocaleString(),
      btuComercial: btuComercial.toLocaleString()
    };
  };

  const results = step === 5 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Wind size={28} color="#3B82F6" />
        Calculadora de Ar Condicionado
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Dimensionamento térmico em BTUs.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Maximize size={20} /> Área do ambiente</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.area}
                  onChange={e => setData({ ...data, area: e.target.value })}
                  placeholder="Ex: 20"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>m²</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={20} /> Quantidade de pessoas</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Qual a média de pessoas no ambiente?</p>
              <input 
                type="number" 
                value={data.pessoas}
                onChange={e => setData({ ...data, pessoas: e.target.value })}
                className="input-base"
                style={{ fontSize: 24, padding: '16px 20px' }}
                autoFocus
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Monitor size={20} /> Equipamentos</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Computadores, TVs, Geladeiras, etc.</p>
              <input 
                type="number" 
                value={data.equipamentos}
                onChange={e => setData({ ...data, equipamentos: e.target.value })}
                className="input-base"
                style={{ fontSize: 24, padding: '16px 20px' }}
                autoFocus
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Sun size={20} /> Incidência Solar</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Manhã (Pouco Sol)', 'Tarde', 'Dia Todo'].map(sol => (
                  <button 
                    key={sol}
                    onClick={() => setData({ ...data, sol })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.sol === sol ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.sol === sol ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.sol === sol ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.sol === sol ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {sol}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && results && (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#3B82F6" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Equipamento Recomendado</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 24, background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>Potência Comercial Ideal</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#3B82F6' }}>{results.btuComercial} BTUs</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Carga térmica calculada: {results.btusCalculado} BTUs</div>
                </div>
              </div>

              <SmartResultActions 
                tags={['air-conditioning']}
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
