import { useState, useMemo, useEffect } from 'react';
import { Search, Compass, FileText, ChevronRight, Star } from 'lucide-react';
import { TECHNICAL_ARTICLES, CATEGORIES, type TechnicalArticle } from '../../data/technicalLibrary';
import { ArticleView } from './ArticleView';

interface TechnicalCentralProps {
  initialArticleId?: string;
  onNavigate: (tab: string, param?: string) => void;
}

export function TechnicalCentral({ initialArticleId, onNavigate }: TechnicalCentralProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeArticle, setActiveArticle] = useState<TechnicalArticle | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('co_tech_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('co_tech_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  useEffect(() => {
    if (initialArticleId) {
      const article = TECHNICAL_ARTICLES.find(a => a.id === initialArticleId);
      if (article) {
        setActiveArticle(article);
      }
    }
  }, [initialArticleId]);

  // Enhanced Search Engine
  const filteredArticles = useMemo(() => {
    let filtered = TECHNICAL_ARTICLES;

    if (selectedCategory === 'Favoritos') {
      filtered = filtered.filter(a => favorites.includes(a.id));
    } else if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(a => a.category === selectedCategory || a.subcategories.includes(selectedCategory));
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(a => {
        const titleMatch = a.title.toLowerCase().includes(query);
        const categoryMatch = a.category.toLowerCase().includes(query);
        const summaryMatch = a.summary.toLowerCase().includes(query);
        const keywordMatch = a.metadata.keywords.some(k => k.toLowerCase().includes(query));
        const synonymMatch = a.metadata.synonyms.some(s => s.toLowerCase().includes(query));
        
        // Deep search fields
        const materialsMatch = a.related.materials.some(m => m.toLowerCase().includes(query));
        const normsMatch = a.related.norms?.some(n => n.id.toLowerCase().includes(query) || n.name.toLowerCase().includes(query));
        const calcMatch = a.related.calculators.some(c => c.toLowerCase().includes(query));
        const toolsMatch = a.content.toolsNeeded.some(t => t.toLowerCase().includes(query));
        const problemsMatch = (a.related.problems || []).some(p => p.toLowerCase().includes(query));

        return titleMatch || categoryMatch || summaryMatch || keywordMatch || synonymMatch ||
               materialsMatch || normsMatch || calcMatch || toolsMatch || problemsMatch;
      });
    }

    return filtered;
  }, [search, selectedCategory, favorites]);

  const popularSuggestions = ['Concreto', 'Chuveiro', 'Pintura', 'Infiltração', 'NBR 6118'];

  if (activeArticle) {
    return (
      <ArticleView 
        article={activeArticle} 
        onBack={() => setActiveArticle(null)}
        onNavigateToCalc={(calcId) => onNavigate('calculators', calcId)}
        onNavigateToArticle={(articleId) => {
          const art = TECHNICAL_ARTICLES.find(a => a.id === articleId);
          if (art) setActiveArticle(art);
        }}
        isFavorite={favorites.includes(activeArticle.id)}
        onToggleFavorite={() => toggleFavorite(activeArticle.id)}
      />
    );
  }

  const allCategories = ['Todos', 'Favoritos', ...CATEGORIES.filter(c => c !== 'Todos')];

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: 120 }}>
      <div style={{ padding: '24px 20px', backgroundColor: 'var(--color-primary)', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 24, color: '#fff' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Compass size={28} /> Central Técnica
        </h1>
        <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 24 }}>
          Sua base de conhecimento inteligente para construção civil.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
          <input 
            type="text"
            placeholder="Ex: Como misturar concreto, NBR 5410..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', 
              height: 56, 
              borderRadius: 28, 
              paddingLeft: 48, 
              paddingRight: 16,
              border: 'none',
              fontSize: 16,
              fontWeight: 500,
              backgroundColor: '#fff',
              color: '#333',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        
        {/* Categories (Chips) */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, margin: '0 -20px 16px', paddingLeft: 20, paddingRight: 20, scrollbarWidth: 'none' }}>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 100,
                border: 'none',
                backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--bg-glass)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-main)',
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: selectedCategory === cat ? '0 4px 12px var(--color-primary-alpha)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat === 'Favoritos' && <Star size={16} fill={selectedCategory === cat ? '#fff' : 'transparent'} />}
              {cat}
            </button>
          ))}
        </div>

        {/* Popular Suggestions */}
        {!search && selectedCategory === 'Todos' && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase' }}>
              Buscas Populares
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {popularSuggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setSearch(s)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <div 
                key={article.id} 
                onClick={() => setActiveArticle(article)}
                className="glass-panel card-premium-interactive animate-slide-up" 
                style={{ padding: 20, borderRadius: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-alpha)', padding: '4px 8px', borderRadius: 8 }}>
                    {article.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {article.category === 'Normas' && <FileText size={18} color="var(--text-muted)" />}
                    <button 
                      onClick={(e) => toggleFavorite(article.id, e)}
                      style={{ 
                        background: 'none', border: 'none', padding: 4, cursor: 'pointer',
                        color: favorites.includes(article.id) ? '#F59E0B' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Star size={20} fill={favorites.includes(article.id) ? '#F59E0B' : 'transparent'} />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4, paddingRight: 24 }}>{article.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {article.summary}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Search size={32} opacity={0.5} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)' }}>Nenhum resultado encontrado</p>
              <p style={{ fontSize: 14 }}>Tente usar palavras mais genéricas como "Concreto" ou "Parede".</p>
              <button 
                onClick={() => { setSearch(''); setSelectedCategory('Todos'); }}
                className="btn-secondary"
                style={{ marginTop: 24, padding: '8px 24px', borderRadius: 100 }}
              >
                Limpar Busca
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
