import React, { useEffect } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Capacitor } from '@capacitor/core';
import { AdMobService } from '../../services/ads/AdMobService';

export const AdSenseInjector: React.FC = () => {
  const { limits } = useSubscription();

  useEffect(() => {
    const shouldShowAds = limits?.hasAds ?? true;

    if (shouldShowAds) {
      if (Capacitor.isNativePlatform()) {
        AdMobService.initialize();
      } else {
        const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5169145738145346";
          script.async = true;
          script.crossOrigin = "anonymous";
          document.head.appendChild(script);
        }
      }
    } else {
      if (Capacitor.isNativePlatform()) {
        AdMobService.hideBanner();
      } else {
        const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
        if (existingScript) existingScript.remove();
      }
    }
  }, [limits]);

  return null;
};
