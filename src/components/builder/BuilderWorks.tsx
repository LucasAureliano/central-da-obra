import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, MapPin, Search, ChevronRight, Calendar, DollarSign, Activity } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { formatCurrency } from '../../utils/formatters';

interface BuilderWorksProps {
  onWorkSelect: (id: string) => void;
}

export function BuilderWorks({ onWorkSelect }: BuilderWorksProps) {
  const { works, isLoadingWorks, setPrimaryWork, primaryWork } = useWorks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todas');

  const filteredWorks = works.filter(work => {
    const matchesSearch = work.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (work.client && work.client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'Todas' || work.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      <header className="page-header" style={{ marginBottom: 24, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Building2 size={28} color="var(--color-primary)" />
            Obras Corporativas
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Gestão de Múltiplos Canteiros</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} />
          Nova Obra
        </button>
      </header>

      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div className="search-bar" style={{ flex: 1, backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 16px', display: 'flex', alignItems: 'center', height: 44 }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou cliente..." 
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
            <option value="Todas">Todas</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Planejamento">Planejamento</option>
            <option value="Atrasada">Atrasada</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>

        {isLoadingWorks ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="loading-spinner" />
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="glass-panel" style={{ padding: 40, textAlign: 'center', borderRadius: 24 }}>
            <Building2 size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.5 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Nenhuma Obra Encontrada</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cadastre sua primeira obra ou altere os filtros.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence>
              {filteredWorks.map(work => {
                const physicalProgress = work.progress || 0;
                const financialProgress = work.budget && work.spent ? Math.min(100, Math.round((work.spent / work.budget) * 100)) : 0;
                
                return (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel"
                    style={{ borderRadius: 20, overflow: 'hidden', cursor: 'pointer', border: primaryWork?.id === work.id ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)' }}
                    onClick={() => onWorkSelect(work.id)}
                  >
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: work.colorTheme || '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 24, fontWeight: 800 }}>
                            {work.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                              {work.name}
                              {primaryWork?.id === work.id && (
                                <span style={{ fontSize: 10, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 10 }}>OBRA PRINCIPAL</span>
                              )}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={14} /> {work.address || 'Endereço não informado'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          padding: '4px 12px', 
                          borderRadius: 12, 
                          fontSize: 12, 
                          fontWeight: 600,
                          backgroundColor: work.status === 'Atrasada' ? 'rgba(239, 68, 68, 0.1)' : 
                                          work.status === 'Finalizada' ? 'rgba(16, 185, 129, 0.1)' : 
                                          'var(--bg-elevated)',
                          color: work.status === 'Atrasada' ? '#EF4444' : 
                                work.status === 'Finalizada' ? '#10B981' : 
                                'var(--text-main)'
                        }}>
                          {work.status || 'Planejamento'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 24, padding: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Activity size={12} /> Avanço Físico</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>{physicalProgress}%</span>
                          </div>
                          <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${physicalProgress}%`, height: '100%', backgroundColor: '#3B82F6', borderRadius: 3 }} />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={12} /> Avanço Financeiro</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>{financialProgress}%</span>
                          </div>
                          <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${financialProgress}%`, height: '100%', backgroundColor: financialProgress > 100 ? '#EF4444' : '#10B981', borderRadius: 3 }} />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            <strong>Cliente:</strong> {work.client || 'Não informado'}
                          </span>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            <strong>Orçamento:</strong> {work.budget ? `${formatCurrency(work.budget)}` : 'Não definido'}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: 12 }}>
                          {primaryWork?.id !== work.id && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setPrimaryWork(work.id); }}
                              style={{ background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}
                            >
                              Tornar Principal
                            </button>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); alert('CentralObra Connect: Painel de permissões para compartilhar cronograma, fotos e relatórios com o cliente desta obra. (Em desenvolvimento)'); }}
                            style={{ background: 'none', border: '1px solid var(--color-primary)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                            Connect
                          </button>
                          <button 
                            className="btn-primary" 
                            style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            Acessar Painel <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
