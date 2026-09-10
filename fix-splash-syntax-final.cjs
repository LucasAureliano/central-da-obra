const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The problematic block is around line 354
code = code.replace(/\/\/ APP ENTRANCE SPLASH SCREEN\s*\/\/ Hide native Capacitor Splash Screen safely once React is fully hydrated\s*useEffect\(\(\) => \{\s*if \(\!loading && Capacitor\.isNativePlatform\(\)\) \{\s*CapacitorSplashScreen\.hide\(\)\.catch\(console\.error\);\s*\}\s*\}, \[loading\]\);\s*\/\/ APP ENTRANCE SPLASH SCREEN\s*return <SplashScreen onComplete=\{\(\) => \{\s*sessionStorage\.setItem\('hasShownAppSplash', 'true'\);\s*setHasShownAppSplash\(true\);\s*\}\} \/>;\s*\}/g, `
  // APP ENTRANCE SPLASH SCREEN
  if (!hasShownAppSplash) {
    // Hide native Capacitor Splash Screen safely once React is fully hydrated
    if (!loading && Capacitor.isNativePlatform()) {
      CapacitorSplashScreen.hide().catch(console.error);
    }
    return <SplashScreen onComplete={() => {
      sessionStorage.setItem('hasShownAppSplash', 'true');
      setHasShownAppSplash(true);
    }} />;
  }
`);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Fixed App.tsx syntax completely");
