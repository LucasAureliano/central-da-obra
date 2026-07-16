import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '48px 24px', 
        textAlign: 'center', 
        gap: 24,
        background: 'var(--bg-surface-solid)',
        borderRadius: 24,
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div 
        style={{ 
          width: 80, 
          height: 80, 
          borderRadius: 40, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          color: 'var(--color-primary)'
        }}
      >
        {icon}
      </div>

      <div style={{ maxWidth: 320 }}>
        <h4 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
          {title}
        </h4>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="btn-primary" 
          style={{ marginTop: 8 }}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
