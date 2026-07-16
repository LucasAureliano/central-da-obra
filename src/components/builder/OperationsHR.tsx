import React, { useState } from 'react';
import { Users, HardHat, Search, UserPlus, Filter, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  role: string;
  site: string;
  status: 'Ativo' | 'Férias' | 'Afastado';
  productivity: number; // 0-100%
  overtime: number; // hours this month
}

export const OperationsHR: React.FC = () => {
  const [workers] = useState<Worker[]>([
    { id: '1', name: 'João Silva', role: 'Mestre de Obras', site: 'Edifício Horizon', status: 'Ativo', productivity: 95, overtime: 12 },
    { id: '2', name: 'Carlos Santos', role: 'Pedreiro', site: 'Edifício Horizon', status: 'Ativo', productivity: 88, overtime: 5 },
    { id: '3', name: 'Marcos Paulo', role: 'Eletricista', site: 'Residencial Acqua', status: 'Afastado', productivity: 0, overtime: 0 },
    { id: '4', name: 'Ana Oliveira', role: 'Engenheira Residente', site: 'Galpão Logístico Sul', status: 'Ativo', productivity: 92, overtime: 25 },
  ]);

  const [filter, setFilter] = useState('');

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(filter.toLowerCase()) || 
    w.site.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Produtividade & RH</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gestão de equipes e desempenho nas obras</p>
        </div>
        <button className="btn-primary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserPlus size={24} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Users size={16} color="var(--color-primary)" />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total Efetivo</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)' }}>142</span>
        </div>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <TrendingUp size={16} color="#10B981" />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Produtividade Média</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: '#10B981' }}>87%</span>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
        <input 
          type="text" 
          placeholder="Buscar colaborador ou obra..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '14px 16px 14px 48px', 
            borderRadius: 16, 
            border: '1px solid var(--border-light)', 
            backgroundColor: 'var(--bg-elevated)', 
            color: 'var(--text-main)',
            fontSize: 15
          }} 
        />
        <button style={{ position: 'absolute', right: 16, top: 14, background: 'none', border: 'none', color: 'var(--color-primary)' }}>
          <Filter size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredWorkers.map(worker => (
          <div key={worker.id} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HardHat size={22} color="var(--text-main)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>{worker.name}</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{worker.role} • {worker.site}</span>
                </div>
              </div>
              <span style={{ 
                fontSize: 11, 
                fontWeight: 700, 
                padding: '4px 8px', 
                borderRadius: 8, 
                backgroundColor: worker.status === 'Ativo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                color: worker.status === 'Ativo' ? '#10B981' : '#F59E0B' 
              }}>
                {worker.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <TrendingUp size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Produtividade</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{worker.productivity}%</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Clock size={14} color={worker.overtime > 20 ? '#EF4444' : 'var(--text-muted)'} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Horas Extras</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: worker.overtime > 20 ? '#EF4444' : 'var(--text-main)' }}>{worker.overtime}h</span>
              </div>
            </div>

            {worker.overtime > 20 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#EF4444', fontSize: 12 }}>
                <AlertTriangle size={14} />
                Limite de horas extras excedido no mês.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
