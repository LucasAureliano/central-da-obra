import React, { useState } from 'react';
import { UserPlus, Phone, Briefcase, MapPin } from 'lucide-react';

export const Team: React.FC = () => {
  const [employees] = useState([
    { id: 1, name: 'João Silva', role: 'Mestre de Obras', phone: '(11) 98765-4321', rate: 'R$ 250/dia', status: 'Em obra' },
    { id: 2, name: 'Carlos Santos', role: 'Pedreiro', phone: '(11) 91234-5678', rate: 'R$ 180/dia', status: 'Disponível' },
    { id: 3, name: 'Roberto Alves', role: 'Eletricista', phone: '(11) 99988-7766', rate: 'R$ 200/dia', status: 'Em obra' }
  ]);

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {employees.map(emp => (
          <div key={emp.id} className="card-premium">
            <div className="flex-space-between" style={{ marginBottom: 12 }}>
              <div>
                <h3 className="text-base font-bold">{emp.name}</h3>
                <span className="text-xs text-muted">{emp.role}</span>
              </div>
              <span className={`badge ${emp.status === 'Em obra' ? 'badge-orange' : 'badge-green'}`}>
                {emp.status}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="flex-row-center text-xs text-muted" style={{ gap: 8 }}>
                <Phone size={14} className="text-primary" />
                <span>{emp.phone}</span>
              </div>
              <div className="flex-row-center text-xs text-muted" style={{ gap: 8 }}>
                <Briefcase size={14} className="text-primary" />
                <span>Diária: {emp.rate}</span>
              </div>
              <div className="flex-row-center text-xs text-muted" style={{ gap: 8 }}>
                <MapPin size={14} className="text-primary" />
                <span>Alocado: {emp.status === 'Em obra' ? 'Residência Alpha' : 'Nenhuma'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
