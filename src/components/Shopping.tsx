import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Trash2, Search, CheckCircle, Circle, 
  ExternalLink, Sparkles, X, ShoppingBag, ArrowLeft 
} from 'lucide-react';
import { EmptyState3D } from './EmptyState3D';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
}

export function Shopping({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [list, setList] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [searchStoreItem, setSearchStoreItem] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'users', user.uid, 'shoppingList'), orderBy('addedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as ShoppingItem[];
      setList(items);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemQty || !user) return;
    
    try {
      await addDoc(collection(db, 'users', user.uid, 'shoppingList'), {
        name: newItemName,
        quantity: newItemQty,
        checked: false,
        addedAt: serverTimestamp()
      });
      setNewItemName('');
      setNewItemQty('');
    } catch (err) {
      console.error('Error adding item', err);
    }
  };

  const handleToggleItem = async (id: string, currentChecked: boolean) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'shoppingList', id), {
      checked: !currentChecked
    });
  };

  const handleDeleteItem = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'shoppingList', id));
  };

  // Mock stores prices for simulation
  const getMockPrices = (itemName: string) => {
    const seed = itemName.charCodeAt(0) + itemName.length;
    const basePrice = (seed % 150) + 15;
    return [
      { store: 'Leroy Merlin', price: `R$ ${basePrice.toFixed(2)}`, link: '#' },
      { store: 'C&C Casa e Construção', price: `R$ ${(basePrice * 0.95).toFixed(2)}`, link: '#' },
      { store: 'Telhanorte', price: `R$ ${(basePrice * 1.03).toFixed(2)}`, link: '#' },
      { store: 'Mercado Livre', price: `R$ ${(basePrice * 0.91).toFixed(2)}`, link: '#' },
    ];
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 120 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>

      <div className="flex-space-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="text-2xl font-black">Lista de Compras</h1>
          <p className="text-xs text-muted">Controle inteligente de cotações e compras</p>
        </div>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-alpha)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShoppingCart size={20} className="text-primary" />
        </div>
      </div>

      {/* Add new item Form */}
      <form onSubmit={handleAdd} className="glass-panel animate-fade-in" style={{ padding: 16, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <h3 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>Inserir Item Manualmente</h3>
        
        <div className="input-group" style={{ marginBottom: 0 }}>
          <span className="input-label" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Material / Ferramenta</span>
          <input 
            type="text" 
            placeholder="Ex: Cimento CP-II" 
            className="input-premium" 
            style={{ width: '100%', marginBottom: 8 }} 
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required 
          />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <span className="input-label" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Quantidade / Medida</span>
          <input 
            type="text" 
            placeholder="Ex: 10 sacos ou 2 m³" 
            className="input-premium" 
            style={{ width: '100%', marginBottom: 8 }} 
            value={newItemQty}
            onChange={(e) => setNewItemQty(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="btn-primary" style={{ padding: 12, borderRadius: 12, fontSize: 13, marginTop: 4 }}>
          Adicionar à Lista
        </button>
      </form>

      {/* Shopping List Items */}
      <h3 className="text-base font-bold text-main" style={{ marginBottom: 12 }}>Itens de Compra</h3>
      {list.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <EmptyState3D
            icon={<ShoppingBag size={40} />}
            title="Sua lista de compras está vazia"
            description="Use as calculadoras para adicionar materiais automaticamente ou adicione manualmente no formulário acima."
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(item => (
            <div 
              key={item.id} 
              className={`glass-panel card-premium-interactive flex-space-between ${item.checked ? 'animate-fade-in' : ''}`} 
              style={{ 
                padding: '12px 14px',
                borderRadius: 16,
                opacity: item.checked ? 0.6 : 1,
                borderLeft: item.checked ? '4px solid #22c55e' : '4px solid var(--color-primary)'
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button 
                  onClick={() => handleToggleItem(item.id, item.checked)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: item.checked ? '#22c55e' : 'var(--text-muted)' }}
                >
                  {item.checked ? <CheckCircle size={20} /> : <Circle size={20} />}
                </button>
                <div>
                  <h4 className="text-sm font-semibold text-main" style={{ textDecoration: item.checked ? 'line-through' : 'none', margin: 0 }}>
                    {item.name}
                  </h4>
                  <span className="text-xs text-muted">Qtd: {item.quantity}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!item.checked && (
                  <button 
                    onClick={() => setSearchStoreItem(item.name)}
                    className="btn-action" 
                    style={{ padding: '6px 10px', fontSize: 11, display: 'flex', gap: 4, alignItems: 'center', backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}
                  >
                    <Search size={12} /> Cotar
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Store Price Comparison Drawer/Modal */}
      {searchStoreItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-end'
        }} className="animate-fade-in">
          <div className="glass-panel animate-fade-in" style={{
            width: '100%',
            backgroundColor: 'var(--bg-surface)',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div className="flex-space-between">
              <h3 className="text-base font-bold flex-row-center text-main" style={{ gap: 8, display: 'flex', alignItems: 'center', margin: 0 }}>
                <Sparkles size={18} className="text-primary" /> Cotação Inteligente
              </h3>
              <button 
                onClick={() => setSearchStoreItem(null)} 
                style={{ background: 'var(--bg-glass)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-xs text-muted">
              Buscando preços para: <strong style={{ color: 'var(--text-main)' }}>{searchStoreItem}</strong> nas principais lojas:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {getMockPrices(searchStoreItem).map((store, index) => (
                <div key={index} className="glass-panel flex-space-between" style={{ padding: '12px 16px', borderRadius: 16 }}>
                  <div>
                    <h4 className="text-sm font-bold text-main" style={{ margin: 0, marginBottom: 4 }}>{store.store}</h4>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{store.price}</span>
                  </div>
                  <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', borderRadius: 100, fontSize: 12, gap: 4, display: 'flex', alignItems: 'center' }}>
                    Comprar <ExternalLink size={12} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setSearchStoreItem(null)} className="btn-secondary" style={{ marginTop: 8, padding: 14, borderRadius: 16 }}>
              Fechar Cotação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

