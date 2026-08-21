import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Capacitor } from '@capacitor/core';

interface SponsoredAdProps {
  probability?: number;
  className?: string;
  location?: string;
}

export const SponsoredAd: React.FC<SponsoredAdProps> = ({ probability = 0.3, className = '', location = 'feed' }) => {
  const { limits } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Disable AdSense in native apps to prevent account ban
  const shouldShowAds = (limits?.hasAds ?? true) ;
  const ADS_ENABLED = true;

  useEffect(() => {
    if (!shouldShowAds || isDismissed) {
      setIsVisible(false);
      return;
    }
    const shouldShow = Math.random() <= probability;
    setIsVisible(shouldShow);
  }, [shouldShowAds, isDismissed, probability]);

  // Inject AdSense when visible
  useEffect(() => {
    if (isVisible && shouldShowAds) {
      try {
        const w = window as any;
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [isVisible, shouldShowAds]);

  if (!isVisible || !shouldShowAds || !ADS_ENABLED) return null;

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
          className={`sponsored-ad-card ${className}`}
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
