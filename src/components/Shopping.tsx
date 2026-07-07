import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { TiltCard } from './TiltCard';
import { Check, Package, Search } from 'lucide-react';
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
  isPurchased: boolean;
  calcName: string;
}

export function Shopping() {
  const { user } = useAuth();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'purchased'>('pending');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // 1. Fetch works
    const qWorks = query(collection(db, 'works'), where('userId', '==', user.uid));
    const unsubscribeWorks = onSnapshot(qWorks, (worksSnap) => {
      const worksData = worksSnap.docs.map(d => ({ id: d.id, name: d.data().name }));
      
      if (worksData.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const unsubscribeCalcs: any[] = [];
      const allItemsMap: Record<string, ShoppingItem[]> = {};

      let pendingUpdates = worksData.length;

      worksData.forEach(work => {
        const qCalc = query(collection(db, 'works', work.id, 'calculations'));
        const unsubCalc = onSnapshot(qCalc, (calcSnap) => {
          const workItems: ShoppingItem[] = [];
          
          calcSnap.forEach(docSnap => {
            const calcData = docSnap.data();
            if (calcData.resultData && calcData.resultData.materials) {
              calcData.resultData.materials.forEach((mat: any, idx: number) => {
                workItems.push({
                  workId: work.id,
                  workName: work.name,
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

          allItemsMap[work.id] = workItems;
          pendingUpdates--;
          
          // Re-flatten
          const flattened = Object.values(allItemsMap).flat();
          setItems(flattened);
          if (pendingUpdates <= 0) {
            setLoading(false);
          }
        });
        unsubscribeCalcs.push(unsubCalc);
      });

      return () => {
        unsubscribeCalcs.forEach(fn => fn());
      };
    });

    return () => unsubscribeWorks();
  }, [user]);

  const handleTogglePurchased = async (item: ShoppingItem) => {
    try {
      // Optimiztic UI could be implemented here, but we will just wait for the db update
      // which will trigger the onSnapshot.
      
      // We need to fetch the specific calculation document to update the array
      const calcRef = doc(db, 'works', item.workId, 'calculations', item.calcId);
      
      // Get the latest data to avoid race conditions
      // In a real app we'd use a transaction, but this is fine for this scope
      const calcSnap = await getDocs(query(collection(db, 'works', item.workId, 'calculations')));
      const calcDoc = calcSnap.docs.find(d => d.id === item.calcId);
      if (!calcDoc) return;
      
      const calcData = calcDoc.data();
      const updatedMaterials = [...calcData.resultData.materials];
      
      updatedMaterials[item.matIndex] = {
        ...updatedMaterials[item.matIndex],
        isPurchased: !item.isPurchased
      };

      const newTotalCost = updatedMaterials.reduce((acc, m) => acc + (Number(m.quantity) * (m.unitPrice || 0)), 0);

      await updateDoc(calcRef, {
        'resultData.materials': updatedMaterials,
        totalCost: newTotalCost
      });
      
    } catch (error) {
      console.error("Error updating item", error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'pending' ? !item.isPurchased : item.isPurchased;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.workName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPending = items.filter(i => !i.isPurchased).reduce((acc, i) => acc + (Number(i.quantity) * (i.unitPrice || 0)), 0);

  return (
    <div className="screen-content" style={{ padding: '24px 20px 100px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Lista de Compras</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gerencie os materiais de todas as suas obras.</p>
      </div>

      <div className="glass-panel" style={{ padding: 16, borderRadius: 16, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--color-danger)' }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Estimativa Pendente</p>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-danger)', margin: 0 }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
          </h3>
        </div>
        <Package size={32} color="var(--color-danger)" style={{ opacity: 0.2 }} />
      </div>

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
            Pendentes ({items.filter(i => !i.isPurchased).length})
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
            Comprados ({items.filter(i => i.isPurchased).length})
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
          <input 
            type="text" 
            placeholder="Buscar material ou obra..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium"
            style={{ width: '100%', paddingLeft: 44 }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.workName} • {item.calcName}</span>
                      {item.unitPrice ? (
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>S/ Preço</span>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
