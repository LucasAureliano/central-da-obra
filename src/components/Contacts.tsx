import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Phone, Building2, UserCircle2, HardHat } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { TiltCard } from './TiltCard';

type ContactType = 'cliente' | 'fornecedor' | 'equipe';

interface Contact {
  id: string;
  name: string;
  type: ContactType;
  phone: string;
  company?: string;
  specialty?: string;
  notes?: string;
}

export function Contacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState<ContactType | 'todos'>('todos');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ContactType>('fornecedor');
  const [newPhone, setNewPhone] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'contacts'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
      setContacts(data.sort((a, b) => a.name.localeCompare(b.name)));
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName || !newPhone) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        userId: user.uid,
        name: newName,
        type: newType,
        phone: newPhone,
        company: newCompany,
        specialty: newSpecialty,
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewName('');
      setNewPhone('');
      setNewCompany('');
      setNewSpecialty('');
    } catch (error) {
      console.error("Error adding contact", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchesFilter = filter === 'todos' || c.type === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.company?.toLowerCase().includes(search.toLowerCase()) ||
                          c.specialty?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: ContactType) => {
    switch (type) {
      case 'cliente': return <UserCircle2 size={24} color="#3B82F6" />;
      case 'fornecedor': return <Building2 size={24} color="#F59E0B" />;
      case 'equipe': return <HardHat size={24} color="#10B981" />;
    }
  };

  return (
    <div className="screen-content" style={{ padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Contatos</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary" 
          style={{ width: 40, height: 40, padding: 0, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
          <input 
            type="text" 
            placeholder="Buscar contatos, empresas..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium"
            style={{ width: '100%', paddingLeft: 44 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {(['todos', 'cliente', 'fornecedor', 'equipe'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backgroundColor: filter === t ? 'var(--color-primary)' : 'var(--bg-elevated)',
                color: filter === t ? '#FFF' : 'var(--text-muted)',
                border: filter === t ? 'none' : '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              {t === 'todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        {filteredContacts.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Nenhum contato encontrado.</p>
          </div>
        ) : (
          filteredContacts.map(contact => (
            <TiltCard key={contact.id} style={{ padding: 16, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {getIcon(contact.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {contact.name}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {contact.company || contact.specialty || contact.type}
                </p>
              </div>
              <a 
                href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}
              >
                <Phone size={18} />
              </a>
            </TiltCard>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowAddModal(false)} />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            style={{ width: '100%', maxWidth: 500, backgroundColor: 'var(--bg-main)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', position: 'relative' }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Novo Contato</h2>
            <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Tipo de Contato</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['cliente', 'fornecedor', 'equipe'] as ContactType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      style={{
                        flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
                        backgroundColor: newType === t ? 'var(--color-primary-alpha)' : 'var(--bg-elevated)',
                        color: newType === t ? 'var(--color-primary)' : 'var(--text-muted)',
                        border: newType === t ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer'
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Nome Completo</label>
                <input type="text" className="input-premium" value={newName} onChange={e => setNewName(e.target.value)} required />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>WhatsApp</label>
                <input type="tel" className="input-premium" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="(11) 99999-9999" required />
              </div>

              {newType !== 'cliente' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Empresa (Opcional)</label>
                    <input type="text" className="input-premium" value={newCompany} onChange={e => setNewCompany(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Especialidade (Opcional)</label>
                    <input type="text" className="input-premium" value={newSpecialty} onChange={e => setNewSpecialty(e.target.value)} placeholder="Ex: Eletricista" />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ flex: 1, padding: 14 }}>Cancelar</button>
                <button type="submit" disabled={isSubmitting || !newName || !newPhone} className="btn-primary" style={{ flex: 1, padding: 14 }}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Contato'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
