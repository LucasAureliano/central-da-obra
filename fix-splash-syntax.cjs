const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/    \/\/ APP ENTRANCE SPLASH SCREEN\n      return <SplashScreen onComplete=\{\(\) => \{/g, "    // APP ENTRANCE SPLASH SCREEN\n    if (!hasShownAppSplash) {\n      return <SplashScreen onComplete={() => {");

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Fixed App.tsx syntax");
