import { AdMob, BannerAdSize, BannerAdPosition, AdmobConsentStatus } from '@capacitor-community/admob';
import type { BannerAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export class AdMobService {
  private static isInitialized = false;

  static async initialize() {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await AdMob.initialize({
        initializeForTesting: import.meta.env.DEV,
      });
      
      const consentInfo = await AdMob.requestConsentInfo();
      if (consentInfo.status === AdmobConsentStatus.REQUIRED) {
        await AdMob.showConsentForm();
      }
      
      this.isInitialized = true;
    } catch (e) {
      console.error('Failed to initialize AdMob', e);
    }
  }

  static async showBanner() {
    if (!Capacitor.isNativePlatform() || !this.isInitialized) return;

    try {
      const options: BannerAdOptions = {
        adId: Capacitor.getPlatform() === 'ios' ? 'ca-app-pub-3940256099942544/2934735716' : 'ca-app-pub-3940256099942544/6300978111',
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: import.meta.env.DEV
      };
      await AdMob.showBanner(options);
    } catch (e) {
      console.error('Failed to show AdMob Banner', e);
    }
  }

  static async hideBanner() {
    if (!Capacitor.isNativePlatform() || !this.isInitialized) return;
    try {
      await AdMob.hideBanner();
      await AdMob.removeBanner();
    } catch (e) {
      console.error('Failed to hide AdMob Banner', e);
    }
  }

  static async showInterstitial() {
    if (!Capacitor.isNativePlatform() || !this.isInitialized) return;

    try {
      const options = {
        adId: Capacitor.getPlatform() === 'ios' ? 'ca-app-pub-3940256099942544/4411468910' : 'ca-app-pub-3940256099942544/1033173712',
        isTesting: import.meta.env.DEV
      };
      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
    } catch (e) {
      console.error('Failed to show AdMob Interstitial', e);
    }
  }
}
