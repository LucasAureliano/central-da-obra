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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowUpgradeModal(false)}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-subtle)] glass-panel text-[var(--text-main)]"
        >
          {/* Header */}
          <div className="relative p-6 pb-4 flex items-center justify-between border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                <Crown size={20} className="text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-[var(--text-main)]">Upgrade Premium</h2>
            </div>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-8 h-8 rounded-full bg-transparent border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-black text-[var(--text-main)] mb-2 leading-tight">
              {upgradeTitle}
            </h3>
            
            <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed">
              {upgradeMessage}
            </p>

            {upgradeBenefits && upgradeBenefits.length > 0 && (
              <div className="bg-transparent border border-[var(--border-subtle)] rounded-2xl p-5 mb-6">
                <p className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-4 opacity-80">O que você ganha:</p>
                <div className="flex flex-col gap-3">
                  {upgradeBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-[var(--text-main)] leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoToPlans}
                className="btn-primary w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Sparkles size={18} />
                Ver Planos a partir de R$ 29,99
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-3 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
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
