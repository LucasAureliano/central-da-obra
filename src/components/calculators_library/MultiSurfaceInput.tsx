import React from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SurfaceDimension {
  id: number;
  label?: string;
  d1: string; // width
  d2: string; // height/length
  d3?: string; // depth/thickness (optional)
}

interface MultiSurfaceInputProps {
  surfaces: SurfaceDimension[];
  onChange: (surfaces: SurfaceDimension[]) => void;
  title?: string; // e.g. "Medidas das Paredes"
  d1Label?: string; // e.g. "Largura (m)"
  d2Label?: string; // e.g. "Altura (m)"
  d3Label?: string; // e.g. "Profundidade (m)" (if passed, enables d3)
  addButtonLabel?: string; // e.g. "Adicionar Parede"
  defaultSurfaceLabel?: string; // e.g. "Parede"
}

export function MultiSurfaceInput({
  surfaces,
  onChange,
  title = 'Áreas de Aplicação',
  d1Label = 'Largura (m)',
  d2Label = 'Altura (m)',
  d3Label,
  addButtonLabel = 'Adicionar Superfície',
  defaultSurfaceLabel = 'Superfície'
}: MultiSurfaceInputProps) {
  
  const addSurface = () => {
    onChange([
      ...surfaces,
      { id: Date.now(), d1: '', d2: '', d3: d3Label ? '' : undefined, label: `${defaultSurfaceLabel} ${surfaces.length + 1}` }
    ]);
  };

  const removeSurface = (id: number) => {
    // Keep at least one
    if (surfaces.length <= 1) return;
    const newSurfaces = surfaces.filter(s => s.id !== id);
    onChange(newSurfaces);
  };

  const updateSurface = (id: number, field: keyof SurfaceDimension, value: string) => {
    onChange(
      surfaces.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
  };

  return (
    <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {surfaces.map((surface, index) => (
            <motion.div
              key={surface.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'var(--bg-input-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                  type="text"
                  value={surface.label || `${defaultSurfaceLabel} ${index + 1}`}
                  onChange={(e) => updateSurface(surface.id, 'label', e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    outline: 'none',
                    width: '100%',
                    padding: 0
                  }}
                  placeholder="Nome do ambiente..."
                />
                
                {surfaces.length > 1 && (
                  <button
                    onClick={() => removeSurface(surface.id)}
                    style={{
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 16,
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-error)',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {d1Label}
                  </label>
                  <input
                    type="number"
                    value={surface.d1}
                    onChange={(e) => updateSurface(surface.id, 'd1', e.target.value)}
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 12,
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-base)',
                      color: 'var(--text-main)',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {d2Label}
                  </label>
                  <input
                    type="number"
                    value={surface.d2}
                    onChange={(e) => updateSurface(surface.id, 'd2', e.target.value)}
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 12,
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-base)',
                      color: 'var(--text-main)',
                      outline: 'none'
                    }}
                  />
                </div>
                {d3Label && (
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>
                      {d3Label}
                    </label>
                    <input
                      type="number"
                      value={surface.d3 || ''}
                      onChange={(e) => updateSurface(surface.id, 'd3', e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 12,
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-base)',
                        color: 'var(--text-main)',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={addSurface}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px',
            borderRadius: 16,
            border: '1px dashed var(--border-subtle)',
            background: 'transparent',
            color: 'var(--text-main)',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          <Plus size={16} />
          {addButtonLabel}
        </button>
      </div>
    </div>
  );
}
