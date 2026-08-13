import React, { useMemo } from 'react';
import { Building2, ShoppingCart, Users, AlertTriangle, AlertCircle, Clock, CheckCircle2, TrendingDown } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';

interface AlertItem {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  workName: string;
}

export const OperationsCenter: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { works } = useWorks();

  const activeWorks = works.filter(w => (w.progress || 0) < 100).length;
  const delayedWorks = works.filter(w => (w.progress || 0) < 30).length;
  const completedWorks = works.filter(w => (w.progress || 0) === 100).length;

  // Generate some dynamic mock alerts based on works
  const alerts = useMemo<AlertItem[]>(() => {
    if (works.length === 0) return [];
    const generated: AlertItem[] = [];
    
    works.forEach((w, i) => {
      if (i === 0) {
        generated.push({
          id: `alert-${w.id}-1`,
          type: 'danger',
          title: 'Orçamento Ultrapassado',
          description: 'Orçamento ultrapassado em 12% na etapa de fundação.',
          workName: w.name
        });
      }
      if (i === 1 || (i === 0 && works.length === 1)) {
        generated.push({
          id: `alert-${w.id}-2`,
          type: 'warning',
          title: 'Compra Pendente',
          description: 'Faltam 2 dias para a entrega do Cimento, compra não aprovada.',
          workName: w.name
        });
      }
      if ((w.progress || 0) > 0 && (w.progress || 0) < 30) {
        generated.push({
          id: `alert-${w.id}-3`,
          type: 'danger',
          title: 'Cronograma Atrasado',
          description: 'Atraso de 4 dias na etapa de Alvenaria.',
          workName: w.name
        });
      }
    });
    return generated.slice(0, 4); // max 4 alerts
  }, [works]);

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 24px 20px', overflowX: 'hidden', minHeight: '100%' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Centro de Operações</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Visão macro de obras, equipes e alertas</p>
        </div>
      </div>

      {/* Grid de KPIs Estratégicos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 24 }}>
        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, borderLeft: '4px solid #3B82F6' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Obras Ativas</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)' }}>{activeWorks}</span>
        </div>

        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, borderLeft: '4px solid #EF4444' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Alertas Críticos</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#EF4444' }}>{alerts.filter(a => a.type === 'danger').length}</span>
        </div>

        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Concluídas</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#10B981' }}>{completedWorks}</span>
        </div>
      </div>

      {/* 🚨 Central de Alertas */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <AlertTriangle size={18} color="#EF4444" />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Central de Alertas</h3>
        </div>

        {alerts.length === 0 ? (
          <div className="glass-panel" style={{ padding: 24, borderRadius: 16, textAlign: 'center' }}>
            <CheckCircle2 size={28} color="#10B981" style={{ margin: '0 auto 8px' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>Tudo sob controle!</span>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Nenhum alerta crítico nas suas obras.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map(alert => (
              <div key={alert.id} className="glass-panel" style={{ 
                padding: 14, 
                borderRadius: 14, 
                borderLeft: `4px solid ${alert.type === 'danger' ? '#EF4444' : '#F59E0B'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}>
                <div style={{ 
                  width: 36, height: 36, borderRadius: 10, 
                  backgroundColor: alert.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: alert.type === 'danger' ? '#EF4444' : '#F59E0B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {alert.type === 'danger' ? <TrendingDown size={18} /> : <AlertCircle size={18} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: alert.type === 'danger' ? '#EF4444' : '#F59E0B', textTransform: 'uppercase' }}>
                      {alert.workName}
                    </span>
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 2px 0' }}>{alert.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shortcuts to Main Operations */}
      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 14 }}>Ações Rápidas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 30 }}>
        <button
          onClick={() => onNavigate && onNavigate('compras')}
          className="glass-panel card-premium-interactive"
          style={{ padding: 14, borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', cursor: 'pointer', background: 'transparent' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Compras</h4>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>12 pendentes</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('equipes')}
          className="glass-panel card-premium-interactive"
          style={{ padding: 14, borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', cursor: 'pointer', background: 'transparent' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Equipes</h4>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>48 alocados</span>
          </div>
        </button>
      </div>

      {/* Lista de Obras e Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Andamento das Obras</h3>
        <button onClick={() => onNavigate && onNavigate('obras')} style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Ver Todas</button>
      </div>

      {works.length === 0 ? (
        <div className="glass-panel" style={{ padding: 32, borderRadius: 20, textAlign: 'center' }}>
          <Building2 size={32} color="var(--color-primary)" style={{ margin: '0 auto 10px', display: 'block' }} />
          <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Nenhuma Obra Ativa</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Cadastre obras para acompanhar no Centro de Operações.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20 }}>
          {works.map(w => (
            <div key={w.id} className="glass-panel" style={{ padding: 16, borderRadius: 18, borderLeft: '4px solid #3B82F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 2px 0' }}>{w.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> Previsão: Nov/2026</span>
                  </div>
                </div>
                <span className="status-chip" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', fontWeight: 800 }}>
                  {w.progress || 0}%
                </span>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Financeiro (Realizado)</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>R$ 145.000 / 300k</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Equipe Atual</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>12 pessoas</span>
                </div>
              </div>

              <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${w.progress || 0}%`, height: '100%', backgroundColor: '#3B82F6', borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
