import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, ArrowRight, Sparkles, Star } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface PlansUpsellPopupProps {
  onGoToPlans: () => void;
}

export const PlansUpsellPopup: React.FC<PlansUpsellPopupProps> = ({ onGoToPlans }) => {
  const { plan } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  
  const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes('free');

  useEffect(() => {
    if (isPaidPlan) return;
    
    // Check if shown in this session
    const hasShown = sessionStorage.getItem('plans_popup_shown') === 'true';
    if (hasShown) return;

    // Show after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('plans_popup_shown', 'true');
    }, 20000);

    return () => clearTimeout(timer);
  }, [isPaidPlan]);

  if (isPaidPlan) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: 20
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            style={{
              width: '100%',
              maxWidth: 440,
              background: 'linear-gradient(145deg, #1A1C23 0%, #0D0E12 100%)',
              borderRadius: 32,
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 215, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            {/* Premium Gold Glow */}
            <div style={{
              position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)',
              width: 200, height: 100, background: 'rgba(255, 215, 0, 0.4)', filter: 'blur(50px)',
              pointerEvents: 'none'
            }} />

            <button
              onClick={() => setIsVisible(false)}
              style={{
                position: 'absolute', top: 20, right: 20,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)', width: 32, height: 32, borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <X size={18} />
            </button>

            <div style={{ padding: '40px 32px 32px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <motion.div 
                animate={{ rotateY: [0, 180, 360] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 72, height: 72, borderRadius: 36, background: 'linear-gradient(135deg, #FFDF00 0%, #D4AF37 100%)', color: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                  boxShadow: '0 10px 25px rgba(212, 175, 55, 0.4)'
                }}
              >
                <Crown size={36} />
              </motion.div>
              
              <h2 style={{ margin: '0 0 12px 0', fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                Desbloqueie seu Potencial
              </h2>
              <p style={{ margin: '0 0 32px 0', fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Acesse inteligência artificial avançada, remova os anúncios para sempre e gerencie obras ilimitadas com recursos profissionais.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button
                  onClick={() => {
                    setIsVisible(false);
                    onGoToPlans();
                  }}
                  style={{ 
                    padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 800, 
                    background: 'linear-gradient(135deg, #FFDF00 0%, #D4AF37 100%)',
                    color: '#000', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  <Sparkles size={18} /> Conhecer Planos Premium
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  style={{
                    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                    padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  Continuar com limitações
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
