import React, { useState } from 'react';
import { Truck, MapPin, Search, AlertCircle, Wrench, CheckCircle } from 'lucide-react';

type EquipStatus = 'Em uso' | 'Manutenção' | 'Disponível';

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipStatus;
  currentSite?: string;
  nextMaintenance: string;
}

export const EquipmentControl: React.FC = () => {
  const [equipments] = useState<Equipment[]>([
    { id: '1', name: 'Betoneira 400L', type: 'Misturador', status: 'Em uso', currentSite: 'Edifício Horizon', nextMaintenance: '15/08/2026' },
    { id: '2', name: 'Escavadeira CAT', type: 'Pesado', status: 'Manutenção', nextMaintenance: '10/07/2026' },
    { id: '3', name: 'Guindaste 30T', type: 'Içamento', status: 'Disponível', nextMaintenance: '01/10/2026' },
    { id: '4', name: 'Gerador 50kVA', type: 'Energia', status: 'Em uso', currentSite: 'Galpão Logístico Sul', nextMaintenance: '20/07/2026' },
  ]);

  const [filter, setFilter] = useState('');

  const filteredEquip = equipments.filter(e => 
    e.name.toLowerCase().includes(filter.toLowerCase()) || 
    (e.currentSite && e.currentSite.toLowerCase().includes(filter.toLowerCase()))
  );

  const getStatusColor = (status: EquipStatus) => {
    switch (status) {
      case 'Disponível': return '#10B981';
      case 'Em uso': return '#3B82F6';
      case 'Manutenção': return '#EF4444';
    }
  };

  const getStatusIcon = (status: EquipStatus) => {
    switch (status) {
      case 'Disponível': return <CheckCircle size={16} color="#10B981" />;
      case 'Em uso': return <MapPin size={16} color="#3B82F6" />;
      case 'Manutenção': return <Wrench size={16} color="#EF4444" />;
    }
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Equipamentos</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gestão de maquinário e alocações</p>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Truck size={24} />
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
        <input 
          type="text" 
          placeholder="Buscar equipamento ou obra..." 
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {['Todos', 'Disponível', 'Manutenção'].map(tab => (
          <button key={tab} className="btn-secondary" style={{ padding: '8px 4px', fontSize: 12, borderRadius: 12 }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredEquip.map(equip => (
          <div key={equip.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, borderLeft: `4px solid ${getStatusColor(equip.status)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>{equip.name}</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{equip.type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: 8 }}>
                {getStatusIcon(equip.status)}
                <span style={{ fontSize: 12, fontWeight: 600, color: getStatusColor(equip.status) }}>{equip.status}</span>
              </div>
            </div>

            {equip.currentSite && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-main)' }}>
                <MapPin size={16} color="var(--text-muted)" />
                <span style={{ fontSize: 13 }}>{equip.currentSite}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
              <Wrench size={16} />
              <span style={{ fontSize: 13 }}>Próx. Manutenção: {equip.nextMaintenance}</span>
            </div>

            {equip.status === 'Manutenção' && (
              <div style={{ marginTop: 12, padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <AlertCircle size={16} color="#EF4444" style={{ marginTop: 2 }} />
                <span style={{ fontSize: 12, color: '#EF4444' }}>Equipamento indisponível. Previsão de retorno em 3 dias.</span>
              </div>
            )}
          </div>
        ))}

        {filteredEquip.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Truck size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Nenhum equipamento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
