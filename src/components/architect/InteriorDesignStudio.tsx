import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, LayoutDashboard, Layers, Columns, Compass, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ArchitecturalTrends } from '../owner/ArchitecturalTrends';

type StudioTab = 'tendencias' | 'moodboards' | 'catalogo' | 'comparacao' | 'favoritos';

export function InteriorDesignStudio({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<StudioTab>('catalogo');

  const TABS = [
    { id: 'catalogo', label: 'Catálogo de Materiais', icon: Layers },
    { id: 'moodboards', label: 'Moodboards', icon: LayoutDashboard },
    { id: 'tendencias', label: 'Tendências e Referências', icon: Compass },
    { id: 'comparacao', label: 'Comparação', icon: Columns },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
  ] as const;

  const MATERIAL_CATEGORIES = [
    'Revestimentos', 'Pisos', 'Tintas', 'Marcenaria', 'Metais', 'Louças', 'Decoração'
  ];

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 24px 20px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} className="btn-secondary" style={{ width: 40, height: 40, borderRadius: 20, padding: 0 }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Studio de Interiores</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Ambiente técnico de especificação</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 20, scrollbarWidth: 'none', flexShrink: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as StudioTab)}
            style={{
              padding: '10px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: activeTab === tab.id ? '#FFF' : 'var(--text-muted)',
              border: activeTab === tab.id ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          
          {/* TENDÊNCIAS */}
          {activeTab === 'tendencias' && (
            <motion.div key="tendencias" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Reuse the existing trends logic but hide its back button */}
              <div style={{ margin: '-24px -20px' }}>
                 <ArchitecturalTrends />
              </div>
            </motion.div>
          )}

          {/* CATÁLOGO DE MATERIAIS */}
          {activeTab === 'catalogo' && (
            <motion.div key="catalogo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
                {MATERIAL_CATEGORIES.map(cat => (
                  <div key={cat} className="card-premium" style={{ padding: 16, textAlign: 'center', cursor: 'pointer' }} onClick={() => toast.success(`Carregando biblioteca de ${cat}...`)}>
                    <ImageIcon size={24} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{cat}</div>
                  </div>
                ))}
              </div>
              
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Lançamentos e Destaques</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {[
                  { name: 'Porcelanato Calacatta Gold 120x120', brand: 'Portobello', img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80', cat: 'Revestimentos' },
                  { name: 'Misturador Monocomando Gold', brand: 'Deca', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', cat: 'Metais' },
                  { name: 'Tinta Acrílica Fosca Algodão Egípcio', brand: 'Suvinil', img: 'https://images.unsplash.com/photo-1562259929-b7e181d8d007?auto=format&fit=crop&w=400&q=80', cat: 'Tintas' },
                  { name: 'Piso Vinílico Carvalho Hannover', brand: 'Tarkett', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80', cat: 'Pisos' }
                ].map((item, idx) => (
                  <div key={idx} className="card-premium" style={{ overflow: 'hidden', padding: 0 }}>
                    <div style={{ height: 140, backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div style={{ padding: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>{item.cat}</span>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: '4px 0', lineHeight: 1.2 }}>{item.name}</h4>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{item.brand}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* MOODBOARDS */}
          {activeTab === 'moodboards' && (
            <motion.div key="moodboards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>Meus Moodboards</h3>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, borderRadius: 12 }} onClick={() => toast.success('Novo moodboard criado')}>
                  + Novo
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card-premium" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 80, height: 80, borderRadius: 12, background: 'linear-gradient(45deg, #1A1A1A, #5C4033, #B89B72)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Living Conceito Aberto</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Cliente: Familia Silva • 12 itens</p>
                  </div>
                </div>
                <div className="card-premium" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 80, height: 80, borderRadius: 12, background: 'linear-gradient(45deg, #F5F5F0, #C5A880, #534B4F)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Suíte Master</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Cliente: Apartamento 402 • 8 itens</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* COMPARAÇÃO */}
          {activeTab === 'comparacao' && (
            <motion.div key="comparacao" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg-elevated)', borderRadius: 16 }}>
                 <Columns size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                 <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Comparador de Materiais</h3>
                 <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Selecione até 3 itens do catálogo para comparar preços, especificações e fornecedores.</p>
                 <button className="btn-secondary" style={{ padding: '8px 16px', borderRadius: 12 }}>Adicionar Itens</button>
               </div>
            </motion.div>
          )}

          {/* FAVORITOS */}
          {activeTab === 'favoritos' && (
            <motion.div key="favoritos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg-elevated)', borderRadius: 16 }}>
                 <Heart size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                 <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Seus Favoritos</h3>
                 <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Você ainda não adicionou nenhum material ou referência aos favoritos.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
