import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { FloorTileCalc as TileCalc } from '../calculators_library/FloorTileCalc';
import { ConcreteMixCalc as ConcreteVolumeCalc } from '../calculators_library/ConcreteMixCalc';
import { WallPaintCalc as PaintCalc } from '../calculators_library/WallPaintCalc';
import { SponsoredAd } from '../shared/SponsoredAd';
import { LandingNavbar } from '../landing/LandingNavbar';
import { InstitutionalFooter } from '../landing/InstitutionalFooter';

export function PublicCalculatorView({ theme, calcId }: { theme: string, calcId: string }) {
  const getCalcData = () => {
    switch(calcId) {
      case 'concreto': return { 
        title: 'Calculadora de Concreto Grátis', 
        description: 'Calcule a quantidade exata de cimento, areia, brita e água para sua laje, piso ou pilar.',
        component: <ConcreteVolumeCalc onBack={() => window.location.href = '/?calculadoras=true'} /> 
      };
      case 'tinta': return { 
        title: 'Calculadora de Tinta Grátis', 
        description: 'Estime quantos galões de tinta são necessários para pintar as paredes da sua obra, com ou sem demãos.',
        component: <PaintCalc onBack={() => window.location.href = '/?calculadoras=true'} /> 
      };
      default: return { 
        title: 'Calculadora de Pisos e Revestimentos Grátis', 
        description: 'Saiba exatamente quantos metros quadrados de piso e sacos de argamassa comprar.',
        component: <TileCalc onBack={() => window.location.href = '/?calculadoras=true'} /> 
      };
    }
  };

  const { title, description, component } = getCalcData();

  const handleNavigate = (page: string) => {
    window.location.href = `/#${page}`;
  };

  const handleAuth = () => {
    window.location.href = '/';
  };

  return (
    <div className="landing-body" data-theme={theme} style={{ backgroundColor: 'var(--bg-base)', fontFamily: "'Inter', sans-serif", flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', overflowX: 'hidden' }}>
      <Helmet>
        <title>{title} | CentralObra</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Cabeçalho do Site Principal */}
      <LandingNavbar 
        theme={theme as 'light'|'dark'} 
        onLogin={handleAuth} 
        onRegister={handleAuth} 
        scrolled={true} 
      />

      {/* Espaçamento para o navbar fixed */}
      <div style={{ height: 80 }}></div>

      {/* Hero Simples da Calculadora */}
      <div style={{ padding: '40px 20px 20px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>{title}</h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      {/* Anúncio Superior */}
      <div style={{ padding: '24px 20px 0', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <SponsoredAd probability={1} location="calc_top" />
      </div>

      <main style={{ position: 'relative', width: '100%', maxWidth: 768, margin: '0 auto', display: 'flex', flexDirection: 'column', paddingBottom: 60 }}>
        
        {/* Container da Calculadora */}
        <div style={{ position: 'relative', marginTop: 24, padding: '0 16px' }}>
          {component}
        </div>

        {/* Textos Explicativos (SEO e Ajuda) */}
        <div style={{ margin: '40px 16px 0', padding: '32px 24px', backgroundColor: 'var(--bg-surface)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Por que calcular com precisão?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <CheckCircle2 color="var(--color-primary)" size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}><strong>Evite desperdícios:</strong> Comprar material a mais significa dinheiro parado e entulho na obra.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <CheckCircle2 color="var(--color-primary)" size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}><strong>Sem atrasos:</strong> Faltar material no meio do serviço atrasa o cronograma e o pagamento da mão de obra.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <CheckCircle2 color="var(--color-primary)" size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}><strong>Orçamento exato:</strong> Apresente orçamentos precisos para seus clientes e evite surpresas.</p>
            </div>
          </div>
        </div>

        {/* Anúncio Inferior */}
        <div style={{ padding: '24px 16px', width: '100%' }}>
          <SponsoredAd probability={1} location="calc_bottom" />
        </div>

        {/* Call to Action CentralObra */}
        <div style={{ 
          margin: '0 16px', padding: 32, borderRadius: 24, 
          background: 'linear-gradient(145deg, var(--bg-panel) 0%, var(--bg-elevated) 100%)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={32} color="var(--color-primary)" />
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Baixe o App Completo</h3>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.5, maxWidth: 400, margin: '0 auto 24px' }}>
            Acesse mais de 80 calculadoras de materiais, gestão financeira e planejamento de obras no aplicativo CentralObra.
          </p>
          <button onClick={handleAuth} className="btn-primary" style={{ width: '100%', maxWidth: 300, margin: '0 auto', padding: 16, borderRadius: 16, fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Criar Conta Grátis <ArrowRight size={20} />
          </button>
        </div>
      </main>

      {/* Rodapé do Site Principal */}
      <InstitutionalFooter theme={theme as 'light'|'dark'} onLogin={handleAuth} onNavigate={(p) => handleNavigate(p)} />
    </div>
  );
}
