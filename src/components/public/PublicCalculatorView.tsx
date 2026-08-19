import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowRight, Lock, HardHat } from 'lucide-react';
import { FloorTileCalc as TileCalc } from '../calculators_library/FloorTileCalc'; // Using existing calc
import { ConcreteMixCalc as ConcreteVolumeCalc } from '../calculators_library/ConcreteMixCalc';
import { WallPaintCalc as PaintCalc } from '../calculators_library/WallPaintCalc';

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
    <div className="app-container" data-theme={theme} style={{ minHeight: '100vh', paddingBottom: 80, backgroundColor: 'var(--bg-main)' }}>
      <Helmet>
        <title>{title} | CentralObra</title>
        <meta name="description" content={`Use nossa ${title} sem precisar de cadastro. Calcule exatamente a quantidade de material que você precisa para sua obra, evitando desperdício.`} />
        <meta property="og:title" content={`${title} | CentralObra`} />
        <meta property="og:description" content="Pare de desperdiçar material na sua obra! Use a calculadora exata do CentralObra." />
      </Helmet>

      {/* Header */}
      <header style={{ 
        padding: '24px 20px', 
        background: 'linear-gradient(135deg, var(--color-primary), #8B5CF6)',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        marginBottom: 24,
        boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={20} color="#FFF" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#FFF', margin: 0 }}>Ferramenta Gratuita</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: 0 }}>CentralObra</p>
          </div>
        </div>
        <p style={{ color: '#FFF', fontSize: 15, fontWeight: 500, lineHeight: 1.4 }}>
          Descubra a quantidade exata de material para evitar desperdícios e compras desnecessárias.
        </p>
      </header>

      {/* Calculator Body */}
      <main style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="glass-panel" style={{ padding: 20, borderRadius: 24, border: '2px solid var(--color-primary-alpha)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HardHat size={20} color="var(--color-primary)" /> {title}
          </h2>
          
          <div style={{ margin: '0 -16px' }}>
            {component}
          </div>
        </div>

        {/* Lead Magnet Call To Action */}
        <div style={{ 
          padding: 24, borderRadius: 24, 
          background: 'linear-gradient(145deg, var(--bg-panel) 0%, var(--bg-elevated) 100%)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={32} color="var(--color-primary)" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>
            Mais de 80 Calculadoras
          </h3>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
            Acesse calculadoras de Tijolos, Argamassa, Ferragens, Fundação, Telhado e Inteligência Artificial para analisar sua obra completa.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-primary"
            style={{ width: '100%', padding: 16, borderRadius: 16, fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            Criar Conta Grátis <ArrowRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
