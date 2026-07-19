import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { toast } from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  description: string;
}

export const ServicesCatalog: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { triggerGuestAlert } = useAuthModal();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [formData, setFormData] = useState({ name: '', category: 'Alvenaria', unit: 'm�', price: '', description: '' });

  useEffect(() => {
    if (user && !isGuest) {
      loadServices();
    } else {
      setServices([]);
      setLoading(false);
    }
  }, [user, isGuest]);

  const loadServices = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const q = query(collection(db, 'users', user.uid, 'services'));
      const querySnapshot = await getDocs(q);
      const loaded: Service[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          name: data.name || '',
          category: data.category || '',
          unit: data.unit || 'm�',
          price: data.price || 0,
          description: data.description || ''
        });
      });
      loaded.sort((a, b) => a.name.localeCompare(b.name));
      setServices(loaded);
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Erro ao carregar servi�os");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.category.toLowerCase().includes(filter.toLowerCase()));

  const openNewService = () => {
    if (isGuest) {
      triggerGuestAlert();
      return;
    }
    setEditingService(null);
    setFormData({ name: '', category: 'Alvenaria', unit: 'm�', price: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditService = (service: Service) => {
    if (isGuest) {
      triggerGuestAlert();
      return;
    }
    setEditingService(service);
    setFormData({ name: service.name, category: service.category, unit: service.unit, price: service.price.toString(), description: service.description });
    setIsModalOpen(true);
  };

  const saveService = async () => {
    if (!formData.name || !formData.price) {
      toast.error("Nome e valor s�o obrigat�rios");
      return;
    }
    if (!user) return;
    
    try {
      if (editingService) {
        const docRef = doc(db, 'users', user.uid, 'services', editingService.id);
        await updateDoc(docRef, {
          name: formData.name,
          category: formData.category,
          unit: formData.unit,
          price: parseFloat(formData.price.replace(',', '.')),
          description: formData.description,
          updatedAt: serverTimestamp()
        });
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await addDoc(collection(db, 'users', user.uid, 'services'), {
          name: formData.name,
          category: formData.category,
          unit: formData.unit,
          price: parseFloat(formData.price.replace(',', '.')),
          description: formData.description,
          createdAt: serverTimestamp()
        });
        toast.success("Serviço cadastrado com sucesso!");
      }
      setIsModalOpen(false);
      loadServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Erro ao salvar serviço");
    }
  };

  const deleteService = async (id: string) => {
    if (isGuest) {
      triggerGuestAlert();
      return;
    }
    if (!user) return;
    if (confirm('Tem certeza que deseja excluir este serviço do catálogo?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'services', id));
        toast.success("Serviço removido");
        loadServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Erro ao excluir serviço");
      }
    }
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Meu Cat�logo</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gerencie seus servi�os padr�o</p>
        </div>
        <button className="btn-primary" onClick={openNewService} style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </button>
      </div>

      <div className="input-icon-wrapper" style={{ marginBottom: 24 }}>
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Buscar servi�o ou categoria..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field"
        />
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando cat�logo...
        </div>
      ) : services.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(30, 58, 138, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Briefcase size={40} color="var(--color-primary)" opacity={0.8} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Cat�logo Vazio</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 300, lineHeight: 1.5 }}>
            Cadastre seus servi�os padr�o (M�o de obra, projetos, consultorias) para agilizar na hora de criar novos or�amentos.
          </p>
          <button 
            className="btn-primary" onClick={openNewService}
            style={{ borderRadius: 20, padding: '16px 32px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={20} /> Cadastrar Servi�o
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredServices.map(service => (
            <div key={service.id} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{service.name}</h3>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 8 }}>{service.category}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEditService(service)} className="btn-icon" style={{ width: 32, height: 32 }}><Edit2 size={16} /></button>
                  <button onClick={() => deleteService(service.id)} className="btn-icon" style={{ width: 32, height: 32, color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                </div>
              </div>
              {service.description && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.4 }}>{service.description}</p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: 12, borderRadius: 12, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Valor de tabela:</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#10B981' }}>R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>/ {service.unit}</span></span>
              </div>
            </div>
          ))}

          {filteredServices.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Briefcase size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>Nenhum servi�o encontrado na busca.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel" style={{ width: '100%', maxWidth: 400, borderRadius: 24, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {editingService ? 'Editar Servi�o' : 'Novo Servi�o'}
                </h2>
                <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="input-group">
                  <label>Nome do Servi�o *</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Reboco Interno" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="input-group">
                    <label>Categoria</label>
                    <select className="select-field" style={{ padding: '0 16px' }} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="Alvenaria">Alvenaria</option>
                      <option value="Hidr�ulica">Hidr�ulica</option>
                      <option value="El�trica">El�trica</option>
                      <option value="Pintura">Pintura</option>
                      <option value="Acabamento">Acabamento</option>
                      <option value="Projeto">Projeto</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Unidade</label>
                    <select className="select-field" style={{ padding: '0 16px' }} value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                      <option value="m�">m�</option>
                      <option value="m">m</option>
                      <option value="un">un (unidade)</option>
                      <option value="dia">dia</option>
                      <option value="hr">hora</option>
                      <option value="pt">ponto</option>
                      <option value="global">global</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Valor Padr�o (R$) *</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px' }} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
                </div>

                <div className="input-group">
                  <label>Descri��o Opcional</label>
                  <textarea className="textarea-field" style={{ padding: '16px', height: 80, resize: 'none' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detalhes do servi�o..." />
                </div>
              </div>

              <button className="btn-primary" onClick={saveService} style={{ width: '100%', padding: 16, borderRadius: 16, marginTop: 24, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Check size={20} /> Salvar Servi�o
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
