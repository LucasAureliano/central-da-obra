import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { useInsights } from '../../hooks/useInsights';
import type { InsightCategory } from '../../hooks/useInsights';
import { InsightCard } from './InsightCard';

export function InsightsCentral({ onBack, onNavigate }: { onBack: () => void, onNavigate: (route: string) => void }) {
  const { insights } = useInsights();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<InsightCategory | 'all'>('all');

  const filters: { id: InsightCategory | 'all', label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'finance', label: 'Financeiro' },
    { id: 'shopping', label: 'Compras' },
    { id: 'schedule', label: 'Cronograma' },
    { id: 'calculator', label: 'Calculadoras' },
    { id: 'work', label: 'Obra' },
    { id: 'safety', label: 'Segurança' },
    { id: 'technical', label: 'Central Técnica' },
  ];

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(search.toLowerCase()) || 
                          insight.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || insight.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="screen-content" style={{ padding: '24px 20px 0 20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 8, marginLeft: -8 }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Central de Insights</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Análises inteligentes da sua obra</p>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
        <input
          type="text"
          placeholder="Pesquisar insights..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-premium"
          style={{ width: '100%', paddingLeft: 44 }}
        />
      </div>

      <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }}>
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
              backgroundColor: activeFilter === f.id ? 'var(--color-primary)' : 'var(--bg-elevated)',
              color: activeFilter === f.id ? '#FFF' : 'var(--text-muted)',
              border: activeFilter === f.id ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredInsights.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum insight encontrado para os filtros atuais.
          </div>
        ) : (
          <AnimatePresence>
            {filteredInsights.map(insight => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <InsightCard insight={insight} onClickAction={onNavigate} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
