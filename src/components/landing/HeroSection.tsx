import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, ChevronDown, Play } from 'lucide-react';

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
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="landing-section" style={{ minHeight: '100dvh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', paddingBottom: '100px', position: 'relative', overflow: 'hidden' }}>
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
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 720, margin: '0 auto', padding: '0 16px' }}>
          
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
              backdropFilter: 'blur(24px)',
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
            style={{ textAlign: 'center', width: '100%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            A plataforma completa para{' '}
            <span className="text-gradient">profissionais da obra</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            style={{ textAlign: 'center', width: '100%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Capte clientes com portfólio e avaliações, crie orçamentos profissionais em PDF e gerencie suas obras e cronogramas de forma inteligente.
          </motion.p>
          
          <motion.div 
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32, width: '100%', maxWidth: 400 }}
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

          <motion.div
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64, width: '100%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 12, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', textDecoration: 'none', transition: 'all 0.2s' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Baixar na App Store" style={{ height: 32 }} />
            </a>
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 12, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', textDecoration: 'none', transition: 'all 0.2s' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Disponível no Google Play" style={{ height: 32 }} />
            </a>
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
      
      {!showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-muted)',
            cursor: 'pointer',
            zIndex: 10
          }}
          onClick={() => {
            const container = document.querySelector('.landing-body');
            if (container) {
              container.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
            }
          }}
        >
          <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7 }}>Role para explorar</span>
          <ChevronDown size={24} style={{ opacity: 0.7 }} />
        </motion.div>
      )}
    </section>
  );
}
