import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Grid, Ruler, Target, Zap } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface SpotsCalcProps {
  onBack: () => void;
}

export function SpotsCalc({ onBack }: SpotsCalcProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    largura: '',
    comprimento: '',
    objetivo: '',
    potenciaSpot: '5'
  });

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const w = parseFloat(data.largura) || 0;
    const h = parseFloat(data.comprimento) || 0;
    const area = w * h;

    let lux = 150;
    if (data.objetivo === 'Geral') lux = 200;
    if (data.objetivo === 'Destaque') lux = 300;

    const lumensRecomendados = area * lux;
    
    // Assume 80 lumens per Watt for LED spots
    const pot = parseFloat(data.potenciaSpot) || 5;
    const lumensPorSpot = pot * 80;

    let qtd = Math.max(1, Math.round(lumensRecomendados / lumensPorSpot));
    
    // To make a grid, find nearest squares
    let rows = Math.round(Math.sqrt((qtd * h) / w));
    let cols = Math.round(qtd / rows);
    if (rows === 0) rows = 1;
    if (cols === 0) cols = 1;
    qtd = rows * cols;

    const espacoX = w / cols;
    const espacoY = h / rows;

    const margemX = espacoX / 2;
    const margemY = espacoY / 2;

    return { 
      qtd, 
      rows, 
      cols, 
      espacoX: espacoX.toFixed(2), 
      espacoY: espacoY.toFixed(2),
      margemX: margemX.toFixed(2),
      margemY: margemY.toFixed(2)
    };
  };

  const results = step === 5 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Zap size={28} color="#EAB308" />
        Calculadora de Spots
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Distribuição e espaçamento no forro.</p>

      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Largura do Ambiente</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.largura}
                  onChange={e => setData({ ...data, largura: e.target.value })}
                  placeholder="Ex: 3.5"
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
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Comprimento do Ambiente</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.comprimento}
                  onChange={e => setData({ ...data, comprimento: e.target.value })}
                  placeholder="Ex: 4.2"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>metros</span>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Target size={20} /> Objetivo</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Decorativa (Luz Suave)', 'Geral (Luz Média)', 'Destaque (Luz Forte)'].map(obj => (
                  <button 
                    key={obj}
                    onClick={() => setData({ ...data, objetivo: obj.split(' ')[0] })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.objetivo === obj.split(' ')[0] ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.objetivo === obj.split(' ')[0] ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.objetivo === obj.split(' ')[0] ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.objetivo === obj.split(' ')[0] ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={20} /> Potência do Spot</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['3', '5', '7', '10'].map(pot => (
                  <button 
                    key={pot}
                    onClick={() => setData({ ...data, potenciaSpot: pot })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.potenciaSpot === pot ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.potenciaSpot === pot ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.potenciaSpot === pot ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.potenciaSpot === pot ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {pot}W
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && results && (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#10B981" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Spots Calculados</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Quantidade</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)' }}>{results.qtd} un.</div>
                </div>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Distribuição</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>{results.cols} x {results.rows}</div>
                </div>
              </div>

              {/* Esquema Gráfico */}
              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Grid size={16} /> Esquema de Paginação
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Distância entre Spots</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                      X: {results.espacoX}m / Y: {results.espacoY}m
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Afastamento das Paredes</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                      X: {results.margemX}m / Y: {results.margemY}m
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: 24, padding: 16, background: 'rgba(234, 179, 8, 0.05)', border: '1px dashed rgba(234, 179, 8, 0.3)', borderRadius: 12, aspectRatio: `${Math.max(1, parseFloat(data.largura))} / ${Math.max(1, parseFloat(data.comprimento))}`, display: 'grid', gridTemplateColumns: `repeat(${results.cols}, 1fr)`, gridTemplateRows: `repeat(${results.rows}, 1fr)`, gap: 4, placeItems: 'center' }}>
                  {Array.from({ length: results.qtd }).map((_, i) => (
                    <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: '#EAB308', boxShadow: '0 0 10px rgba(234, 179, 8, 0.5)' }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>Visualização esquemática</p>
              </div>

              <SmartResultActions 
                tags={['spots', 'lighting']}
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
