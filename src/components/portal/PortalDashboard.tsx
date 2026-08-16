import { MapPin, Calendar, Activity, ArrowUpRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function PortalDashboard({ work }: { work: any }) {
  const progress = work.progress || 0;
  const getPhase = (p: number) => {
    if (p === 0) return 'Planejamento';
    if (p <= 25) return 'Fundação';
    if (p <= 60) return 'Estrutura';
    if (p < 100) return 'Acabamento';
    return 'Concluída';
  };

  const getPhaseColor = (p: number) => {
    if (p === 0) return '#94A3B8';
    if (p <= 25) return '#8B5CF6';
    if (p <= 60) return '#3B82F6';
    if (p < 100) return '#F59E0B';
    return '#10B981';
  };

  const currentColor = getPhaseColor(progress);

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Section */}
      <div style={{ 
        position: 'relative', 
        borderRadius: 24, 
        overflow: 'hidden', 
        backgroundColor: 'var(--bg-elevated)',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 24,
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* If work has a cover photo, we would show it here. For now, a dynamic gradient background */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${currentColor}22 0%, var(--bg-elevated) 100%)`, zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', fontSize: 12, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: currentColor }} />
            {getPhase(progress)}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.2 }}>
            {work.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
            <MapPin size={16} />
            {work.address || 'Endereço não informado'}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="card-premium">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={20} color="var(--color-primary)" />
            Progresso Geral
          </h2>
          <div style={{ fontSize: 24, fontWeight: 800, color: currentColor }}>
            {progress}%
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 4, height: 12, marginBottom: 16 }}>
          {/* Foundation block (0-25%) */}
          <div style={{ flex: 25, backgroundColor: 'var(--bg-base)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, Math.max(0, (progress / 25) * 100))}%`, height: '100%', backgroundColor: '#8B5CF6' }} />
          </div>
          {/* Structure block (25-60%) */}
          <div style={{ flex: 35, backgroundColor: 'var(--bg-base)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, Math.max(0, ((progress - 25) / 35) * 100))}%`, height: '100%', backgroundColor: '#3B82F6' }} />
          </div>
          {/* Finishing block (60-99%) */}
          <div style={{ flex: 39, backgroundColor: 'var(--bg-base)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, Math.max(0, ((progress - 60) / 39) * 100))}%`, height: '100%', backgroundColor: '#F59E0B' }} />
          </div>
          {/* Final block (100%) */}
          <div style={{ flex: 1, backgroundColor: 'var(--bg-base)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: progress === 100 ? '100%' : '0%', height: '100%', backgroundColor: '#10B981' }} />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
          <span>Fundação</span>
          <span>Estrutura</span>
          <span>Acabamento</span>
        </div>
      </div>

      {/* Project Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Calendar size={18} />
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Previsão de Entrega</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
            {work.deadline ? formatDate(work.deadline) : 'Não definida'}
          </div>
        </div>
        
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <ArrowUpRight size={18} />
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Status</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
            {work.status || 'Em andamento'}
          </div>
        </div>
      </div>
      
      {/* Support / Contact Section */}
      <div style={{ padding: 24, borderRadius: 16, border: '1px dashed var(--border-subtle)', textAlign: 'center', marginTop: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Precisa de ajuda?</h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Entre em contato com o responsável pela obra para tirar dúvidas.</p>
      </div>
    </div>
  );
}
