import { motion } from 'framer-motion';
import { Users, ChevronRight, Activity, Calendar } from 'lucide-react';

export function TeamsWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.3 }}
      className="glass-panel" 
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={18} color="#F59E0B" />
          Gestão de Equipes
        </h3>
        <button 
          onClick={() => onNavigate('rh-produtividade')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Acessar RH <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: 12, backgroundColor: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Activity size={18} color="#F59E0B" />
          </div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>Apontamentos</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Módulo em desenvolvimento</span>
          </div>
        </div>
        <div style={{ padding: 12, backgroundColor: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Calendar size={18} color="#3B82F6" />
          </div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>Cronograma de RH</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Alocação de mão de obra</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
