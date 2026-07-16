import { motion } from 'framer-motion';
import { DollarSign, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useWorks } from '../../../contexts/WorksContext';

export function CorporateFinanceWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { works } = useWorks();

  const totalBudget = works.reduce((acc, work) => acc + (work.budget || 0), 0);
  const totalSpent = works.reduce((acc, work) => acc + (work.spent || 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.2 }}
      className="glass-panel" 
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <DollarSign size={18} color="#10B981" />
          Financeiro Corporativo
        </h3>
        <button 
          onClick={() => onNavigate('financeiro')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Relatórios <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Orçamento Global</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>R$ {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Custo Global</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#EF4444' }}>R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button 
          onClick={() => onNavigate('financeiro')}
          className="btn-secondary" 
          style={{ flex: 1, borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <TrendingDown size={16} /> Custos
        </button>
        <button 
          onClick={() => onNavigate('financeiro')}
          className="btn-secondary" 
          style={{ flex: 1, borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <TrendingUp size={16} /> Receitas
        </button>
      </div>
    </motion.div>
  );
}
