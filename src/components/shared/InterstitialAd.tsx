import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

export const InterstitialAd: React.FC = () => {
  const { plan } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes('free');
  const ADS_ENABLED = false; // Temporarily disabled while AdSense is in review

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

  if (isPaidPlan || !ADS_ENABLED) return null;

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
