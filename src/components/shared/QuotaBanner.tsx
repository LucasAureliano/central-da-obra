import React, { useState } from 'react';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { motion, AnimatePresence } from 'framer-motion';

interface QuotaBannerProps {
  onNavigate?: (tab: string) => void;
}

export const QuotaBanner: React.FC<QuotaBannerProps> = ({ onNavigate }) => {
  const { quotaAlerts } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || quotaAlerts.length === 0) return null;

  const worst = quotaAlerts.reduce((a, b) => a.pct > b.pct ? a : b);
  const isCritical = worst.pct >= 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          margin: '12px 16px 0',
          padding: '12px 14px',
          borderRadius: 14,
          background: isCritical ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
          border: `1px solid ${isCritical ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <AlertTriangle size={18} color={isCritical ? '#EF4444' : '#F59E0B'} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
            {isCritical ? `Limite de ${worst.resource} atingido!` : `${worst.resource}: ${worst.used}/${worst.limit} usados`}
          </span>
          {!isCritical && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>
              ({Math.round(worst.pct * 100)}%)
            </span>
          )}
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('planos')}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Ver Planos <ChevronRight size={14} />
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 8 }}
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
