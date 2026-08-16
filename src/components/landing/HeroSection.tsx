import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Play } from 'lucide-react';

interface HeroSectionProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function HeroSection({ onRegister }: HeroSectionProps) {
  const [showDemo, setShowDemo] = useState(false);

  const handleShowDemo = () => {
    setShowDemo(true);
    setTimeout(() => {
      const element = document.getElementById('demo-view');
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="landing-section" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow signature */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(ellipse at center, var(--color-primary-alpha) 0%, rgba(13,14,18,0) 70%)',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div className="landing-container" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
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
              WebkitBackdropFilter: 'blur(10px)',
              whiteSpace: 'nowrap',
              maxWidth: '90vw',
              overflow: 'hidden'
            }}>
              <span className="text-gradient" style={{ fontWeight: 600, fontSize: 12 }}>NOVO</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Aumente suas vendas com a Central de Marketing <ChevronRight size={14} style={{ flexShrink: 0 }} />
              </span>
            </div>
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            A plataforma completa para <br className="mobile-hidden" />
            <span className="text-gradient">profissionais da obra</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Capte clientes com portfólio e avaliações, crie orçamentos profissionais em PDF e gerencie suas obras e cronogramas de forma inteligente.
          </motion.p>
          
          <motion.div 
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64, width: '100%', maxWidth: 400 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button onClick={onRegister} className="btn-landing-primary" style={{ flex: '1 1 180px' }}>
              Criar Minha Central <ArrowRight size={18} />
            </button>
            <button onClick={handleShowDemo} className="btn-landing-secondary" style={{ flex: '1 1 180px' }}>
              Explorar a Plataforma <Play size={18} />
            </button>
          </motion.div>
          
          {showDemo && (
            <motion.div 
              id="demo-view"
              className="mockup-window"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
          )}

        </div>
      </div>
    </section>
  );
}
