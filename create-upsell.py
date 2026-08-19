import os

code = '''import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, ArrowRight } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface PlansUpsellPopupProps {
  onGoToPlans: () => void;
}

export const PlansUpsellPopup: React.FC<PlansUpsellPopupProps> = ({ onGoToPlans }) => {
  const { plan } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes('free');

  useEffect(() => {
    if (isPaidPlan || hasShown) return;

    // Show after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasShown(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isPaidPlan, hasShown]);

  if (isPaidPlan) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 99998, // just below the ad interstitial
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: 20
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              width: '100%',
              maxWidth: 420,
              background: 'linear-gradient(145deg, var(--bg-panel) 0%, var(--bg-elevated) 100%)',
              borderRadius: 24,
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,107,0,0.1)'
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 120,
              background: 'linear-gradient(135deg, rgba(255,107,0,0.2) 0%, rgba(255,107,0,0) 100%)',
              pointerEvents: 'none'
            }} />

            <button
              onClick={() => setIsVisible(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'var(--bg-input-glass)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)', width: 32, height: 32, borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <div style={{ padding: '32px 24px 24px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 32, background: 'rgba(255,107,0,0.1)', color: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
              }}>
                <Crown size={32} />
              </div>
              
              <h2 style={{ margin: '0 0 12px 0', fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>
                Evolua para o Premium
              </h2>
              <p style={{ margin: '0 0 24px 0', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Desbloqueie ferramentas exclusivas, remova todos os anúncios e tenha acesso ilimitado para gerenciar suas obras com nível de excelência.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => {
                    setIsVisible(false);
                    onGoToPlans();
                  }}
                  className="btn-primary"
                  style={{ padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  Ver Planos Premium <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--text-muted)',
                    padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Continuar no Grátis
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
'''

with open('src/components/shared/PlansUpsellPopup.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
