import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, Plus, MapPin, User, Clock, CheckCircle2, AlertTriangle, ArrowLeft, Trash2, Edit3, X, Save, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export interface ServiceTask {
  id: string;
  title: string;
  isDone: boolean;
}

export interface ActiveService {
  id?: string;
  title: string;
  clientName: string;
  address?: string;
  totalAmount: number;
  progress: number;
  deadline?: string;
  status: 'Agendado' | 'Em Execução' | 'Atrasado' | 'Concluído';
  tasks?: ServiceTask[];
  notes?: string;
  createdAt?: any;
}

interface ServicesManagerProps {
  onBack?: () => void;
}

export function ServicesManager({ onBack }: ServicesManagerProps) {
  const { user, isGuest } = useAuth();
  const [services, setServices] = useState<ActiveService[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ActiveService | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ActiveService['status']>('Agendado');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'services'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ActiveService));
        data.sort((a, b) => {
          const t1 = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const t2 = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return t2 - t1;
        });
        setServices(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setServices([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      // Guest local storage
      try {
        const local = localStorage.getItem('co_active_services');
        if (local) setServices(JSON.parse(local));
        else setServices([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (items: ActiveService[]) => {
    localStorage.setItem('co_active_services', JSON.stringify(items));
  };

  const openAddModal = () => {
    setEditingService(null);
    setTitle('');
    setClientName('');
    setAddress('');
    setAmountInput('');
    setDeadline('');
    setStatus('Agendado');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (srv: ActiveService) => {
    setEditingService(srv);
    setTitle(srv.title);
    setClientName(srv.clientName);
    setAddress(srv.address || '');
    setAmountInput(srv.totalAmount ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(srv.totalAmount) : '');
    setDeadline(srv.deadline || '');
    setStatus(srv.status || 'Em andamento');
    setNotes(srv.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) {
      toast.error('Preencha o título do serviço e o nome do cliente.');
      return;
    }

    setSubmitting(true);
    const numericAmount = amountInput ? parseInt(amountInput.replace(/\D/g, '')) / 100 : 0;

    const srvData: Partial<ActiveService> = {
      title,
      clientName,
      address,
      totalAmount: numericAmount,
      deadline,
      status,
      notes,
    };

    try {
      if (user && !isGuest) {
        if (editingService?.id) {
          const docRef = doc(db, 'users', user.uid, 'services', editingService.id);
          await updateDoc(docRef, { ...srvData, updatedAt: serverTimestamp() });
          toast.success('Serviço atualizado!');
        } else {
          await addDoc(collection(db, 'users', user.uid, 'services'), {
            ...srvData,
            progress: 0,
            tasks: [
              { id: '1', title: 'Preparação e isolamento do local', isDone: false },
              { id: '2', title: 'Execução do serviço principal', isDone: false },
              { id: '3', title: 'Limpeza e entrega final ao cliente', isDone: false },
            ],
            createdAt: serverTimestamp()
          });
          toast.success('Serviço criado com sucesso!');
        }
      } else {
        if (editingService?.id) {
          const updated = services.map(s => s.id === editingService.id ? { ...s, ...srvData } : s);
          setServices(updated);
          saveToLocal(updated);
        } else {
          const newItem: ActiveService = {
            id: crypto.randomUUID(),
            title,
            clientName,
            address,
            totalAmount: numericAmount,
            progress: 0,
            deadline,
            status,
            notes,
            tasks: [
              { id: '1', title: 'Preparação e isolamento do local', isDone: false },
              { id: '2', title: 'Execução do serviço principal', isDone: false },
              { id: '3', title: 'Limpeza e entrega final ao cliente', isDone: false },
            ]
          };
          const updated = [newItem, ...services];
          setServices(updated);
          saveToLocal(updated);
        }
        toast.success('Serviço salvo!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar serviço.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTask = async (srv: ActiveService, taskId: string) => {
    const updatedTasks = (srv.tasks || []).map(t =>
      t.id === taskId ? { ...t, isDone: !t.isDone } : t
    );
    const completedCount = updatedTasks.filter(t => t.isDone).length;
    const newProgress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : srv.progress;
    const newStatus = newProgress === 100 ? 'Concluído' : srv.status;

    try {
      if (user && !isGuest && srv.id) {
        const docRef = doc(db, 'users', user.uid, 'services', srv.id);
        await updateDoc(docRef, { tasks: updatedTasks, progress: newProgress, status: newStatus });
      } else {
        const updated = services.map(s => s.id === srv.id ? { ...s, tasks: updatedTasks, progress: newProgress, status: newStatus } : s);
        setServices(updated);
        saveToLocal(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este serviço?')) return;
    try {
      if (user && !isGuest) {
        await deleteDoc(doc(db, 'users', user.uid, 'services', id));
      } else {
        const updated = services.filter(s => s.id !== id);
        setServices(updated);
        saveToLocal(updated);
      }
      toast.success('Serviço removido.');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao remover serviço.');
    }
  };

  const getStatusBadge = (st: ActiveService['status']) => {
    switch (st) {
      case 'Concluído':
        return <span className="status-chip status-active" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={12} /> Concluído</span>;
      case 'Atrasado':
        return <span className="status-chip status-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} /> Atrasado</span>;
      case 'Agendado':
        return <span className="status-chip status-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> Agendado</span>;
      case 'Em Execução':
      default:
        return <span className="status-chip" style={{ backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Briefcase size={12} /> Em Execução</span>;
    }
  };

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

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
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Meus Serviços</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Trabalhos em andamento e acompanhamento</p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Novo Serviço
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 140, borderRadius: 20 }} />
          <div className="skeleton-glass" style={{ height: 140, borderRadius: 20 }} />
        </div>
      ) : services.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Nenhum Serviço em Andamento</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Cadastre os serviços contratados por seus clientes para gerenciar o progresso, prazos e checklists.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 14, marginTop: 4 }}>
            + Cadastrar Primeiro Serviço
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {services.map(srv => (
            <motion.div
              key={srv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: 18, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{srv.title}</h3>
                    {getStatusBadge(srv.status)}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <User size={13} color="var(--color-primary)" /> {srv.clientName}
                  </span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>
                  {fmt(srv.totalAmount)}
                </span>
              </div>

              {srv.address && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} /> {srv.address}
                </p>
              )}

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                  <span>Progresso</span>
                  <span>{srv.progress}%</span>
                </div>
                <div style={{ height: 8, backgroundColor: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${srv.progress}%`, height: '100%', backgroundColor: srv.progress === 100 ? '#10B981' : 'var(--color-primary)', borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
              </div>

              {/* Tasks Checklist */}
              {srv.tasks && srv.tasks.length > 0 && (
                <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>Checklist do Serviço</span>
                  {srv.tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(srv, task.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: task.isDone ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.isDone ? 'line-through' : 'none' }}
                    >
                      {task.isDone ? <CheckSquare size={16} color="var(--color-primary)" /> : <Square size={16} color="var(--text-muted)" />}
                      <span>{task.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                {srv.deadline ? (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} /> Prazo: {srv.deadline}
                  </span>
                ) : <div />}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEditModal(srv)} style={{ background: 'var(--bg-elevated)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => srv.id && handleDelete(srv.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="glass-panel" style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '85vh', overflowY: 'auto' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>
                {editingService ? 'Editar Serviço' : 'Novo Serviço em Andamento'}
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nome / Título do Serviço *</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Pintura Externa Residencial" className="input-premium" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nome do Cliente *</label>
                  <input required value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ex: Maria das Dores" className="input-premium" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Endereço da Execução</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Av. Paulista, 1000 - Ap 42" className="input-premium" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Valor Contratado (R$)</label>
                    <input
                      value={amountInput}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (!val) setAmountInput('');
                        else setAmountInput(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(val) / 100));
                      }}
                      placeholder="R$ 0,00"
                      className="input-premium"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Prazo Final Estimado</label>
                    <input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="Ex: 20/08/2025" className="input-premium" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)} className="input-premium" style={{ height: 44 }}>
                    <option value="Agendado">Agendado</option>
                    <option value="Em Execução">Em Execução</option>
                    <option value="Atrasado">Atrasado</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Observações</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas adicionais sobre o serviço..." className="input-premium" style={{ minHeight: 60, resize: 'vertical' }} />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Serviço</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
