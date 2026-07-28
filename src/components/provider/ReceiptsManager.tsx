import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Plus, CheckCircle2, Clock, ArrowLeft, Trash2, Edit3, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export interface ReceiptItem {
  id?: string;
  clientName: string;
  description: string;
  amount: number;
  method: 'PIX' | 'Dinheiro' | 'Cartão' | 'Transferência' | 'Cheque' | 'Parcelado';
  status: 'Pago' | 'Pendente' | 'Vencido';
  dueDate?: string;
  paidDate?: string;
  notes?: string;
  createdAt?: any;
}

const PAYMENT_METHODS = ['PIX', 'Dinheiro', 'Cartão', 'Transferência', 'Cheque', 'Parcelado'];

interface ReceiptsManagerProps {
  onBack?: () => void;
}

export function ReceiptsManager({ onBack }: ReceiptsManagerProps) {
  const { user, isGuest } = useAuth();
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pago' | 'Pendente' | 'Vencido'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<ReceiptItem | null>(null);

  // Form
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [method, setMethod] = useState<ReceiptItem['method']>('PIX');
  const [status, setStatus] = useState<ReceiptItem['status']>('Pendente');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'receipts'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ReceiptItem));
        data.sort((a, b) => {
          const t1 = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const t2 = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return t2 - t1;
        });
        setReceipts(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setReceipts([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      // LocalStorage for guest
      try {
        const local = localStorage.getItem('co_receipts');
        if (local) setReceipts(JSON.parse(local));
        else setReceipts([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (items: ReceiptItem[]) => {
    localStorage.setItem('co_receipts', JSON.stringify(items));
  };

  const openAddModal = () => {
    setEditingReceipt(null);
    setClientName('');
    setDescription('');
    setAmountInput('');
    setMethod('PIX');
    setStatus('Pendente');
    setDueDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (rec: ReceiptItem) => {
    setEditingReceipt(rec);
    setClientName(rec.clientName);
    setDescription(rec.description || '');
    setAmountInput(rec.amount ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rec.amount) : '');
    setMethod(rec.method || 'PIX');
    setStatus(rec.status || 'Pendente');
    setDueDate(rec.dueDate || '');
    setNotes(rec.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !amountInput) {
      toast.error('Preencha o cliente e o valor do recebimento.');
      return;
    }

    setSubmitting(true);
    const numericAmount = parseInt(amountInput.replace(/\D/g, '')) / 100;

    const receiptData: Partial<ReceiptItem> = {
      clientName,
      description,
      amount: numericAmount,
      method,
      status,
      dueDate,
      paidDate: status === 'Pago' ? new Date().toISOString().split('T')[0] : undefined,
      notes,
    };

    try {
      if (user && !isGuest) {
        if (editingReceipt?.id) {
          const docRef = doc(db, 'users', user.uid, 'receipts', editingReceipt.id);
          await updateDoc(docRef, { ...receiptData, updatedAt: serverTimestamp() });
          toast.success('Recebimento atualizado!');
        } else {
          await addDoc(collection(db, 'users', user.uid, 'receipts'), {
            ...receiptData,
            createdAt: serverTimestamp()
          });
          toast.success('Recebimento registrado!');
        }
      } else {
        if (editingReceipt?.id) {
          const updated = receipts.map(r => r.id === editingReceipt.id ? { ...r, ...receiptData } : r);
          setReceipts(updated);
          saveToLocal(updated);
        } else {
          const newItem = { id: crypto.randomUUID(), ...receiptData } as ReceiptItem;
          const updated = [newItem, ...receipts];
          setReceipts(updated);
          saveToLocal(updated);
        }
        toast.success('Recebimento salvo!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar recebimento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este lançamento de recebimento?')) return;
    try {
      if (user && !isGuest) {
        await deleteDoc(doc(db, 'users', user.uid, 'receipts', id));
      } else {
        const updated = receipts.filter(r => r.id !== id);
        setReceipts(updated);
        saveToLocal(updated);
      }
      toast.success('Recebimento removido.');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao remover.');
    }
  };

  const handleTogglePaid = async (rec: ReceiptItem) => {
    if (!rec.id) return;
    const newStatus = rec.status === 'Pago' ? 'Pendente' : 'Pago';
    try {
      if (user && !isGuest) {
        const docRef = doc(db, 'users', user.uid, 'receipts', rec.id);
        await updateDoc(docRef, { status: newStatus, paidDate: newStatus === 'Pago' ? new Date().toISOString().split('T')[0] : null });
      } else {
        const updated = receipts.map(r => r.id === rec.id ? { ...r, status: newStatus as ReceiptItem['status'] } : r);
        setReceipts(updated);
        saveToLocal(updated);
      }
      toast.success(newStatus === 'Pago' ? 'Marque como Pago!' : 'Alterado para Pendente');
    } catch (e) {
      console.error(e);
    }
  };

  // Totals
  const totalPaid = receipts.filter(r => r.status === 'Pago').reduce((acc, r) => acc + (r.amount || 0), 0);
  const totalPending = receipts.filter(r => r.status === 'Pendente').reduce((acc, r) => acc + (r.amount || 0), 0);
  const totalOverdue = receipts.filter(r => r.status === 'Vencido').reduce((acc, r) => acc + (r.amount || 0), 0);

  const filteredReceipts = receipts.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Recebimentos</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Controle de faturamento, recebidos e cobranças</p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Novo Recebimento
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Já Recebido</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#10B981' }}>{fmt(totalPaid)}</span>
        </div>
        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>A Receber</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#F59E0B' }}>{fmt(totalPending)}</span>
        </div>
        <div className="glass-panel" style={{ padding: 14, borderRadius: 16, textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Vencidos</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#EF4444' }}>{fmt(totalOverdue)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14, marginBottom: 16 }}>
        {(['all', 'Pendente', 'Pago', 'Vencido'] as const).map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st as any)}
            style={{
              background: 'none', border: 'none', fontSize: 13, cursor: 'pointer',
              fontWeight: filterStatus === st ? 700 : 600,
              color: filterStatus === st ? 'var(--color-primary)' : 'var(--text-muted)',
              borderBottom: filterStatus === st ? '2px solid var(--color-primary)' : 'none',
              paddingBottom: 4
            }}
          >
            {st === 'all' ? `Todos (${receipts.length})` : st}
          </button>
        ))}
      </div>

      {/* Receipts List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skeleton-glass" style={{ height: 90, borderRadius: 16 }} />
          <div className="skeleton-glass" style={{ height: 90, borderRadius: 16 }} />
        </div>
      ) : receipts.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Nenhum Recebimento Registrado</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Registre entradas via PIX, Cartão, Dinheiro ou Parcelado para acompanhar suas cobranças e fluxo de caixa.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 14, marginTop: 4 }}>
            + Registrar Primeiro Recebimento
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredReceipts.map(rec => {
            const isPaid = rec.status === 'Pago';
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => handleTogglePaid(rec)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isPaid ? '#10B981' : 'var(--text-muted)' }}
                  >
                    {isPaid ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </button>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{rec.clientName}</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      {rec.description || 'Recebimento de Serviço'} • <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{rec.method}</span>
                    </p>
                    {rec.dueDate && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                        Vencimento: {new Date(rec.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: isPaid ? '#10B981' : 'var(--text-main)' }}>
                    {fmt(rec.amount)}
                  </span>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 6 }}>
                    <button onClick={() => openEditModal(rec)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => rec.id && handleDelete(rec.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
                {editingReceipt ? 'Editar Recebimento' : 'Novo Recebimento / Cobrança'}
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nome do Cliente *</label>
                  <input required value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ex: Carlos Alberto" className="input-premium" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Descrição do Pagamento</label>
                  <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Entradas da pintura residencial - Parcela 1/2" className="input-premium" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Valor (R$) *</label>
                    <input
                      required
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
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Forma de Pagamento</label>
                    <select value={method} onChange={e => setMethod(e.target.value as any)} className="input-premium" style={{ height: 44 }}>
                      {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="input-premium" style={{ height: 44 }}>
                      <option value="Pendente">Pendente</option>
                      <option value="Pago">Pago (Recebido)</option>
                      <option value="Vencido">Vencido</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Data de Vencimento</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-premium" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Observações</label>
                  <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ex: Comprovante enviado via WhatsApp" className="input-premium" />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Recebimento</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
