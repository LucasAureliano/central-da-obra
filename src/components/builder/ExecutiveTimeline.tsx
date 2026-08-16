import React, { useState, useEffect } from 'react';
import { ChevronRight, Activity, Building, TrendingUp, Trash2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export const ExecutiveTimeline: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadWorks();
  }, [user]);

  const loadWorks = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'works'), where('userId', '==', user?.uid));
      const snap = await getDocs(q);
      const worksData = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setSchedules(worksData.map(w => ({
        id: w.id,
        workName: w.name,
        status: w.progress === 100 ? 'Em dia' : (w.progress > 50 ? 'Adiantado' : 'Atrasado'),
        progress: w.progress || 0,
        deadline: w.deadline || 'N?o definido'
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Em dia': return '#10B981';
      case 'Adiantado': return '#3B82F6';
      case 'Atrasado': return '#EF4444';
      default: return 'var(--text-muted)';
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta obra e todo seu cronograma?')) {
      try {
        await deleteDoc(doc(db, 'works', id));
        loadWorks();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Cronograma Geral</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Vis?o macro de todas as suas obras</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16, textAlign: 'center' }}>
          <Building size={20} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)' }}>{schedules.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Obras Ativas</div>
        </div>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16, textAlign: 'center' }}>
          <TrendingUp size={20} color="#10B981" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)' }}>{schedules.filter(s => s.status !== 'Atrasado').length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No Prazo</div>
        </div>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16, textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <Activity size={20} color="#EF4444" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)' }}>{schedules.filter(s => s.status === 'Atrasado').length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Atrasadas</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
           <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Carregando cronogramas...</p>
        ) : schedules.length === 0 ? (
           <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Nenhuma obra cadastrada.</p>
        ) : schedules.map(schedule => (
          <motion.div 
            key={schedule.id}
            drag="x"
            dragConstraints={{ left: -80, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -50) handleDelete(schedule.id);
            }}
            className="glass-panel" 
            style={{ padding: 16, borderRadius: 16, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{schedule.workName}</h3>
                <span style={{ fontSize: 12, fontWeight: 600, color: getStatusColor(schedule.status), padding: '2px 8px', backgroundColor: `${getStatusColor(schedule.status)}20`, borderRadius: 8, display: 'inline-block', marginTop: 4 }}>
                  Progresso: {schedule.progress}%
                </span>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                 <ChevronRight size={20} color="var(--text-muted)" />
                 <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Deslize para excluir</span>
              </div>
            </div>
            
            {/* Background Red Indicator for Delete */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: -80, width: 80, backgroundColor: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <Trash2 size={24} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
