import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface EmptyState3DProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState3D({ icon, title, description, actionLabel, onAction }: EmptyState3DProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="card-premium"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '48px 24px', 
        textAlign: 'center', 
        gap: 24 
      }}
    >
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        style={{ position: 'relative' }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 80,
          height: 80,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 70%)',
          filter: 'blur(15px)',
          zIndex: 0
        }} />
        
        {/* 3D Floating Icon Container */}
        <div 
          className="card-3d"
          style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 40, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            color: 'var(--color-primary)'
          }}
        >
          {icon}
        </div>
      </motion.div>

      <div style={{ maxWidth: 320 }}>
        <h4 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, letterSpacing: '-0.02em' }}>
          {title}
        </h4>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary" 
          style={{ marginTop: 8 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
