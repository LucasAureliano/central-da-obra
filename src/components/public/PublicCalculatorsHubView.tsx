import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowRight, Grid, HardHat, Ruler, Wrench } from 'lucide-react';
import { SponsoredAd } from '../shared/SponsoredAd';
import { LandingNavbar } from '../landing/LandingNavbar';
import { InstitutionalFooter } from '../landing/InstitutionalFooter';

export function PublicCalculatorsHubView({ theme }: { theme: string }) {
  const handleAuth = () => {
    window.location.href = '/';
  };
  const handleNavigate = (page: string) => {
    window.location.href = `/#${page}`;
  };

  return (
    <div className="landing-body" data-theme={theme} style={{ backgroundColor: 'var(--bg-base)', fontFamily: "'Inter', sans-serif", height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', overflowX: 'hidden' }}>
      <Helmet>
        <title>Calculadoras de Construção Civil Grátis | CentralObra</title>
        <meta name="description" content="Acesse diversas calculadoras gratuitas para construção civil. Calcule cimento, areia, brita, argamassa, tijolos, tintas e pisos com precisão." />
        <meta name="keywords" content="calculadora de construção, calculadora de materiais, obra, reforma, cálculo de cimento, cálculo de argamassa, cálculo de tijolos" />
        <link rel="canonical" href="https://centralobra.com/calculadoras" />
        <meta property="og:title" content="Calculadoras de Construção Civil Grátis | CentralObra" />
        <meta property="og:description" content="Evite desperdício na sua obra. Calcule a quantidade exata de materiais gratuitamente." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Calculadoras de Construção Civil Grátis | CentralObra",
            "description": "Acesse diversas calculadoras gratuitas para construção civil. Calcule cimento, areia, brita, argamassa, tijolos, tintas e pisos com precisão.",
            "url": "https://centralobra.com/calculadoras",
            "publisher": {
              "@type": "Organization",
              "name": "CentralObra",
              "url": "https://centralobra.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://centralobra.com/pwa-512x512.png"
              }
            }
          })}
        </script>
      </Helmet>

      <LandingNavbar 
        theme={theme as 'light' | 'dark'} 
        onLogin={handleAuth} 
        onRegister={handleAuth} 
        scrolled={true} 
        onNavigate={handleNavigate}
      />

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '120px 20px 40px', boxSizing: 'border-box', width: '100%', position: 'relative', zIndex: 10, flex: 1 }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Calculator size={32} color="var(--color-primary)" />
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16, lineHeight: 1.2, wordBreak: 'break-word' }}>
            Calculadoras de <span style={{ color: 'var(--color-primary)' }}>Materiais</span> para Construção
          </h1>
          <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Pare de chutar a quantidade de materiais da sua obra. Nossas calculadoras usam tabelas oficiais e índices da construção civil para dar resultados precisos. 100% grátis.
          </p>
        </div>

        <SponsoredAd probability={1} location="hub_top"  />

        {/* Grid de Calculadoras */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 20, marginBottom: 48, marginTop: 40 }}>
          <CalcCard 
            title="Calculadora de Concreto" 
            desc="Calcule a quantidade exata de cimento, areia, brita e água para o seu traço de concreto."
            icon={<HardHat />}
            link="/?calc=concreto"
          />
          <CalcCard 
            title="Calculadora de Pisos e Azulejos" 
            desc="Descubra quantos metros quadrados de piso e argamassa você vai precisar."
            icon={<Grid />}
            link="/?calc=pisos"
          />
          <CalcCard 
            title="Calculadora de Tintas" 
            desc="Estime os galões de tinta e massa corrida necessários para pintar suas paredes."
            icon={<Wrench />}
            link="/?calc=tinta"
          />
          <CalcCard 
            title="Alvenaria (Tijolos e Blocos)" 
            desc="Cálculo de tijolos baianos, blocos de concreto e argamassa de assentamento."
            icon={<Ruler />}
            link="/?calc=tijolos"
          />
        </div>

        {/* SEO Text Content */}
        <section style={{ backgroundColor: 'var(--bg-surface)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 24, border: '1px solid var(--border-subtle)', marginBottom: 48, boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 24 }}>
            Por que usar nossas calculadoras de materiais?
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 'clamp(14px, 2.5vw, 16px)' }}>
            <p>
              O planejamento financeiro e quantitativo é o pilar mais importante de qualquer obra ou reforma. Um erro comum de pessoas físicas e até mesmo profissionais é fazer estimativas de cabeça ou usar médias genéricas de pedreiros, o que frequentemente resulta em <strong>desperdício de materiais</strong> ou <strong>paralisação da obra</strong> por falta de itens essenciais.
            </p>
            
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginTop: 16 }}>Qual a precisão das calculadoras?</h3>
            <p>
              O <strong>CentralObra</strong> desenvolveu este portal utilizando índices oficiais da construção civil (como tabelas TCPO e SNAPI), além das especificações técnicas dos principais fabricantes do mercado (Votorantim, Quartzolit, Suvinil, Coral). Isso garante que o cálculo de cimento, areia, brita, argamassa, blocos estruturais e tintas reflitam o rendimento real na prática.
            </p>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginTop: 16 }}>Vantagens de calcular online:</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><strong>Redução de Custos:</strong> Evite comprar 20% a 30% a mais do que o necessário. O desperdício de material significa jogar dinheiro fora.</li>
              <li><strong>Otimização de Fretes:</strong> Comprando a quantidade correta de uma só vez, você reduz custos e dores de cabeça com taxas de entrega adicionais.</li>
              <li><strong>Transparência:</strong> Valide se a lista de materiais solicitada pelo seu prestador de serviço está compatível com as áreas e volumes do seu projeto.</li>
            </ul>

            <div style={{ marginTop: 24, padding: 'clamp(16px, 3vw, 24px)', backgroundColor: 'var(--color-primary-alpha)', borderRadius: 16, color: 'var(--text-main)' }}>
              <strong style={{ fontSize: 18, display: 'block', marginBottom: 8, color: 'var(--color-primary)' }}>Gerencie sua obra por completo!</strong>
              O CentralObra não é apenas uma calculadora. Somos uma plataforma completa onde você pode salvar esses resultados, adicionar à sua lista de compras, gerar PDFs automáticos, acompanhar seu cronograma financeiro e encontrar profissionais qualificados perto de você. <a href="/" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Crie sua conta grátis agora.</a>
            </div>
          </div>
        </section>

        <SponsoredAd probability={1} location="hub_bottom"  />

      </main>
      
      <InstitutionalFooter theme={theme as 'light'|'dark'} onLogin={handleAuth} onNavigate={handleNavigate} />
    </div>
  );
}

function CalcCard({ title, desc, icon, link, comingSoon }: { title: string, desc: string, icon: React.ReactNode, link: string, comingSoon?: boolean }) {
  return (
    <a 
      href={comingSoon ? '#' : link}
      style={{ 
        display: 'block', 
        padding: 24, 
        backgroundColor: 'var(--bg-surface)', 
        borderRadius: 20, 
        border: '1px solid var(--border-subtle)',
        textDecoration: 'none',
        position: 'relative',
        opacity: comingSoon ? 0.6 : 1,
        pointerEvents: comingSoon ? 'none' : 'auto',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box' as const
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: 16 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{desc}</p>
      
      {comingSoon ? (
        <span style={{ position: 'absolute', top: 24, right: 24, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', padding: '4px 8px', borderRadius: 100, backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Em Breve</span>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', fontSize: 13, fontWeight: 700, marginTop: 24 }}>
          Acessar <ArrowRight size={14} />
        </div>
      )}
    </a>
  );
}
