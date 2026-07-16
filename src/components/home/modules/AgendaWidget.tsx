import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Clock, MapPin } from 'lucide-react';

export function AgendaWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  // Mock data as Agenda module is not fully developed yet.
  const todayVisits = [
    { id: 1, client: 'João Silva', time: '14:30', address: 'Rua das Flores, 123', type: 'Vistoria' }
  ];

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
          <Calendar size={18} color="#3B82F6" />
          Agenda Hoje
        </h3>
        <button 
          onClick={() => onNavigate('agenda-completa')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Agenda <ChevronRight size={14} />
        </button>
      </div>

      {todayVisits.length === 0 ? (
        <div style={{ padding: 16, backgroundColor: 'var(--bg-elevated)', borderRadius: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          Sem compromissos agendados para hoje.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {todayVisits.map(v => (
            <div key={v.id} style={{ padding: 12, backgroundColor: 'var(--bg-elevated)', borderRadius: 12, borderLeft: '3px solid #3B82F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{v.client}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {v.time}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <MapPin size={12} /> {v.address}
              </span>
              <span style={{ fontSize: 11, padding: '2px 8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderRadius: 8, display: 'inline-block' }}>
                {v.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
