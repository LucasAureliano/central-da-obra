import os

code_sponsored = '''import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
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

  const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes('free');

  useEffect(() => {
    if (isPaidPlan || isDismissed) {
      setIsVisible(false);
      return;
    }
    const shouldShow = Math.random() <= probability;
    setIsVisible(shouldShow);
  }, [isPaidPlan, isDismissed, probability]);

  // Inject AdSense when visible
  useEffect(() => {
    if (isVisible && !isPaidPlan) {
      try {
        const w = window as any;
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [isVisible, isPaidPlan]);

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
            minHeight: 120
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Patrocinado
              </div>
              <Star size={12} style={{ color: '#F59E0B' }} fill="#F59E0B" />
            </div>
            <button onClick={handleDismiss} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Fechar">
              <X size={16} />
            </button>
          </div>

          <div style={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            {/* Google AdSense Unit */}
            <ins className="adsbygoogle"
                 style={{ display: 'block', width: '100%' }}
                 data-ad-client="ca-pub-5169145738145346"
                 data-ad-slot="2786365840"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
'''

with open('src/components/shared/SponsoredAd.tsx', 'w', encoding='utf-8') as f:
    f.write(code_sponsored)


code_interstitial = '''import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

export const InterstitialAd: React.FC = () => {
  const { plan } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes('free');

  useEffect(() => {
    if (isPaidPlan) return;
    const initialTimer = setTimeout(() => {
      triggerAd();
    }, 180000); // 3 minutes
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

  useEffect(() => {
    if (isVisible && !isPaidPlan) {
      try {
        const w = window as any;
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [isVisible, isPaidPlan]);

  const handleClose = () => {
    if (!canClose) return;
    setIsVisible(false);
    setTimeout(() => {
      triggerAd();
    }, 5 * 60000); // 5 minutes
  };

  if (isPaidPlan) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            style={{
              width: '90%', maxWidth: 400, background: 'var(--bg-panel)',
              borderRadius: 24, overflow: 'hidden', position: 'relative',
              border: '1px solid var(--border-subtle)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: 8 }}>
              {!canClose ? (
                <div style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  Fechando em {countdown}s
                </div>
              ) : (
                <button onClick={handleClose} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              )}
            </div>

            <div style={{ padding: '48px 16px 24px', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Google AdSense Unit */}
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '100%' }}
                   data-ad-client="ca-pub-5169145738145346"
                   data-ad-slot="2786365840"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
'''

with open('src/components/shared/InterstitialAd.tsx', 'w', encoding='utf-8') as f:
    f.write(code_interstitial)
