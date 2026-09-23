import { useState, useEffect } from 'react';
import { HardHat, Grid as LucideGrid, Wrench, Ruler, ArrowRight } from 'lucide-react';
import { Logo } from './ui/Logo';


import { CalculatorLandingSection } from './landing/CalculatorLandingSection';
import { HeroSection } from './landing/HeroSection';
import { ProfilesSection } from './landing/ProfilesSection';
import { FeaturesGridSection } from './landing/FeaturesGridSection';
import { PricingSection } from './landing/PricingSection';
import { FaqSection } from './landing/FaqSection';
import { InstitutionalFooter } from './landing/InstitutionalFooter';
import { SEOArticleBlock } from './landing/SEOArticleBlock';
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
    document.title = "CentralObra | Plataforma Inteligente para ConstruÃ§Ã£o Civil";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Planejamento, gestÃ£o financeira, compras, normas e mais de 80 calculadoras de materiais integradas em um Ãºnico aplicativo para a construÃ§Ã£o civil.');

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
        "description": "Plataforma completa para gestÃ£o de obras, calculadoras de materiais, financeiro e biblioteca tÃ©cnica.",
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
      
      <div id="calculadoras">
        <CalculatorLandingSection />
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

      <SEOArticleBlock />

      <InstitutionalFooter theme={theme} onLogin={onLogin} onNavigate={(page) => setSubPage(page)} />

    </div>
  );
}



