import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, MapPin, Briefcase, Phone, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { useBuilder } from '../../contexts/BuilderContext';
import { useWorks } from '../../contexts/WorksContext';

export function BuilderTeams({ onBack }: { onBack: () => void }) {
  const { employees } = useBuilder();
  const { works } = useWorks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'Todos' || emp.role === filterRole;
    const matchesStatus = filterStatus === 'Todos' || emp.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      <header className="page-header" style={{ marginBottom: 24, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Users size={28} color="#8B5CF6" />
            Equipes & Mão de Obra
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Gestão de Pessoal e Alocação</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} />
          Novo Colaborador
        </button>
      </header>

      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div className="search-bar" style={{ flex: 1, backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 16px', display: 'flex', alignItems: 'center', height: 44 }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar colaborador..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', marginLeft: 12 }}
            />
          </div>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 16px', color: 'var(--text-main)', outline: 'none', height: 44 }}
          >
            <option value="Todos">Cargos</option>
            <option value="Engenheiro">Engenheiro</option>
            <option value="Mestre de Obras">Mestre de Obras</option>
            <option value="Pedreiro">Pedreiro</option>
            <option value="Ajudante">Ajudante</option>
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 16px', color: 'var(--text-main)', outline: 'none', height: 44 }}
          >
            <option value="Todos">Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Férias">Férias</option>
            <option value="Afastado">Afastado</option>
          </select>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="glass-panel" style={{ padding: 40, textAlign: 'center', borderRadius: 24 }}>
            <Users size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.5 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Nenhum Colaborador</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cadastre engenheiros, mestres, pedreiros e terceiros.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filteredEmployees.map(emp => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ borderRadius: 20, overflow: 'hidden' }}
              >
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--bg-elevated)', border: '2px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>
                      {emp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{emp.name}</h3>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>{emp.role}</p>
                    </div>
                    <div style={{ 
                      padding: '4px 8px', 
                      borderRadius: 8, 
                      fontSize: 11, 
                      fontWeight: 700,
                      backgroundColor: emp.status === 'Ativo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: emp.status === 'Ativo' ? '#10B981' : '#EF4444'
                    }}>
                      {emp.status}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {emp.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                        <Phone size={14} /> {emp.phone}
                      </div>
                    )}
                    {emp.team && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                        <Users size={14} /> Equipe: {emp.team}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={14} /> Alocação Atual
                    </div>
                    {emp.linkedWorks && emp.linkedWorks.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {emp.linkedWorks.map(wId => {
                          const work = works.find(w => w.id === wId);
                          return (
                            <span key={wId} style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              • {work ? work.name : 'Obra Desconhecida'}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Disponível / Não alocado</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
