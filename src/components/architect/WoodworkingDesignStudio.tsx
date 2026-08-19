import React, { useState } from 'react';
import { ArrowLeft, GripVertical, Hammer } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';

interface WoodworkingItem {
  id: string;
  env: string;
  type: string;
  material: string;
  description: string;
}

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
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '16px 20px', 
        backgroundColor: 'var(--bg-elevated)', 
        borderRadius: 16,
        border: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
    >
      <div 
        className="drag-handle"
        onPointerDown={(e) => controls.start(e)}
        style={{ cursor: 'grab', position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', padding: 8, color: 'var(--text-muted)' }}
      >
        <GripVertical size={16} />
      </div>

      <div style={{ paddingLeft: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{item.env} - {item.material}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ 
            fontSize: 10, 
            fontWeight: 700, 
            padding: '2px 8px', 
            borderRadius: 6,
            backgroundColor: colors.bg,
            color: colors.color
          }}>{item.type}</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)' }}>{item.description}</span>
        </div>
      </div>
      <button 
        type="button"
        onClick={() => onRemove(item.id)}
        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
      >
        Remover
      </button>
    </Reorder.Item>
  );
}

export function WoodworkingDesignStudio({ onBack }: { onBack?: () => void }) {
  const [items, setItems] = useState<WoodworkingItem[]>([
    { id: '1', env: 'Cozinha', type: 'Armário', material: 'MDF Branco 15mm', description: 'Armário Superior da Pia' },
    { id: '2', env: 'Cozinha', type: 'Gabinete', material: 'MDF Madeirado 15mm', description: 'Gabinete da Pia e Gaveteiros' },
    { id: '3', env: 'Sala', type: 'Painel', material: 'MDF Freijó 18mm', description: 'Painel da TV com prateleira' },
    { id: '4', env: 'Quarto Master', type: 'Roupeiro', material: 'MDF Branco 15mm', description: 'Roupeiro em L 6 portas' },
  ]);

  const [env, setEnv] = useState('Cozinha');
  const [type, setType] = useState('Armário');
  const [material, setMaterial] = useState('MDF Branco 15mm');
  const [description, setDescription] = useState('');

  const addItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!description) return;
    setItems([...items, {
      id: Math.random().toString(36).substring(7),
      env,
      type,
      material,
      description
    }]);
    setDescription('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(p => p.id !== id));
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
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
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Estúdio de Marcenaria</h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Planejamento e lista de móveis sob medida</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'start' }}>
          <form onSubmit={addItem} style={{ flex: '1 1 300px', backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Novo Móvel</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>AMBIENTE</label>
                <input 
                  type="text" 
                  value={env}
                  required
                  onChange={e => setEnv(e.target.value)}
                  placeholder="Ex: Cozinha, Quarto..."
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
                  <option value="Armário">Armário (Aéreo)</option>
                  <option value="Gabinete">Gabinete (Bancada/Inferior)</option>
                  <option value="Roupeiro">Roupeiro</option>
                  <option value="Painel">Painel de TV/Cama</option>
                  <option value="Prateleira">Prateleira/Nicho</option>
                  <option value="Mesa/Bancada">Mesa/Bancada</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>MATERIAL / ACABAMENTO</label>
                <input 
                  type="text" 
                  value={material}
                  required
                  onChange={e => setMaterial(e.target.value)}
                  placeholder="Ex: MDF Freijó 18mm"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>DESCRIÇÃO / USO</label>
                <input 
                  type="text" 
                  value={description}
                  required
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Armário para Mantimentos"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                />
              </div>

              <button 
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: 12, backgroundColor: '#8B5CF6', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
              >
                Adicionar Móvel
              </button>
            </div>
          </form>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Lista de Marcenaria</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Arraste para reordenar</span>
            </div>
            
            <div style={{ overflowX: 'auto', paddingBottom: 10 }}>
              <div style={{ minWidth: 600 }}>
                <Reorder.Group 
                  axis="y" 
                  values={items} 
                  onReorder={setItems} 
                  style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0, listStyle: 'none' }}
                >
                  {items.map(p => (
                    <WoodworkingItemComponent key={p.id} item={p} onRemove={removeItem} />
                  ))}
                </Reorder.Group>
              </div>
            </div>
            
            {items.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                Nenhum móvel planejado.
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
