import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CopilotTipProps {
  tip: string | null; // Pass null to hide
}

export function CopilotTip({ tip }: CopilotTipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (tip) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [tip]);

  return (
    <AnimatePresence>
      {isVisible && tip && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            background: 'linear-gradient(135deg, rgba(239, 108, 0, 0.1), rgba(255, 152, 0, 0.05))',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            borderRadius: 16,
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.05)',
            position: 'relative'
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: 'var(--color-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 2
          }}>
            <Sparkles size={14} color="#FFF" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: 4 }}>
              Copilot Sugere
            </span>
            <p style={{ fontSize: 14, color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
              {tip}
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', padding: 4,
              marginTop: -2, marginRight: -4
            }}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
