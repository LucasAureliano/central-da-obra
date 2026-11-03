import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { Sun, Moon } from 'lucide-react';

interface LandingNavbarProps {
  theme: 'light' | 'dark';
  onLogin: () => void;
  onRegister: () => void;
  scrolled: boolean;
  onNavigate?: (id: string) => void;
}

export function LandingNavbar({ theme, onLogin, onRegister, scrolled, onNavigate }: LandingNavbarProps) {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      window.location.href = '/#' + id;
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="landing-nav-container">
        <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <motion.a 
            href="/" 
            className="logo-link"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Logo variant="horizontal" theme={theme} />
          </motion.a>
          <div className="desktop-only">
             <motion.button 
               className="btn-icon" 
               style={{ width: 40, height: 40, borderRadius: 20, color: 'var(--text-main)', cursor: 'pointer' }} 
               onClick={toggleTheme}
               whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 107, 0, 0.12)' }}
               whileTap={{ scale: 0.9, rotate: 180 }}
               transition={{ type: 'spring', stiffness: 350, damping: 22 }}
               title="Alternar Tema Claro / Escuro"
             >
               <motion.div
                 key={theme}
                 initial={{ rotate: -90, opacity: 0 }}
                 animate={{ rotate: 0, opacity: 1 }}
                 exit={{ rotate: 90, opacity: 0 }}
                 transition={{ duration: 0.25 }}
                 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
               >
                 {theme === 'dark' ? <Sun size={20} color="#FFB800" /> : <Moon size={20} color="#6366F1" />}
               </motion.div>
             </motion.button>
          </div>
        </div>
        
        <div className="nav-center mobile-hidden">
          <motion.a 
            href="/#perfis" 
            onClick={(e) => handleScrollTo(e, 'perfis')} 
            className="landing-nav-link animated-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Para Quem
          </motion.a>
          <motion.a 
            href="/#recursos" 
            onClick={(e) => handleScrollTo(e, 'recursos')} 
            className="landing-nav-link animated-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Recursos
          </motion.a>
          <motion.a 
            href="/calculadoras" 
            className="landing-nav-link animated-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Calculadoras
          </motion.a>
          <motion.a 
            href="/#planos" 
            onClick={(e) => handleScrollTo(e, 'planos')} 
            className="landing-nav-link animated-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Planos
          </motion.a>
          <motion.a 
            href="/#como-funciona" 
            onClick={(e) => handleScrollTo(e, 'como-funciona')} 
            className="landing-nav-link animated-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Como Funciona
          </motion.a>
        </div>

        <div className="nav-right mobile-hidden" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button 
            onClick={onLogin} 
            className="landing-nav-link" 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Entrar
          </motion.button>
          <motion.button 
            onClick={onRegister} 
            className="btn-landing-primary btn-3d"
            whileHover={{ scale: 1.04, boxShadow: '0 8px 24px var(--color-primary-glow)' }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            Começar Grátis
          </motion.button>
        </div>
        
        <div className="nav-mobile-only" style={{ alignItems: 'center', gap: 12 }}>
          <motion.button 
            className="btn-icon" 
            style={{ width: 40, height: 40, borderRadius: 20, color: 'var(--text-main)', cursor: 'pointer' }} 
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: 180 }}
            title="Alternar Tema"
          >
            {theme === 'dark' ? <Sun size={20} color="#FFB800" /> : <Moon size={20} color="#6366F1" />}
          </motion.button>
          <motion.button 
            onClick={onLogin} 
            className="btn-landing-primary btn-3d" 
            style={{ height: 40, padding: '0 16px', fontSize: 14 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Entrar
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
