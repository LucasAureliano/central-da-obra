import { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { motion, AnimatePresence } from 'framer-motion';

export function AppInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if it's NOT a native app (i.e. Web), and we are on a mobile device
    const isNative = Capacitor.isNativePlatform();
    const isMobileBrowser = window.innerWidth <= 768;
    const hasDismissed = localStorage.getItem('dismissed_app_banner');

    if (!isNative && isMobileBrowser && !hasDismissed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.65)', // neutral black
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          color: '#FFF',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          margin: '16px 20px', // spacing from sides since it's now inside the content
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div style={{ padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 10 }}>
            <Smartphone size={20} color="#FFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FFF' }}>Aplicativo CentralObra</span>
            <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.7)' }}>Mais rápido e profissional</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a 
            href="#" 
            style={{
              backgroundColor: '#FFF',
              color: '#000',
              padding: '6px 14px',
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            BAIXAR
          </a>
          <button 
            onClick={() => {
              setIsVisible(false);
              localStorage.setItem('dismissed_app_banner', 'true');
            }}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'rgba(255, 255, 255, 0.7)', 
              cursor: 'pointer',
              padding: 4,
              display: 'flex'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
