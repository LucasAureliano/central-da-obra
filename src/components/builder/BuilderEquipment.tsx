import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, Search, MapPin, Wrench, AlertTriangle, Calendar, Settings } from 'lucide-react';
import { useBuilder } from '../../contexts/BuilderContext';
import { useWorks } from '../../contexts/WorksContext';

export function BuilderEquipment({ onBack }: { onBack: () => void }) {
  const { equipments } = useBuilder();
  const { works } = useWorks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const filteredEquipments = equipments.filter(equip => {
    const matchesSearch = equip.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (equip.tag && equip.tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'Todos' || equip.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      <header className="page-header" style={{ marginBottom: 24, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Truck size={28} color="#06B6D4" />
            Equipamentos
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Controle de Patrimônio e Manutenção</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} />
          Novo Equipamento
        </button>
      </header>

      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div className="search-bar" style={{ flex: 1, backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 16px', display: 'flex', alignItems: 'center', height: 44 }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou TAG..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', marginLeft: 12 }}
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 16px', color: 'var(--text-main)', outline: 'none', height: 44 }}
          >
            <option value="Todos">Status</option>
            <option value="Em Uso">Em Uso</option>
            <option value="Disponível">Disponível</option>
            <option value="Manutenção">Manutenção</option>
          </select>
        </div>

        {filteredEquipments.length === 0 ? (
          <div className="glass-panel" style={{ padding: 40, textAlign: 'center', borderRadius: 24 }}>
            <Truck size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.5 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Nenhum Equipamento</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cadastre maquinário pesado, veículos e ferramentas.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filteredEquipments.map(equip => {
              const linkedWork = works.find(w => w.id === equip.linkedWorkId);
              
              return (
                <motion.div
                  key={equip.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel"
                  style={{ borderRadius: 20, overflow: 'hidden' }}
                >
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
                          <Truck size={24} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{equip.name}</h3>
                          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', backgroundColor: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4, marginTop: 4, display: 'inline-block' }}>
                            {equip.tag || 'Sem TAG'}
                          </span>
                        </div>
                      </div>
                      <div style={{ 
                        padding: '4px 8px', 
                        borderRadius: 8, 
                        fontSize: 11, 
                        fontWeight: 700,
                        backgroundColor: equip.status === 'Em Uso' ? 'rgba(59, 130, 246, 0.1)' : 
                                       equip.status === 'Disponível' ? 'rgba(16, 185, 129, 0.1)' : 
                                       'rgba(239, 68, 68, 0.1)',
                        color: equip.status === 'Em Uso' ? '#3B82F6' : 
                               equip.status === 'Disponível' ? '#10B981' : 
                               '#EF4444'
                      }}>
                        {equip.status}
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={14} /> Alocação Atual
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
                        {linkedWork ? linkedWork.name : 'Central / Pátio'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                        <Calendar size={14} />
                        Próx. Manutenção: {equip.nextMaintenance || 'N/A'}
                      </div>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 }} className="hover-bg-glass">
                        <Settings size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
