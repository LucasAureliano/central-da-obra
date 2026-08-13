import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Phone, Edit2, Trash2, X, Check, MapPin, MessageCircle } from 'lucide-react';
import { ClientDetails } from './ClientDetails';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { toast } from 'react-hot-toast';
import type { Client } from '../../types';

export const ClientsManager: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { triggerGuestAlert } = useAuthModal();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    documentNumber: '',
    notes: '',
    photoUrl: '',
    nextVisit: '',
  });

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
          whatsapp: data.whatsapp || data.phone || '',
          address: data.address || '',
          documentNumber: data.documentNumber || '',
          notes: data.notes || '',
          photoUrl: data.photoUrl || '',
          lastVisit: data.lastVisit || '-',
          nextVisit: data.nextVisit || '',
          servicesCount: data.servicesCount || 0,
          totalContracted: data.totalContracted || 0,
          totalValue: data.totalValue || 0,
          totalServices: data.totalServices || 0,
          createdAt: data.createdAt || new Date(),
          userId: user.uid
        });
      });
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
    setFormData({ name: '', email: '', phone: '', whatsapp: '', address: '', documentNumber: '', notes: '', photoUrl: '', nextVisit: '' });
    setIsModalOpen(true);
  };

  const openEditClient = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isGuest) {
      triggerGuestAlert();
      return;
    }
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      whatsapp: client.whatsapp || client.phone || '',
      documentNumber: client.documentNumber || '',
      address: client.address || '',
      notes: client.notes || '',
      photoUrl: client.photoUrl || '',
      nextVisit: client.nextVisit || '',
    });
    setIsModalOpen(true);
  };

  const saveClient = async () => {
    if (!formData.name) {
      toast.error("O nome é obrigatório");
      return;
    }
    if (!user) return;
    
    try {
      if (editingClient?.id) {
        const docRef = doc(db, 'users', user.uid, 'clients', editingClient.id);
        await updateDoc(docRef, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          address: formData.address,
          documentNumber: formData.documentNumber,
          notes: formData.notes,
          photoUrl: formData.photoUrl,
          nextVisit: formData.nextVisit,
          updatedAt: serverTimestamp()
        });
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await addDoc(collection(db, 'users', user.uid, 'clients'), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          address: formData.address,
          documentNumber: formData.documentNumber,
          notes: formData.notes,
          photoUrl: formData.photoUrl,
          nextVisit: formData.nextVisit,
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

  const deleteClient = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isGuest) {
      triggerGuestAlert();
      return;
    }
    if (!user) return;
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        if (!id) return;
        await deleteDoc(doc(db, 'users', user.uid, 'clients', id));
        toast.success("Cliente removido");
        if (selectedClient?.id === id) setSelectedClient(null);
        loadClients();
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Erro ao excluir cliente");
      }
    }
  };

  const openWhatsApp = (phone?: string) => {
    if (!phone) return;
    const clean = phone.replace(/\D/g, '');
    const num = clean.length <= 11 ? `55${clean}` : clean;
    window.open(`https://wa.me/${num}`, '_blank');
  };

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  if (viewingClient) {
    return <ClientDetails client={viewingClient} onBack={() => setViewingClient(null)} onEdit={openEditClient} />;
  }

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Meus Clientes</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gestão e histórico de contatos (CRM)</p>
        </div>
        <button className="btn-primary" onClick={openNewClient} style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="input-icon-wrapper" style={{ marginBottom: 20 }}>
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Buscar cliente por nome..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field"
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 16 }} />
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 16 }} />
        </div>
      ) : clients.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(30, 58, 138, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Users size={40} color="var(--color-primary)" opacity={0.8} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Nenhum cliente cadastrado</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 300, lineHeight: 1.5 }}>
            Cadastre seu primeiro cliente para gerenciar históricos, agendamentos e orçamentos comerciais.
          </p>
          <button 
            className="btn-primary" onClick={openNewClient}
            style={{ borderRadius: 20, padding: '16px 32px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={20} /> Cadastrar Cliente
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredClients.map(client => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setViewingClient(client)}
              className="glass-panel card-premium-interactive"
              style={{ padding: 18, borderRadius: 20, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {client.photoUrl ? (
                    <img src={client.photoUrl} alt={client.name} style={{ width: 48, height: 48, borderRadius: 24, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{client.name}</h3>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{client.totalServices} {client.totalServices === 1 ? 'serviço' : 'serviços'} contratado(s)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={(e) => openEditClient(client, e)} className="btn-icon" style={{ width: 32, height: 32 }}><Edit2 size={15} /></button>
                  <button onClick={(e) => deleteClient(client.id!, e)} className="btn-icon" style={{ width: 32, height: 32, color: 'var(--color-danger)' }}><Trash2 size={15} /></button>
                </div>
              </div>

              {client.address && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} color="var(--color-primary)" /> {client.address}
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 10, borderRadius: 12 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Valor Contratado</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>{fmt(client.totalValue || 0)}</span>
                </div>
                <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 10, borderRadius: 12 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Próxima Visita</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{client.nextVisit || '-'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                {client.phone && (
                  <button className="btn-secondary" style={{ flex: 1, padding: '8px 0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 600 }} onClick={() => window.open(`tel:${client.phone}`)}>
                    <Phone size={14} /> Ligar
                  </button>
                )}
                {(client.whatsapp || client.phone) && (
                  <button style={{ flex: 1, padding: '8px 0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 700, backgroundColor: '#25D366', color: '#FFF', border: 'none', cursor: 'pointer' }} onClick={() => openWhatsApp(client.whatsapp || client.phone)}>
                    <MessageCircle size={14} /> WhatsApp
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}


      {/* FORM CADASTRO MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="glass-panel" style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente no CRM'}
                </h2>
                <button style={{ background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}><X size={18} /></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); saveClient(); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nome Completo do Cliente *</label>
                  <input required type="text" className="input-premium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: João da Silva" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Telefone</label>
                    <input type="tel" className="input-premium" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(11) 99999-0000" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>WhatsApp</label>
                    <input type="tel" className="input-premium" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="(11) 99999-0000" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>E-mail</label>
                    <input type="email" className="input-premium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="joao@email.com" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>CPF/CNPJ</label>
                    <input type="text" className="input-premium" value={formData.documentNumber} onChange={e => setFormData({...formData, documentNumber: e.target.value})} placeholder="000.000.000-00" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Endereço Completo</label>
                  <input type="text" className="input-premium" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Rua, Número, Bairro, Cidade - UF" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Data da Próxima Visita / Atendimento</label>
                  <input type="date" className="input-premium" value={formData.nextVisit} onChange={e => setFormData({...formData, nextVisit: e.target.value})} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Observações / Preferências</label>
                  <textarea className="input-premium" style={{ minHeight: 70, resize: 'vertical' }} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Ex: Prefere atendimento no período da manhã..." />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 8, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Check size={18} /> Salvar Cliente
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
