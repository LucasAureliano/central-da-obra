import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, RefreshCw, BarChart3 } from 'lucide-react';
import { constructionIndexesService, type ConstructionIndex } from '../../services/construction/ConstructionIndexesService';
import { formatCurrency } from '../../utils/formatters';

export function ConstructionIndexesWidget({ onNavigate: _onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [indexes, setIndexes] = useState<ConstructionIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await constructionIndexesService.getIndexes();
      setIndexes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Índices da Construção</h3>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Atualização oficial BCB / IBGE / Sinduscon</span>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div className="skeleton-glass" style={{ height: 70, borderRadius: 14 }} />
          <div className="skeleton-glass" style={{ height: 70, borderRadius: 14 }} />
          <div className="skeleton-glass" style={{ height: 70, borderRadius: 14 }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {indexes.map((idxItem) => (
            <div
              key={idxItem.name}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                padding: '12px 14px',
                borderRadius: 16,
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)' }}>{idxItem.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: idxItem.variation >= 0 ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingUp size={10} /> {idxItem.variation >= 0 ? `+${idxItem.variation}%` : `${idxItem.variation}%`}
                </span>
              </div>

              <div>
                <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)' }}>
                  {idxItem.unit === 'R$/m²' ? `${formatCurrency(idxItem.value)}` : idxItem.name === 'SELIC' ? `${idxItem.value}%` : idxItem.value.toLocaleString('pt-BR')}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                  {idxItem.unit || 'pontos'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
