import { useState, useEffect } from 'react';
import { Logo } from './ui/Logo';
import { Building2, Clock, ThumbsUp, PenTool, ShieldCheck, Zap } from 'lucide-react';

import { HeroSection } from './landing/HeroSection';
import { ProfilesSection } from './landing/ProfilesSection';
import { FeaturesGridSection } from './landing/FeaturesGridSection';
import { FaqSection } from './landing/FaqSection';
import { InstitutionalFooter } from './landing/InstitutionalFooter';
import { GenericInfoPage } from './landing/GenericInfoPage';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  theme: 'light' | 'dark';
}

export function LandingPage({ onLogin, onRegister, theme }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [subPage, setSubPage] = useState<'home' | 'history' | 'careers' | 'contact' | 'privacy' | 'terms'>('home');

  useEffect(() => {
    // Basic SEO Meta tags injection for the institutional page
    document.title = "CentralObra | Plataforma Inteligente para Construção Civil";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Planejamento, gestão financeira, compras, normas e mais de 80 calculadoras de materiais integradas em um único aplicativo para a construção civil.');

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setScrolled(target.scrollTop > 50);
    };
    
    const scrollContainer = document.querySelector('.landing-body');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    
    // Add Schema.org structured data dynamically
    const scriptId = 'schema-org-data';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CentralObra",
        "operatingSystem": "Web, Android, iOS",
        "applicationCategory": "BusinessApplication",
        "description": "Plataforma completa para gestão de obras, calculadoras de materiais, financeiro e biblioteca técnica.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BRL"
        }
      });
      document.head.appendChild(script);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (subPage !== 'home') {
      setSubPage('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (subPage !== 'home') {
    return <GenericInfoPage 
      pageId={subPage} 
      onBack={() => setSubPage('home')} 
      onLogin={onLogin} 
      onNavigate={(page) => setSubPage(page)}
      theme={theme}
    />;
  }

  return (
    <div className="landing-body">
      {/* Background Elements */}
      <div className="landing-bg">
        {/* Dark mesh gradient background for professional look */}
        <div className="shader-bg-wrapper">
          <div className="shader-grid" style={{ opacity: 0.1 }}></div>
          <div className="shader-glow-1" style={{ background: '#3b82f6', opacity: 0.05 }}></div>
          <div className="shader-glow-2" style={{ background: '#8b5cf6', opacity: 0.05 }}></div>
        </div>
      </div>

      {/* Navbar Premium */}
      <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-container">
          <div className="nav-left">
            <a href="#" className="logo-link" onClick={(e) => { e.preventDefault(); document.querySelector('.landing-body')?.scrollTo({top:0, behavior:'smooth'}) }}>
              <Logo variant="horizontal" theme={theme} />
            </a>
          </div>
          
          <div className="nav-center mobile-hidden">
            <a href="#perfis" onClick={(e) => handleScrollTo(e, 'perfis')} className="landing-nav-link animated-link">Para Quem</a>
            <a href="#recursos" onClick={(e) => handleScrollTo(e, 'recursos')} className="landing-nav-link animated-link">Recursos</a>
            <a href="#como-funciona" onClick={(e) => handleScrollTo(e, 'como-funciona')} className="landing-nav-link animated-link">Como Funciona</a>
          </div>

          <div className="nav-right mobile-hidden">
            <button onClick={onLogin} className="landing-nav-link btn-3d" style={{ fontWeight: 600 }}>Entrar</button>
            <button onClick={onRegister} className="btn-landing-primary btn-3d">Começar Grátis</button>
          </div>
          
          {/* Mobile Only Button */}
          <div className="nav-mobile-only">
            <button onClick={onLogin} className="btn-landing-primary btn-3d" style={{ height: 40, padding: '0 16px', fontSize: 14 }}>Entrar</button>
          </div>
        </div>
      </nav>
      
      <HeroSection onLogin={onLogin} onRegister={onRegister} />
      
      <div id="perfis">
        <ProfilesSection />
      </div>
      
      <div id="recursos">
        <FeaturesGridSection />
      </div>

      <div id="como-funciona">
        <FaqSection />
      </div>

      <InstitutionalFooter theme={theme} onLogin={onLogin} onNavigate={(page) => setSubPage(page)} />

    </div>
  );
}
