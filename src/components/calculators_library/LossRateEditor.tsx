import { useState } from 'react';
import { AlertTriangle, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LossRateEditorProps {
  defaultRate: number;
  currentRate: number;
  onRateChange: (rate: number) => void;
}

export function LossRateEditor({ defaultRate, currentRate, onRateChange }: LossRateEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const isBelowRecommended = currentRate < defaultRate;

  return (
    <div style={{ marginBottom: 24 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%', 
          padding: '12px 16px', 
          borderRadius: isOpen ? '16px 16px 0 0' : 16, 
          background: 'var(--bg-input-glass)', 
          border: '1px solid var(--border-subtle)',
          borderBottom: isOpen ? 'none' : '1px solid var(--border-subtle)',
          cursor: 'pointer',
          color: 'var(--text-main)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings2 size={16} color="var(--text-muted)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Taxa de Perda: {currentRate}%</span>
        </div>
        {isBelowRecommended && <AlertTriangle size={16} color="#F59E0B" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ 
              padding: 16, 
              background: 'var(--bg-glass)', 
              border: '1px solid var(--border-subtle)', 
              borderTop: 'none', 
              borderRadius: '0 0 16px 16px' 
            }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                Margem de perda por recortes/quebras (Recomendado: {defaultRate}%)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="1"
                  value={currentRate}
                  onChange={e => onRateChange(parseInt(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                />
                <span style={{ fontSize: 14, fontWeight: 700, width: 40, textAlign: 'right' }}>{currentRate}%</span>
              </div>
              
              {isBelowRecommended && (
                <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 11, color: '#F59E0B', lineHeight: 1.4 }}>
                    <strong>Atenção:</strong> Você definiu uma taxa menor que a norma técnica recomendada ({defaultRate}%). Isso pode gerar falta de material na obra.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
