import React, { useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

export const Agenda: React.FC = () => {
  const [events] = useState([
    { id: 1, title: 'Reunião com Arquiteto', time: '09:00', duration: '1h', location: 'Escritório Central', type: 'reuniao' },
    { id: 2, title: 'Entrega de Materiais', time: '14:30', duration: '30m', location: 'Residência Alpha', type: 'entrega' },
    { id: 3, title: 'Vistoria da Fundação', time: '16:00', duration: '2h', location: 'Edifício Horizon', type: 'vistoria' }
  ]);

  return (
    <div className="screen-content" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="flex-space-between">
        <div>
          <h1 className="text-2xl font-black">Agenda</h1>
          <p className="text-xs text-muted">Compromissos e entregas do dia</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="text-sm font-bold text-primary">Hoje</div>
          <div className="text-xs text-muted">12 Jun 2026</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, margin: '0 -16px', paddingLeft: 16, paddingRight: 16 }} className="hide-scrollbar">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
          <div key={i} className={`card-premium ${i === 2 ? '' : 'text-muted'}`} style={{ 
            minWidth: 50, 
            textAlign: 'center', 
            padding: '10px 4px', 
            borderColor: i === 2 ? 'var(--color-primary)' : 'var(--border-light)',
            backgroundColor: i === 2 ? 'var(--color-primary-light)' : 'var(--bg-surface)'
          }}>
            <div className="text-xs">{day}</div>
            <div className={`text-base font-bold ${i === 2 ? 'text-primary' : ''}`}>{10 + i}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 className="text-sm font-bold mt-2">Eventos de Hoje</h3>
        {events.map(event => (
          <div key={event.id} className="card-premium flex-row-center" style={{ gap: 12, padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 45 }}>
              <span className="text-sm font-bold">{event.time}</span>
              <span className="text-xs text-muted">{event.duration}</span>
            </div>
            
            <div style={{ width: 2, height: 40, backgroundColor: 'var(--color-primary-light)', borderRadius: 2 }}></div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h4 className="text-sm font-bold">{event.title}</h4>
              <div className="flex-row-center text-xs text-muted" style={{ gap: 4 }}>
                <MapPin size={12} />
                <span>{event.location}</span>
              </div>
            </div>
            
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
