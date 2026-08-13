import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, Search, MapPin, Phone, Mail, Star, FileText } from 'lucide-react';
import { useBuilder } from '../../contexts/BuilderContext';

export function BuilderSuppliers({ onBack }: { onBack: () => void }) {
  const { suppliers } = useBuilder();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');

  const filteredSuppliers = suppliers.filter(sup => {
    const matchesSearch = sup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (sup.cnpj && sup.cnpj.includes(searchTerm));
    const matchesCategory = filterCategory === 'Todas' || sup.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      <header className="page-header" style={{ marginBottom: 24, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Truck size={28} color="#F59E0B" />
            Fornecedores
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Gestão de Parceiros Comerciais</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} />
          Novo Fornecedor
        </button>
      </header>

      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div className="search-bar" style={{ flex: 1, backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 16px', display: 'flex', alignItems: 'center', height: 44 }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou CNPJ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', marginLeft: 12 }}
            />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 16px', color: 'var(--text-main)', outline: 'none', height: 44 }}
          >
            <option value="Todas">Todas Categorias</option>
            <option value="Materiais Básicos">Materiais Básicos</option>
            <option value="Acabamentos">Acabamentos</option>
            <option value="Locação de Equipamentos">Locação de Equipamentos</option>
            <option value="Serviços Especializados">Serviços Especializados</option>
          </select>
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className="glass-panel" style={{ padding: 40, textAlign: 'center', borderRadius: 24 }}>
            <Truck size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.5 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Nenhum Fornecedor</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cadastre seus parceiros e fornecedores de materiais.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filteredSuppliers.map(sup => (
              <motion.div
                key={sup.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ borderRadius: 20, overflow: 'hidden' }}
              >
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{sup.name}</h3>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{sup.category || 'Sem categoria'}</p>
                    </div>
                    {sup.rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                        <Star size={14} fill="#F59E0B" /> {sup.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {sup.cnpj && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                        <FileText size={14} /> CNPJ: {sup.cnpj}
                      </div>
                    )}
                    {sup.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                        <Phone size={14} /> {sup.phone}
                      </div>
                    )}
                    {sup.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                        <Mail size={14} /> {sup.email}
                      </div>
                    )}
                  </div>

                  {sup.products && (
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Principais Produtos/Serviços</div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sup.products}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 12 }}>Histórico</button>
                    <button className="btn-primary" style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 12 }}>Nova Cotação</button>
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
