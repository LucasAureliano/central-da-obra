import os

code = '''import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Star } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface SponsoredAdProps {
  probability?: number; // 0.0 to 1.0
  className?: string;
  location?: string;
}

export const SponsoredAd: React.FC<SponsoredAdProps> = ({ probability = 0.3, className = '', location = 'feed' }) => {
  const { plan } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if it's a paid plan
  const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes('free');

  useEffect(() => {
    // If paid plan, never show. If dismissed in this session, never show.
    if (isPaidPlan || isDismissed) {
      setIsVisible(false);
      return;
    }

    // Use a simple seeded random based on location to keep it stable during renders,
    // or just a normal Math.random() on mount.
    const shouldShow = Math.random() <= probability;
    setIsVisible(shouldShow);
  }, [isPaidPlan, isDismissed, probability]);

  if (!isVisible || isPaidPlan) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0, overflow: 'hidden' }}
          className={sponsored-ad-card \}
          style={{
            position: 'relative',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          {/* Glass glare effect */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ 
                background: 'var(--color-primary-alpha)', 
                color: 'var(--color-primary)', 
                padding: '2px 8px', 
                borderRadius: 12, 
                fontSize: 10, 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                Patrocinado
              </div>
              <Star size={12} style={{ color: '#F59E0B' }} fill="#F59E0B" />
            </div>
            <button 
              onClick={handleDismiss}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Fechar an&uacute;ncio"
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 12, 
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF9500 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 'bold', fontSize: 24, flexShrink: 0
            }}>
              CO
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)', fontSize: 16 }}>CentralObra Ads</h4>
              <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.4 }}>
                Transforme a visibilidade da sua construtora. Anuncie aqui e alcance milhares de clientes no app.
              </p>
              <button style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                fontSize: 14,
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                Saiba mais <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
'''

os.makedirs('src/components/shared', exist_ok=True)
with open('src/components/shared/SponsoredAd.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
