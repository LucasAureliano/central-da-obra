import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Layers, CheckCircle2, XCircle, Info } from 'lucide-react';

interface MaterialsCatalogProps {
  onBack: () => void;
}

export function MaterialsCatalog({ onBack }: MaterialsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<'pisos' | 'bancadas' | 'paredes'>('pisos');

  const catalog = {
    pisos: [
      {
        name: 'Porcelanato',
        pros: ['Alta durabilidade', 'Resistente à água', 'Variedade de acabamentos'],
        cons: ['Toque frio', 'Juntas podem encardir', 'Instalação exige mão de obra especializada'],
        cost: 'R$ 60 a R$ 350 /m²',
        idealFor: 'Salas, cozinhas, banheiros e áreas externas.'
      },
      {
        name: 'Piso Vinílico',
        pros: ['Toque térmico confortável', 'Instalação rápida', 'Acústica excelente (não faz toc-toc)'],
        cons: ['Não pode molhar em excesso', 'Pode riscar com móveis pesados'],
        cost: 'R$ 80 a R$ 200 /m² (com instalação)',
        idealFor: 'Quartos, salas e escritórios.'
      },
      {
        name: 'Laminado',
        pros: ['Menor custo', 'Instalação muito rápida', 'Estética de madeira'],
        cons: ['Baixa resistência à água', 'Som oco ao caminhar (toc-toc)'],
        cost: 'R$ 50 a R$ 120 /m²',
        idealFor: 'Quartos e ambientes comerciais leves.'
      }
    ],
    bancadas: [
      {
        name: 'Granito',
        pros: ['Excelente custo-benefício', 'Alta resistência a riscos', 'Resiste bem ao calor'],
        cons: ['Pode manchar se não impermeabilizado', 'Estética mais granulada'],
        cost: 'R$ 400 a R$ 1.500 /m²',
        idealFor: 'Cozinhas de alto uso e áreas de serviço.'
      },
      {
        name: 'Quartzo (Silestone)',
        pros: ['Cores uniformes e modernas', 'Altíssima resistência a manchas', 'Não é poroso'],
        cons: ['Não resiste a panelas quentes (pode queimar a resina)', 'Alto custo'],
        cost: 'R$ 1.500 a R$ 3.500 /m²',
        idealFor: 'Cozinhas gourmet e banheiros.'
      },
      {
        name: 'Porcelanato Esculpido',
        pros: ['Visual contínuo', 'Mesmo material do piso/parede', 'Resiste a manchas'],
        cons: ['Quinas são mais frágeis', 'Mão de obra cara para esculpir'],
        cost: 'R$ 800 a R$ 2.000 /m²',
        idealFor: 'Banheiros e nichos.'
      }
    ],
    paredes: [
      {
        name: 'Pintura Acrílica',
        pros: ['Custo acessível', 'Fácil manutenção', 'Infinidade de cores'],
        cons: ['Desgasta com o tempo', 'Pode manchar com sujeira'],
        cost: 'R$ 20 a R$ 60 /m² (material + mão de obra)',
        idealFor: 'Todos os ambientes secos.'
      },
      {
        name: 'Papel de Parede',
        pros: ['Transformação rápida', 'Sem sujeira na instalação', 'Texturas exclusivas'],
        cons: ['Pode descolar com umidade', 'Requer parede muito lisa'],
        cost: 'R$ 100 a R$ 400 /rolo',
        idealFor: 'Quartos, salas e lavabos.'
      },
      {
        name: 'Painel Ripado',
        pros: ['Visual muito sofisticado', 'Traz aconchego e textura', 'Pode esconder fiações'],
        cons: ['Alto custo', 'Acúmulo de poeira nas frestas'],
        cost: 'R$ 300 a R$ 900 /m²',
        idealFor: 'Salas de estar (painel de TV) e cabeceiras.'
      }
    ]
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Layers size={28} color="#D946EF" />
        Catálogo de Materiais
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Comparativo rápido para ajudar nas decisões de projeto.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }} className="hide-scrollbar">
        {[
          { id: 'pisos', label: 'Pisos' },
          { id: 'bancadas', label: 'Bancadas' },
          { id: 'paredes', label: 'Paredes' }
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

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {catalog[activeCategory].map((item) => (
            <div key={item.name} className="card-premium" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</h3>
                <div style={{ padding: '4px 10px', background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
                  {item.cost}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#10B981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={16} /> Vantagens</h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {item.pros.map(pro => (
                      <li key={pro} style={{ fontSize: 13, color: 'var(--text-main)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <span style={{ color: '#10B981', marginTop: 1 }}>•</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F43F5E', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><XCircle size={16} /> Desvantagens</h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {item.cons.map(con => (
                      <li key={con} style={{ fontSize: 13, color: 'var(--text-main)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <span style={{ color: '#F43F5E', marginTop: 1 }}>•</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ padding: 12, background: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(217, 70, 239, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Info size={16} color="#D946EF" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Ideal para</div>
                  <div style={{ fontSize: 13, color: 'var(--text-main)' }}>{item.idealFor}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
