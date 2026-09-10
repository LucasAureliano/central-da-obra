const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add Capacitor SplashScreen import if missing
if (!code.includes('import { SplashScreen as CapacitorSplashScreen } from')) {
  code = code.replace(/import \{ Capacitor \} from '@capacitor\/core';/, "import { Capacitor } from '@capacitor/core';\nimport { SplashScreen as CapacitorSplashScreen } from '@capacitor/splash-screen';");
}

// Ensure native SplashScreen is hidden when React finishes loading Auth
code = code.replace(/if \(!hasShownAppSplash\) \{/, `
    // Hide native Capacitor Splash Screen safely once React is fully hydrated
    useEffect(() => {
      if (!loading && Capacitor.isNativePlatform()) {
        CapacitorSplashScreen.hide().catch(console.error);
      }
    }, [loading]);

    // APP ENTRANCE SPLASH SCREEN`);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Fixed Native SplashScreen bug");
