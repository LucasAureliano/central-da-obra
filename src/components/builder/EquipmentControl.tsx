import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Search, AlertCircle, Wrench, CheckCircle, Plus } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

type EquipStatus = 'Em uso' | 'Manutenção' | 'Disponível';

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipStatus;
  currentSite?: string;
  nextMaintenance?: string;
}

export const EquipmentControl: React.FC = () => {
  const { user } = useAuth();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user) {
      setEquipments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const qEquip = query(collection(db, 'equipments'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(qEquip, (snapshot) => {
      if (snapshot.empty) {
        setEquipments([]);
      } else {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Equipment));
        setEquipments(data);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching equipments:", error);
      setEquipments([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredEquip = equipments.filter(e => 
    e.name?.toLowerCase().includes(filter.toLowerCase()) || 
    (e.currentSite && e.currentSite.toLowerCase().includes(filter.toLowerCase())) ||
    e.type?.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusColor = (status: EquipStatus) => {
    switch (status) {
      case 'Disponível': return '#10B981';
      case 'Em uso': return '#3B82F6';
      case 'Manutenção': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusIcon = (status: EquipStatus) => {
    switch (status) {
      case 'Disponível': return <CheckCircle size={16} color="#10B981" />;
      case 'Em uso': return <MapPin size={16} color="#3B82F6" />;
      case 'Manutenção': return <Wrench size={16} color="#EF4444" />;
      default: return <AlertCircle size={16} color="#9CA3AF" />;
    }
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Equipamentos</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gestão de maquinário e alocações</p>
        </div>
        <button className="btn-primary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </button>
      </div>

      {loading ? (
         <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
           <div className="skeleton-glass" style={{ height: 120, width: '100%', borderRadius: 16 }} />
           <div className="skeleton-glass" style={{ height: 120, width: '100%', borderRadius: 16 }} />
         </div>
      ) : equipments.length === 0 ? (
        <div style={{ marginTop: 60, textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-light)' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <Truck size={40} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Nenhum Equipamento</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto', marginBottom: 24 }}>
            Registre betoneiras, escavadeiras, guindastes e demais maquinários para rastrear alocação e manutenções.
          </p>
          <button className="btn-primary hover-scale" style={{ padding: '0 24px', height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Plus size={20} />
            <span>Adicionar Maquinário</span>
          </button>
        </div>
      ) : (
        <>
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
                    <span style={{ fontSize: 12, fontWeight: 600, color: getStatusColor(equip.status) }}>{equip.status || 'N/A'}</span>
                  </div>
                </div>

                {equip.currentSite && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-main)' }}>
                    <MapPin size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: 13 }}>{equip.currentSite}</span>
                  </div>
                )}

                {equip.nextMaintenance && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                    <Wrench size={16} />
                    <span style={{ fontSize: 13 }}>Próx. Manutenção: {equip.nextMaintenance}</span>
                  </div>
                )}

                {equip.status === 'Manutenção' && (
                  <div style={{ marginTop: 12, padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <AlertCircle size={16} color="#EF4444" style={{ marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: '#EF4444' }}>Equipamento indisponível. Aguardando finalização da manutenção.</span>
                  </div>
                )}
              </div>
            ))}

            {filteredEquip.length === 0 && equipments.length > 0 && (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Truck size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)' }}>Nenhum equipamento encontrado no filtro.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
