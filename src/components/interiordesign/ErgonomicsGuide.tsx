import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Ruler, BookOpen } from 'lucide-react';

interface ErgonomicsGuideProps {
  onBack: () => void;
}

export function ErgonomicsGuide({ onBack }: ErgonomicsGuideProps) {
  const [activeCategory, setActiveCategory] = useState<'cozinha' | 'banheiro' | 'circulacao'>('cozinha');

  const measures = {
    cozinha: [
      { item: 'Bancada de Pia', height: '90 a 92cm', note: 'Altura ideal para evitar dores nas costas (pessoas entre 1.60m e 1.70m).' },
      { item: 'Bancada Ilha (Refeição)', height: '75cm ou 90cm', note: '75cm para cadeiras comuns, 90cm para banquetas médias.' },
      { item: 'Armário Superior', height: '1.50m do chão', note: 'Deixar entre 60cm e 70cm de distância da bancada da pia.' }
    ],
    banheiro: [
      { item: 'Bancada da Pia', height: '85 a 90cm', note: 'Com cuba de embutir. Se for de apoio, a borda superior da cuba deve ficar nessa altura.' },
      { item: 'Eixo do Vaso Sanitário', distance: 'Mín. 30cm', note: 'Distância mínima do centro do vaso até a parede ou box lateral.' },
      { item: 'Papeleira', height: '50 a 60cm', note: 'Ao lado do vaso, fácil alcance.' }
    ],
    circulacao: [
      { item: 'Corredores Mínimos', distance: '90cm', note: 'Mínimo absoluto para passagem de uma pessoa com conforto.' },
      { item: 'Entre sofá e rack', distance: '60 a 80cm', note: 'Permite circulação confortável na sala.' },
      { item: 'Atrás de cadeiras', distance: '60cm', note: 'Espaço necessário para afastar a cadeira da mesa sem bater na parede.' }
    ]
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Ruler size={28} color="#D946EF" />
        Medidas Ergonômicas
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Medidas padrão e confortáveis para o seu projeto.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }} className="hide-scrollbar">
        {[
          { id: 'cozinha', label: 'Cozinha' },
          { id: 'banheiro', label: 'Banheiro' },
          { id: 'circulacao', label: 'Circulação' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              whiteSpace: 'nowrap',
              border: activeCategory === tab.id ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              background: activeCategory === tab.id ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
              color: activeCategory === tab.id ? 'var(--color-primary)' : 'var(--text-main)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {measures[activeCategory].map((measure, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={measure.item}
            className="card-premium" 
            style={{ padding: 16 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{measure.item}</h3>
              <div style={{ padding: '4px 10px', background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
                {(measure as any).height || (measure as any).distance}
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <BookOpen size={16} style={{ flexShrink: 0, marginTop: 2, opacity: 0.5 }} />
              {measure.note}
            </p>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
