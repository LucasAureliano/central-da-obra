import os

code = '''import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

export const InterstitialAd: React.FC = () => {
  const { plan } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes('free');

  useEffect(() => {
    if (isPaidPlan) return;

    // Trigger after 1 minute for the first time
    const initialTimer = setTimeout(() => {
      triggerAd();
    }, 60000); // 1 minute

    return () => clearTimeout(initialTimer);
  }, [isPaidPlan]);

  const triggerAd = () => {
    if (isPaidPlan) return;
    setIsVisible(true);
    setCanClose(false);
    setCountdown(5);
  };

  useEffect(() => {
    if (isVisible && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isVisible && countdown === 0) {
      setCanClose(true);
    }
  }, [isVisible, countdown]);

  const handleClose = () => {
    if (!canClose) return;
    setIsVisible(false);
    
    // Schedule next ad in 5 minutes
    setTimeout(() => {
      triggerAd();
    }, 5 * 60000); // 5 minutes
  };

  if (isPaidPlan) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              width: '90%',
              maxWidth: 400,
              background: 'var(--bg-panel)',
              borderRadius: 24,
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
            }}
          >
            {/* Ad Header/Timer */}
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              {!canClose ? (
                <div style={{
                  background: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Fechando em {countdown}s
                </div>
              ) : (
                <button
                  onClick={handleClose}
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              background: 'var(--color-primary)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              Patrocinado
            </div>

            {/* Fake Video/Image Area */}
            <div style={{
              width: '100%',
              height: 240,
              background: 'linear-gradient(135deg, #1e1e1e 0%, #000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}>
                <Play size={24} color="#fff" style={{ marginLeft: 4 }} />
              </div>
            </div>

            {/* Ad Content */}
            <div style={{ padding: 24, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>
                Destrave Todo o Potencial
              </h3>
              <p style={{ margin: '0 0 24px 0', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Assine agora e remova todos os anúncios, ganhe relatórios ilimitados e acesse as ferramentas premium da CentralObra.
              </p>

              <button
                style={{
                  width: '100%',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  padding: 16,
                  borderRadius: 16,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)'
                }}
              >
                Conhecer Planos Premium <ExternalLink size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
'''

with open('src/components/shared/InterstitialAd.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
