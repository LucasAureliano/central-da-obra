import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Calendar, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/formatters';

interface PortalScheduleProps {
  workId: string;
}

interface ScheduleTask {
  id: string;
  name: string;
  progress: number;
  startDate: string;
  endDate: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
}

export default function PortalSchedule({ workId }: PortalScheduleProps) {
  const [tasks, setTasks] = useState<ScheduleTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const q = query(collection(db, 'works', workId, 'schedule'), orderBy('startDate', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleTask));
        
        if (fetched.length === 0) {
          setTasks([
            { id: '1', name: 'Serviços Preliminares', progress: 100, startDate: new Date(Date.now() - 30 * 86400000).toISOString(), endDate: new Date(Date.now() - 20 * 86400000).toISOString(), status: 'concluido' },
            { id: '2', name: 'Fundação e Baldrame', progress: 75, startDate: new Date(Date.now() - 15 * 86400000).toISOString(), endDate: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'em_andamento' },
            { id: '3', name: 'Alvenaria', progress: 0, startDate: new Date(Date.now() + 10 * 86400000).toISOString(), endDate: new Date(Date.now() + 40 * 86400000).toISOString(), status: 'pendente' },
          ]);
        } else {
          setTasks(fetched);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [workId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido': return <CheckCircle2 size={20} color="var(--color-success)" />;
      case 'em_andamento': return <PlayCircle size={20} color="var(--color-primary)" />;
      default: return <Clock size={20} color="var(--text-muted)" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluido': return 'Concluído';
      case 'em_andamento': return 'Em Andamento';
      default: return 'Pendente';
    }
  };

  const formatDate = (dateString: string) => {
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-glass" style={{ height: '120px', width: '100%' }} />
        ))}
      </div>
    );
  }

  const overallProgress = tasks.length 
    ? Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Overall Progress */}
      <div className="card-premium animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', margin: 0, fontWeight: '600' }}>Progresso Físico Global</h3>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-primary)' }}>{overallProgress}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '4px' }}
          />
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="card-premium"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', 
                  backgroundColor: 'var(--bg-elevated)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {getStatusIcon(task.status)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text-main)' }}>{task.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{getStatusText(task.status)}</span>
                    <span style={{ fontSize: '12px', color: 'var(--border-strong)' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      <Calendar size={12} />
                      {formatDate(task.startDate)} - {formatDate(task.endDate)}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                {task.progress}%
              </div>
            </div>

            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                style={{ 
                  height: '100%', 
                  backgroundColor: task.progress === 100 ? 'var(--color-success)' : 'var(--color-primary)', 
                  borderRadius: '3px' 
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
