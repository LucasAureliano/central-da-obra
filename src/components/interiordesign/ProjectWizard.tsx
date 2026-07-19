import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Home, Maximize, Palette, LayoutDashboard } from 'lucide-react';
import { SmartResultActions } from '../calculators_library/SmartResultActions';

interface ProjectWizardProps {
  onBack: () => void;
}

export function ProjectWizard({ onBack }: ProjectWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    ambiente: '',
    estilo: '',
    area: ''
  });

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const area = parseFloat(data.area) || 0;
    
    // Simulação de estimativas para interiores
    const custoMedioM2 = {
      'Minimalista': 1500,
      'Industrial': 1200,
      'Contemporâneo': 1800,
      'Clássico': 2500,
      'Boho': 1100
    }[data.estilo] || 1500;

    const estimativaTotal = area * custoMedioM2;

    return { 
      custoM2: custoMedioM2.toLocaleString(),
      estimativaTotal: estimativaTotal.toLocaleString(),
      paletaSugerida: data.estilo === 'Industrial' ? 'Cinza, Preto, Tijolo' : 
                      data.estilo === 'Minimalista' ? 'Branco, Bege, Madeira Clara' :
                      data.estilo === 'Clássico' ? 'Dourado, Branco, Marmorizado' : 'Neutros com toques de cor'
    };
  };

  const results = step === 4 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <LayoutDashboard size={28} color="#D946EF" />
        Assistente de Projetos
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Briefing rápido para estimativas de interiores.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Home size={20} /> Qual o ambiente?</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {['Sala de Estar', 'Quarto Casal', 'Quarto Solteiro', 'Cozinha', 'Banheiro', 'Escritório', 'Varanda'].map(amb => (
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
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Palette size={20} /> Estilo Predominante</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Minimalista', 'Industrial', 'Contemporâneo', 'Clássico', 'Boho'].map(estilo => (
                  <button 
                    key={estilo}
                    onClick={() => setData({ ...data, estilo })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.estilo === estilo ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.estilo === estilo ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.estilo === estilo ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.estilo === estilo ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {estilo}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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

          {step === 4 && results && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(217, 70, 239, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#D946EF" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Ficha do Projeto</h2>
                <p style={{ color: 'var(--text-muted)' }}>{data.ambiente} - {data.area}m²</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 24, background: 'linear-gradient(145deg, rgba(217, 70, 239, 0.1) 0%, rgba(217, 70, 239, 0.02) 100%)', border: '1px solid rgba(217, 70, 239, 0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>Estimativa de Custo (Execução)</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#D946EF' }}>R$ {results.estimativaTotal}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Média de R$ {results.custoM2}/m² para o estilo {data.estilo}</div>
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Diretrizes Iniciais</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Estilo Adotado</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{data.estilo}</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Paleta Sugerida</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.paletaSugerida}</span>
                  </li>
                </ul>
              </div>

              <SmartResultActions 
                tags={['interior-design', 'project', data.estilo.toLowerCase()]}
                onGeneratePDF={() => alert('PDF Gerado!')}
                onAddBudget={() => alert('Criar Orçamento Base')}
                onSaveHistory={() => alert('Salvo no Portfólio')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
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
              {step === 3 ? 'Finalizar' : 'Avançar'}
              {step < 3 && <ArrowRight size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
