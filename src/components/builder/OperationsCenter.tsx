import React, { useState } from 'react';
import { Map, AlertTriangle, Building, ShieldCheck, ChevronRight, Activity, Bell } from 'lucide-react';

interface ActiveSite {
  id: string;
  name: string;
  status: 'critical' | 'warning' | 'stable';
  progress: number;
  budgetUsed: number;
  location: string;
}

export const OperationsCenter: React.FC = () => {
  const [sites] = useState<ActiveSite[]>([
    { id: '1', name: 'Edifício Horizon', status: 'warning', progress: 45, budgetUsed: 52, location: 'São Paulo, SP' },
    { id: '2', name: 'Residencial Acqua', status: 'stable', progress: 80, budgetUsed: 78, location: 'Campinas, SP' },
    { id: '3', name: 'Galpão Logístico Sul', status: 'critical', progress: 12, budgetUsed: 30, location: 'Curitiba, PR' },
  ]);

  const criticalSites = sites.filter(s => s.status === 'critical');

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Centro de Operações</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Visão estratégica de todas as obras ativas</p>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="btn-secondary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={20} />
          </button>
          {criticalSites.length > 0 && (
            <div style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#EF4444', border: '2px solid var(--bg-base)' }} />
          )}
        </div>
      </div>

      {/* Simulated Map Container */}
      <div style={{ 
        width: '100%', 
        height: 200, 
        backgroundColor: 'var(--bg-elevated)', 
        borderRadius: 20, 
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-light)'
      }}>
        {/* Placeholder Map Background using CSS patterns */}
        <div style={{ 
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
        
        {/* Map UI Overlay */}
        <div style={{ position: 'absolute', top: 16, left: 16, backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(8px)', padding: '8px 12px', borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Map size={16} color="var(--color-primary)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Visão Geral (3 Obras)</span>
        </div>

        {/* Map Pins */}
        <div style={{ position: 'absolute', top: '40%', left: '30%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ padding: '4px 8px', backgroundColor: 'var(--bg-surface)', borderRadius: 8, fontSize: 11, fontWeight: 700, marginBottom: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Horizon</div>
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#F59E0B', border: '2px solid #FFF', boxShadow: '0 0 0 4px rgba(245, 158, 11, 0.2)' }} />
        </div>
        <div style={{ position: 'absolute', top: '60%', left: '70%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ padding: '4px 8px', backgroundColor: 'var(--bg-surface)', borderRadius: 8, fontSize: 11, fontWeight: 700, marginBottom: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Acqua</div>
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#10B981', border: '2px solid #FFF', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }} />
        </div>
        <div style={{ position: 'absolute', top: '75%', left: '45%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ padding: '4px 8px', backgroundColor: 'var(--bg-surface)', borderRadius: 8, fontSize: 11, fontWeight: 700, marginBottom: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Galpão Sul</div>
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#EF4444', border: '2px solid #FFF', boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.2)' }} />
        </div>
      </div>

      {criticalSites.length > 0 && (
        <div style={{ padding: 16, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={18} color="#EF4444" />
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>Atenção Necessária</h4>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
            Existem {criticalSites.length} obra(s) com desvios significativos de cronograma ou orçamento.
          </p>
        </div>
      )}

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Status das Obras</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sites.map(site => (
          <div key={site.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, borderLeft: `4px solid ${site.status === 'critical' ? '#EF4444' : site.status === 'warning' ? '#F59E0B' : '#10B981'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={20} color="var(--text-main)" />
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{site.name}</h4>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{site.location}</span>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <ChevronRight size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Activity size={12} /> Avanço Físico</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>{site.progress}%</span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: 'var(--border-light)', borderRadius: 3 }}>
                  <div style={{ width: `${site.progress}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 3 }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={12} /> Orçamento Uso</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: site.budgetUsed > site.progress ? '#EF4444' : '#10B981' }}>{site.budgetUsed}%</span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: 'var(--border-light)', borderRadius: 3 }}>
                  <div style={{ width: `${site.budgetUsed}%`, height: '100%', backgroundColor: site.budgetUsed > site.progress ? '#EF4444' : '#10B981', borderRadius: 3 }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
