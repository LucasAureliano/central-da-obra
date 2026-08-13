import React from 'react';
import { UserPlus, Phone, Briefcase, MapPin } from 'lucide-react';
import { useBuilder } from '../contexts/BuilderContext';


export const Team: React.FC = () => {
  const { employees, isLoading } = useBuilder();

  if (isLoading) {
    return <div className="screen-content flex-center">Carregando equipe...</div>;
  }

  return (
    <div className="screen-content" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="flex-space-between">
        <div>
          <h1 className="text-2xl font-black">Equipe</h1>
          <p className="text-xs text-muted">Gerencie seus funcionários e prestadores</p>
        </div>
        <button 
          className="btn-primary" 
          style={{ width: 'auto', padding: '10px 16px', borderRadius: 'var(--radius-full)' }}
        >
          <UserPlus size={18} />
          <span className="text-sm">Novo</span>
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="flex-center" style={{ flexDirection: 'column', padding: '40px 20px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <UserPlus size={48} className="text-muted" style={{ marginBottom: 16 }} />
          <h3 className="text-lg font-bold" style={{ marginBottom: 8 }}>Nenhum funcionário cadastrado</h3>
          <p className="text-sm text-muted" style={{ marginBottom: 24 }}>Adicione membros à sua equipe para alocá-los em obras.</p>
          <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: 24, fontSize: 14 }}>
            Adicionar Membro
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {employees.map(emp => (
            <div key={emp.id} className="card-premium">
              <div className="flex-space-between" style={{ marginBottom: 12 }}>
                <div>
                  <h3 className="text-base font-bold">{emp.name}</h3>
                  <span className="text-xs text-muted">{emp.role}</span>
                </div>
                <span className={`badge ${emp.availability === 'Alocado' ? 'badge-orange' : 'badge-green'}`}>
                  {emp.availability}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {emp.phone && (
                  <div className="flex-row-center text-xs text-muted" style={{ gap: 8 }}>
                    <Phone size={14} className="text-primary" />
                    <span>{emp.phone}</span>
                  </div>
                )}
                <div className="flex-row-center text-xs text-muted" style={{ gap: 8 }}>
                  <Briefcase size={14} className="text-primary" />
                  <span>Diária: {emp.specialty || 'Não definida'}</span>
                </div>
                <div className="flex-row-center text-xs text-muted" style={{ gap: 8 }}>
                  <MapPin size={14} className="text-primary" />
                  <span>Alocado: {emp.availability === 'Alocado' && emp.linkedWorks?.length ? `${emp.linkedWorks.length} obra(s)` : 'Nenhuma'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
