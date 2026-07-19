import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, Lightbulb, CheckCircle2, Home, Ruler, Maximize, PaintBucket, Target } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface LightingWizardProps {
  onBack: () => void;
}

export function LightingWizard({ onBack }: LightingWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    ambiente: '',
    area: '',
    peDireito: '',
    cor: '',
    objetivo: ''
  });

  const nextStep = () => setStep(s => Math.min(6, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const area = parseFloat(data.area) || 0;
    
    // Base Lux table by environment (NBR 8995-1 simplified)
    let luxRecomendado = 150;
    if (['Cozinha', 'Escritório', 'Escritório Comercial', 'Loja'].includes(data.ambiente)) luxRecomendado = 300;
    if (['Banheiro'].includes(data.ambiente)) luxRecomendado = 200;
    if (['Corredor', 'Garagem'].includes(data.ambiente)) luxRecomendado = 100;
    
    // Objective modifier
    if (data.objetivo === 'Trabalho') luxRecomendado += 150;
    if (data.objetivo === 'Conforto') luxRecomendado = Math.max(100, luxRecomendado - 50);

    // Color modifier (darker colors absorb more light)
    let colorFactor = 1;
    if (data.cor === 'Média') colorFactor = 1.2;
    if (data.cor === 'Escura') colorFactor = 1.4;

    const lumens = Math.round(area * luxRecomendado * colorFactor);
    
    // Assume average LED efficacy of 90 lm/W
    const potenciaTotal = Math.round(lumens / 90);
    
    // Assume typical fixtures (15W panels = 1200 lm, 5W spots = 400 lm)
    const luminarias = Math.max(1, Math.round(lumens / 1200));
    const spots = Math.round(lumens / 400);

    let tempCor = '4000K (Branco Neutro)';
    if (['Quarto', 'Sala'].includes(data.ambiente) || data.objetivo === 'Conforto') tempCor = '2700K - 3000K (Branco Quente)';
    if (['Cozinha', 'Banheiro', 'Escritório', 'Loja'].includes(data.ambiente) || data.objetivo === 'Trabalho') tempCor = '5000K - 6500K (Branco Frio)';

    return { luxRecomendado, lumens, potenciaTotal, luminarias, spots, tempCor, irc: '> 80 (90+ para Lojas)' };
  };

  const results = step === 6 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Lightbulb size={28} color="#F59E0B" />
        Assistente de Iluminação
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Dimensionamento rápido e normas técnicas.</p>

      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Home size={20} /> Qual o ambiente?</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {['Sala', 'Quarto', 'Cozinha', 'Banheiro', 'Escritório', 'Área Gourmet', 'Corredor', 'Garagem', 'Loja'].map(amb => (
                  <button 
                    key={amb}
                    onClick={() => setData({ ...data, ambiente: amb })}
                    style={{ 
                      padding: '12px 20px', 
                      borderRadius: 12, 
                      border: data.ambiente === amb ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.ambiente === amb ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.ambiente === amb ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.ambiente === amb ? 600 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {amb}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Maximize size={20} /> Área do ambiente</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.area}
                  onChange={e => setData({ ...data, area: e.target.value })}
                  placeholder="Ex: 15"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>m²</span>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Pé-direito</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.peDireito}
                  onChange={e => setData({ ...data, peDireito: e.target.value })}
                  placeholder="Ex: 2.8"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>metros</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>Pé-direito muito alto exige lâmpadas mais fortes ou pendentes.</p>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><PaintBucket size={20} /> Cor Predominante</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Paredes escuras absorvem mais luz, exigindo maior potência luminosa.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Clara', 'Média', 'Escura'].map(cor => (
                  <button 
                    key={cor}
                    onClick={() => setData({ ...data, cor })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.cor === cor ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.cor === cor ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.cor === cor ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.cor === cor ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {cor}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Target size={20} /> Objetivo da Iluminação</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Conforto', 'Trabalho', 'Decorativa', 'Mista'].map(obj => (
                  <button 
                    key={obj}
                    onClick={() => setData({ ...data, objetivo: obj })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.objetivo === obj ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.objetivo === obj ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.objetivo === obj ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.objetivo === obj ? 600 : 400,
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

          {step === 6 && results && (
            <motion.div key="s6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#10B981" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Dimensionamento Concluído</h2>
                <p style={{ color: 'var(--text-muted)' }}>Projeto para {data.ambiente} ({data.area}m²)</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Lumens Totais</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)' }}>{results.lumens.toLocaleString()} lm</div>
                </div>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Iluminância</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#8B5CF6' }}>{results.luxRecomendado} Lux</div>
                </div>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Potência Estimada</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#F59E0B' }}>~{results.potenciaTotal}W</div>
                </div>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Temperatura</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{results.tempCor}</div>
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Equipamentos Sugeridos</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Painéis LED (Geral)</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.luminarias} unidades</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ou Spots LED (Decorativo)</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.spots} unidades</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Índice IRC</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.irc}</span>
                  </li>
                </ul>
              </div>

              <SmartResultActions 
                tags={['lighting', 'lighting-wizard']}
                onGeneratePDF={() => alert('PDF Gerado!')}
                onAddBudget={() => alert('Adicionado ao Orçamento')}
                onAddShoppingList={() => alert('Adicionado à Lista de Compras')}
                onSaveHistory={() => alert('Salvo no Histórico')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        {step < 6 && (
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
              {step === 5 ? 'Calcular' : 'Avançar'}
              {step < 5 && <ArrowRight size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
