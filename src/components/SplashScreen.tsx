import { useEffect, useState } from 'react';
import { Logo } from './ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    const timer = setTimeout(() => {
      onComplete();
    }, 2600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="app-container" 
        style={{ 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column', 
          gap: 36,
          background: 'radial-gradient(circle at 50% 45%, #181a24 0%, #0a0b0e 100%)',
          zIndex: 9999,
          position: 'fixed',
          inset: 0,
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Ambient Glow 1 - Deep Orange Aura */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ 
              opacity: [0, 0.7, 0.45], 
              scale: [0.7, 1.3, 1.15] 
            }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 107, 0, 0.35) 0%, rgba(255, 107, 0, 0.08) 50%, transparent 72%)',
              filter: 'blur(32px)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />

          {/* Ambient Glow 2 - Cyan/Blue Architectural Accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.45, 0.25], 
              scale: [0.8, 1.4, 1.25],
              rotate: [0, 90]
            }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 68%)',
              filter: 'blur(28px)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />

          {/* Concentric Expanding Shockwave Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ 
              opacity: [0, 0.6, 0], 
              scale: [0.7, 1.55, 1.9] 
            }}
            transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              borderRadius: '50%',
              border: '1.5px solid rgba(255, 107, 0, 0.5)',
              boxShadow: '0 0 20px rgba(255, 107, 0, 0.4)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
          
          {/* Main Logo Container with 3D Spring & Floating Motion */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 15 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: [0, -6, 0] 
            }}
            transition={{ 
              scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.5 },
              y: { repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.7 }
            }}
            style={{ transformOrigin: 'center', position: 'relative', zIndex: 1 }}
          >
            <Logo variant="splash" theme="dark" size={120} />
          </motion.div>
        </div>
        
        {/* Progress & Tagline Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 170,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            zIndex: 1
          }}
        >
          {/* Progress Track */}
          <div style={{
            width: '100%',
            height: 4,
            borderRadius: 999,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)'
          }}>
            {/* Shimmer Light */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
                zIndex: 3
              }}
            />
            {/* Progress Bar Fill with Glowing Tip */}
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
              style={{ 
                height: '100%', 
                background: 'linear-gradient(90deg, #FF6B00 0%, #FFA057 100%)',
                boxShadow: '0 0 12px rgba(255, 107, 0, 0.8)',
                borderRadius: 999
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              style={{ 
                fontSize: 10, 
                fontWeight: 700, 
                color: 'var(--text-muted)', 
                letterSpacing: 2, 
                textTransform: 'uppercase' 
              }}
            >
              CentralObra
            </motion.span>
            <motion.span 
              style={{ 
                fontSize: 11, 
                fontWeight: 700, 
                color: 'var(--color-primary)', 
                fontVariantNumeric: 'tabular-nums' 
              }}
            >
              {progress}%
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
