import React, { useState, useEffect } from 'react';
import { Users, User, Search, Plus, Phone, Mail, Edit2, Trash2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { toast } from 'react-hot-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastService: string;
  totalValue: number;
  totalServices: number;
}

export const ClientsManager: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { triggerGuestAlert } = useAuthModal();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (user && !isGuest) {
      loadClients();
    } else {
      setClients([]);
      setLoading(false);
    }
  }, [user, isGuest]);

  const loadClients = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const q = query(collection(db, 'users', user.uid, 'clients'));
      const querySnapshot = await getDocs(q);
      const loadedClients: Client[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedClients.push({
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          lastService: data.lastService || '-',
          totalValue: data.totalValue || 0,
          totalServices: data.totalServices || 0
        });
      });
      // Sort alphabetically
      loadedClients.sort((a, b) => a.name.localeCompare(b.name));
      setClients(loadedClients);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

  const openNewClient = () => {
    if (isGuest) {
      triggerGuestAlert();
      return;
    }
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '' });
    setIsModalOpen(true);
  };

  const openEditClient = (client: Client) => {
    if (isGuest) {
      triggerGuestAlert();
      return;
    }
    setEditingClient(client);
    setFormData({ name: client.name, email: client.email, phone: client.phone });
    setIsModalOpen(true);
  };

  const saveClient = async () => {
    if (!formData.name) {
      toast.error("O nome � obrigat�rio");
      return;
    }
    if (!user) return;
    
    try {
      if (editingClient) {
        const docRef = doc(db, 'users', user.uid, 'clients', editingClient.id);
        await updateDoc(docRef, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          updatedAt: serverTimestamp()
        });
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await addDoc(collection(db, 'users', user.uid, 'clients'), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          lastService: '-',
          totalValue: 0,
          totalServices: 0,
          createdAt: serverTimestamp()
        });
        toast.success("Cliente cadastrado com sucesso!");
      }
      setIsModalOpen(false);
      loadClients();
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Erro ao salvar cliente");
    }
  };

  const deleteClient = async (id: string) => {
    if (isGuest) {
      triggerGuestAlert();
      return;
    }
    if (!user) return;
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'clients', id));
        toast.success("Cliente removido");
        loadClients();
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Erro ao excluir cliente");
      }
    }
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Meus Clientes</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gest�o e hist�rico de contatos</p>
        </div>
        <button className="btn-primary" onClick={openNewClient} style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </button>
      </div>

      <div className="input-icon-wrapper" style={{ marginBottom: 24 }}>
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Buscar cliente..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field"
        />
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando clientes...
        </div>
      ) : clients.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(30, 58, 138, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Users size={40} color="var(--color-primary)" opacity={0.8} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Nenhum cliente cadastrado</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 300, lineHeight: 1.5 }}>
            Cadastre seu primeiro cliente para gerenciar hist�ricos e gerar or�amentos mais r�pidos.
          </p>
          <button 
            className="btn-primary" onClick={openNewClient}
            style={{ borderRadius: 20, padding: '16px 32px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={20} /> Cadastrar Cliente
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredClients.map(client => (
            <div key={client.id} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{client.name}</h3>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{client.totalServices} {client.totalServices === 1 ? 'servi�o' : 'servi�os'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEditClient(client)} className="btn-icon" style={{ width: 32, height: 32 }}><Edit2 size={16} /></button>
                  <button onClick={() => deleteClient(client.id)} className="btn-icon" style={{ width: 32, height: 32, color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ backgroundColor: 'var(--bg-surface)', padding: 12, borderRadius: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Valor Contratado</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>R$ {client.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ backgroundColor: 'var(--bg-surface)', padding: 12, borderRadius: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>�ltimo Servi�o</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{client.lastService}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-secondary" style={{ flex: 1, padding: '10px 0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }} onClick={() => window.open(`tel:${client.phone}`)}>
                  <Phone size={16} /> Ligar
                </button>
                <button className="btn-secondary" style={{ flex: 1, padding: '10px 0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }} onClick={() => window.open(`mailto:${client.email}`)}>
                  <Mail size={16} /> E-mail
                </button>
              </div>
            </div>
          ))}

          {filteredClients.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Users size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>Nenhum cliente encontrado na busca.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel" style={{ width: '100%', maxWidth: 400, borderRadius: 24, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </h2>
                <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="input-group">
                  <label>Nome Completo *</label>
                  <div className="input-icon-wrapper">
                    <User size={20} />
                    <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Jo�o da Silva" />
                  </div>
                </div>
                <div className="input-group">
                  <label>WhatsApp / Telefone</label>
                  <div className="input-icon-wrapper">
                    <Phone size={20} />
                    <input type="tel" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <div className="input-group">
                  <label>E-mail</label>
                  <div className="input-icon-wrapper">
                    <Mail size={20} />
                    <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="joao@email.com" />
                  </div>
                </div>
              </div>

              <button className="btn-primary" onClick={saveClient} style={{ width: '100%', padding: 16, borderRadius: 16, marginTop: 24, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Check size={20} /> Salvar Cliente
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
