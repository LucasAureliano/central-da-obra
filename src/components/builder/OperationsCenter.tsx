import React from 'react';
import { Building2, ShoppingCart, Users } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';

export const OperationsCenter: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { works } = useWorks();

  const activeWorks = works.filter(w => (w.progress || 0) < 100).length;
  const delayedWorks = works.filter(w => (w.progress || 0) < 30).length;
  const completedWorks = works.filter(w => (w.progress || 0) === 100).length;

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden', minHeight: '100vh' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Centro de Operações Executivo</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Comando central e indicadores em tempo real</p>
        </div>
      </div>

      {/* Grid de KPIs Estratégicos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, borderLeft: '4px solid #3B82F6' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Obras Ativas</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)' }}>{activeWorks}</span>
        </div>

        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Atenção / Atraso</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B' }}>{delayedWorks}</span>
        </div>

        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, borderLeft: '4px solid #10B981' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Concluídas</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#10B981' }}>{completedWorks}</span>
        </div>

        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, borderLeft: '4px solid #8B5CF6' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Mão de Obra</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#8B5CF6' }}>48 colaboradores</span>
        </div>
      </div>

      {/* Shortcuts to Main Operations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => onNavigate && onNavigate('centro-compras')}
          className="glass-panel card-premium-interactive"
          style={{ padding: 16, borderRadius: 18, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Centro de Compras</h4>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Cotações e suprimentos</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('equipe')}
          className="glass-panel card-premium-interactive"
          style={{ padding: 16, borderRadius: 18, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Gestão de Equipes</h4>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Alocação entre canteiros</span>
          </div>
        </button>
      </div>

      {/* Lista de Obras e Status */}
      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 14 }}>Status das Obras Ativas</h3>

      {works.length === 0 ? (
        <div className="glass-panel" style={{ padding: 32, borderRadius: 20, textAlign: 'center' }}>
          <Building2 size={32} color="var(--color-primary)" style={{ margin: '0 auto 10px', display: 'block' }} />
          <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Nenhuma Obra Ativa</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Cadastre obras para acompanhar no Centro de Operações.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {works.map(w => (
            <div key={w.id} className="glass-panel" style={{ padding: 16, borderRadius: 18, borderLeft: '4px solid #3B82F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{w.name}</h4>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{w.address || 'Localização não informada'}</span>
                </div>
                <span className="status-chip" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                  {w.progress || 0}% Concluído
                </span>
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
