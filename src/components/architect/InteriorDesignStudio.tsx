import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, LayoutDashboard, Layers, Columns, Compass, Image as ImageIcon, ShoppingCart, RefreshCw, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ArchitecturalTrends } from '../owner/ArchitecturalTrends';

type StudioTab = 'tendencias' | 'moodboards' | 'catalogo' | 'comparacao' | 'favoritos';

interface CatalogItem {
  id: string;
  name: string;
  brand: string;
  img: string;
  cat: string;
  basePrice?: number;
}

const CATALOG_DB: CatalogItem[] = [
  { id: '1', name: 'Porcelanato Calacatta Gold 120x120', brand: 'Portobello', img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80', cat: 'Revestimentos', basePrice: 289.90 },
  { id: '2', name: 'Misturador Monocomando Gold', brand: 'Deca', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', cat: 'Metais', basePrice: 1450.00 },
  { id: '3', name: 'Tinta Acrílica Fosca Algodão Egípcio', brand: 'Suvinil', img: 'https://images.unsplash.com/photo-1562259929-b7e181d8d007?auto=format&fit=crop&w=400&q=80', cat: 'Tintas', basePrice: 489.90 },
  { id: '4', name: 'Piso Vinílico Carvalho Hannover', brand: 'Tarkett', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80', cat: 'Pisos', basePrice: 125.50 },
  { id: '5', name: 'Torneira Gourmet DocolBistrô', brand: 'Docol', img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=400&q=80', cat: 'Metais', basePrice: 2150.00 },
  { id: '6', name: 'Revestimento Metrô White 10x20', brand: 'Eliane', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', cat: 'Revestimentos', basePrice: 89.90 },
  { id: '7', name: 'Cuba de Apoio Redonda Branca', brand: 'Celite', img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=400&q=80', cat: 'Louças', basePrice: 350.00 },
  { id: '8', name: 'Tinta Esmalte Sintético Preto', brand: 'Coral', img: 'https://images.unsplash.com/photo-1562259929-b7e181d8d007?auto=format&fit=crop&w=400&q=80', cat: 'Tintas', basePrice: 120.00 },
];

export function InteriorDesignStudio({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<StudioTab>('catalogo');
  const [apiPrices, setApiPrices] = useState<Record<string, { price: number; store: string }>>({});
  const [isPricing, setIsPricing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  const TABS = [
    { id: 'catalogo', label: 'Catálogo de API', icon: Layers },
    { id: 'moodboards', label: 'Moodboards', icon: LayoutDashboard },
    { id: 'tendencias', label: 'Tendências', icon: Compass },
    { id: 'comparacao', label: 'Comparação', icon: Columns },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
  ] as const;

  const MATERIAL_CATEGORIES = [
    'Revestimentos', 'Pisos', 'Tintas', 'Marcenaria', 'Metais', 'Louças', 'Decoração'
  ];

  // Simulate API fetching for real-time prices
  const fetchLivePrices = () => {
    setIsPricing(true);
    toast('Consultando APIs de lojistas...', { icon: '🔄' });
    
    setTimeout(() => {
      const stores = ['Leroy Merlin', 'Telhanorte', 'C&C', 'Obramax'];
      const newPrices: Record<string, { price: number; store: string }> = {};
      
      CATALOG_DB.forEach(item => {
        const variance = (Math.random() * 0.2) - 0.1; // +/- 10%
        const livePrice = (item.basePrice || 100) * (1 + variance);
        const store = stores[Math.floor(Math.random() * stores.length)];
        newPrices[item.id] = { price: livePrice, store };
      });
      
      setApiPrices(newPrices);
      setIsPricing(false);
      toast.success('Preços atualizados em tempo real via API!');
    }, 2000);
  };

  useEffect(() => {
    fetchLivePrices();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(f => f !== id);
      if (prev.length >= 3) {
        toast.error('Máximo de 3 itens na comparação.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const formatPrice = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 24px 20px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} className="btn-secondary" style={{ width: 40, height: 40, borderRadius: 20, padding: 0 }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Studio de Interiores</h1>
            <p style={{ fontSize: 13, color: 'var(--color-primary)', margin: 0, fontWeight: 600 }}>API de Materiais em Tempo Real</p>
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
              display: 'flex', alignItems: 'center', gap: 6,
              position: 'relative'
            }}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.id === 'comparacao' && compareList.length > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--color-danger)', color: '#fff', fontSize: 10, width: 16, height: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {compareList.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 60 }}>
        <AnimatePresence mode="wait">
          
          {/* TENDÊNCIAS */}
          {activeTab === 'tendencias' && (
            <motion.div key="tendencias" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ margin: '-24px -20px' }}>
                 <ArchitecturalTrends />
              </div>
            </motion.div>
          )}

          {/* CATÁLOGO DE MATERIAIS */}
          {activeTab === 'catalogo' && (
            <motion.div key="catalogo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>Marcas Integradas API</h3>
                <button onClick={fetchLivePrices} disabled={isPricing} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 12, display: 'flex', gap: 6 }}>
                  <RefreshCw size={14} className={isPricing ? "animate-spin" : ""} />
                  Atualizar Preços
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
                {MATERIAL_CATEGORIES.map(cat => (
                  <div key={cat} className="card-premium" style={{ padding: 16, textAlign: 'center', cursor: 'pointer' }} onClick={() => toast.success(`Filtrando biblioteca de ${cat}...`)}>
                    <ImageIcon size={24} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{cat}</div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {CATALOG_DB.map((item) => {
                  const apiData = apiPrices[item.id];
                  return (
                    <div key={item.id} className="card-premium" style={{ overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', height: 160, backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Heart size={16} color={favorites.includes(item.id) ? "var(--color-danger)" : "var(--text-muted)"} fill={favorites.includes(item.id) ? "var(--color-danger)" : "transparent"} />
                        </button>
                        <span style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 8 }}>
                          {item.brand}
                        </span>
                      </div>
                      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>{item.cat}</span>
                        <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 8px 0', lineHeight: 1.3 }}>{item.name}</h4>
                        
                        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                          {isPricing || !apiData ? (
                            <div style={{ height: 36, display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 12, gap: 6 }}>
                              <RefreshCw size={12} className="animate-spin" /> Buscando API...
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--color-primary)' }}>{formatPrice(apiData.price)}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Info size={10} /> {apiData.store} (Agora)
                              </div>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button 
                            onClick={() => toggleCompare(item.id)}
                            className="btn-secondary" 
                            style={{ flex: 1, padding: '8px', fontSize: 12, borderRadius: 8, border: compareList.includes(item.id) ? '1px solid var(--color-primary)' : undefined, color: compareList.includes(item.id) ? 'var(--color-primary)' : undefined }}
                          >
                            {compareList.includes(item.id) ? 'Comparando' : 'Comparar'}
                          </button>
                          <button onClick={() => toast.success('Adicionado à lista de compras')} className="btn-primary" style={{ padding: '8px 12px', borderRadius: 8 }}>
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              {compareList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg-elevated)', borderRadius: 16 }}>
                  <Columns size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Comparador de API</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Selecione até 3 itens do catálogo para comparar preços em tempo real.</p>
                  <button onClick={() => setActiveTab('catalogo')} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: 12 }}>Ir para Catálogo</button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                     <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>Comparando {compareList.length} itens</h3>
                     <button onClick={() => setCompareList([])} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8 }}>Limpar</button>
                  </div>
                  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
                     {compareList.map(id => {
                       const item = CATALOG_DB.find(c => c.id === id);
                       const priceData = apiPrices[id];
                       if (!item) return null;
                       return (
                         <div key={id} className="card-premium" style={{ minWidth: 200, flexShrink: 0, padding: 16 }}>
                            <div style={{ height: 100, backgroundImage: `url(${item.img})`, backgroundSize: 'cover', borderRadius: 8, marginBottom: 12 }} />
                            <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>{item.name}</h4>
                            <p style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 700, margin: '4px 0' }}>{item.brand}</p>
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)' }}>{priceData ? formatPrice(priceData.price) : '...'}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>via {priceData?.store || 'API'}</div>
                            </div>
                         </div>
                       )
                     })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* FAVORITOS */}
          {activeTab === 'favoritos' && (
            <motion.div key="favoritos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg-elevated)', borderRadius: 16 }}>
                  <Heart size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Seus Favoritos</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Você ainda não adicionou nenhum material ou referência aos favoritos.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {favorites.map(id => {
                    const item = CATALOG_DB.find(c => c.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="card-premium" style={{ display: 'flex', gap: 12, padding: 12 }}>
                        <div style={{ width: 60, height: 60, borderRadius: 8, backgroundImage: `url(${item.img})`, backgroundSize: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0', lineHeight: 1.2 }}>{item.name}</h4>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.brand}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
