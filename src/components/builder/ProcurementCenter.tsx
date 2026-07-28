import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, Plus, Search, Trash2, X, Save, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export type ProcurementStage = 'Solicitado' | 'Cotando' | 'Aprovado' | 'Comprado' | 'Recebido' | 'Conferido';

export interface ProcurementItem {
  id?: string;
  itemTitle: string;
  workName: string;
  category: string; // 'Alvenaria', 'Elétrica', 'Hidráulica', 'Acabamento', 'Estrutura', 'Ferramentas'
  costCenter?: string;
  supplierName?: string;
  stage: ProcurementStage;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  approvedPrice?: number;
  paidPrice?: number;
  responsible: string;
  deadline?: string;
  invoiceNumber?: string;
  notes?: string;
  createdAt?: any;
}

const STAGES: { id: ProcurementStage; label: string; color: string }[] = [
  { id: 'Solicitado', label: 'Solicitado', color: '#6B7280' },
  { id: 'Cotando', label: 'Cotando', color: '#3B82F6' },
  { id: 'Aprovado', label: 'Aprovado', color: '#F59E0B' },
  { id: 'Comprado', label: 'Comprado', color: '#8B5CF6' },
  { id: 'Recebido', label: 'Recebido', color: '#06B6D4' },
  { id: 'Conferido', label: 'Conferido', color: '#10B981' },
];

const CATEGORIES = [
  'Alvenaria e Cimento',
  'Aço e Estrutura',
  'Elétrica e Iluminação',
  'Hidráulica e Louças',
  'Revestimentos e Pisos',
  'Tintas e Impermeabilizantes',
  'Equipamentos e EPIs',
  'Madeiras e Formas'
];

interface ProcurementCenterProps {
  onBack?: () => void;
}

