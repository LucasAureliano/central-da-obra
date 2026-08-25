import { useState, useEffect } from 'react';
import { Logo } from './ui/Logo';


import { HeroSection } from './landing/HeroSection';
import { ProfilesSection } from './landing/ProfilesSection';
import { FeaturesGridSection } from './landing/FeaturesGridSection';
import { PricingSection } from './landing/PricingSection';
import { FaqSection } from './landing/FaqSection';
import { InstitutionalFooter } from './landing/InstitutionalFooter';
import { GenericInfoPage } from './landing/GenericInfoPage';
import { SponsoredAd } from './shared/SponsoredAd';

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
    <div className="landing-body" onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 50)}>
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
            <a href="/?calculadoras=true" className="landing-nav-link animated-link">Calculadoras</a>
            <a href="#planos" onClick={(e) => handleScrollTo(e, 'planos')} className="landing-nav-link animated-link">Planos</a>
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
      
      <div id="calculadoras" style={{ padding: '60px 20px', backgroundColor: 'var(--bg-surface)', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Precisando calcular materiais?</h2>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 48px' }}>Acesse nossa biblioteca com dezenas de calculadoras gratuitas para estimar cimento, tijolos, tintas e pisos com precisão milimétrica.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 960, margin: '0 auto 48px', textAlign: 'left' }}>
          <a href="/?calc=concreto" className="feature-card" style={{ textDecoration: 'none', background: 'var(--bg-panel)', padding: 24, borderRadius: 20, border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Concreto</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Calcule areia, brita, água e cimento.</p>
          </a>
          <a href="/?calc=pisos" className="feature-card" style={{ textDecoration: 'none', background: 'var(--bg-panel)', padding: 24, borderRadius: 20, border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Pisos e Revestimentos</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>M² de piso e argamassa exatos.</p>
          </a>
          <a href="/?calc=tinta" className="feature-card" style={{ textDecoration: 'none', background: 'var(--bg-panel)', padding: 24, borderRadius: 20, border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Tinta</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Galões de tinta para suas paredes.</p>
          </a>
          <div className="feature-card" style={{ opacity: 0.6, background: 'var(--bg-panel)', padding: 24, borderRadius: 20, border: '1px dashed var(--border-subtle)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Alvenaria (Em Breve)</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Cálculo de tijolos e argamassa.</p>
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: '0 auto 48px' }}>
          <SponsoredAd probability={1} location="landing_calc" />
        </div>

        <a href="/?calculadoras=true" className="btn-landing-primary btn-3d" style={{ display: 'inline-flex', padding: '16px 32px', fontSize: 18, textDecoration: 'none' }}>
          Acessar Hub Completo
        </a>
      </div>
      
      <div id="recursos">
        <FeaturesGridSection />
      </div>

      <div id="planos">
        <PricingSection onSubscribe={onRegister} />
      </div>

      <div id="como-funciona">
        <FaqSection />
      </div>

      <InstitutionalFooter theme={theme} onLogin={onLogin} onNavigate={(page) => setSubPage(page)} />

    </div>
  );
}
