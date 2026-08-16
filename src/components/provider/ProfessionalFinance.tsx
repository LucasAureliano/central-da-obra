import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, PieChart, Plus, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';

export interface FinancialEntry {
  id?: string;
  type: 'receita' | 'custo' | 'imposto';
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface ProfessionalFinanceProps {
  onBack?: () => void;
}

export function ProfessionalFinance({ onBack }: ProfessionalFinanceProps) {
  const { user, isGuest } = useAuth();
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'receita' | 'custo' | 'imposto'>('custo');
  const [category, setCategory] = useState('Materiais');
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'financial_entries'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as FinancialEntry));
        setEntries(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setEntries([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      try {
        const local = localStorage.getItem('co_pro_finance');
        if (local) setEntries(JSON.parse(local));
        else setEntries([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (items: FinancialEntry[]) => {
    localStorage.setItem('co_pro_finance', JSON.stringify(items));
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amountInput) {
      toast.error('Preencha a descrição e o valor.');
      return;
    }

    setSubmitting(true);
    const numericAmount = parseInt(amountInput.replace(/\D/g, '')) / 100;

    const newEntry: FinancialEntry = {
      type,
      category,
      description,
      amount: numericAmount,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      if (user && !isGuest) {
        await addDoc(collection(db, 'users', user.uid, 'financial_entries'), {
          ...newEntry,
          createdAt: serverTimestamp()
        });
        toast.success('Lançamento financeiro registrado!');
      } else {
        const updated = [newEntry, ...entries];
        setEntries(updated);
        saveToLocal(updated);
        toast.success('Lançamento salvo!');
      }
      setIsModalOpen(false);
      setDescription('');
      setAmountInput('');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar lançamento.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const grossRevenue = entries.filter(e => e.type === 'receita').reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalCosts = entries.filter(e => e.type === 'custo').reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalTaxes = entries.filter(e => e.type === 'imposto').reduce((acc, e) => acc + (e.amount || 0), 0);
  const netProfit = grossRevenue - totalCosts - totalTaxes;

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

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
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Financeiro Profissional</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>DRE, Fluxo de Caixa e Lucratividade</p>
          </div>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Novo Lançamento
        </button>
      </div>

      {/* DRE Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="glass-panel" style={{ padding: 16, borderRadius: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Receita Bruta</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#10B981' }}>{fmt(grossRevenue)}</span>
        </div>

        <div className="glass-panel" style={{ padding: 16, borderRadius: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Custos Operacionais</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#EF4444' }}>{fmt(totalCosts)}</span>
        </div>

        <div className="glass-panel" style={{ padding: 16, borderRadius: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Impostos & Taxas</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#F59E0B' }}>{fmt(totalTaxes)}</span>
        </div>

        <div className="glass-panel" style={{ padding: 16, borderRadius: 20, backgroundColor: netProfit >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${netProfit >= 0 ? '#10B981' : '#EF4444'}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Lucro Líquido</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: netProfit >= 0 ? '#10B981' : '#EF4444' }}>{fmt(netProfit)}</span>
        </div>
      </div>

      {/* History List */}
      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 14 }}>Extrato de Fluxo de Caixa</h3>

      {loading ? (
        <div className="skeleton-glass" style={{ height: 100, borderRadius: 16 }} />
      ) : entries.length === 0 ? (
        <div className="glass-panel" style={{ padding: 32, borderRadius: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
          <PieChart size={36} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: 12 }} />
          <p style={{ margin: 0, fontSize: 14 }}>Nenhum lançamento no fluxo de caixa.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map((entry, idx) => (
            <div key={entry.id || idx} className="glass-panel" style={{ padding: 14, borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{entry.description}</h4>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{entry.category} • {formatDate(entry.date)}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: entry.type === 'receita' ? '#10B981' : '#EF4444' }}>
                {entry.type === 'receita' ? `+ ${fmt(entry.amount)}` : `- ${fmt(entry.amount)}`}
              </span>
            </div>
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

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Novo Lançamento Financeiro</h3>

              <form onSubmit={handleAddEntry} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Tipo de Lançamento</label>
                  <select value={type} onChange={e => setType(e.target.value as any)} className="input-premium" style={{ height: 44 }}>
                    <option value="receita">Receita (Entrada)</option>
                    <option value="custo">Custo Operacional (Saída)</option>
                    <option value="imposto">Imposto / Taxa</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Categoria</label>
                  <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: Materiais, Ajudantes, Combustível, Simples Nacional" className="input-premium" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Descrição *</label>
                  <input required value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Compra de latas de tinta Suvinil" className="input-premium" />
                </div>

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

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Lançamento</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
