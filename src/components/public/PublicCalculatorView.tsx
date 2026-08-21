import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Lock } from 'lucide-react';
import { FloorTileCalc as TileCalc } from '../calculators_library/FloorTileCalc';
import { ConcreteMixCalc as ConcreteVolumeCalc } from '../calculators_library/ConcreteMixCalc';
import { WallPaintCalc as PaintCalc } from '../calculators_library/WallPaintCalc';
import { SponsoredAd } from '../shared/SponsoredAd';

export function PublicCalculatorView({ theme, calcId }: { theme: string, calcId: string }) {
  const getCalcData = () => {
    switch(calcId) {
      case 'concreto': return { title: 'Calculadora de Concreto Grátis', component: <ConcreteVolumeCalc onBack={() => window.location.href = '/'} /> };
      case 'tinta': return { title: 'Calculadora de Tinta Grátis', component: <PaintCalc onBack={() => window.location.href = '/'} /> };
      default: return { title: 'Calculadora de Pisos e Revestimentos Grátis', component: <TileCalc onBack={() => window.location.href = '/'} /> };
    }
  };

  const { title, component } = getCalcData();

  return (
    <div className="app-container" data-theme={theme} style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>{title} | CentralObra</title>
        <meta name="description" content={`Use nossa ${title} sem precisar de cadastro. Calcule a quantidade exata de material para evitar desperdício.`} />
      </Helmet>

      <div style={{ padding: '16px 16px 0', maxWidth: 768, margin: '0 auto', width: '100%' }}>
        <SponsoredAd probability={1} location="calc_top" />
      </div>

      <main style={{ position: 'relative', width: '100%', maxWidth: 768, margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ position: 'relative', flex: 1, minHeight: 'calc(100vh - 200px)' }}>
          {component}
        </div>

        <div style={{ 
          margin: '24px 16px', padding: 24, borderRadius: 24, 
          background: 'linear-gradient(145deg, var(--bg-panel) 0%, var(--bg-elevated) 100%)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={32} color="var(--color-primary)" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Mais de 80 Calculadoras</h3>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.5 }}>Acesse calculadoras de Tijolos, Argamassa, Ferragens, Fundação, Telhado e Inteligência Artificial para analisar sua obra completa.</p>
          <button onClick={() => window.location.href = '/'} className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Criar Conta Grátis <ArrowRight size={20} />
          </button>
        </div>
        
        <div style={{ padding: '0 16px 24px', maxWidth: 768, margin: '0 auto', width: '100%' }}>
          <SponsoredAd probability={1} location="calc_bottom" />
        </div>
      </main>
    </div>
  );
}
