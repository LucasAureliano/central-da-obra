import { motion } from 'framer-motion';
import { Activity, Calculator, Users, Target } from 'lucide-react';

interface DashboardQuickActionsProps {
  onNavigate: (tab: string) => void;
  containerVariants: any;
  itemVariants: any;
}

export function DashboardQuickActions({ onNavigate, containerVariants, itemVariants }: DashboardQuickActionsProps) {
  return (
    <motion.div 
      variants={containerVariants}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}
    >
      <motion.div variants={itemVariants} className="btn-action glass-panel" onClick={() => onNavigate('financeiro')}>
        <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
          <Activity size={24} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Gastos</span>
      </motion.div>

      <motion.div variants={itemVariants} className="btn-action glass-panel" onClick={() => onNavigate('library')}>
        <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
          <Calculator size={24} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Calc</span>
      </motion.div>

      <motion.div variants={itemVariants} className="btn-action glass-panel" onClick={() => onNavigate('equipe')}>
        <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
          <Users size={24} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Equipe</span>
      </motion.div>

      <motion.div variants={itemVariants} className="btn-action glass-panel" onClick={() => onNavigate('relatorios')}>
        <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
          <Target size={24} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Relatórios</span>
      </motion.div>
    </motion.div>
  );
}
