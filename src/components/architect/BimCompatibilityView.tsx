import { useState, useEffect } from 'react';
import { Puzzle, AlertTriangle, CheckCircle, Clock, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

export function BimCompatibilityView({ projectId }: { projectId: string }) {
  const [clashes, setClashes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState('Arquitetura x Estrutura');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, `projects/${projectId}/clashes`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setClashes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [projectId]);

  const handleAddClash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `projects/${projectId}/clashes`), {
        title,
        discipline,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      toast.success('Interferência registrada!');
      setIsModalOpen(false);
      setTitle('');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (clashId: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, `projects/${projectId}/clashes`, clashId), {
        status: currentStatus === 'pending' ? 'resolved' : 'pending'
      });
    } catch (e) {
      toast.error('Erro ao atualizar status.');
    }
  };

  const handleDelete = async (clashId: string) => {
    if (confirm('Apagar este registro?')) {
      try {
        await deleteDoc(doc(db, `projects/${projectId}/clashes`, clashId));
        toast.success('Registro apagado.');
      } catch (e) {
        toast.error('Erro ao apagar.');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Puzzle size={20} color="#F59E0B" />
            Compatibilização (BIM Clashes)
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Registro de interferências entre disciplinas.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
          <Plus size={16} /> Nova Interferência
        </button>
      </div>

      {clashes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-elevated)', borderRadius: 16 }}>
          <CheckCircle size={48} color="var(--color-success)" style={{ marginBottom: 16 }} />
          <p style={{ color: 'var(--text-main)', fontSize: 16, fontWeight: 700 }}>Nenhum Clash Registrado</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Tudo compatibilizado até o momento!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {clashes.map(clash => (
            <motion.div 
              key={clash.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button 
                  onClick={() => toggleStatus(clash.id, clash.status)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  {clash.status === 'pending' ? (
                    <AlertTriangle size={24} color="#F59E0B" />
                  ) : (
                    <CheckCircle size={24} color="#10B981" />
                  )}
                </button>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px', textDecoration: clash.status === 'resolved' ? 'line-through' : 'none', opacity: clash.status === 'resolved' ? 0.6 : 1 }}>{clash.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>{clash.discipline}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ 
                  padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                  backgroundColor: clash.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: clash.status === 'pending' ? '#F59E0B' : '#10B981'
                }}>
                  {clash.status === 'pending' ? 'Pendente' : 'Resolvido'}
                </span>
                <button onClick={() => handleDelete(clash.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Clash Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ width: '100%', maxWidth: 400, borderRadius: 24, padding: 24, position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Registrar Interferência</h2>
              
              <form onSubmit={handleAddClash} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Descrição *</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Viga cruzando duto de ar" className="input-premium" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Disciplinas Envolvidas</label>
                  <select value={discipline} onChange={e => setDiscipline(e.target.value)} className="input-premium">
                    <option>Arquitetura x Estrutura</option>
                    <option>Arquitetura x Elétrica</option>
                    <option>Estrutura x Hidráulica</option>
                    <option>Climatização x Elétrica</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ flex: 1, padding: 14, borderRadius: 12 }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
