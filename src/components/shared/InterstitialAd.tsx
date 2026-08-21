import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Capacitor } from '@capacitor/core';
import { AdMobService } from '../../services/ads/AdMobService';

interface InterstitialAdProps {
  onComplete?: () => void;
  triggerId?: string;
  probability?: number;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onComplete, triggerId = 'default', probability = 0.2 }) => {
  const { limits } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  const shouldShowAds = limits?.hasAds ?? true;

  useEffect(() => {
    if (!shouldShowAds) {
      if (onComplete) onComplete();
      return;
    }

    const shouldShow = Math.random() <= probability;
    
    if (shouldShow) {
      if (Capacitor.isNativePlatform()) {
        AdMobService.showInterstitial().then(() => {
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 5000);
        });
      } else {
        setIsVisible(true);
      }
    } else {
      if (onComplete) onComplete();
    }
  }, [shouldShowAds, probability, triggerId]);

  useEffect(() => {
    if (isVisible && countdown > 0 && !Capacitor.isNativePlatform()) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanClose(true);
      if (onComplete) {
        setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, 1000);
      }
    }
  }, [isVisible, countdown, onComplete]);

  useEffect(() => {
    if (isVisible && shouldShowAds && !Capacitor.isNativePlatform()) {
      try {
        const w = window as any;
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [isVisible, shouldShowAds]);

  if (!isVisible || Capacitor.isNativePlatform()) return null;

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
              {!canClose && (
                <div style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  Fechando em {countdown}s
                </div>
              )}
            </div>

            <div style={{ padding: '48px 16px 24px', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {import.meta.env.DEV ? (
                <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', width: '100%', height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px dashed var(--border-subtle)' }}>
                  [Mock de Anúncio Interstitial]<br/><br/>
                  Na produção, este espaço será preenchido automaticamente pelo Google AdSense.
                </div>
              ) : (
                <ins className="adsbygoogle"
                     style={{ display: 'block', width: '100%', height: 250 }}
                     data-ad-client="ca-pub-5169145738145346"
                     data-ad-slot="9876543210"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
