import { Briefcase, Activity } from 'lucide-react';
import { TiltCard } from '../TiltCard';
import { GripVertical } from 'lucide-react';

interface DashboardMetricsProps {
  isGuest: boolean;
  profile: any;
  works: any[];
  totalSpent: number;
  onNavigate: (tab: string) => void;
}

export function DashboardMetrics({ isGuest, profile, works, totalSpent, onNavigate }: DashboardMetricsProps) {
  if (isGuest) return null;
  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', position: 'relative' }}>
      <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'var(--text-muted)' }}>
        <GripVertical size={20} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Resumo Geral</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {profile?.role === 'owner' ? (
          <>
            <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                <Briefcase size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Minhas Obras</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
            </TiltCard>
            <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                <Activity size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Gastos Registrados</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-danger)' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
              </div>
            </TiltCard>
          </>
        ) : profile?.role === 'architect' ? (
          <>
            <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                <Briefcase size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Projetos</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
            </TiltCard>
            <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('library')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                <Activity size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Assistentes</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>14+</div>
            </TiltCard>
          </>
        ) : profile?.role === 'builder' ? (
          <>
            <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                <Briefcase size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Obras Ativas</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
            </TiltCard>
            <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('equipe')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                <Activity size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Equipes</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-success)' }}>Ativas</div>
            </TiltCard>
          </>
        ) : (
          <>
            <TiltCard style={{ padding: 16, borderRadius: 16, gridColumn: 'span 2', backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                <Briefcase size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Obras em Andamento</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
            </TiltCard>
          </>
        )}
      </div>
    </div>
  );
}
