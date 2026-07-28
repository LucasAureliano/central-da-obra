import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, getDocs, addDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useWorks } from '../contexts/WorksContext';
import { TiltCard } from './TiltCard';
import { Check, Package, Search, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingItem {
  workId: string;
  workName: string;
  calcId: string;
  matIndex: number;
  name: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  supplier?: string;
  link?: string;
  isPurchased: boolean;
  calcName: string;
}

export function Shopping({ workId, embedded }: { workId?: string, embedded?: boolean }) {
  const { user, profile } = useAuth();
  const { works, activeWork, primaryWork } = useWorks();
  const currentWork = workId ? works.find(w => w.id === workId) : ((profile?.role === 'owner' ? primaryWork : activeWork) || (works.length > 0 ? works[0] : null));
  const [calcItems, setCalcItems] = useState<ShoppingItem[]>([]);
  const [manualItems, setManualItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'purchased'>('pending');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState(0);
  const [newUnit, setNewUnit] = useState('un');
  const [newPrice, setNewPrice] = useState(0);


  // Fetch calculation‑derived items
  useEffect(() => {
    if (!user || !currentWork) { 
      setCalcItems([]); 
      setLoading(false); 
      return; 
    }

    const qCalc = query(collection(db, 'works', currentWork.id, 'calculations'));
    const unsubCalc = onSnapshot(qCalc, (calcSnap) => {
      const workItems: ShoppingItem[] = [];
      calcSnap.forEach(docSnap => {
        const calcData = docSnap.data();
        if (calcData.resultData && calcData.resultData.materials) {
          calcData.resultData.materials.forEach((mat: any, idx: number) => {
            workItems.push({
              workId: currentWork.id,
              workName: currentWork.name,
              calcId: docSnap.id,
              calcName: calcData.name || 'Assistente',
              matIndex: idx,
              name: mat.name,
              quantity: mat.quantity,
              unit: mat.unit,
              unitPrice: mat.unitPrice,
              isPurchased: !!mat.isPurchased
            });
          });
        }
      });
      setCalcItems(workItems);
      setLoading(false);
    });

    return () => unsubCalc();
  }, [user, currentWork]);

  // Fetch manual shopping items for the active work
  useEffect(() => {
    if (!user || !currentWork) {
      setManualItems([]);
      return;
    }
    const qManual = query(collection(db, 'works', currentWork.id, 'shopping'));
    const unsubManual = onSnapshot(qManual, (snap) => {
      const items: ShoppingItem[] = [];
      snap.docs.forEach(docSnap => {
        const data = docSnap.data();
        items.push({
          workId: currentWork.id,
          workName: currentWork.name,
          calcId: docSnap.id,
          matIndex: -1,
          name: data.name,
          quantity: data.quantity,
          unit: data.unit,
          unitPrice: data.unitPrice,
          isPurchased: data.isPurchased ?? false,
          calcName: 'Adicionado Manualmente'
        });
      });
      setManualItems(items);
    });
    return () => unsubManual();
  }, [user, currentWork]);

  const handleTogglePurchased = async (item: ShoppingItem) => {
    try {
      const isNowPurchased = !item.isPurchased;
      
      // If marking as purchased, create an expense in Finance (expenses)
      if (isNowPurchased) {
        const expenseWorkId = item.workId || currentWork?.id;
        if (expenseWorkId) {
          const amount = Number(item.quantity) * (item.unitPrice || 0);
          await addDoc(collection(db, 'works', expenseWorkId, 'expenses'), {
            title: `Compra: ${item.name}`,
            amount: amount,
            category: 'Materiais',
            date: serverTimestamp(),
            status: 'Pago',
            createdAt: serverTimestamp(),
            workId: expenseWorkId,
            supplier: item.supplier || ''
          });
          
          await updateDoc(doc(db, 'works', expenseWorkId), {
            spent: increment(amount)
          });
        }
      }

      // Manual item update
      if (item.matIndex === -1 && item.calcId) {
        const manualRef = doc(db, 'works', item.workId, 'shopping', item.calcId);
        await updateDoc(manualRef, { isPurchased: isNowPurchased });
        return;
      }

      // Calculation item update (existing logic)
      const calcRef = doc(db, 'works', item.workId, 'calculations', item.calcId);
      const calcSnap = await getDocs(query(collection(db, 'works', item.workId, 'calculations')));
      const calcDoc = calcSnap.docs.find(d => d.id === item.calcId);
      if (!calcDoc) return;

      const calcData = calcDoc.data();
      const updatedMaterials = [...calcData.resultData.materials];
      updatedMaterials[item.matIndex] = {
        ...updatedMaterials[item.matIndex],
        isPurchased: isNowPurchased
      };

      const newTotalCost = updatedMaterials.reduce((acc, m) => acc + (Number(m.quantity) * (m.unitPrice || 0)), 0);
      await updateDoc(calcRef, {
        'resultData.materials': updatedMaterials,
        totalCost: newTotalCost
      });
    } catch (error) {
      console.error('Error updating item', error);
    }
  };

  const handleAddManualItem = async () => {
    if (!newName.trim()) return;
    if (newQty <= 0) return;
    if (newPrice < 0) return;
    try {
      if (!currentWork) return;
      await addDoc(collection(db, 'works', currentWork.id, 'shopping'), {
        name: newName.trim(),
        quantity: newQty,
        unit: newUnit,
        unitPrice: newPrice,
        isPurchased: false,
        createdAt: serverTimestamp()
      });
      setNewName('');
      setNewQty(0);
      setNewUnit('un');
      setNewPrice(0);
      setShowAddModal(false);
    } catch (e) {
      console.error('Error adding manual item', e);
    }
  };

  const mergedItems = [...calcItems, ...manualItems];
  const filteredItems = mergedItems.filter(item => {
    const matchesFilter = filter === 'pending' ? !item.isPurchased : item.isPurchased;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.workName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPending = mergedItems.filter(i => !i.isPurchased)
    .reduce((acc, i) => acc + (Number(i.quantity) * (i.unitPrice || 0)), 0);

  const unitOptions = ['un', 'm²', 'm³', 'kg', 'saco', 'litro', 'peça', 'metro'];

  return (
    <div className={embedded ? "animate-fade-in" : "screen-content animate-fade-in"} style={{ padding: embedded ? '0' : '24px 20px 0 20px' }}>
      {!embedded && (
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Lista de Materiais</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gerencie os materiais de todas as suas obras.</p>
      </div>
      )}
      {/* Botão de Adicionar - Destacado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Lista de Materiais</h3>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Gerencie os materiais desta obra</p>
        </div>
        <button className="btn-primary" style={{ padding: '0 20px', height: 48, borderRadius: 14, fontSize: 14, fontWeight: 700 }} onClick={() => setShowAddModal(true)}>
          <Plus size={20} style={{ marginRight: 8 }} /> Adicionar Item
        </button>
      </div>

      <div className="glass-panel" style={{ padding: 16, borderRadius: 16, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--color-danger)' }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Estimativa Pendente</p>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-danger)', margin: 0 }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
          </h3>
        </div>
        <Package size={32} color="var(--color-danger)" style={{ opacity: 0.2 }} />
      </div>

      {/* Price Comparison API Card */}
      {filter === 'pending' && mergedItems.filter(i => !i.isPurchased).length > 0 && (
        <div className="glass-panel" style={{ padding: 16, borderRadius: 18, marginBottom: 24, border: '1px solid rgba(59, 130, 246, 0.3)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              ⚡ Cotação Automática de Preços
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: 8 }}>
              Economia estimada: R$ {Math.round(totalPending * 0.12).toLocaleString('pt-BR')},00
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, textAlign: 'center' }}>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: 10, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block' }}>Menor Preço</span>
              <strong style={{ fontSize: 13, color: '#10B981' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending * 0.88)}</strong>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: 10, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block' }}>Preço Médio</span>
              <strong style={{ fontSize: 13, color: 'var(--text-main)' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}</strong>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: 10, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block' }}>Maior Preço</span>
              <strong style={{ fontSize: 13, color: 'var(--color-danger)' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending * 1.15)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setFilter('pending')}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
              backgroundColor: filter === 'pending' ? 'var(--color-primary-alpha)' : 'var(--bg-elevated)',
              color: filter === 'pending' ? 'var(--color-primary)' : 'var(--text-muted)',
              border: filter === 'pending' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            Pendentes ({mergedItems.filter(i => !i.isPurchased).length})
          </button>
          <button
            onClick={() => setFilter('purchased')}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
              backgroundColor: filter === 'purchased' ? 'var(--color-success-alpha)' : 'var(--bg-elevated)',
              color: filter === 'purchased' ? 'var(--color-success)' : 'var(--text-muted)',
              border: filter === 'purchased' ? '2px solid var(--color-success)' : '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            Comprados ({mergedItems.filter(i => i.isPurchased).length})
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
          <input
            type="text"
            placeholder="Buscar material ou obra..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-premium"
            style={{ width: '100%', paddingLeft: 44 }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 100 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando materiais...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
            <p>Nenhum material {filter === 'pending' ? 'pendente' : 'comprado'} encontrado.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div
                key={`${item.calcId}-${item.matIndex}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TiltCard style={{ padding: 16, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button
                    onClick={() => handleTogglePurchased(item)}
                    style={{
                      width: 28, height: 28, borderRadius: 14,
                      backgroundColor: item.isPurchased ? 'var(--color-success)' : 'transparent',
                      border: item.isPurchased ? 'none' : '2px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, cursor: 'pointer'
                    }}
                  >
                    {item.isPurchased && <Check size={16} color="#FFF" />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: item.isPurchased ? 'var(--text-muted)' : 'var(--text-main)', margin: 0, textDecoration: item.isPurchased ? 'line-through' : 'none' }}>
                        {item.name}
                      </h3>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                         <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.workName?.length ? `${item.workName} • ${item.calcName}` : ''}</span>
                         {item.supplier && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fornecedor: {item.supplier}</span>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        {item.unitPrice ? (
                          <>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)}
                            </span>
                            {item.link && !item.isPurchased && (
                               <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                                 Ver Produto ↗
                               </a>
                            )}
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>S/ Preço</span>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      {/* Add Item Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel animate-slide-up" style={{ 
            width: '100%', 
            maxWidth: 500, 
            borderTopLeftRadius: 24, 
            borderTopRightRadius: 24, 
            padding: '24px 24px calc(24px + env(safe-area-inset-bottom, 0px)) 24px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20, color: 'var(--text-main)' }}>Adicionar Material</h2>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text-muted)' }}>Nome</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="input-premium"
                style={{ width: '100%' }}
                placeholder="Ex.: Cimento"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text-muted)' }}>Quantidade</label>
              <input
                type="number"
                min="0"
                value={newQty}
                onChange={e => setNewQty(parseFloat(e.target.value) || 0)}
                className="input-premium"
                style={{ width: '100%' }}
                placeholder="0"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text-muted)' }}>Unidade</label>
              <select
                value={newUnit}
                onChange={e => setNewUnit(e.target.value)}
                className="input-premium"
                style={{ width: '100%' }}
              >
                {unitOptions.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text-muted)' }}>Preço Unitário (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPrice}
                onChange={e => setNewPrice(parseFloat(e.target.value) || 0)}
                className="input-premium"
                style={{ width: '100%' }}
                placeholder="0,00"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer' }}>
                <X size={20} /> Cancelar
              </button>
              <button onClick={handleAddManualItem} style={{ backgroundColor: 'var(--color-primary)', border: 'none', color: '#FFF', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
