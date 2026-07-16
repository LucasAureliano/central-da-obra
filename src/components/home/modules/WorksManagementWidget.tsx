import { motion } from 'framer-motion';
import { Building, ChevronRight, Activity, Users, PenTool } from 'lucide-react';
import { useWorks } from '../../../contexts/WorksContext';

export function WorksManagementWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
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
            <Building size={24} color="#FFF" />
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFF', margin: 0, lineHeight: 1.2 }}>Obras Ativas</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Gestão centralizada ({works.length})</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('centro-operacoes')}
          style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', opacity: 0.8 }}
        >
          Centro de Operações <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Activity size={18} color="#FFF" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#FFF' }}>{works.length}</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>Em Andamento</span>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <PenTool size={18} color="#FFF" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#FFF' }}>0</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>Em Aprovação</span>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Users size={18} color="#FFF" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#FFF' }}>2</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>Equipes Ativas</span>
        </div>
      </div>
      
      <button 
        className="btn-primary" 
        style={{ width: '100%', borderRadius: 12, fontSize: 14, backgroundColor: '#FFF', color: 'var(--color-primary)' }}
        onClick={() => onNavigate('centro-operacoes')}
      >
        Acessar Centro de Operações
      </button>
    </motion.div>
  );
}
