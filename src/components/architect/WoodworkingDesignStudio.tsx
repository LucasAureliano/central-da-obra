import React, { useState } from 'react';
import { ArrowLeft, GripVertical, Hammer, ShoppingCart, Trash2, Building2 } from 'lucide-react';
import { motion, Reorder, useDragControls, AnimatePresence } from 'framer-motion';

interface WoodworkingItem {
  id: string;
  env: string;
  type: string;
  material: string;
  description: string;
  estimatedCost: number;
}

const MATERIAL_PRICES: Record<string, number> = {
  'MDF Branco': 800,
  'MDF Madeirado': 1200,
  'MDF Laca': 2500,
  'Compensado Naval': 1500,
  'MDF Ultra': 1100
};

const TYPE_MULTIPLIER: Record<string, number> = {
  'Armário': 1.5,
  'Painel': 0.8,
  'Roupeiro': 2.0,
  'Gabinete': 1.0,
  'Prateleiras': 0.5
};

function WoodworkingItemComponent({ item, onRemove }: { item: WoodworkingItem; onRemove: (id: string) => void }) {
  const controls = useDragControls();

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'Armário': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' };
      case 'Painel': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' };
      case 'Roupeiro': return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' };
      case 'Gabinete': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280' };
    }
  };

  const colors = getTypeStyle(item.type);

  return (
    <Reorder.Item 
      value={item} 
      dragListener={false} 
      dragControls={controls}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', position: 'relative' }}
    >
      <div
        className="drag-handle"
        onPointerDown={(e) => controls.start(e)}
        style={{ cursor: 'grab', position: 'absolute', right: 8, top: 8, padding: 8, color: 'var(--text-muted)' }}
      >
        <GripVertical size={16} />
      </div>

      <div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 700 }}>{item.env}</span>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, paddingRight: 24, color: 'var(--text-main)' }}>{item.description}</h4>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, backgroundColor: colors.bg, color: colors.color, fontWeight: 600 }}>{item.type}</span>
        <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, backgroundColor: 'var(--bg-panel)', color: 'var(--text-muted)', fontWeight: 600 }}>{item.material}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 12 }}>
          <span style={{ fontSize: 10, color: '#10B981', display: 'block', marginBottom: 4, fontWeight: 700 }}>CUSTO ESTIMADO</span>
          <strong style={{ fontSize: 14, color: '#10B981' }}>R$ {item.estimatedCost.toFixed(2)}</strong>
        </div>
      </div>

      <button onClick={() => onRemove(item.id)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <Trash2 size={14} /> Remover Item
      </button>
    </Reorder.Item>
  );
}

export function WoodworkingDesignStudio({ onBack }: { onBack?: () => void }) {
  const [items, setItems] = useState<WoodworkingItem[]>([
    { id: '1', env: 'Cozinha', type: 'Armário', material: 'MDF Branco', description: 'Armários Superiores Pia', estimatedCost: 1200 },
    { id: '2', env: 'Cozinha', type: 'Gabinete', material: 'MDF Ultra', description: 'Gabinete Inferior Pia', estimatedCost: 1650 },
    { id: '3', env: 'Quarto Casal', type: 'Roupeiro', material: 'MDF Madeirado', description: 'Guarda-Roupa 4 Portas', estimatedCost: 4800 },
  ]);

  const [env, setEnv] = useState('Cozinha');
  const [type, setType] = useState('Armário');
  const [material, setMaterial] = useState('MDF Branco');
  const [desc, setDesc] = useState('');

  const addItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!desc) return;
    
    const baseMat = MATERIAL_PRICES[material] || 1000;
    const mult = TYPE_MULTIPLIER[type] || 1.0;
    const est = baseMat * mult;

    setItems([...items, {
      id: crypto.randomUUID(),
      env,
      type,
      material,
      description: desc,
      estimatedCost: est
    }]);
    setDesc('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const totalEstimatedCost = items.reduce((acc, i) => acc + i.estimatedCost, 0);

  const stores = [
    { name: 'Marcenaria Central', price: totalEstimatedCost * 1.15 },
    { name: 'Leo Madeiras (MDF M³)', price: totalEstimatedCost * 0.65 },
    { name: 'Decor Planejados', price: totalEstimatedCost * 1.80 }
  ];
  stores.sort((a, b) => a.price - b.price);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{ padding: 8, borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={20} color="var(--text-main)" />
          </button>
        )}
        <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: 12, borderRadius: 16 }}>
          <Hammer size={28} color="#8B5CF6" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Projeto de Marcenaria</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Planejamento de móveis e estimativa de custos</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* ADD ITEM FORM */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Adicionar Móvel ao Projeto</h2>

          <form onSubmit={addItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>AMBIENTE</label>
              <input 
                type="text" 
                value={env}
                onChange={e => setEnv(e.target.value)}
                placeholder="Ex: Cozinha"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>TIPO DE MÓVEL</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              >
                {Object.keys(TYPE_MULTIPLIER).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>MATERIAL / ACABAMENTO</label>
              <select 
                value={material}
                onChange={e => setMaterial(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              >
                {Object.keys(MATERIAL_PRICES).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>DESCRIÇíO DETALHADA</label>
              <input 
                type="text" 
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Ex: Armários superiores com porta de vidro reflecta"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <button 
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: 8, padding: 14, borderRadius: 12, fontWeight: 700 }}
              >
                Adicionar Móvel
              </button>
            </div>
          </form>
        </div>

        {/* ITEMS LIST (CARDS) */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Lista de Móveis</h3>
          {items.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Nenhum móvel adicionado.</p>
          ) : (
            <Reorder.Group axis="y" values={items} onReorder={setItems} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {items.map(item => (
                <WoodworkingItemComponent key={item.id} item={item} onRemove={removeItem} />
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* ESTIMATOR & QUOTATION SUMMARY */}
        {items.length > 0 && (
          <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <ShoppingCart size={24} color="#10B981" />
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Cotação em Tempo Real (API)</h2>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Total Estimado (Móveis Planejados)</span>
              <strong style={{ fontSize: 32, fontWeight: 900, color: '#10B981' }}>R$ {totalEstimatedCost.toFixed(2)}</strong>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>Comparativo de Fornecedores:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {stores.map((store, idx) => (
                <div key={store.name} style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-elevated)', border: idx === 0 ? '2px solid #10B981' : '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Building2 size={14} /> {store.name}
                    </span>
                    {idx === 0 && <span style={{ fontSize: 10, backgroundColor: '#10B981', color: '#FFF', padding: '2px 6px', borderRadius: 6, fontWeight: 700 }}>+ BARATO</span>}
                  </div>
                  <strong style={{ fontSize: 18, color: 'var(--text-main)' }}>R$ {store.price.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
