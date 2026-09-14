import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export const REVENUECAT_API_KEY = "test_DllBLkFCttvsPXyZAnrpcTzlNPw";

export const initRevenueCat = async (userId: string) => {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ 
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId 
    });
    console.log("RevenueCat configured for user:", userId);
  } catch (e) {
    console.error("RevenueCat Init Error", e);
  }
};

export const purchaseNativePackage = async (planId: string, isAnnual: boolean): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) return false;
  
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current && offerings.current.availablePackages.length > 0) {
      const rcPackageId = `${planId}_${isAnnual ? 'annual' : 'monthly'}`;
      
      let pkgToBuy = offerings.current.availablePackages.find(p => p.identifier === rcPackageId);
      
      if (!pkgToBuy) {
        pkgToBuy = offerings.current.availablePackages[0];
      }

      const purchaseResult = await Purchases.purchasePackage({ aPackage: pkgToBuy });
      
      if (typeof purchaseResult.customerInfo.entitlements.active['pro'] !== "undefined") {
        return true;
      }
      return true;
    } else {
      console.warn("No RevenueCat offerings configured yet.");
      throw new Error("Nenhum pacote configurado na App Store/Play Store.");
    }
  } catch (e: any) {
    if (e.userCancelled) {
      console.log("User cancelled purchase");
      return false;
    }
    console.error("Purchase error", e);
    throw new Error(e.message || "Erro no pagamento nativo");
  }
};
