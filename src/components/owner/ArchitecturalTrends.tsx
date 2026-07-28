import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Share2, ArrowLeft, Sparkles, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

export interface TrendItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  tags: string[];
  palette: string[];
}

const TREND_CATEGORIES = [
  'Todos',
  'Arquitetura',
  'Design de Interiores',
  'Paisagismo',
  'Fachadas',
  'Piscinas',
  'Iluminação',
  'Automação',
  'Revestimentos',
  'Porcelanatos',
  'Tintas',
  'Móveis Planejados'
];

const INITIAL_TRENDS: TrendItem[] = [
  {
    id: 't-1',
    title: 'Fachada Minimalista com Concreto Visto e Brise Wood',
    category: 'Fachadas',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Linhas puras integradas à natureza com iluminação embutida e brises em madeira cumaru tratada.',
    tags: ['#Minimalismo', '#ConcretoVisto', '#Brises', '#FachadaModernista'],
    palette: ['#2B2B2B', '#D4A373', '#8C8C8C', '#E9E5D9']
  },
  {
    id: 't-2',
    title: 'Living Conceito Aberto com Ilha em Mármore Escuro',
    category: 'Design de Interiores',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    description: 'Integração de sala de estar e cozinha gourmet com pendentes minimalistas e acabamentos escuros.',
    tags: ['#LivingAberto', '#MármoreNero', '#CozinhaGourmet', '#IluminaçãoQuente'],
    palette: ['#1A1A1A', '#5C4033', '#B89B72', '#FFFFFF']
  },
  {
    id: 't-3',
    title: 'Piscina de Borda Infinita com Revestimento de Pedra Hijau',
    category: 'Piscinas',
    imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    description: 'Piscina integrada ao paisagismo com iluminação subaquática LED RGB e pedra vulcanica verde.',
    tags: ['#BordaInfinita', '#PedraHijau', '#PaisagismoTropical', '#DeckMadeira'],
    palette: ['#1C3F39', '#5E8B7E', '#C2A687', '#333333']
  },
  {
    id: 't-4',
    title: 'Paisagismo Biofílico com Jardim Vertical e Iluminação Cênica',
    category: 'Paisagismo',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    description: 'Combinação de espécies tropicais com automação de irrigação e espetos de jardim dimerizáveis.',
    tags: ['#Biofilia', '#JardimVertical', '#AutomaçãoDeIrrigação', '#IluminaçãoCênica'],
    palette: ['#2D4A27', '#4F772D', '#90A955', '#31572C']
  },
  {
    id: 't-5',
    title: 'Suíte Master com Iluminação Indireta Kelvin 2700K',
    category: 'Iluminação',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    description: 'Sancas de LED integradas, marcenaria ripada em tom amêndoa e automação Lutron.',
    tags: ['#SuíteMaster', '#IluminaçãoIndireta', '#2700K', '#MarcenariaRipada'],
    palette: ['#231F20', '#D6C0B3', '#AB886D', '#493628']
  },
  {
    id: 't-6',
    title: 'Porcelanato Grandes Formatos 120x240cm Calacatta Gold',
    category: 'Porcelanatos',
    imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    description: 'Bancadas e pisos contínuos com junta mínima de 1mm trazendo efeito monolítico.',
    tags: ['#PorcelanatoGiga', '#CalacattaGold', '#Monolítico', '#JuntaMínima'],
    palette: ['#F5F5F0', '#C5A880', '#534B4F', '#1F1F1F']
  }
];

export function ArchitecturalTrends({ onBack }: { onBack?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<TrendItem | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
      toast.success('Removido dos favoritos');
    } else {
      setFavorites([...favorites, id]);
      toast.success('Salvo nos seus favoritos!');
    }
  };

  const handleShare = (item: TrendItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`Confira esta tendência na CentralObra: ${item.title}`);
    toast.success('Link de inspiração copiado!');
  };

  const filteredTrends = INITIAL_TRENDS.filter(item => {
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} className="btn-secondary" style={{ width: 40, height: 40, borderRadius: 20, padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Hub de Tendências</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Inspiração de alto padrão para sua obra</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'var(--color-primary-alpha)', padding: '6px 12px', borderRadius: 20 }}>
          <Sparkles size={16} color="var(--color-primary)" />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>{favorites.length} Salvos</span>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
        <input 
          type="text"
          placeholder="Pesquisar por revestimento, iluminação, fachada..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', height: 48, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, paddingLeft: 44, paddingRight: 16, fontSize: 14, color: 'var(--text-main)' }}
        />
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 20, scrollbarWidth: 'none' }}>
        {TREND_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
              backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: selectedCategory === cat ? '#FFF' : 'var(--text-muted)',
              border: selectedCategory === cat ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trends Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filteredTrends.map(item => {
          const isFav = favorites.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="card-premium-interactive"
              style={{
                backgroundColor: 'var(--bg-surface)', borderRadius: 24, overflow: 'hidden',
                border: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'flex', flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden' }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
                  <button
                    onClick={e => handleShare(item, e)}
                    style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={e => toggleFavorite(item.id, e)}
                    style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: isFav ? 'var(--color-primary)' : 'rgba(0,0,0,0.6)', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Heart size={16} fill={isFav ? '#FFF' : 'none'} />
                  </button>
                </div>

                <span style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 12, backdropFilter: 'blur(4px)' }}>
                  {item.category}
                </span>
              </div>

              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6, lineHeight: 1.3 }}>{item.title}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.4 }}>{item.description}</p>
                </div>

                {/* Color Palette Spec */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {item.palette.map((color, idx) => (
                      <div key={idx} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: color, border: '1px solid rgba(255,255,255,0.2)' }} title={color} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={14} /> Detalhes
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {activeItem && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} onClick={() => setActiveItem(null)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: 600, borderRadius: 28, overflow: 'hidden', position: 'relative', zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}
            >
              <img src={activeItem.imageUrl} alt={activeItem.title} style={{ width: '100%', height: 260, objectFit: 'cover' }} />

              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>{activeItem.category}</span>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>{activeItem.title}</h2>
                  </div>
                  <button onClick={() => setActiveItem(null)} style={{ background: 'var(--bg-elevated)', border: 'none', width: 36, height: 36, borderRadius: 18, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft size={18} />
                  </button>
                </div>

                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>{activeItem.description}</p>

                {/* Palette */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Paleta de Cores e Materiais</h4>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {activeItem.palette.map((color, idx) => (
                      <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ height: 40, borderRadius: 12, backgroundColor: color, border: '1px solid var(--border-subtle)', marginBottom: 4 }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {activeItem.tags.map((tag, idx) => (
                    <span key={idx} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12 }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    toggleFavorite(activeItem.id, { stopPropagation: () => {} } as any);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', height: 48, borderRadius: 16, fontSize: 14, fontWeight: 700 }}
                >
                  <Heart size={18} fill={favorites.includes(activeItem.id) ? '#FFF' : 'none'} />
                  {favorites.includes(activeItem.id) ? 'Remover dos Favoritos' : 'Salvar Inspiração nos Favoritos'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
