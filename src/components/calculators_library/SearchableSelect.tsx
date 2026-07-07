import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  icon?: React.ReactNode;
  tags?: { text: string; color?: string }[];
  isRecent?: boolean;
  isFavorite?: boolean;
}

interface SearchableSelectProps {
  options: SelectOption[];
  selectedId?: string;
  onSelect: (option: SelectOption) => void;
  onCustomSelect?: () => void;
  searchPlaceholder?: string;
}

export function SearchableSelect({
  options,
  selectedId,
  onSelect,
  onCustomSelect,
  searchPlaceholder = 'Pesquisar...'
}: SearchableSelectProps) {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const query = normalize(search);
    return options.filter(opt => 
      normalize(opt.title).includes(query) || 
      (opt.subtitle && normalize(opt.subtitle).includes(query)) ||
      (opt.category && normalize(opt.category).includes(query))
    );
  }, [options, search]);

  const categories = useMemo(() => {
    if (search) {
      // If searching, just show a flat list or grouped by category but all expanded
      const groups: Record<string, SelectOption[]> = {};
      filteredOptions.forEach(opt => {
        const cat = opt.category || 'Outros';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(opt);
      });
      return groups;
    }

    // Default grouping
    const groups: Record<string, SelectOption[]> = {};
    
    const favorites = options.filter(o => o.isFavorite);
    if (favorites.length > 0) groups['⭐ Mais Utilizados'] = favorites;
    
    const recents = options.filter(o => o.isRecent);
    if (recents.length > 0) groups['🕒 Utilizados Recentemente'] = recents;

    options.forEach(opt => {
      // Skip duplicating favorites/recents in their main category if we want, or keep them.
      // We will keep them in both places for standard UX, or maybe not. Let's keep them.
      const cat = opt.category || 'Outros';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(opt);
    });

    return groups;
  }, [options, filteredOptions, search]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} style={{ backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)' }}>{part}</span> : part
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Sticky Search Bar */}
      <div style={{ position: 'sticky', top: 80, zIndex: 5, backgroundColor: 'var(--bg-main)', paddingBottom: 8 }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: 16,
              outline: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          />
        </div>
      </div>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.entries(categories).map(([catName, opts]) => {
          const isExpanded = search ? true : (expandedCategories[catName] !== false);
          
          return (
            <div key={catName} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Category Header */}
              <button 
                onClick={() => toggleCategory(catName)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <h4 style={{ fontSize: 16, fontWeight: 700 }}>{catName}</h4>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {/* Category Items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    {opts.map(opt => {
                      const isSelected = selectedId === opt.id;
                      return (
                        <button
                          key={`${catName}-${opt.id}`}
                          onClick={() => onSelect(opt)}
                          className={isSelected ? 'glass-panel card-premium-interactive' : 'card-premium-interactive'}
                          style={{
                            padding: 16,
                            borderRadius: 16,
                            backgroundColor: isSelected ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                            border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {opt.icon && (
                            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-elevated)', color: isSelected ? '#fff' : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {opt.icon}
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <h5 style={{ fontSize: 16, fontWeight: 700, color: isSelected ? 'var(--color-primary)' : 'var(--text-main)', marginBottom: 2 }}>
                              {highlightMatch(opt.title, search)}
                            </h5>
                            {opt.subtitle && (
                              <p style={{ fontSize: 13, color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                                {highlightMatch(opt.subtitle, search)}
                              </p>
                            )}
                          </div>
                          {opt.tags && (
                            <div style={{ display: 'flex', gap: 8 }}>
                              {opt.tags.map((tag, i) => (
                                <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 999, backgroundColor: tag.color || 'var(--bg-elevated)', color: 'var(--text-main)' }}>
                                  {tag.text}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredOptions.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', borderRadius: 16 }}>
            Nenhum resultado encontrado para "{search}"
          </div>
        )}

        {/* Custom Option Fallback */}
        {onCustomSelect && (
          <button 
            onClick={onCustomSelect}
            className="card-premium-interactive"
            style={{
              padding: 16,
              borderRadius: 16,
              backgroundColor: 'var(--bg-surface)',
              border: '1px dashed var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              marginTop: 8
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusCircle size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h5 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Não encontrei o que procuro</h5>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Inserir material ou rendimento manualmente (Outro/Personalizado)</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
