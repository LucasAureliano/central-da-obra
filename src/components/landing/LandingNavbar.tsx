import React from 'react';
import { Logo } from '../ui/Logo';

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

  return (
    <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="landing-nav-container">
        <div className="nav-left">
          <a href="/" className="logo-link">
            <Logo variant="horizontal" theme={theme} />
          </a>
        </div>
        
        <div className="nav-center mobile-hidden">
          <a href="/#perfis" onClick={(e) => handleScrollTo(e, 'perfis')} className="landing-nav-link animated-link">Para Quem</a>
          <a href="/#recursos" onClick={(e) => handleScrollTo(e, 'recursos')} className="landing-nav-link animated-link">Recursos</a>
          <a href="/?calculadoras=true" className="landing-nav-link animated-link">Calculadoras</a>
          <a href="/#planos" onClick={(e) => handleScrollTo(e, 'planos')} className="landing-nav-link animated-link">Planos</a>
          <a href="/#como-funciona" onClick={(e) => handleScrollTo(e, 'como-funciona')} className="landing-nav-link animated-link">Como Funciona</a>
        </div>

        <div className="nav-right mobile-hidden">
          <button onClick={onLogin} className="landing-nav-link btn-3d" style={{ fontWeight: 600 }}>Entrar</button>
          <button onClick={onRegister} className="btn-landing-primary btn-3d">Começar Grátis</button>
        </div>
        
        <div className="nav-mobile-only">
          <button onClick={onLogin} className="btn-landing-primary btn-3d" style={{ height: 40, padding: '0 16px', fontSize: 14 }}>Entrar</button>
        </div>
      </div>
    </nav>
  );
}
