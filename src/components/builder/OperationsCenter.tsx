import React from 'react';
import { Map, AlertTriangle, Building, ShieldCheck, ChevronRight, Activity, Bell, MapPin } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';

export const OperationsCenter: React.FC = () => {
  const { works } = useWorks();

  const sites = works.map(w => ({
    id: w.id,
    name: w.name,
    status: (w.progress || 0) < 30 ? 'warning' : 'stable',
    progress: w.progress || 0,
    budgetUsed: w.spent && w.budget ? Math.round((w.spent / w.budget) * 100) : 0,
    location: w.address || 'Não informado'
  }));

  const criticalSites = sites.filter(s => s.status === 'critical' || s.budgetUsed > 100);

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden', minHeight: '100vh' }}>
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

      {sites.length === 0 ? (
        <div style={{ marginTop: 60, textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-light)' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <MapPin size={40} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Nenhuma Obra Ativa</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto' }}>
            Assim que você adicionar obras ao sistema, o centro de operações fornecerá insights estratégicos e mapa em tempo real de suas execuções.
          </p>
        </div>
      ) : (
        <>
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
            <div style={{ 
              position: 'absolute', inset: 0, opacity: 0.1,
              backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
            
            <div style={{ position: 'absolute', top: 16, left: 16, backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(8px)', padding: '8px 12px', borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Map size={16} color="var(--color-primary)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Visão Geral ({sites.length} Obras)</span>
            </div>

            {/* Map Pins dynamically placed */}
            {sites.map((site, idx) => {
              const top = 30 + (idx * 20) % 50;
              const left = 20 + (idx * 25) % 60;
              return (
                <div key={site.id} style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ padding: '4px 8px', backgroundColor: 'var(--bg-surface)', borderRadius: 8, fontSize: 11, fontWeight: 700, marginBottom: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{site.name.split(' ')[0]}</div>
                  <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: site.status === 'critical' ? '#EF4444' : site.status === 'warning' ? '#F59E0B' : '#10B981', border: '2px solid #FFF' }} />
                </div>
              );
            })}
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
                      <div style={{ width: `${Math.min(site.budgetUsed, 100)}%`, height: '100%', backgroundColor: site.budgetUsed > site.progress ? '#EF4444' : '#10B981', borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
