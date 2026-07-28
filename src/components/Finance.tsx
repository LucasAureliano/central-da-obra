import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWorks } from '../contexts/WorksContext';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, Timestamp, orderBy, updateDoc, doc, increment } from 'firebase/firestore';
import { Plus, Wallet, CheckCircle2, Clock, X, Trash2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { EmptyState } from './EmptyState';

type Category = 'Materiais' | 'Mão de Obra' | 'Equipamentos' | 'Serviços' | 'Taxas' | 'Outros';
type ExpenseStatus = 'Pago' | 'Pendente' | 'Cancelado';

interface Expense {
  id?: string;
  title: string;
  amount: number;
  category: Category;
  status: ExpenseStatus;
  date: any;
  supplier?: string;
  paymentMethod?: string;
  notes?: string;
  workId?: string;
  createdAt: any;
  workName?: string;
}

export function Finance({ initialShowAddModal = false, onBack, workId, embedded }: { initialShowAddModal?: boolean; onBack?: () => void; workId?: string; embedded?: boolean }) {
  const { user, isGuest, profile } = useAuth();
  const { works, activeWork, primaryWork } = useWorks();
  
  const isGlobal = !workId;
  const currentWork = workId ? works.find(w => w.id === workId) : ((profile?.role === 'owner' ? primaryWork : activeWork) || (works.length > 0 ? works[0] : null));
  const workIdsStr = isGlobal ? works.map(w => w.id).sort().join(',') : (currentWork?.id || '');

  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddModal, setShowAddModal] = useState(initialShowAddModal);
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
  const [selectedWorkId, setSelectedWorkId] = useState<string>('');

  useEffect(() => {
    if (showAddModal) {
      if (isGlobal && works.length > 0 && !selectedWorkId) {
        setSelectedWorkId(works[0].id);
      } else if (!isGlobal && currentWork) {
        setSelectedWorkId(currentWork.id);
      }
    }
  }, [showAddModal, isGlobal, works, currentWork]);

  useEffect(() => {
    if (!user || isGuest) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const worksToQuery = isGlobal ? works : (currentWork ? [currentWork] : []);
    
    if (worksToQuery.length === 0) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribes: any[] = [];
    const allData: Record<string, Expense[]> = {};
    let loadedCount = 0;

    worksToQuery.forEach(w => {
      const qExpenses = query(
        collection(db, `works/${w.id}/expenses`),
        orderBy('date', 'desc')
      );

      const unsub = onSnapshot(qExpenses, (snap) => {
        const data = snap.docs.map(doc => ({ 
          id: doc.id, 
          workName: w.name,
          workId: w.id,
          ...doc.data() 
        } as Expense));
        
        allData[w.id] = data;
        loadedCount++;
        
        const combined = Object.values(allData).flat().sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
          const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
          return dateB - dateA;
        });
        
        setExpenses(combined);
        if (loadedCount >= worksToQuery.length) {
          setLoading(false);
        }
      });
      unsubscribes.push(unsub);
    });

    return () => unsubscribes.forEach(u => u());
  }, [user, isGuest, workIdsStr]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetWork = works.find(w => w.id === selectedWorkId);
    if (!title || amount <= 0 || !targetWork) return;

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
        workId: targetWork.id,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, `works/${targetWork.id}/expenses`), newExpense);
      
      if (status === 'Pago') {
        const workRef = doc(db, 'works', targetWork.id);
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
    if (!exp.workId) return;
    if (!window.confirm('Tem certeza que deseja excluir este lançamento?')) return;
    
    try {
      await import('firebase/firestore').then(({ deleteDoc }) => 
        deleteDoc(doc(db, `works/${exp.workId}/expenses`, exp.id!))
      );
      
      if (exp.status === 'Pago') {
        const workRef = doc(db, 'works', exp.workId);
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

  const budget = isGlobal 
    ? works.reduce((acc, w) => acc + (Number(w.budget) || 0), 0)
    : (Number(currentWork?.budget) || 0);
    
  const spent = expenses.filter(e => e.status !== 'Cancelado').reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const saldo = budget - spent;
  const progressPercent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

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

  const groupOrder = ['Hoje', 'Ontem', 'Esta Semana', 'Este Mês', 'Mais antigos'];

  return (
    <div className={embedded ? "animate-fade-in" : "screen-content animate-fade-in"} style={{ padding: embedded ? '0' : '24px 20px 0 20px' }}>
      {!embedded && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        {onBack && (
          <button onClick={onBack} className="btn-secondary" style={{ padding: 8, borderRadius: 12 }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            {isGlobal ? 'Financeiro Global' : 'Financeiro da Obra'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isGlobal ? 'Controle consolidado de todas as obras' : 'Acompanhamento do orçamento e gastos'}
          </p>
        </div>
      </div>
      )}

      {/* Resumo Card */}
      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 32, background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 200, height: 200, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16,185,129,0) 70%)', borderRadius: '50%' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Resumo Financeiro</h3>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Posição atual consolidada</p>
          </div>
          <button className="btn-primary" style={{ padding: '0 16px', height: 40, borderRadius: 12, fontSize: 13 }} onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Lançar Despesa
          </button>
        </div>

        <div style={{ height: 8, backgroundColor: 'var(--bg-surface)', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: 'var(--color-primary)', transition: 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Orçamento Previsto</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
              {formatCurrency(budget)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total Gasto</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#EF4444' }}>
              {formatCurrency(spent)}
            </p>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Saldo Disponível</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: saldo >= 0 ? '#10B981' : '#EF4444' }}>
              {formatCurrency(saldo)}
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

      <div style={{ paddingBottom: 100 }}>
        {groupOrder.map(group => {
          const groupExpenses = grouped[group];
          if (!groupExpenses || groupExpenses.length === 0) return null;

          return (
            <div key={group} style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{group}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {groupExpenses.map(exp => (
                  <div key={exp.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: exp.status === 'Pago' ? 'var(--color-success-bg)' : exp.status === 'Pendente' ? 'var(--color-warning-bg)' : 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: exp.status === 'Pago' ? 'var(--color-success)' : exp.status === 'Pendente' ? 'var(--color-warning)' : 'var(--text-muted)' }}>
                        {exp.status === 'Pago' ? <CheckCircle2 size={24} /> : exp.status === 'Pendente' ? <Clock size={24} /> : <X size={24} />}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{exp.title}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{exp.category}</span>
                          {isGlobal && exp.workName && (
                            <>
                              <span style={{ fontSize: 10, color: 'var(--border-strong)' }}>•</span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)' }}>{exp.workName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: exp.status === 'Pago' ? '#EF4444' : 'var(--text-main)' }}>
                        - {formatCurrency(exp.amount)}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: exp.status === 'Pago' ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600, marginTop: 4 }}>
                        {exp.status}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteExpense(exp)} style={{ background: 'none', border: 'none', padding: 8, color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredExpenses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Wallet size={40} color="var(--border-strong)" style={{ marginBottom: 16 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhum lançamento encontrado nesta categoria.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
            onClick={() => setShowAddModal(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel" 
            style={{ 
              position: 'relative', width: '100%', maxWidth: 500, 
              borderRadius: 24, padding: '32px 24px', 
              maxHeight: '90vh', overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Nova Despesa</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'var(--bg-surface)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {isGlobal && (
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Obra</label>
                    <select required value={selectedWorkId} onChange={e => setSelectedWorkId(e.target.value)} className="input-premium">
                      <option value="" disabled>Selecione uma obra</option>
                      {works.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                )}

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
                      <option value="Materiais">Materiais</option>
                      <option value="Mão de Obra">Mão de Obra</option>
                      <option value="Equipamentos">Equipamentos</option>
                      <option value="Serviços">Serviços</option>
                      <option value="Taxas">Taxas</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as ExpenseStatus)} className="input-premium">
                      <option value="Pago">Pago</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Fornecedor (Opcional)</label>
                  <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="input-premium" placeholder="Nome do fornecedor" />
                </div>

                <button type="submit" className="btn-primary" style={{ height: 48, borderRadius: 14, fontSize: 15, fontWeight: 700, marginTop: 8 }}>
                  Salvar Lançamento
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
