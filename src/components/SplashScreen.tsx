import { useEffect } from 'react';
import { CustomLogo } from './CustomLogo';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Exibe por 2.5 segundos para a animação completa
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="app-container" 
        style={{ 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column', 
          gap: 32,
          background: 'var(--bg-base)',
          zIndex: 9999,
          position: 'fixed',
          inset: 0
        }}
      >
        <div style={{ position: 'relative' }}>
          {/* Ambient Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.5, 0.2], scale: [0.5, 1.2, 1] }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 150,
              height: 150,
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 70%)',
              filter: 'blur(20px)',
              zIndex: 0
            }}
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: -15, y: 20 }}
            animate={{ scale: 1.5, opacity: 1, rotateX: 0, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 1.2 
            }}
            style={{ transformOrigin: 'center', position: 'relative', zIndex: 1 }}
          >
            <CustomLogo theme="dark" />
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            width: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div style={{
            width: '100%',
            height: 3,
            borderRadius: 2,
            backgroundColor: 'var(--border-strong)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Shimmer Effect */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.8), transparent)',
                zIndex: 2
              }}
            />
            {/* Progress Bar */}
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{ 
                height: '100%', 
                backgroundColor: 'var(--color-primary)',
                boxShadow: '0 0 10px var(--color-primary)'
              }}
            />
          </div>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}
          >
            Carregando
          </motion.span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
