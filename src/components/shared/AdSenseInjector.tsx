import React, { useEffect } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Capacitor } from '@capacitor/core';

export const AdSenseInjector: React.FC = () => {
  const { limits } = useSubscription();

  useEffect(() => {
    // Only inject if it's a free plan or hasAds is explicitly true
    // AND if we are NOT on a native mobile app to avoid Google bans
    const shouldShowAds = (limits?.hasAds ?? true) && !Capacitor.isNativePlatform();

    if (shouldShowAds) {
      const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5169145738145346";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    } else {
      // If user upgrades to paid, remove the script tag
      const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    }
  }, [limits]);

  return null;
};
