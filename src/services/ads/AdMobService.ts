import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdmobConsentStatus } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export class AdMobService {
  private static isInitialized = false;

  static async initialize() {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: process.env.NODE_ENV !== 'production',
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
        // REPLACE THESE WITH REAL ADMOB UNIT IDS (These are test IDs)
        adId: Capacitor.getPlatform() === 'ios' ? 'ca-app-pub-3940256099942544/2934735716' : 'ca-app-pub-3940256099942544/6300978111',
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: process.env.NODE_ENV !== 'production'
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
        // REPLACE THESE WITH REAL ADMOB UNIT IDS
        adId: Capacitor.getPlatform() === 'ios' ? 'ca-app-pub-3940256099942544/4411468910' : 'ca-app-pub-3940256099942544/1033173712',
        isTesting: process.env.NODE_ENV !== 'production'
      };
      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
    } catch (e) {
      console.error('Failed to show AdMob Interstitial', e);
    }
  }
}
