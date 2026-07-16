import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWorks } from '../contexts/WorksContext';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, Timestamp, orderBy, updateDoc, doc, increment } from 'firebase/firestore';
import { Plus, Wallet, CheckCircle2, Clock, X, Search, Trash2 } from 'lucide-react';
import CountUp from 'react-countup';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { EmptyState } from './EmptyState';
import type { Expense, Category, ExpenseStatus } from '../types';

export function Finance() {
  const { user, isGuest } = useAuth();
  const { works, activeWork } = useWorks();
  const [loading, setLoading] = useState(true);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'Pago' | 'Pendente'>('all');
  
  // Modal state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<Category>('Materiais');
  const [status, setStatus] = useState<ExpenseStatus>('Pago');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplier, setSupplier] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!user || isGuest || !activeWork) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const qExpenses = query(
      collection(db, `works/${activeWork.id}/expenses`),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(qExpenses, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isGuest, activeWork]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0 || !activeWork) return;

    try {
      const newExpense: Omit<Expense, 'id'> = {
        title,
        amount,
        category,
        status,
        date: Timestamp.fromDate(new Date(`${date}T12:00:00`)),
        supplier,
        paymentMethod,
        notes,
        workId: activeWork.id,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, `works/${activeWork.id}/expenses`), newExpense);
      
      // Update the work's spent total
      if (status === 'Pago') {
        const workRef = doc(db, 'works', activeWork.id);
        await updateDoc(workRef, {
          spent: increment(amount)
        });
      }
      
      toast.success('Lançamento adicionado com sucesso!');
      setShowAddModal(false);
      setTitle('');
      setAmount(0);
      setSupplier('');
      setPaymentMethod('');
      setNotes('');
    } catch (err) {
      console.error("Error adding expense", err);
      toast.error('Erro ao adicionar lançamento');
    }
  };

  const handleDeleteExpense = async (exp: Expense) => {
    if (!activeWork) return;
    if (!window.confirm('Tem certeza que deseja excluir este lançamento?')) return;
    
    try {
      await import('firebase/firestore').then(({ deleteDoc }) => 
        deleteDoc(doc(db, `works/${activeWork.id}/expenses`, exp.id!))
      );
      
      if (exp.status === 'Pago') {
        const workRef = doc(db, 'works', activeWork.id);
        await updateDoc(workRef, {
          spent: increment(-exp.amount)
        });
      }
      toast.success('Lançamento excluído');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir');
    }
  };


  if (loading && works.length > 0) {
    return <div className="screen-content" style={{ padding: 20 }}>Carregando financeiro...</div>;
  }

  if (works.length === 0) {
    return (
      <div className="screen-content animate-fade-in" style={{ padding: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Financeiro</h1>
        <EmptyState 
          icon={<Wallet size={40} />}
          title="Nenhuma obra selecionada"
          description="Crie uma obra primeiro para gerenciar o financeiro."
        />
      </div>
    );
  }

  const budget = activeWork?.budget || 0;
  // Calculate spent only from expenses that are NOT Cancelado
  const spent = expenses.filter(e => e.status !== 'Cancelado').reduce((acc, e) => acc + e.amount, 0);
  const saldo = budget - spent;
  const progressPercent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

  const filteredExpenses = expenses.filter(e => filter === 'all' || e.status === filter);

  // Group by timeline
  const today = new Date();
  const getTimelineGroup = (timestamp: any) => {
    if (!timestamp) return 'Antigos';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffTime = Math.abs(today.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return 'Esta Semana';
    if (diffDays <= 30) return 'Este Mês';
    return 'Mais antigos';
  };

  const grouped = filteredExpenses.reduce((acc, exp) => {
    const group = getTimelineGroup(exp.date);
    if (!acc[group]) acc[group] = [];
    acc[group].push(exp);
    return acc;
  }, {} as Record<string, Expense[]>);

  const categoriesOptions: Category[] = [
    'Materiais', 'Mão de obra', 'Fretes', 'Locação', 'Ferramentas', 
    'Acabamentos', 'Elétrica', 'Hidráulica', 'Pintura', 'Outros'
  ];

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 0 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)' }}>Financeiro</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{activeWork?.name}</p>
        </div>
        <button className="btn-primary" style={{ width: 48, height: 48, padding: 0, borderRadius: 24 }} onClick={() => setShowAddModal(true)}>
          <Plus size={24} />
        </button>
      </div>

      {/* Dashboard Resumo */}
      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Resumo da Obra</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>
            <CountUp end={progressPercent} decimals={1} duration={1.5} />% consumido
          </span>
        </div>

        <div style={{ height: 8, backgroundColor: 'var(--bg-surface)', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: 'var(--color-primary)', transition: 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Orçamento Previsto</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
              <CountUp prefix="R$ " end={budget} separator="." decimal="," decimals={2} duration={1.5} />
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total Gasto</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#EF4444' }}>
              <CountUp prefix="R$ " end={spent} separator="." decimal="," decimals={2} duration={1.5} />
            </p>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Saldo Disponível</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: saldo >= 0 ? '#10B981' : '#EF4444' }}>
              <CountUp prefix="R$ " end={saldo} separator="." decimal="," decimals={2} duration={1.5} />
            </p>
          </div>
        </div>
      </div>

      {/* Lançamentos List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Lançamentos</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => setFilter('all')}
            style={{ background: filter === 'all' ? 'var(--color-primary-alpha)' : 'transparent', color: filter === 'all' ? 'var(--color-primary)' : 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >Todos</button>
          <button 
            onClick={() => setFilter('Pago')}
            style={{ background: filter === 'Pago' ? 'var(--color-success-bg)' : 'transparent', color: filter === 'Pago' ? 'var(--color-success)' : 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >Pagos</button>
          <button 
            onClick={() => setFilter('Pendente')}
            style={{ background: filter === 'Pendente' ? 'var(--color-warning-bg)' : 'transparent', color: filter === 'Pendente' ? 'var(--color-warning)' : 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >Pendentes</button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <EmptyState 
          icon={<Search size={32} />}
          title="Nenhum lançamento"
          description="Adicione suas despesas para acompanhar o saldo da obra."
          actionLabel="Adicionar Lançamento"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {['Hoje', 'Ontem', 'Esta Semana', 'Este Mês', 'Mais antigos'].map(group => {
            if (!grouped[group] || grouped[group].length === 0) return null;
            return (
              <div key={group}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{group}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {grouped[group].map(exp => (
                    <div key={exp.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {exp.status === 'Pago' ? <CheckCircle2 size={20} color="var(--color-success)" /> : <Clock size={20} color="var(--color-warning)" />}
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{exp.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{exp.category} {exp.supplier ? `• ${exp.supplier}` : ''}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: exp.status === 'Cancelado' ? 'var(--text-muted)' : '#EF4444', textDecoration: exp.status === 'Cancelado' ? 'line-through' : 'none', margin: 0 }}>
                          - <CountUp prefix="R$ " end={exp.amount} separator="." decimal="," decimals={2} duration={1} />
                        </p>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4, backgroundColor: exp.status === 'Pago' ? 'var(--color-success-bg)' : exp.status === 'Pendente' ? 'var(--color-warning-bg)' : 'var(--bg-elevated)', color: exp.status === 'Pago' ? 'var(--color-success)' : exp.status === 'Pendente' ? 'var(--color-warning)' : 'var(--text-muted)' }}>
                          {exp.status}
                        </span>
                        <button 
                          onClick={() => handleDeleteExpense(exp)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8, padding: 4, color: 'var(--text-muted)' }}
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add Lançamento (Bottom Sheet) */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel" 
              style={{ 
                width: '100%', 
                maxWidth: 500, 
                borderTopLeftRadius: 32, 
                borderTopRightRadius: 32, 
                padding: '32px 24px calc(24px + env(safe-area-inset-bottom, 0px)) 24px', 
                maxHeight: '90vh', 
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderBottom: 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Novo Lançamento</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'var(--bg-elevated)', border: 'none', color: 'var(--text-main)', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} />
                </button>
              </div>
            
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Descrição</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-premium" placeholder="Ex: Cimento 50kg" />
              </div>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Valor (R$)</label>
                  <input required type="number" step="0.01" min="0" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} className="input-premium" placeholder="0,00" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Data</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="input-premium" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Categoria</label>
                  <select value={category} onChange={e => setCategory(e.target.value as Category)} className="input-premium">
                    {categoriesOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as ExpenseStatus)} className="input-premium">
                    <option value="Pago">Pago</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Parcelado">Parcelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Fornecedor / Prestador (Opcional)</label>
                <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="input-premium" placeholder="Ex: Depósito São João" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Forma de Pagamento (Opcional)</label>
                <input type="text" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="input-premium" placeholder="Ex: PIX, Cartão" />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
                Adicionar Lançamento
              </button>
            </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
