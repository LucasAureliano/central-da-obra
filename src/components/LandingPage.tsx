import { useState, useEffect } from 'react';
import { Logo } from './ui/Logo';
import { ConstructionShaderBg } from './landing/ConstructionShaderBg';
import { TestimonialStack } from './landing/TestimonialStack';
import type { Testimonial } from './landing/TestimonialStack';
import { Building2, Clock, ThumbsUp, PenTool, ShieldCheck, Zap } from 'lucide-react';

import { HeroSection } from './landing/HeroSection';
import { ProfilesSection } from './landing/ProfilesSection';
import { FeaturesGridSection } from './landing/FeaturesGridSection';
import { CalculatorsShowcase } from './landing/CalculatorsShowcase';
import { LibraryDemoSection } from './landing/LibraryDemoSection';
import { FinanceDemoSection } from './landing/FinanceDemoSection';
import { ManagementDemoSection } from './landing/ManagementDemoSection';
import { InsightsDemoSection } from './landing/InsightsDemoSection';
import { HowItWorksTimeline } from './landing/HowItWorksTimeline';
import { DifferentialsSection } from './landing/DifferentialsSection';
import { FaqSection } from './landing/FaqSection';
import { InstitutionalFooter } from './landing/InstitutionalFooter';
import { GenericInfoPage } from './landing/GenericInfoPage';

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    initials: 'RC',
    name: 'Ricardo Carvalho',
    role: 'Engenheiro Civil',
    quote: "O CentralObra eliminou 90% das minhas planilhas. Faço orçamentos em minutos e acompanho o custo real da obra pelo celular enquanto estou no canteiro.",
    tags: [{ text: 'DESTAQUE', type: 'featured' }, { text: 'Gestão de Obras', type: 'default' }],
    stats: [{ icon: Building2, text: '12 Obras Ativas' }, { icon: Clock, text: 'Economiza 10h/semana' }],
    avatarGradient: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
  },
  {
    id: 2,
    initials: 'MS',
    name: 'Mariana Silva',
    role: 'Arquiteta',
    quote: "Meus clientes ficam impressionados quando envio os orçamentos em PDF com a identidade visual do meu escritório. O app me passa muito profissionalismo.",
    tags: [{ text: 'Premium', type: 'default' }, { text: 'Orçamentos', type: 'default' }],
    stats: [{ icon: ThumbsUp, text: 'Aumento em Vendas' }, { icon: PenTool, text: 'Design Focado' }],
    avatarGradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    id: 3,
    initials: 'JL',
    name: 'João Lima',
    role: 'Proprietário',
    quote: "Construir minha casa era um pesadelo até eu achar este app. Agora guardo todas as notas fiscais e sei exatamente quanto gastei na fundação e na alvenaria.",
    tags: [{ text: 'Novo', type: 'default' }, { text: 'Controle', type: 'featured' }],
    stats: [{ icon: ShieldCheck, text: 'Tudo Registrado' }, { icon: Zap, text: 'Fácil de Usar' }],
    avatarGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  }
];

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

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
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
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (subPage !== 'home') {
      setSubPage('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
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
        <ConstructionShaderBg theme={theme} />
      </div>

      {/* Navbar Premium */}
      <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-container">
          <div className="nav-left">
            <a href="#" className="logo-link" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}) }}>
              <Logo variant="horizontal" theme={theme} />
            </a>
          </div>
          
          <div className="nav-center mobile-hidden">
            <a href="#perfis" onClick={(e) => handleScrollTo(e, 'perfis')} className="landing-nav-link animated-link">Para Quem</a>
            <a href="#recursos" onClick={(e) => handleScrollTo(e, 'recursos')} className="landing-nav-link animated-link">Recursos</a>
            <a href="#demonstracao" onClick={(e) => handleScrollTo(e, 'demonstracao')} className="landing-nav-link animated-link">Demonstração</a>
            <a href="#como-funciona" onClick={(e) => handleScrollTo(e, 'como-funciona')} className="landing-nav-link animated-link">Como Funciona</a>
          </div>

          <div className="nav-right mobile-hidden">
            <button onClick={onLogin} className="landing-nav-link" style={{ fontWeight: 600 }}>Entrar</button>
            <button onClick={onRegister} className="btn-landing-primary">Começar Grátis</button>
          </div>
          
          {/* Mobile Only Button */}
          <div className="nav-mobile-only">
            <button onClick={onLogin} className="btn-landing-primary" style={{ height: 40, padding: '0 16px', fontSize: 14 }}>Entrar</button>
          </div>
        </div>
      </nav>
      
      <HeroSection onLogin={onLogin} onRegister={onRegister} />
      
      <div id="perfis">
        <ProfilesSection />
      </div>
      
      <div id="recursos">
        <FeaturesGridSection />
        <div id="calculadoras">
          <CalculatorsShowcase onRegister={onRegister} />
        </div>
      </div>

      <div id="demonstracao">
        <div id="biblioteca">
          <LibraryDemoSection />
        </div>
        <div id="gestao">
          <FinanceDemoSection />
        </div>
        <ManagementDemoSection />
        <div style={{ marginTop: '80px' }}>
          <InsightsDemoSection />
        </div>
      </div>

      <div id="como-funciona">
        <HowItWorksTimeline />
      </div>
      
      <DifferentialsSection />

      {/* Depoimentos Premium com Testimonial Stack (Mantido do original) */}
      <section id="depoimentos" className="landing-section">
        <div className="landing-container">
          <div className="section-header">
            <h2 className="landing-section-title">O que dizem os <span className="text-gradient">Profissionais</span></h2>
            <p className="landing-section-subtitle">Junte-se a milhares de pessoas que transformaram a forma como lidam com obras no Brasil.</p>
          </div>
          <div>
            <TestimonialStack testimonials={testimonialsData} visibleBehind={2} />
          </div>
        </div>
      </section>

      <div id="faq">
        <FaqSection />
      </div>

      <InstitutionalFooter theme={theme} onLogin={onLogin} onNavigate={(page) => setSubPage(page)} />

    </div>
  );
}
