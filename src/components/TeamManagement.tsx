import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Users, UserPlus, Phone, Mail, 
  Briefcase, Trash2, Search, Building2, User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, doc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

interface Contact {
  id: string;
  name: string;
  role: string;
  category: 'team' | 'client';
  phone: string;
  email: string;
}

export function TeamManagement({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState<'all' | 'team' | 'client'>('all');
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    category: 'team' as 'team' | 'client',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'users', user.uid, 'contacts'), orderBy('addedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Contact[];
      setContacts(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newContact.name || !newContact.role) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'contacts'), {
        ...newContact,
        addedAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewContact({ name: '', role: '', category: 'team', phone: '', email: '' });
    } catch (err) {
      console.error('Erro ao adicionar contato', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm('Tem certeza que deseja remover este contato?')) {
      await deleteDoc(doc(db, 'users', user.uid, 'contacts', id));
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchCategory = filter === 'all' || c.category === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 120 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>

      <div className="flex-space-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="text-2xl font-black">Gestão de Contatos</h1>
          <p className="text-xs text-muted">Sua equipe de obra, clientes e parceiros</p>
        </div>
        <button 
          className="btn-primary" 
          style={{ width: 44, height: 44, borderRadius: 22, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={20} />
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{ marginBottom: 24 }}>
        <div className="input-group" style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 13 }} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou função..." 
            className="input-premium"
            style={{ paddingLeft: 44 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }} className="hide-scrollbar">
          <button 
            className={`btn-secondary ${filter === 'all' ? 'active-filter' : ''}`}
            style={{ padding: '8px 16px', borderRadius: 100, fontSize: 13, backgroundColor: filter === 'all' ? 'var(--color-primary-alpha)' : 'var(--bg-surface)', color: filter === 'all' ? 'var(--color-primary)' : 'var(--text-muted)', border: filter === 'all' ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button 
            className={`btn-secondary ${filter === 'team' ? 'active-filter' : ''}`}
            style={{ padding: '8px 16px', borderRadius: 100, fontSize: 13, backgroundColor: filter === 'team' ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-surface)', color: filter === 'team' ? '#F59E0B' : 'var(--text-muted)', border: filter === 'team' ? '1px solid #F59E0B' : '1px solid var(--border-subtle)', whiteSpace: 'nowrap', display: 'flex', gap: 6, alignItems: 'center' }}
            onClick={() => setFilter('team')}
          >
            <Users size={14} /> Mão de Obra
          </button>
          <button 
            className={`btn-secondary ${filter === 'client' ? 'active-filter' : ''}`}
            style={{ padding: '8px 16px', borderRadius: 100, fontSize: 13, backgroundColor: filter === 'client' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-surface)', color: filter === 'client' ? '#3B82F6' : 'var(--text-muted)', border: filter === 'client' ? '1px solid #3B82F6' : '1px solid var(--border-subtle)', whiteSpace: 'nowrap', display: 'flex', gap: 6, alignItems: 'center' }}
            onClick={() => setFilter('client')}
          >
            <Building2 size={14} /> Clientes/Fornecedores
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredContacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ opacity: 0.2, margin: '0 auto', marginBottom: 16 }} />
            <p>Nenhum contato encontrado.</p>
          </div>
        ) : (
          filteredContacts.map((contact, index) => (
            <div key={contact.id} className={`glass-panel animate-stagger-${Math.min(index + 1, 5)}`} style={{ padding: 16, borderRadius: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: contact.category === 'team' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: contact.category === 'team' ? '#F59E0B' : '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{contact.name}</h3>
                    <span style={{ fontSize: 12, color: contact.category === 'team' ? '#F59E0B' : '#3B82F6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Briefcase size={12} /> {contact.role}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(contact.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', opacity: 0.7 }}>
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                {contact.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                    <Phone size={14} /> {contact.phone}
                  </div>
                )}
                {contact.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                    <Mail size={14} /> {contact.email}
                  </div>
                )}
                {!contact.phone && !contact.email && (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhum meio de contato registrado</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }} className="animate-fade-in">
          <form 
            onSubmit={handleAddContact}
            className="glass-panel animate-fade-in" 
            style={{ width: '100%', backgroundColor: 'var(--bg-surface)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--text-main)' }}>Novo Contato</h2>
            
            <div className="input-group">
              <span className="input-label">Categoria</span>
              <div style={{ display: 'flex', gap: 12 }}>
                <div 
                  onClick={() => setNewContact({...newContact, category: 'team'})}
                  style={{ flex: 1, padding: 12, borderRadius: 12, border: newContact.category === 'team' ? '2px solid #F59E0B' : '1px solid var(--border-subtle)', backgroundColor: newContact.category === 'team' ? 'rgba(245, 158, 11, 0.05)' : 'transparent', textAlign: 'center', cursor: 'pointer', fontWeight: 600, color: newContact.category === 'team' ? '#F59E0B' : 'var(--text-muted)' }}
                >
                  Equipe / Mão de Obra
                </div>
                <div 
                  onClick={() => setNewContact({...newContact, category: 'client'})}
                  style={{ flex: 1, padding: 12, borderRadius: 12, border: newContact.category === 'client' ? '2px solid #3B82F6' : '1px solid var(--border-subtle)', backgroundColor: newContact.category === 'client' ? 'rgba(59, 130, 246, 0.05)' : 'transparent', textAlign: 'center', cursor: 'pointer', fontWeight: 600, color: newContact.category === 'client' ? '#3B82F6' : 'var(--text-muted)' }}
                >
                  Cliente / Fornecedor
                </div>
              </div>
            </div>

            <div className="input-group">
              <span className="input-label">Nome Completo *</span>
              <input 
                type="text" 
                className="input-premium" 
                required 
                value={newContact.name}
                onChange={e => setNewContact({...newContact, name: e.target.value})}
              />
            </div>

            <div className="input-group">
              <span className="input-label">Função / Papel *</span>
              <input 
                type="text" 
                className="input-premium" 
                placeholder={newContact.category === 'team' ? "Ex: Pedreiro, Mestre de Obras..." : "Ex: Proprietário, Loja de Materiais..."}
                required 
                value={newContact.role}
                onChange={e => setNewContact({...newContact, role: e.target.value})}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-group">
                <span className="input-label">Telefone</span>
                <input 
                  type="tel" 
                  className="input-premium" 
                  placeholder="(00) 00000-0000"
                  value={newContact.phone}
                  onChange={e => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
              <div className="input-group">
                <span className="input-label">E-mail</span>
                <input 
                  type="email" 
                  className="input-premium" 
                  placeholder="email@exemplo.com"
                  value={newContact.email}
                  onChange={e => setNewContact({...newContact, email: e.target.value})}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ flex: 1, padding: 14 }}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: 14 }}>
                Salvar Contato
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
