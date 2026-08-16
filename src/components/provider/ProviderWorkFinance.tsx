import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, addDoc, Timestamp, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Plus, CheckCircle2, Clock, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';

interface ProviderWorkFinanceProps {
  workId: string;
}

type EntryType = 'Recebimento' | 'Diária' | 'Extra' | 'Custo';
type EntryStatus = 'Recebido' | 'Pendente' | 'Pago';

interface WorkEntry {
  id?: string;
  description: string;
  amount: number;
  type: EntryType;
  status: EntryStatus;
  date: any;
  createdAt: any;
}

export function ProviderWorkFinance({ workId }: ProviderWorkFinanceProps) {
  const { user, isGuest } = useAuth();
  const { triggerGuestAlert } = useAuthModal();
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<EntryType>('Recebimento');
  const [status, setStatus] = useState<EntryStatus>('Pendente');

  useEffect(() => {
    if (!workId) return;

    if (isGuest || !user) {
      try {
        const stored = localStorage.getItem(`co_provider_finance_${workId}`);
        if (stored) setEntries(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'works', workId, 'provider_finances'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs: WorkEntry[] = [];
      snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() } as WorkEntry));
      setEntries(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error loading provider finance:", error);
      setLoading(false);
      toast.error("Erro ao carregar o financeiro");
    });
    return () => unsub();
  }, [workId, user, isGuest]);

  const saveToLocal = (updated: WorkEntry[]) => {
    localStorage.setItem(`co_provider_finance_${workId}`, JSON.stringify(updated));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    if (isGuest || !user) {
      const newItem: WorkEntry = {
        id: crypto.randomUUID(),
        description,
        amount: parseFloat(amount),
        type,
        status,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...entries];
      setEntries(updated);
      saveToLocal(updated);
      toast.success('Lançamento adicionado!');
      setShowAddModal(false);
      setDescription('');
      setAmount('');
      return;
    }

    try {
      await addDoc(collection(db, 'works', workId, 'provider_finances'), {
        description,
        amount: parseFloat(amount),
        type,
        status,
        date: Timestamp.now(),
        createdAt: Timestamp.now(),
      });
      toast.success('Lançamento adicionado!');
      setShowAddModal(false);
      setDescription('');
      setAmount('');
    } catch (error) {
      toast.error('Erro ao adicionar lançamento');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      if (isGuest || !user) {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        saveToLocal(updated);
        toast.success('Excluído com sucesso');
        return;
      }
      try {
        await deleteDoc(doc(db, 'works', workId, 'provider_finances', id));
        toast.success('Excluído com sucesso');
      } catch {
        toast.error('Erro ao excluir');
      }
    }
  };

  const toggleStatus = async (entry: WorkEntry) => {
    if (!entry.id) return;
    const newStatus = entry.status === 'Pendente' ? (entry.type === 'Custo' ? 'Pago' : 'Recebido') : 'Pendente';
    
    if (isGuest || !user) {
      const updated = entries.map(e => e.id === entry.id ? { ...e, status: newStatus as EntryStatus } : e);
      setEntries(updated);
      saveToLocal(updated);
      return;
    }

    try {
      await updateDoc(doc(db, 'works', workId, 'provider_finances', entry.id), { status: newStatus });
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const totalRecebido = entries.filter(e => e.type !== 'Custo' && e.status === 'Recebido').reduce((a, b) => a + b.amount, 0);
  const totalPendente = entries.filter(e => e.type !== 'Custo' && e.status === 'Pendente').reduce((a, b) => a + b.amount, 0);

  if (loading) return <div style={{ padding: 20 }}>Carregando financeiro...</div>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total Recebido</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#10B981' }}>R$ {totalRecebido.toFixed(2)}</p>
        </div>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>A Receber</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#F59E0B' }}>R$ {totalPendente.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Lançamentos desta Obra</h3>
        <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Novo
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {entries.map(entry => (
          <div key={entry.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button 
                onClick={() => toggleStatus(entry)}
                style={{ 
                  width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  border: `1px solid ${entry.status === 'Pendente' ? 'var(--border-subtle)' : (entry.type === 'Custo' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)')}`,
                  backgroundColor: entry.status === 'Pendente' ? 'transparent' : (entry.type === 'Custo' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                  color: entry.status === 'Pendente' ? 'var(--text-muted)' : (entry.type === 'Custo' ? '#EF4444' : '#10B981')
                }}
              >
                {entry.status === 'Pendente' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
              </button>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{entry.description}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{entry.type}</span>
                  <span style={{ fontSize: 12, color: entry.status === 'Pendente' ? '#F59E0B' : (entry.type === 'Custo' ? '#EF4444' : '#10B981') }}>
                    • {entry.status}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: entry.type === 'Custo' ? '#EF4444' : 'var(--text-main)' }}>
                {entry.type === 'Custo' ? '-' : ''}R$ {entry.amount.toFixed(2)}
              </p>
              <button onClick={() => handleDelete(entry.id!)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum lançamento registrado nesta obra.
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={() => setShowAddModal(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ backgroundColor: 'var(--bg-base)', width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px', zIndex: 101 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>Novo Lançamento</h3>
                <button onClick={() => setShowAddModal(false)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', border: 'none' }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Tipo</label>
                  <select value={type} onChange={e => setType(e.target.value as EntryType)} className="input-field" style={{ width: '100%', height: 48, borderRadius: 12, padding: '0 16px' }}>
                    <option value="Recebimento">Recebimento (Parcela, Contrato)</option>
                    <option value="Diária">Diária</option>
                    <option value="Extra">Serviço Extra</option>
                    <option value="Custo">Custo / Compra de Material</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Descrição</label>
                  <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Parcela 1, Troca de torneira..." className="input-field" style={{ width: '100%', height: 48, borderRadius: 12, padding: '0 16px' }} />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Valor (R$)</label>
                  <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" className="input-field" style={{ width: '100%', height: 48, borderRadius: 12, padding: '0 16px' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Status Inicial</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" onClick={() => setStatus('Pendente')} style={{ flex: 1, padding: '12px 0', borderRadius: 12, fontWeight: 600, fontSize: 14, backgroundColor: status === 'Pendente' ? '#FEF3C7' : 'var(--bg-body)', color: status === 'Pendente' ? '#D97706' : 'var(--text-muted)', border: `1px solid ${status === 'Pendente' ? '#FCD34D' : 'var(--border-subtle)'}` }}>Pendente</button>
                    <button type="button" onClick={() => setStatus('Recebido')} style={{ flex: 1, padding: '12px 0', borderRadius: 12, fontWeight: 600, fontSize: 14, backgroundColor: status === 'Recebido' ? '#D1FAE5' : 'var(--bg-body)', color: status === 'Recebido' ? '#059669' : 'var(--text-muted)', border: `1px solid ${status === 'Recebido' ? '#34D399' : 'var(--border-subtle)'}` }}>{type === 'Custo' ? 'Pago' : 'Recebido'}</button>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', height: 56, borderRadius: 16, fontSize: 16, marginTop: 8 }}>
                  Salvar
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
