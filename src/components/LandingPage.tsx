import { useState, useEffect } from 'react';
import { HardHat, Grid as LucideGrid, Wrench, Ruler, ArrowRight } from 'lucide-react';
import { Logo } from './ui/Logo';


import { HeroSection } from './landing/HeroSection';
import { ProfilesSection } from './landing/ProfilesSection';
import { FeaturesGridSection } from './landing/FeaturesGridSection';
import { PricingSection } from './landing/PricingSection';
import { FaqSection } from './landing/FaqSection';
import { InstitutionalFooter } from './landing/InstitutionalFooter';
import { GenericInfoPage } from './landing/GenericInfoPage';
import { SponsoredAd } from './shared/SponsoredAd';
import { LandingNavbar } from './landing/LandingNavbar';

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
    <div className="landing-body" onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 50)} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', overflowX: 'hidden' }}>
      {/* Background Elements */}
      <div className="landing-bg">
        {/* Dark mesh gradient background for professional look */}
        <div className="shader-bg-wrapper">
          <div className="shader-grid" style={{ opacity: 0.1 }}></div>
          <div className="shader-glow-1" style={{ background: '#3b82f6', opacity: 0.05 }}></div>
          <div className="shader-glow-2" style={{ background: '#8b5cf6', opacity: 0.05 }}></div>
        </div>
      </div>

      <LandingNavbar 
        theme={theme} 
        onLogin={onLogin} 
        onRegister={onRegister} 
        scrolled={scrolled} 
        onNavigate={(id) => handleScrollTo({ preventDefault: () => {} } as any, id)}
      />
      
      <HeroSection onLogin={onLogin} onRegister={onRegister} />
      
      <div id="perfis">
        <ProfilesSection />
      </div>
      
      <div id="calculadoras" style={{ padding: '80px 20px', backgroundColor: 'var(--bg-base)', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Calculadoras Gratuitas</h2>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 48, lineHeight: 1.6, maxWidth: 600, margin: '0 auto 48px' }}>
            Acesse nossa biblioteca completa com dezenas de calculadoras para estimar cimento, tijolos, tintas e pisos com precisão milimétrica.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: 20, marginBottom: 48, textAlign: 'left' }}>
            <a href="/?calc=concreto" className="calc-hover-card" style={{ display: 'block', padding: 24, backgroundColor: 'var(--bg-surface)', borderRadius: 20, border: '1px solid var(--border-subtle)', textDecoration: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: 16 }}>
                <HardHat />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Concreto</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>Cimento, areia e brita para lajes e pisos.</p>
            </a>
            <a href="/?calc=pisos" className="calc-hover-card" style={{ display: 'block', padding: 24, backgroundColor: 'var(--bg-surface)', borderRadius: 20, border: '1px solid var(--border-subtle)', textDecoration: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: 16 }}>
                <LucideGrid />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Pisos e Azulejos</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>Metragem e quantidade de argamassa.</p>
            </a>
            <a href="/?calc=tinta" className="calc-hover-card" style={{ display: 'block', padding: 24, backgroundColor: 'var(--bg-surface)', borderRadius: 20, border: '1px solid var(--border-subtle)', textDecoration: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: 16 }}>
                <Wrench />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Tintas</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>Rendimento de galões para pintura.</p>
            </a>
            <a href="/?calc=tijolos" className="calc-hover-card" style={{ display: 'block', padding: 24, backgroundColor: 'var(--bg-surface)', borderRadius: 20, border: '1px solid var(--border-subtle)', textDecoration: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: 16 }}>
                <Ruler />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Alvenaria</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>Tijolos e blocos para subir paredes.</p>
            </a>
          </div>

          <a href="/?calculadoras=true" className="btn-landing-primary btn-3d" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', fontSize: 16, textDecoration: 'none' }}>
            Ver Todas as Calculadoras
            <ArrowRight size={20} />
          </a>
        </div>
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
