import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Search, Calendar, FileText, User, Tag, Clock, ArrowRight } from 'lucide-react';
import { useBuilder } from '../../contexts/BuilderContext';
import { useWorks } from '../../contexts/WorksContext';

const PROCUREMENT_STEPS = [
  'Solicitado',
  'Cotando',
  'Aprovado',
  'Comprado',
  'Entregue'
];

export function BuilderProcurement({ onBack }: { onBack: () => void }) {
  const { procurements, isLoading } = useBuilder();
  const { works } = useWorks();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Group by status for Kanban
  const groupedProcurements = useMemo(() => {
    const grouped = PROCUREMENT_STEPS.reduce((acc, step) => {
      acc[step] = [];
      return acc;
    }, {} as Record<string, any[]>);

    procurements.forEach(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.requester && p.requester.toLowerCase().includes(searchTerm.toLowerCase()));
      if (matchSearch && grouped[p.status]) {
        grouped[p.status].push(p);
      }
    });

    return grouped;
  }, [procurements, searchTerm]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return '#EF4444';
      case 'Média': return '#F59E0B';
      case 'Baixa': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div className="page-container" style={{ paddingBottom: 100, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header className="page-header" style={{ marginBottom: 24, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShoppingCart size={28} color="#F97316" />
            Centro de Compras
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Fluxo de Cotações e Suprimentos</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} />
          Nova Requisição
        </button>
      </header>

      <div style={{ padding: '0 20px', marginBottom: 24, flexShrink: 0 }}>
        <div className="search-bar" style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 16px', display: 'flex', alignItems: 'center', height: 44, maxWidth: 400 }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Buscar requisição..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', marginLeft: 12 }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowX: 'auto', padding: '0 20px', display: 'flex', gap: 16 }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: 40 }}>
            <div className="loading-spinner" />
          </div>
        ) : (
          PROCUREMENT_STEPS.map(step => (
            <div key={step} style={{ minWidth: 320, width: 320, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-elevated)', borderRadius: 20, padding: 16, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>{step}</h3>
                <span style={{ backgroundColor: 'var(--bg-glass)', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                  {groupedProcurements[step].length}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1, paddingRight: 4 }}>
                <AnimatePresence>
                  {groupedProcurements[step].map(p => {
                    const linkedWork = works.find(w => w.id === p.linkedWorkId);

                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel hover-scale"
                        style={{ padding: 16, borderRadius: 16, cursor: 'grab', borderLeft: `4px solid ${getPriorityColor(p.priority)}` }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>#{p.id.substring(0, 5).toUpperCase()}</span>
                          {p.priority && (
                            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 6, backgroundColor: `${getPriorityColor(p.priority)}20`, color: getPriorityColor(p.priority) }}>
                              {p.priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                        
                        <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                          {p.title}
                        </h4>
                        
                        {linkedWork && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Tag size={12} /> Obra: {linkedWork.name}
                          </div>
                        )}
                        
                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                            <User size={12} /> {p.requester || 'Sistema'}
                          </div>
                          {p.items && p.items.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--text-main)', backgroundColor: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: 8 }}>
                              <FileText size={12} /> {p.items.length} itens
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {groupedProcurements[step].length === 0 && (
                  <div style={{ padding: 32, textAlign: 'center', border: '2px dashed var(--border-subtle)', borderRadius: 16 }}>
                    <ShoppingCart size={24} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>Nenhuma requisição nesta etapa</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
