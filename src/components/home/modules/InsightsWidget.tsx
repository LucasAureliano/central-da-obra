import { motion } from 'framer-motion';
import { useInsights } from '../../../hooks/useInsights';
import { InsightCard } from '../../insights/InsightCard';
import { Lightbulb, ChevronRight } from 'lucide-react';

export function InsightsWidget({ onNavigate }: { onNavigate: (route: string) => void }) {
  const { insights } = useInsights();

  if (insights.length === 0) return null;

  const topInsights = insights.slice(0, 3); // Max 3 insights to keep it clean

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.1 }} 
      style={{ marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lightbulb size={20} color="var(--color-primary)" />
          Insights da Obra
        </h3>
        <button 
          onClick={() => onNavigate('insights')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver todos <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {topInsights.map(insight => (
          <InsightCard key={insight.id} insight={insight} onClickAction={onNavigate} />
        ))}
      </div>
    </motion.div>
  );
}
