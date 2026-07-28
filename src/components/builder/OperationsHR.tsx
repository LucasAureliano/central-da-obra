import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Trash2, X, Save, ArrowLeft, Building2, Phone } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export interface CorporateWorker {
  id?: string;
  name: string;
  role: string;
  phone?: string;
  team?: string;
  specialty?: string;
  assignedWork: string;
  status: 'Ativo em Obra' | 'Disponível' | 'Férias' | 'Afastado';
  hoursPlanned?: number;
  notes?: string;
  createdAt?: any;
}

const ROLES = [
  'Engenheiro de Obra',
  'Mestre de Obras',
  'Encarregado de Turma',
  'Pedreiro',
  'Servente',
  'Eletricista',
  'Encanador / Anteneiro',
  'Pintor / Acabador',
  'Carpinteiro / Armador',
  'Empreiteira Terceirizada'
];

export const OperationsHR: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { user, isGuest } = useAuth();
  const [workers, setWorkers] = useState<CorporateWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<CorporateWorker | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [phone, setPhone] = useState('');
  const [team, setTeam] = useState('Equipe Estrutural A');
  const [specialty, setSpecialty] = useState('Alvenaria e Concreto');
  const [assignedWork, setAssignedWork] = useState('Obra Principal');
  const [status, setStatus] = useState<CorporateWorker['status']>('Ativo em Obra');
  const [hoursPlanned, setHoursPlanned] = useState('44');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'corporate_workers'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as CorporateWorker));
        setWorkers(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setWorkers([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      try {
        const local = localStorage.getItem('co_corporate_workers');
        if (local) setWorkers(JSON.parse(local));
        else setWorkers([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (items: CorporateWorker[]) => {
    localStorage.setItem('co_corporate_workers', JSON.stringify(items));
  };

  const openAddModal = () => {
    setEditingWorker(null);
    setName('');
    setRole(ROLES[0]);
    setPhone('');
    setTeam('Equipe Estrutural A');
    setSpecialty('Alvenaria e Concreto');
    setAssignedWork('Obra Principal');
    setStatus('Ativo em Obra');
    setHoursPlanned('44');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe o nome do colaborador.');
      return;
    }

    setSubmitting(true);
    const payload: CorporateWorker = {
      name,
      role,
      phone,
      team,
      specialty,
      assignedWork,
      status,
      hoursPlanned: parseFloat(hoursPlanned) || 44,
      notes,
    };

    try {
      if (user && !isGuest) {
        if (editingWorker?.id) {
          const docRef = doc(db, 'users', user.uid, 'corporate_workers', editingWorker.id);
          await updateDoc(docRef, { ...payload, updatedAt: serverTimestamp() });
          toast.success('Colaborador atualizado!');
        } else {
          await addDoc(collection(db, 'users', user.uid, 'corporate_workers'), {
            ...payload,
            createdAt: serverTimestamp()
          });
          toast.success('Colaborador adicionado à equipe!');
        }
      } else {
        if (editingWorker?.id) {
          const updated = workers.map(w => w.id === editingWorker.id ? { ...w, ...payload } : w);
          setWorkers(updated);
          saveToLocal(updated);
        } else {
          const newItem = { id: crypto.randomUUID(), ...payload };
          const updated = [newItem, ...workers];
          setWorkers(updated);
          saveToLocal(updated);
        }
        toast.success('Colaborador salvo localmente!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar colaborador.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este colaborador da equipe?')) return;
    try {
      if (user && !isGuest) {
        await deleteDoc(doc(db, 'users', user.uid, 'corporate_workers', id));
      } else {
        const updated = workers.filter(w => w.id !== id);
        setWorkers(updated);
        saveToLocal(updated);
      }
      toast.success('Colaborador removido.');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    w.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
    w.assignedWork.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Gestão de Equipes & RH</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Alocação de mão de obra e terceirizados por obra</p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <UserPlus size={16} /> Novo Colaborador
        </button>
      </div>

      {/* Search Input */}
      {workers.length > 0 && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 13 }} />
          <input
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Buscar por nome, cargo ou obra alocada..."
            className="input-premium"
            style={{ paddingLeft: 42, height: 44 }}
          />
        </div>
      )}

      {/* Workers Grid */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 100, borderRadius: 20 }} />
          <div className="skeleton-glass" style={{ height: 100, borderRadius: 20 }} />
        </div>
      ) : workers.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Nenhum Colaborador Cadastrado</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Cadastre sua equipe técnica e terceirizados para gerenciar a distribuição nos canteiros.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 14, marginTop: 4 }}>
            + Cadastrar Primeiro Colaborador
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {filteredWorkers.map(w => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: 18, borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{w.name}</h3>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6' }}>{w.role}</span>
                  </div>
                  <span className="status-chip" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}>
                    {w.status}
                  </span>
                </div>

                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Building2 size={13} color="#8B5CF6" /> Obra Alocada: <strong style={{ color: 'var(--text-main)' }}>{w.assignedWork}</strong>
                </span>
                {w.phone && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Phone size={12} /> {w.phone}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Carga Horária: {w.hoursPlanned || 44}h/sem</span>
                <button onClick={() => w.id && handleDelete(w.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Add Colaborador */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="glass-panel" style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '85vh', overflowY: 'auto' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Novo Colaborador / Terceirizado</h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nome Completo *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Carlos Silva" className="input-premium" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Cargo / Função</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="input-premium" style={{ height: 44 }}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Obra Alocada *</label>
                    <input required value={assignedWork} onChange={e => setAssignedWork(e.target.value)} placeholder="Ex: Residência Alpha" className="input-premium" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Telefone / WhatsApp</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Status de Trabalho</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="input-premium" style={{ height: 44 }}>
                      <option value="Ativo em Obra">Ativo em Obra</option>
                      <option value="Disponível">Disponível</option>
                      <option value="Férias">Férias</option>
                      <option value="Afastado">Afastado</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Colaborador</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
