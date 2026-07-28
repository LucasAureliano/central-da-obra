import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Users, Phone, Calendar, CheckCircle2, XCircle, Clock, Trash2, Edit3, X, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export interface ProviderQuote {
  id?: string;
  name: string;
  specialty: string;
  phone: string;
  amount: number;
  deadline: string;
  description: string;
  notes?: string;
  status: 'recebida' | 'em_analise' | 'aceita' | 'recusada';
  createdAt?: any;
}

const SPECIALTIES = [
  'Pedreiro / Alvenaria',
  'Eletricista',
  'Encanador / Hidráulica',
  'Pintor',
  'Gesseiro',
  'Marceneiro',
  'Serralheiro',
  'Telhadista',
  'Arquiteto / Projetista',
  'Engenheiro / Calculista',
  'Marmoraria / Pedras',
  'Climatização / Ar Condicionado',
  'Outro'
];

export function ProviderQuotes({ workId }: { workId: string }) {
  const [quotes, setQuotes] = useState<ProviderQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<ProviderQuote | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [phone, setPhone] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ProviderQuote['status']>('recebida');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!workId) return;
    setLoading(true);
    const q = query(collection(db, `works/${workId}/quotes`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProviderQuote));
      setQuotes(data);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching quotes:', err);
      setQuotes([]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [workId]);

  const openAddModal = () => {
    setEditingQuote(null);
    setName('');
    setSpecialty(SPECIALTIES[0]);
    setPhone('');
    setAmountInput('');
    setDeadline('');
    setDescription('');
    setNotes('');
    setStatus('recebida');
    setIsModalOpen(true);
  };

  const openEditModal = (quote: ProviderQuote) => {
    setEditingQuote(quote);
    setName(quote.name);
    setSpecialty(quote.specialty || SPECIALTIES[0]);
    setPhone(quote.phone || '');
    setAmountInput(quote.amount ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.amount) : '');
    setDeadline(quote.deadline || '');
    setDescription(quote.description || '');
    setNotes(quote.notes || '');
    setStatus(quote.status || 'recebida');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amountInput) {
      toast.error('Preencha o nome do prestador e o valor da proposta.');
      return;
    }

    setSubmitting(true);
    const numericAmount = parseInt(amountInput.replace(/\D/g, '')) / 100;

    try {
      if (editingQuote?.id) {
        // Update
        const quoteRef = doc(db, `works/${workId}/quotes`, editingQuote.id);
        await updateDoc(quoteRef, {
          name,
          specialty,
          phone,
          amount: numericAmount,
          deadline,
          description,
          notes,
          status
        });
        toast.success('Cotação atualizada!');
      } else {
        // Add
        await addDoc(collection(db, `works/${workId}/quotes`), {
          name,
          specialty,
          phone,
          amount: numericAmount,
          deadline,
          description,
          notes,
          status,
          createdAt: serverTimestamp()
        });
        toast.success('Cotação cadastrada com sucesso!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar cotação.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (quoteId: string) => {
    if (!confirm('Deseja realmente remover esta proposta?')) return;
    try {
      await deleteDoc(doc(db, `works/${workId}/quotes`, quoteId));
      toast.success('Cotação removida.');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao remover cotação.');
    }
  };

  const handleStatusChange = async (quote: ProviderQuote, newStatus: ProviderQuote['status']) => {
    if (!quote.id) return;
    try {
      const quoteRef = doc(db, `works/${workId}/quotes`, quote.id);
      await updateDoc(quoteRef, { status: newStatus });
      toast.success(`Status alterado para ${getStatusLabel(newStatus)}`);
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (s: ProviderQuote['status']) => {
    switch (s) {
      case 'aceita':
        return <span className="status-chip status-active" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={12} /> Aceita</span>;
      case 'recusada':
        return <span className="status-chip status-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><XCircle size={12} /> Recusada</span>;
      case 'em_analise':
        return <span className="status-chip status-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> Em Análise</span>;
      case 'recebida':
      default:
        return <span className="status-chip" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} /> Recebida</span>;
    }
  };

  const getStatusLabel = (s: ProviderQuote['status']) => {
    switch (s) {
      case 'aceita': return 'Aceita';
      case 'recusada': return 'Recusada';
      case 'em_analise': return 'Em Análise';
      default: return 'Recebida';
    }
  };

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div style={{ padding: 20 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Cotações de Prestadores</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Organize e compare propostas de serviços</p>
        </div>
        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Nova Cotação
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 100, borderRadius: 16 }} />
          <div className="skeleton-glass" style={{ height: 100, borderRadius: 16 }} />
        </div>
      ) : quotes.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', borderRadius: 20, backgroundColor: 'var(--bg-elevated)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <Users size={32} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Nenhuma Cotação Cadastrada</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Guarde aqui orçamentos de pedreiros, eletricistas, pintores e outros profissionais para comparar e aprovar.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '10px 20px', borderRadius: 12, fontSize: 14, marginTop: 4 }}>
            + Adicionar Primeira Cotação
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quotes.map((quote) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{quote.name}</h4>
                    {getStatusBadge(quote.status)}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', display: 'block' }}>
                    {quote.specialty}
                  </span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>
                  {fmt(quote.amount)}
                </span>
              </div>

              {quote.description && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {quote.description}
                </p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12, color: 'var(--text-muted)', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                {quote.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={12} /> {quote.phone}
                  </span>
                )}
                {quote.deadline && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} /> Prazo: {quote.deadline}
                  </span>
                )}
              </div>

              {/* Status Selector Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => handleStatusChange(quote, 'em_analise')}
                    style={{ padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: quote.status === 'em_analise' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-elevated)', color: quote.status === 'em_analise' ? '#F59E0B' : 'var(--text-muted)' }}
                  >
                    Em Análise
                  </button>
                  <button
                    onClick={() => handleStatusChange(quote, 'aceita')}
                    style={{ padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: quote.status === 'aceita' ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-elevated)', color: quote.status === 'aceita' ? '#10B981' : 'var(--text-muted)' }}
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => handleStatusChange(quote, 'recusada')}
                    style={{ padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: quote.status === 'recusada' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-elevated)', color: quote.status === 'recusada' ? '#EF4444' : 'var(--text-muted)' }}
                  >
                    Recusar
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEditModal(quote)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => quote.id && handleDelete(quote.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '85vh', overflowY: 'auto' }}
            >
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>
                {editingQuote ? 'Editar Cotação' : 'Nova Cotação de Prestador'}
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Nome do Prestador / Empresa *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ex: João da Silva Pedreiro" className="input-premium" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Especialidade</label>
                    <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="input-premium" style={{ height: 44 }}>
                      {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Telefone / WhatsApp</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" className="input-premium" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Valor Proposto (R$) *</label>
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
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Prazo Estimado</label>
                    <input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="Ex: 15 dias" className="input-premium" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Descrição dos Serviços</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="O que está incluso na proposta..." className="input-premium" style={{ minHeight: 70, resize: 'vertical' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Status Inicial</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)} className="input-premium" style={{ height: 44 }}>
                    <option value="recebida">Recebida</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="aceita">Aceita</option>
                    <option value="recusada">Recusada</option>
                  </select>
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Cotação</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
