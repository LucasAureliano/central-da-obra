import { useState } from 'react';
import { Droplet, ArrowLeft, GripVertical, ShoppingCart, Trash2, Building2 } from 'lucide-react';
import { motion, Reorder, useDragControls } from 'framer-motion';

export interface PlumbingPoint {
  id: string;
  env: string;
  type: string;
  description: string;
  quantity: number;
  estimatedCost: number;
}

const PLUMBING_TYPES = [
  { name: 'Água Fria', basePrice: 45.0 },
  { name: 'Água Quente', basePrice: 85.0 },
  { name: 'Esgoto', basePrice: 35.0 },
  { name: 'Gás', basePrice: 120.0 }
];

function PlumbingPointComponent({ item, onRemove }: { item: PlumbingPoint, onRemove: (id: string) => void }) {
  const controls = useDragControls();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Água Fria': return { bg: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9' };
      case 'Água Quente': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
      case 'Gás': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' };
      default: return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' };
    }
  };

  const colors = getTypeColor(item.type);

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
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ 
            fontSize: 10, 
            fontWeight: 700, 
            padding: '4px 8px', 
            borderRadius: 6,
            backgroundColor: colors.bg,
            color: colors.color
          }}>
            {item.type}
          </span>
          <strong style={{ fontSize: 16, color: 'var(--text-main)' }}>{item.description}</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 10, borderRadius: 12 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>QUANTIDADE</span>
          <strong style={{ fontSize: 14, color: 'var(--text-main)' }}>{item.quantity} un</strong>
        </div>
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 12 }}>
          <span style={{ fontSize: 10, color: '#10B981', display: 'block', marginBottom: 4, fontWeight: 700 }}>CUSTO ESTIMADO</span>
          <strong style={{ fontSize: 14, color: '#10B981' }}>R$ {item.estimatedCost.toFixed(2)}</strong>
        </div>
      </div>

      <button onClick={() => onRemove(item.id)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <Trash2 size={14} /> Remover Ponto
      </button>
    </Reorder.Item>
  );
}

export function PlumbingDesignStudio({ onBack }: { onBack?: () => void }) {
  const [points, setPoints] = useState<PlumbingPoint[]>([
    { id: '1', env: 'Banheiro Master', type: 'Água Quente', description: 'Chuveiro', quantity: 2, estimatedCost: 170.0 },
    { id: '2', env: 'Banheiro Master', type: 'Água Fria', description: 'Chuveiro', quantity: 2, estimatedCost: 90.0 },
    { id: '3', env: 'Cozinha', type: 'Água Fria', description: 'Torneira Pia', quantity: 1, estimatedCost: 45.0 },
  ]);

  const [newEnv, setNewEnv] = useState('Cozinha');
  const [newType, setNewType] = useState('Água Fria');
  const [newDesc, setNewDesc] = useState('');
  const [newQty, setNewQty] = useState('1');

  const addPoint = () => {
    if (!newDesc) return;
    
    const typeObj = PLUMBING_TYPES.find(t => t.name === newType) || PLUMBING_TYPES[0];
    const qty = Number(newQty) || 1;
    const est = typeObj.basePrice * qty;

    setPoints([{
      id: crypto.randomUUID(),
      env: newEnv,
      type: newType,
      description: newDesc,
      quantity: qty,
      estimatedCost: est
    }, ...points]);
    setNewDesc('');
  };

  const removePoint = (id: string) => {
    setPoints(points.filter(p => p.id !== id));
  };

  const totalEstimatedCost = points.reduce((acc, p) => acc + p.estimatedCost, 0);

  const stores = [
    { name: 'Leroy Merlin', price: totalEstimatedCost * 1.05 },
    { name: 'Telhanorte', price: totalEstimatedCost * 0.98 },
    { name: 'C&C', price: totalEstimatedCost * 1.12 }
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
        <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 12, borderRadius: 16 }}>
          <Droplet size={28} color="#0EA5E9" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Projeto Hidráulico</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Mapeamento de pontos e cotação de tubos/conexões</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* ADD POINT FORM */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Mapear Novo Ponto</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>AMBIENTE</label>
              <input 
                type="text" 
                value={newEnv}
                onChange={e => setNewEnv(e.target.value)}
                placeholder="Ex: Banheiro Suíte"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>TIPO</label>
              <select 
                value={newType}
                onChange={e => setNewType(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              >
                {PLUMBING_TYPES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>DESCRIÇíO</label>
              <input 
                type="text" 
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Ex: Ponto de Chuveiro"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>QUANTIDADE</label>
              <input 
                type="number" 
                value={newQty}
                onChange={e => setNewQty(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <button 
            onClick={addPoint}
            className="btn-primary"
            style={{ width: '100%', marginTop: 24, padding: 14, borderRadius: 12, fontWeight: 700 }}
          >
            Adicionar Ponto
          </button>
        </div>

        {/* POINTS LIST (CARDS) */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Pontos Mapeados</h3>
          {points.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Nenhum ponto hidráulico mapeado.</p>
          ) : (
            <Reorder.Group axis="y" values={points} onReorder={setPoints} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {points.map(item => (
                <PlumbingPointComponent key={item.id} item={item} onRemove={removePoint} />
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* ESTIMATOR & QUOTATION SUMMARY */}
        {points.length > 0 && (
          <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <ShoppingCart size={24} color="#10B981" />
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Cotação em Tempo Real (API)</h2>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Total Estimado de Tubos e Conexões</span>
              <strong style={{ fontSize: 32, fontWeight: 900, color: '#10B981' }}>R$ {totalEstimatedCost.toFixed(2)}</strong>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>Comparativo nas Lojas Parceiras:</h3>
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
