import { motion } from 'framer-motion';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CalculatorsShowcaseProps {
  onRegister: () => void;
}

const calcCategories = [
  "Estrutura (Concreto, Aço, Formas)",
  "Alvenaria (Blocos, Tijolos, Argamassa)",
  "Acabamentos (Pisos, Revestimentos, Pintura)",
  "Instalações (Elétrica, Hidráulica)",
  "Telhados e Coberturas"
];

export function CalculatorsShowcase({ onRegister }: CalculatorsShowcaseProps) {
  return (
    <section className="landing-section">
      <div className="landing-container">
        <div className="bento-grid">
          {/* Left Column */}
          <motion.div 
            className="col-span-8 landing-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '48px' }}
          >
            <div className="card-icon-wrapper" style={{ marginBottom: 32 }}>
              <Calculator size={24} />
            </div>
            
            <h2 className="landing-section-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16 }}>
              O Fim do Desperdício de Material
            </h2>
            
            <p className="landing-section-subtitle" style={{ marginBottom: 32 }}>
              Nossa engine matemática possui mais de 80 calculadoras integradas com as normas ABNT vigentes. Descubra exatamente quanto material comprar para cada etapa da sua obra, sem faltar e sem sobrar.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
              {calcCategories.map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-main)', fontSize: 14 }}>{cat}</span>
                </div>
              ))}
            </div>
            
            <button onClick={onRegister} className="btn-landing-primary">
              Experimentar Calculadoras <ArrowRight size={18} />
            </button>
          </motion.div>
          
          {/* Right Column (Visual) */}
          <motion.div 
            className="col-span-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              borderRadius: 24, 
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Ambient Glow */}
            <div style={{
              position: 'absolute',
              width: '150%',
              height: '150%',
              background: 'radial-gradient(circle at center, var(--color-primary-alpha) 0%, transparent 60%)',
              opacity: 0.5,
              top: '-25%',
              left: '-25%',
              filter: 'blur(40px)',
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1, padding: 32, width: '100%' }}>
              {/* Mockup simplificado de calculadora */}
              <div style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,107,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <Calculator size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Alvenaria Estrutural</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bloco 14x19x39</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-base)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Qtd. Blocos</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 13 }}>1.250 un</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-base)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Argamassa</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 13 }}>35 sacos</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,107,0,0.1)', borderRadius: 8, border: '1px solid var(--color-primary-alpha)' }}>
                    <span style={{ color: 'var(--color-primary)', fontSize: 13, fontWeight: 500 }}>Desperdício 5%</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 13 }}>+ 62 un</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
