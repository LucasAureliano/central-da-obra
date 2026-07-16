import { motion } from 'framer-motion';
import { Briefcase, Plus, FileSignature, CheckSquare, ChevronRight } from 'lucide-react';
import { useWorks } from '../../../contexts/WorksContext';

export function ProjectsWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { works } = useWorks();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.15 }}
      className="glass-panel card-mesh-gradient" 
      style={{ padding: 24, borderRadius: 24, marginBottom: 24, position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} color="#FFF" />
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFF', margin: 0, lineHeight: 1.2 }}>Gestão de Projetos</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{works.length} obra(s) ativas</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('controle-projetos')}
          style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', opacity: 0.8 }}
        >
          Painel de Projetos <ChevronRight size={14} />
        </button>
      </div>

      <button 
        className="btn-primary" 
        style={{ width: '100%', borderRadius: 12, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, backgroundColor: '#FFF', color: 'var(--color-primary)' }}
        onClick={() => onNavigate('controle-projetos')}
      >
        <Plus size={18} /> Novo Projeto
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button 
          onClick={() => onNavigate('pendencias-tecnicas')}
          style={{ padding: '12px 0', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <CheckSquare size={16} /> Pendências
        </button>
        <button 
          onClick={() => onNavigate('relatorios')}
          style={{ padding: '12px 0', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <FileSignature size={16} /> Relatórios
        </button>
      </div>
    </motion.div>
  );
}
