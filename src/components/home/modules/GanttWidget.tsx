import { motion } from 'framer-motion';
import { Calendar, ChevronRight, CheckCircle, Activity } from 'lucide-react';

export function GanttWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.25 }}
      className="glass-panel" 
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={18} color="#3B82F6" />
          Cronograma Geral
        </h3>
        <button 
          onClick={() => onNavigate('cronograma-geral')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Gantt <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: 12, backgroundColor: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <CheckCircle size={18} color="#10B981" />
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', display: 'block' }}>12</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Obras no Prazo</span>
          </div>
        </div>
        <div style={{ padding: 12, backgroundColor: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Activity size={18} color="#EF4444" />
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', display: 'block' }}>3</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Obras Atrasadas</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
