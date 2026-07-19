import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Ruler, Scissors, Palette } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface WallpaperCalcProps {
  onBack: () => void;
}

export function WallpaperCalc({ onBack }: WallpaperCalcProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    larguraParede: '',
    alturaParede: '',
    areaPortasJanelas: '',
    tamanhoRolo: '5.3' // Padrão 0.53x10m
  });

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const l = parseFloat(data.larguraParede) || 0;
    const a = parseFloat(data.alturaParede) || 0;
    const desc = parseFloat(data.areaPortasJanelas) || 0;
    const rendimentoTeorico = parseFloat(data.tamanhoRolo) || 5.3;
    
    // O rendimento real de um rolo de 5.3m² é geralmente 4.5m² devido a casamentos de desenhos
    const rendimentoReal = rendimentoTeorico * 0.85;

    const areaBruta = l * a;
    const areaLiquida = Math.max(0, areaBruta - desc);
    
    const rolos = Math.ceil(areaLiquida / rendimentoReal);

    return { 
      areaLiquida: areaLiquida.toFixed(2),
      rolos
    };
  };

  const results = step === 5 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Palette size={28} color="#8B5CF6" />
        Calculadora Papel de Parede
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Cálculo exato de rolos necessários.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Largura da Parede (Soma)</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.larguraParede}
                  onChange={e => setData({ ...data, larguraParede: e.target.value })}
                  placeholder="Ex: 5"
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
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Altura (Pé-Direito)</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.alturaParede}
                  onChange={e => setData({ ...data, alturaParede: e.target.value })}
                  placeholder="Ex: 2.8"
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
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Scissors size={20} /> Desconto de Vãos (Portas/Janelas)</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Qual a área total a descontar?</p>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.areaPortasJanelas}
                  onChange={e => setData({ ...data, areaPortasJanelas: e.target.value })}
                  placeholder="Ex: 3.5"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>m²</span>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Palette size={20} /> Especificações do Rolo</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['5.3', '10.6'].map(rolo => (
                  <button 
                    key={rolo}
                    onClick={() => setData({ ...data, tamanhoRolo: rolo })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.tamanhoRolo === rolo ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.tamanhoRolo === rolo ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.tamanhoRolo === rolo ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.tamanhoRolo === rolo ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    Rolo de {rolo} m² {rolo === '5.3' && '(Padrão 0.53 x 10m)'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && results && (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#8B5CF6" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Rolos Necessários</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 24, background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>Total a Comprar</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#8B5CF6' }}>{results.rolos} rolos</div>
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Detalhes</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Área Líquida (sem vãos)</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.areaLiquida} m²</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Desperdício Considerado (Casamento de desenho)</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>15%</span>
                  </li>
                </ul>
              </div>

              <SmartResultActions 
                tags={['wallpaper']}
                onGeneratePDF={() => alert('PDF Gerado!')}
                onAddBudget={() => alert('Adicionado ao Orçamento')}
                onAddShoppingList={() => alert('Adicionado à Lista de Compras')}
                onSaveHistory={() => alert('Salvo no Histórico')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
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
