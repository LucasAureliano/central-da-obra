import { motion } from 'framer-motion';
import { useConstructionIndexes } from '../../../hooks/useConstructionIndexes';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { Skeleton } from '../../ui/Skeleton';

export function MarketIndexesWidget() {
  const { indexes, loading, error } = useConstructionIndexes();

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }} className="hide-scrollbar">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} width={140} height={80} borderRadius={16} variant="glass" style={{ flexShrink: 0 }} />
        ))}
      </div>
    );
  }

  if (error || !indexes || indexes.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.05 }} 
      style={{ marginBottom: 24 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Activity size={18} color="var(--color-primary)" />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
          Índices de Mercado (Ao Vivo)
        </h3>
      </div>
      
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }} className="hide-scrollbar">
        {indexes.map(index => {
          const isPositive = index.variation > 0;
          const isNeutral = index.variation === 0;
          const color = isPositive ? '#ef4444' : isNeutral ? 'var(--text-muted)' : '#22c55e'; // For inflation/costs, positive is bad (red)
          const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
          
          return (
            <div 
              key={index.name} 
              className="glass-panel" 
              style={{ padding: '12px 16px', borderRadius: 16, minWidth: 140, display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{index.name}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>
                  {index.value.toLocaleString('pt-BR')}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Icon size={12} />
                  {Math.abs(index.variation).toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
