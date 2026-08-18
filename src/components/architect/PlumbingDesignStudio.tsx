import { useState } from 'react';
import { Droplet, ArrowLeft, GripVertical } from 'lucide-react';
import { motion, Reorder, useDragControls } from 'framer-motion';

export interface PlumbingPoint {
  id: string;
  env: string;
  type: string;
  description: string;
  quantity: number;
}

function PlumbingPointComponent({ item, onRemove }: { item: PlumbingPoint, onRemove: (id: string) => void }) {
  const controls = useDragControls();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Água Fria': return { bg: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9' };
      case 'Água Quente': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
      default: return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' };
    }
  };

  const colors = getTypeColor(item.type);

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', position: 'relative' }}
    >
      <div
        className="drag-handle"
        onPointerDown={(e) => controls.start(e)}
        style={{ cursor: 'grab', position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', padding: 8, color: 'var(--text-muted)' }}
      >
        <GripVertical size={16} />
      </div>

      <div style={{ paddingLeft: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{item.env}</span>
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

export function PlumbingDesignStudio({ onBack }: { onBack?: () => void }) {
  const [points, setPoints] = useState<PlumbingPoint[]>([
    { id: '1', env: 'Cozinha', type: 'Água Fria', description: 'Ponto Pia', quantity: 1 },
    { id: '2', env: 'Cozinha', type: 'Esgoto', description: 'Esgoto Pia (50mm)', quantity: 1 },
    { id: '3', env: 'Banheiro Suíte', type: 'Água Fria', description: 'Ponto Chuveiro', quantity: 1 },
    { id: '4', env: 'Banheiro Suíte', type: 'Água Quente', description: 'Ponto Chuveiro Aquecimento', quantity: 1 },
    { id: '5', env: 'Banheiro Suíte', type: 'Esgoto', description: 'Esgoto Vaso Sanitário (100mm)', quantity: 1 },
  ]);

  const [env, setEnv] = useState('Cozinha');
  const [type, setType] = useState('Água Fria');
  const [description, setDescription] = useState('');

  const addPoint = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!description) return;
    setPoints([...points, {
      id: Math.random().toString(36).substring(7),
      env,
      type,
      description,
      quantity: 1
    }]);
    setDescription('');
  };

  const removePoint = (id: string) => {
    setPoints(points.filter(p => p.id !== id));
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
          <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 12, borderRadius: 16 }}>
            <Droplet size={28} color="#0EA5E9" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Mapeamento Hidráulico</h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Planejamento de pontos de água fria, quente e esgoto</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'start' }}>
          <form onSubmit={addPoint} style={{ flex: '1 1 300px', backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Novo Ponto</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>AMBIENTE</label>
                <input 
                  type="text" 
                  value={env}
                  required
                  onChange={e => setEnv(e.target.value)}
                  placeholder="Ex: Área de Serviço"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>TIPO DE PONTO</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                >
                  <option value="Água Fria">Água Fria</option>
                  <option value="Água Quente">Água Quente</option>
                  <option value="Esgoto">Esgoto Sanitário</option>
                  <option value="Pluvial">Água Pluvial</option>
                  <option value="Gás">Ponto de Gás</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>DESCRIÇÃO</label>
                <input 
                  type="text" 
                  value={description}
                  required
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Ponto Máquina Lavar"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                />
              </div>

              <button 
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: 12, backgroundColor: '#0EA5E9', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
              >
                Adicionar Ponto
              </button>
            </div>
          </form>

          <div style={{ flex: '2 1 400px', minWidth: 0 }}>
            <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Lista de Pontos</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Arraste para reordenar</span>
            </div>
            
            <div style={{ overflowX: 'auto', paddingBottom: 10 }}>
              <div style={{ minWidth: 600 }}>
                <Reorder.Group 
                  axis="y" 
                  values={points} 
                  onReorder={setPoints} 
                  style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0, listStyle: 'none' }}
                >
                  {points.map(p => (
                    <PlumbingPointComponent key={p.id} item={p} onRemove={removePoint} />
                  ))}
                </Reorder.Group>
              </div>
            </div>
            
            {points.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                Nenhum ponto adicionado.
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
