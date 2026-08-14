import { motion } from 'framer-motion';
import { Plus, GripVertical } from 'lucide-react';

interface DashboardWorksProps {
  isGuest: boolean;
  profile: any;
  works: any[];
  onNavigate: (tab: string) => void;
}

export function DashboardWorks({ isGuest, profile, works, onNavigate }: DashboardWorksProps) {
  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
      <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'var(--text-muted)' }}>
        <GripVertical size={20} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Obras Recentes</h2>
        {!isGuest && works.length > 0 && (
          <button onClick={() => onNavigate('obras')} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Ver todas
          </button>
        )}
      </div>

      {isGuest ? (
        <div style={{ padding: 24, borderRadius: 16, textAlign: 'center', backgroundColor: 'var(--bg-base)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Crie uma conta para salvar obras</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>No modo visitante, o salvamento de projetos está desativado.</p>
          <motion.button 
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onNavigate('menu')}
          >
            Fazer Cadastro Gratuito
          </motion.button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory' }}>
          {profile?.role !== 'owner' && (
            <motion.div 
              whileHover={{ scale: 0.98, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('obras')}
              style={{ minWidth: 140, height: 160, borderRadius: 20, border: '2px dashed var(--color-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: 'var(--color-primary-alpha)', cursor: 'pointer', scrollSnapAlign: 'start' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} color="#FFF" />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 14 }}>Nova Obra</span>
            </motion.div>
          )}

          {works.map((work) => (
            <motion.div 
              key={work.id} 
              whileHover={{ scale: 0.98, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('obras')}
              style={{ minWidth: 240, height: 160, padding: 20, borderRadius: 20, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', scrollSnapAlign: 'start' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: (work.progress || 0) > 30 ? '#10B981' : '#F59E0B' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{work.status || 'Em andamento'}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{work.name}</h3>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progresso</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>
                    <span>{work.progress || 0}</span>%
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${work.progress || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 3 }} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
