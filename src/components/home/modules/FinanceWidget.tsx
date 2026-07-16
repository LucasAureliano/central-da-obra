import { motion } from 'framer-motion';
import { DollarSign, ChevronRight, TrendingDown } from 'lucide-react';
import { useWorks } from '../../../contexts/WorksContext';

export function FinanceWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { activeWork } = useWorks();
  
  if (!activeWork) return null;

  const budget = activeWork.budget || 0;
  const spent = activeWork.spent || 0;
  const balance = budget - spent;
  const percent = budget > 0 ? (spent / budget) * 100 : 0;

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
          Financeiro
        </h3>
        <button 
          onClick={() => onNavigate('financeiro')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Mais <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Orçamento</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>R$ {budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Total Gasto</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#EF4444' }}>R$ {spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Saldo Disponível</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: balance >= 0 ? '#10B981' : '#EF4444' }}>
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div style={{ height: 8, backgroundColor: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percent, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ 
              height: '100%', 
              backgroundColor: percent > 90 ? '#EF4444' : percent > 70 ? '#F59E0B' : '#10B981',
              borderRadius: 4
            }}
          />
        </div>
      </div>

      <button 
        onClick={() => onNavigate('financeiro')}
        className="btn-secondary" 
        style={{ width: '100%', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <TrendingDown size={16} /> Adicionar Despesa
      </button>
    </motion.div>
  );
}
