import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Play } from 'lucide-react';

interface HeroSectionProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function HeroSection({ onRegister }: HeroSectionProps) {
  const handleScrollToFeatures = () => {
    const element = document.getElementById('recursos');
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="landing-section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: '160px' }}>
      <div className="landing-container" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 999,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-glass)',
              marginBottom: 32,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}>
              <span className="text-gradient" style={{ fontWeight: 600, fontSize: 13 }}>NOVO</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                Integração completa com normas técnicas <ChevronRight size={14} />
              </span>
            </div>
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            A inteligência por trás de <br className="mobile-hidden" />
            <span className="text-gradient">obras de sucesso</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Planejamento, gestão financeira, compras, normas e mais de 80 calculadoras de materiais integradas em um único aplicativo. Feito por profissionais, para profissionais.
          </motion.p>
          
          <motion.div 
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64, width: '100%', maxWidth: 400 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button onClick={onRegister} className="btn-landing-primary" style={{ flex: '1 1 180px' }}>
              Começar Grátis <ArrowRight size={18} />
            </button>
            <button onClick={handleScrollToFeatures} className="btn-landing-secondary" style={{ flex: '1 1 180px' }}>
              Ver Demonstração <Play size={18} />
            </button>
          </motion.div>
          
          <motion.div 
            className="mockup-window"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', height: '600px', display: 'flex', flexDirection: 'column' }}
          >
            <div className="mockup-header">
              <div className="mockup-dot red"></div>
              <div className="mockup-dot yellow"></div>
              <div className="mockup-dot green"></div>
            </div>
            <div style={{ position: 'relative', width: '100%', flex: 1, background: 'var(--bg-base)', overflow: 'hidden', borderRadius: '0 0 16px 16px' }}>
              <iframe src="/?preview=true" style={{ width: '100%', height: '100%', border: 'none' }} title="Interface do Aplicativo" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
