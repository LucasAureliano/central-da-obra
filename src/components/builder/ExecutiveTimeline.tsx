import React, { useState } from 'react';
import { Filter, ChevronRight, Activity, Building, TrendingUp } from 'lucide-react';

interface TimelinePhase {
  name: string;
  start: number; // mock months 1-12
  duration: number; // mock months
  progress: number;
}

interface MasterSchedule {
  id: string;
  workName: string;
  status: 'Em dia' | 'Atrasado' | 'Adiantado';
  phases: TimelinePhase[];
}

export const ExecutiveTimeline: React.FC = () => {
  const [schedules] = useState<MasterSchedule[]>([
    {
      id: '1',
      workName: 'Horizonte Residence',
      status: 'Em dia',
      phases: [
        { name: 'Fundação', start: 1, duration: 2, progress: 100 },
        { name: 'Estrutura', start: 3, duration: 4, progress: 70 },
        { name: 'Acabamentos', start: 6, duration: 4, progress: 10 },
      ]
    },
    {
      id: '2',
      workName: 'Torre Corporate',
      status: 'Atrasado',
      phases: [
        { name: 'Demolição', start: 1, duration: 1, progress: 100 },
        { name: 'Fundação', start: 2, duration: 3, progress: 40 },
        { name: 'Estrutura', start: 5, duration: 5, progress: 0 },
      ]
    }
  ]);

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Em dia': return '#10B981';
      case 'Adiantado': return '#3B82F6';
      case 'Atrasado': return '#EF4444';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Cronograma Geral</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gantt macro de todas as obras (Visão Executiva)</p>
        </div>
        <button className="btn-secondary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Filter size={20} />
        </button>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {schedules.map(schedule => (
          <div key={schedule.id} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{schedule.workName}</h3>
                <span style={{ fontSize: 12, fontWeight: 600, color: getStatusColor(schedule.status), padding: '2px 8px', backgroundColor: `${getStatusColor(schedule.status)}20`, borderRadius: 8, display: 'inline-block', marginTop: 4 }}>
                  {schedule.status}
                </span>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Simulated Gantt Chart */}
            <div style={{ overflowX: 'auto', paddingBottom: 8 }} className="hide-scrollbar">
              <div style={{ minWidth: 400 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2, marginBottom: 8 }}>
                  {months.map(m => (
                    <div key={m} style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>{m}</div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {schedule.phases.map((phase, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', height: 24, position: 'relative' }}>
                      {/* Phase Label overlay */}
                      <span style={{ position: 'absolute', left: 0, top: -14, fontSize: 10, color: 'var(--text-main)', fontWeight: 600 }}>{phase.name}</span>
                      
                      {/* Grid background */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2, width: '100%', position: 'absolute', inset: 0, zIndex: 0 }}>
                        {months.map(m => (
                          <div key={m} style={{ backgroundColor: 'var(--bg-elevated)', borderRadius: 2 }} />
                        ))}
                      </div>

                      {/* Bar */}
                      <div style={{ 
                        position: 'absolute', 
                        left: `${((phase.start - 1) / 12) * 100}%`, 
                        width: `${(phase.duration / 12) * 100}%`,
                        height: '100%',
                        backgroundColor: 'var(--bg-elevated)',
                        borderRadius: 4,
                        zIndex: 1,
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden'
                      }}>
                        <div style={{ width: `${phase.progress}%`, height: '100%', backgroundColor: phase.progress === 100 ? '#10B981' : 'var(--color-primary)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
