import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Box, Ruler, Palette, Scale } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface CountertopCalcProps {
  onBack: () => void;
}

export function CountertopCalc({ onBack }: CountertopCalcProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    largura: '',
    profundidade: '',
    frontao: '10', // cm
    saia: '4', // cm
    material: ''
  });

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const l = parseFloat(data.largura) || 0;
    const p = parseFloat(data.profundidade) || 0;
    const f = (parseFloat(data.frontao) || 0) / 100; // cm para m
    const s = (parseFloat(data.saia) || 0) / 100; // cm para m

    // Área da pedra plana
    const areaPlana = l * p;
    
    // Área dos acabamentos (Frontão atrás e nas laterais se houver, mas vamos assumir linear)
    const linearFrontao = l; // Assumindo encostado apenas na parede do fundo
    const linearSaia = l + p + p; // Assumindo saia na frente e duas laterais

    const areaFrontao = linearFrontao * f;
    const areaSaia = linearSaia * s;

    const areaTotal = areaPlana + areaFrontao + areaSaia;

    // Estimativa de peso por m2 (2cm espessura)
    let pesoPorM2 = 55; // Granito/Mármore médio
    if (data.material === 'Porcelanato') pesoPorM2 = 25;
    if (data.material === 'Quartzo/Silestone') pesoPorM2 = 50;

    const pesoTotal = areaPlana * pesoPorM2; // Frontão e saia também pesam, mas a estrutura suporta o plano

    return { 
      areaPlana: areaPlana.toFixed(2),
      areaTotal: areaTotal.toFixed(2),
      linearFrontao: linearFrontao.toFixed(2),
      linearSaia: linearSaia.toFixed(2),
      pesoTotal: pesoTotal.toFixed(0)
    };
  };

  const results = step === 5 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Box size={28} color="#64748B" />
        Calculadora de Bancadas
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Medidas, áreas e peso para pedras e porcelanatos.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Largura e Profundidade</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Largura Total (m)</label>
                  <input 
                    type="number" 
                    value={data.largura}
                    onChange={e => setData({ ...data, largura: e.target.value })}
                    placeholder="Ex: 2.5"
                    className="input-base"
                    style={{ fontSize: 20, padding: '12px 16px' }}
                    autoFocus
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Profundidade (m)</label>
                  <input 
                    type="number" 
                    value={data.profundidade}
                    onChange={e => setData({ ...data, profundidade: e.target.value })}
                    placeholder="Ex: 0.60"
                    className="input-base"
                    style={{ fontSize: 20, padding: '12px 16px' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Palette size={20} /> Material</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Granito', 'Mármore', 'Quartzo/Silestone', 'Porcelanato'].map(mat => (
                  <button 
                    key={mat}
                    onClick={() => setData({ ...data, material: mat })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.material === mat ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.material === mat ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.material === mat ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.material === mat ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Frontão (Rodabanca)</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Qual a altura do acabamento que vai na parede?</p>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.frontao}
                  onChange={e => setData({ ...data, frontao: e.target.value })}
                  placeholder="Ex: 10"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>cm</span>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Saia (Testeira)</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Qual a altura do acabamento frontal/lateral que esconde a espessura da pedra?</p>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.saia}
                  onChange={e => setData({ ...data, saia: e.target.value })}
                  placeholder="Ex: 4"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>cm</span>
              </div>
            </motion.div>
          )}

          {step === 5 && results && (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(100, 116, 139, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#64748B" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Dimensionamento da Bancada</h2>
                <p style={{ color: 'var(--text-muted)' }}>Material: {data.material || 'Não informado'}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Área Plana Útil</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>{results.areaPlana} m²</div>
                </div>
                <div className="card-premium" style={{ padding: 16, background: 'linear-gradient(145deg, rgba(100, 116, 139, 0.1) 0%, rgba(100, 116, 139, 0.02) 100%)', border: '1px solid rgba(100, 116, 139, 0.2)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Área Total a Comprar</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#64748B' }}>{results.areaTotal} m²</div>
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Acabamentos e Fixação</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Corte de Frontão ({data.frontao}cm)</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.linearFrontao}m linear</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Corte de Saia/Testeira ({data.saia}cm)</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.linearSaia}m linear</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Scale size={16} /> Peso Estimado (Plano)</span>
                    <span style={{ fontWeight: 600, color: '#F59E0B' }}>~ {results.pesoTotal} kg</span>
                  </li>
                </ul>
              </div>

              <SmartResultActions 
                tags={['countertop', 'kitchen', 'bathroom', 'stone']}
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