export function ProcurementCenter({ onBack }: ProcurementCenterProps) {
  const { user, isGuest } = useAuth();
  const [items, setItems] = useState<ProcurementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStageFilter, setActiveStageFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProcurementItem | null>(null);

  // Form States
  const [itemTitle, setItemTitle] = useState('');
  const [workName, setWorkName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [costCenter, setCostCenter] = useState('Obra Principal');
  const [supplierName, setSupplierName] = useState('');
  const [stage, setStage] = useState<ProcurementStage>('Solicitado');
  const [quantity, setQuantity] = useState('100');
  const [unit, setUnit] = useState('un');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [approvedPrice, setApprovedPrice] = useState('');
  const [responsible, setResponsible] = useState('');
  const [deadline, setDeadline] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'procurement_items'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProcurementItem));
        setItems(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setItems([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      try {
        const local = localStorage.getItem('co_procurement_items');
        if (local) setItems(JSON.parse(local));
        else setItems([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (data: ProcurementItem[]) => {
    localStorage.setItem('co_procurement_items', JSON.stringify(data));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setItemTitle('');
    setWorkName('');
    setCategory(CATEGORIES[0]);
    setCostCenter('Obra Principal');
    setSupplierName('');
    setStage('Solicitado');
    setQuantity('100');
    setUnit('un');
    setEstimatedPrice('');
    setApprovedPrice('');
    setResponsible(user?.displayName || 'Setor de Compras');
    setDeadline('');
    setInvoiceNumber('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !workName.trim()) {
      toast.error('Informe o material e a obra de destino.');
      return;
    }

    setSubmitting(true);
    const estVal = estimatedPrice ? parseInt(estimatedPrice.replace(/\D/g, '')) / 100 : 0;
    const appVal = approvedPrice ? parseInt(approvedPrice.replace(/\D/g, '')) / 100 : estVal;

    const payload: ProcurementItem = {
      itemTitle,
      workName,
      category,
      costCenter,
      supplierName,
      stage,
      quantity: parseFloat(quantity) || 1,
      unit,
      estimatedPrice: estVal,
      approvedPrice: appVal,
      responsible,
      deadline,
      invoiceNumber,
      notes,
    };

    try {
      if (user && !isGuest) {
        if (editingItem?.id) {
          const docRef = doc(db, 'users', user.uid, 'procurement_items', editingItem.id);
          await updateDoc(docRef, { ...payload, updatedAt: serverTimestamp() });
          toast.success('Compra atualizada!');
        } else {
          await addDoc(collection(db, 'users', user.uid, 'procurement_items'), {
            ...payload,
            createdAt: serverTimestamp()
          });
          toast.success('Solicitação de compra criada!');
        }
      } else {
        if (editingItem?.id) {
          const updated = items.map(i => i.id === editingItem.id ? { ...i, ...payload } : i);
          setItems(updated);
          saveToLocal(updated);
        } else {
          const newItem = { id: crypto.randomUUID(), ...payload };
          const updated = [newItem, ...items];
          setItems(updated);
          saveToLocal(updated);
        }
        toast.success('Compra salva localmente!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar no Centro de Compras.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdvanceStage = async (item: ProcurementItem) => {
    if (!item.id) return;
    const stageOrder: ProcurementStage[] = ['Solicitado', 'Cotando', 'Aprovado', 'Comprado', 'Recebido', 'Conferido'];
    const currentIdx = stageOrder.indexOf(item.stage);
    if (currentIdx >= stageOrder.length - 1) return;

    const nextStage = stageOrder[currentIdx + 1];

    try {
      if (user && !isGuest) {
        const docRef = doc(db, 'users', user.uid, 'procurement_items', item.id);
        await updateDoc(docRef, { stage: nextStage });
      } else {
        const updated = items.map(i => i.id === item.id ? { ...i, stage: nextStage } : i);
        setItems(updated);
        saveToLocal(updated);
      }
      toast.success(`Avançado para: ${nextStage}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover esta solicitação de compra?')) return;
    try {
      if (user && !isGuest) {
        await deleteDoc(doc(db, 'users', user.uid, 'procurement_items', id));
      } else {
        const updated = items.filter(i => i.id !== id);
        setItems(updated);
        saveToLocal(updated);
      }
      toast.success('Compra removida.');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredItems = items.filter(i => {
    const matchesStage = activeStageFilter === 'Todos' || i.stage === activeStageFilter;
    const matchesSearch = i.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          i.workName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (i.supplierName && i.supplierName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStage && matchesSearch;
  });

  const totalProcurementValue = items.reduce((acc, curr) => acc + (curr.approvedPrice || curr.estimatedPrice || 0), 0);
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
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Centro de Compras</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Gestão de cotações, suprimentos e aprovações corporativas</p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Nova Compra
        </button>
      </div>

      {/* KPI Total Summary Card */}
      <div className="card-mesh-gradient" style={{ padding: 20, borderRadius: 20, marginBottom: 20, color: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 2 }}>Volume Total de Compras</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: '#FFF' }}>{fmt(totalProcurementValue)}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 2 }}>Itens em Pedido</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#4ADE80' }}>{items.length} itens</span>
          </div>
        </div>
      </div>

      {/* 6 Stage Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }} className="hide-scrollbar">
        <button
          onClick={() => setActiveStageFilter('Todos')}
          style={{
            padding: '6px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
            border: activeStageFilter === 'Todos' ? '1.5px solid var(--color-primary)' : '1px solid var(--border-subtle)',
            backgroundColor: activeStageFilter === 'Todos' ? 'var(--color-primary-alpha)' : 'var(--bg-elevated)',
            color: activeStageFilter === 'Todos' ? 'var(--color-primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          Todos
        </button>
        {STAGES.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveStageFilter(s.id)}
            style={{
              padding: '6px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
              border: activeStageFilter === s.id ? `1.5px solid ${s.color}` : '1px solid var(--border-subtle)',
              backgroundColor: activeStageFilter === s.id ? `${s.color}20` : 'var(--bg-elevated)',
              color: activeStageFilter === s.id ? s.color : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      {items.length > 0 && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 13 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por insumo, obra ou fornecedor..."
            className="input-premium"
            style={{ paddingLeft: 42, height: 44 }}
          />
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 20 }} />
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 20 }} />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Centro de Compras Vazio</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Crie cotações e requisições de materiais para gerenciar o abastecimento de suas obras.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 14, marginTop: 4 }}>
            + Solicitar Primeira Compra
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredItems.map(item => {
            const stageConfig = STAGES.find(s => s.id === item.stage) || STAGES[0];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: 16, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 10, borderLeft: `4px solid ${stageConfig.color}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 2px' }}>{item.itemTitle}</h3>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Obra: <strong style={{ color: 'var(--text-main)' }}>{item.workName}</strong> • {item.quantity} {item.unit}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: stageConfig.color, backgroundColor: `${stageConfig.color}20`, padding: '4px 10px', borderRadius: 8 }}>
                    {item.stage}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Fornecedor: {item.supplierName || 'A cotar'}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-main)' }}>
                      {fmt(item.approvedPrice || item.estimatedPrice || 0)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {item.stage !== 'Conferido' && (
                      <button
                        onClick={() => handleAdvanceStage(item)}
                        style={{ padding: '6px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700, border: 'none', backgroundColor: stageConfig.color, color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        Avançar <ChevronRight size={14} />
                      </button>
                    )}
                    <button onClick={() => item.id && handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
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

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Nova Solicitação de Compra</h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Item / Material *</label>
                  <input required value={itemTitle} onChange={e => setItemTitle(e.target.value)} placeholder="Ex: 50 sacos de Cimento CP-II" className="input-premium" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Obra de Destino *</label>
                    <input required value={workName} onChange={e => setWorkName(e.target.value)} placeholder="Ex: Edifício Horizonte" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Categoria</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="input-premium" style={{ height: 44 }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Quantidade</label>
                    <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Unidade</label>
                    <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="m², kg, un" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Valor Estimado</label>
                    <input
                      value={estimatedPrice}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (!val) setEstimatedPrice('');
                        else setEstimatedPrice(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(val) / 100));
                      }}
                      placeholder="R$ 0,00"
                      className="input-premium"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Fornecedor Sugerido</label>
                    <input value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder="Ex: Gerdau / Leroy" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Etapa Inicial</label>
                    <select value={stage} onChange={e => setStage(e.target.value as any)} className="input-premium" style={{ height: 44 }}>
                      {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Solicitação de Compra</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
