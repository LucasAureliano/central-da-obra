import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface UpgradeModalProps {
  onNavigate?: (route: string) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onNavigate }) => {
  const { showUpgradeModal, setShowUpgradeModal, upgradeMessage, upgradeTitle, upgradeBenefits, plan } = useSubscription();

  if (!showUpgradeModal) return null;

  const handleGoToPlans = () => {
    setShowUpgradeModal(false);
    if (onNavigate) {
      onNavigate('planos');
    } else {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'planos' }));
    }
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          onClick={() => setShowUpgradeModal(false)}
        />
        
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
            onClick={() => setShowUpgradeModal(false)}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)', width: 32, height: 32, borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ padding: '40px 32px 32px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <motion.div 
              animate={{ rotateY: [0, 180, 360] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 72, height: 72, borderRadius: 36, background: 'linear-gradient(135deg, #FFDF00 0%, #D4AF37 100%)', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.4)'
              }}
            >
              <Crown size={36} />
            </motion.div>
            
            <h2 style={{ margin: '0 0 12px 0', fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
              {upgradeTitle || 'Desbloqueie seu Potencial'}
            </h2>
            <p style={{ margin: '0 0 24px 0', fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {upgradeMessage || 'Acesse inteligência artificial avançada, remova os anúncios para sempre e gerencie obras ilimitadas com recursos profissionais.'}
            </p>

            {upgradeBenefits && upgradeBenefits.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 24, textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {upgradeBenefits.map((benefit, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <CheckCircle2 size={18} color="#D4AF37" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <button
                onClick={handleGoToPlans}
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
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                  padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s'
                }}
              >
                Continuar com limitações ({plan?.name})
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
