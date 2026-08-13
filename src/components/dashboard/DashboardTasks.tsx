import { CheckSquare, GripVertical } from 'lucide-react';

interface DashboardTasksProps {
  isGuest: boolean;
  profile: any;
  upcomingTasks: any[];
  onNavigate: (tab: string) => void;
}

export function DashboardTasks({ isGuest, profile, upcomingTasks, onNavigate }: DashboardTasksProps) {
  if (isGuest || !(profile?.role === 'architect' || profile?.role === 'service') || upcomingTasks.length === 0) return null;
  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', position: 'relative' }}>
      <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'var(--text-muted)' }}>
        <GripVertical size={20} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <CheckSquare size={18} color="var(--color-primary)" />
        Próximas Tarefas
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {upcomingTasks.map((task, idx) => (
          <div key={idx} style={{ padding: 16, borderRadius: 12, backgroundColor: 'var(--bg-base)', borderLeft: '4px solid var(--color-primary)', cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{task.title}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>Obra: {task.workName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
