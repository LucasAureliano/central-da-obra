import { motion } from 'framer-motion';
import type { Insight } from '../../hooks/useInsights';
import { ChevronRight } from 'lucide-react';

export function InsightCard({ insight, onClickAction }: { insight: Insight; onClickAction: (route: string) => void }) {
  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'critical': return { bg: 'var(--color-danger-alpha)', color: 'var(--color-danger)', border: 'var(--color-danger)' };
      case 'high': return { bg: '#FEF3C7', color: '#F59E0B', border: '#F59E0B' };
      case 'medium': return { bg: '#E0F2FE', color: '#3B82F6', border: '#3B82F6' };
      case 'info':
      default: return { bg: 'var(--color-success-alpha)', color: 'var(--color-success)', border: 'var(--color-success)' };
    }
  };

  const colors = getPriorityColors(insight.priority);

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="glass-panel"
      style={{
        padding: 20,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        borderLeft: `4px solid ${colors.border}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          backgroundColor: colors.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          {insight.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{insight.title}</h4>
            <span style={{ fontSize: 11, fontWeight: 600, color: colors.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {insight.priority}
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            {insight.description}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <button 
          onClick={() => onClickAction(insight.actionRoute)}
          style={{
            background: 'none', border: 'none', color: 'var(--color-primary)',
            fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
            cursor: 'pointer', padding: '6px 12px', borderRadius: 8,
            backgroundColor: 'var(--color-primary-alpha)'
          }}
        >
          {insight.suggestedAction}
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
