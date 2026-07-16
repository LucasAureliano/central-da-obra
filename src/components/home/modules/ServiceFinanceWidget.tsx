import { motion } from 'framer-motion';
import { DollarSign, ChevronRight, TrendingUp } from 'lucide-react';
import { useWorks } from '../../../contexts/WorksContext';

export function ServiceFinanceWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { works } = useWorks();
  
  // Fake calculation based on works
  const totalReceivables = works.reduce((acc, work) => acc + ((work.budget || 0) - (work.spent || 0)), 0);
  const totalReceived = works.reduce((acc, work) => acc + (work.spent || 0), 0); // Mock received as spent for now

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
          <DollarSign size={18} color="#10B981" />
          Recebimentos
        </h3>
        <button 
          onClick={() => onNavigate('financeiro')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Mais <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>A Receber (Mês)</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#10B981' }}>R$ {Math.max(0, totalReceivables).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Já Recebido</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <button 
        onClick={() => onNavigate('financeiro')}
        className="btn-secondary" 
        style={{ width: '100%', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <TrendingUp size={16} /> Registrar Recebimento
      </button>
    </motion.div>
  );
}
