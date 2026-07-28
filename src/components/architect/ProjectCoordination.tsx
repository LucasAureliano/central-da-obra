import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Puzzle, Plus, Trash2, X, Save, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export interface ProjectClash {
  id?: string;
  projectName: string;
  disciplineA: string;
  disciplineB: string;
  title: string;
  description: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  status: 'Pendente' | 'Em Análise' | 'Resolvido';
  responsible?: string;
  deadline?: string;
  createdAt?: any;
}

const DISCIPLINES = [
  'Arquitetônico',
  'Estrutural',
  'Hidrossanitário',
  'Elétrico',
  'Climatização (HVAC)',
  'Prevenção contra Incêndio (PPCI)'
];

interface ProjectCoordinationProps {
  onBack?: () => void;
}

export function ProjectCoordination({ onBack }: ProjectCoordinationProps) {
  const { user, isGuest } = useAuth();
  const [clashes, setClashes] = useState<ProjectClash[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClash, setEditingClash] = useState<ProjectClash | null>(null);

  // Form states
  const [projectName, setProjectName] = useState('');
  const [disciplineA, setDisciplineA] = useState('Arquitetônico');
  const [disciplineB, setDisciplineB] = useState('Estrutural');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ProjectClash['priority']>('Alta');
  const [status, setStatus] = useState<ProjectClash['status']>('Pendente');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'project_clashes'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectClash));
        setClashes(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setClashes([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      try {
        const local = localStorage.getItem('co_project_clashes');
        if (local) setClashes(JSON.parse(local));
        else setClashes([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (items: ProjectClash[]) => {
    localStorage.setItem('co_project_clashes', JSON.stringify(items));
  };

  const openAddModal = () => {
    setEditingClash(null);
    setProjectName('');
    setDisciplineA('Arquitetônico');
    setDisciplineB('Estrutural');
    setTitle('');
    setDescription('');
    setPriority('Alta');
    setStatus('Pendente');
    setResponsible('Eng. Calculista');
    setDeadline('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectName.trim()) {
      toast.error('Preencha o título do conflito e o nome do projeto.');
      return;
    }

    setSubmitting(true);

    const clashData: ProjectClash = {
      projectName,
      disciplineA,
      disciplineB,
      title,
      description,
      priority,
      status,
      responsible,
      deadline,
    };

    try {
      if (user && !isGuest) {
        if (editingClash?.id) {
          const docRef = doc(db, 'users', user.uid, 'project_clashes', editingClash.id);
          await updateDoc(docRef, { ...clashData, updatedAt: serverTimestamp() });
          toast.success('Incompatibilidade atualizada!');
        } else {
          await addDoc(collection(db, 'users', user.uid, 'project_clashes'), {
            ...clashData,
            createdAt: serverTimestamp()
          });
          toast.success('Interferência registrada!');
        }
      } else {
        if (editingClash?.id) {
          const updated = clashes.map(c => c.id === editingClash.id ? { ...c, ...clashData } : c);
          setClashes(updated);
          saveToLocal(updated);
        } else {
          const newItem = { id: crypto.randomUUID(), ...clashData };
          const updated = [newItem, ...clashes];
          setClashes(updated);
          saveToLocal(updated);
        }
        toast.success('Interferência salva!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este registro de incompatibilidade?')) return;
    try {
      if (user && !isGuest) {
        await deleteDoc(doc(db, 'users', user.uid, 'project_clashes', id));
      } else {
        const updated = clashes.filter(c => c.id !== id);
        setClashes(updated);
        saveToLocal(updated);
      }
      toast.success('Interferência removida.');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao remover.');
    }
  };

  const getPriorityColor = (p: ProjectClash['priority']) => {
    switch (p) {
      case 'Crítica': return '#EF4444';
      case 'Alta': return '#F59E0B';
      case 'Média': return '#3B82F6';
      case 'Baixa': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Compatibilização de Projetos</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Registro de conflitos (BIM Clashes) entre disciplinas</p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Novo Conflito
        </button>
      </div>

      {/* Clashes List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 20 }} />
        </div>
      ) : clashes.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Puzzle size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Sem Conflitos Registrados</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Registre interferências entre o projeto estrutural, hidráulico, elétrico e arquitetônico para evitar retrabalhos na obra.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 14, marginTop: 4 }}>
            + Registrar Primeira Incompatibilidade
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {clashes.map(clash => (
            <motion.div
              key={clash.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: 18, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 12, borderLeft: `4px solid ${getPriorityColor(clash.priority)}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>{clash.title}</h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>
                    {clash.disciplineA} ⚡ {clash.disciplineB}
                  </span>
                </div>
                <span className="status-chip" style={{ backgroundColor: 'var(--bg-elevated)', color: getPriorityColor(clash.priority) }}>
                  {clash.priority}
                </span>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>{clash.description}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Projeto: <strong>{clash.projectName}</strong> • Responsável: {clash.responsible || 'Engenharia'}
                </span>

                <button onClick={() => clash.id && handleDelete(clash.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="glass-panel" style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '85vh', overflowY: 'auto' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Nova Incompatibilidade / Conflito</h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nome do Projeto *</label>
                  <input required value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Ex: Edifício Horizonte" className="input-premium" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Disciplina 1</label>
                    <select value={disciplineA} onChange={e => setDisciplineA(e.target.value)} className="input-premium" style={{ height: 44 }}>
                      {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Disciplina 2</label>
                    <select value={disciplineB} onChange={e => setDisciplineB(e.target.value)} className="input-premium" style={{ height: 44 }}>
                      {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Título do Conflito *</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Tubulação de esgoto colidindo com viga V-102" className="input-premium" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Prioridade</label>
                    <select value={priority} onChange={e => setPriority(e.target.value as any)} className="input-premium" style={{ height: 44 }}>
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                      <option value="Crítica">Crítica</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Responsável pela solução</label>
                    <input value={responsible} onChange={e => setResponsible(e.target.value)} placeholder="Eng. Calculista" className="input-premium" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Descrição & Proposta de Solução</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes do conflito e solução sugerida..." className="input-premium" style={{ minHeight: 70, resize: 'vertical' }} />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Incompatibilidade</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
