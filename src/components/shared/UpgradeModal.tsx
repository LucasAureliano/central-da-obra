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
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={() => setShowUpgradeModal(false)}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel"
          style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: 420, 
            borderRadius: 24, 
            overflow: 'hidden', 
            border: '1px solid var(--border-subtle)', 
            backgroundColor: 'var(--bg-panel)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={20} color="#3B82F6" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Upgrade Premium</h2>
            </div>
            <button
              onClick={() => setShowUpgradeModal(false)}
              style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} color="var(--text-muted)" />
            </button>
          </div>

          <div style={{ padding: 24 }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.2 }}>
              {upgradeTitle}
            </h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
              {upgradeMessage}
            </p>

            {upgradeBenefits && upgradeBenefits.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, opacity: 0.8 }}>O que você ganha:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {upgradeBenefits.map((benefit, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <CheckCircle2 size={18} color="#3B82F6" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={handleGoToPlans}
                className="btn-primary"
                style={{ width: '100%', padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)' }}
              >
                <Sparkles size={18} />
                Ver Planos a partir de R$ 29,90
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="btn-secondary"
                style={{ width: '100%', padding: 16, borderRadius: 16, fontWeight: 700, fontSize: 14, backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)' }}
              >
                Continuar no Plano Atual ({plan.name})
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
