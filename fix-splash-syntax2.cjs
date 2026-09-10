const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The code looks like this right now:
//       // APP ENTRANCE SPLASH SCREEN
//       return <SplashScreen onComplete={() => {

code = code.replace(/\/\/\s*APP ENTRANCE SPLASH SCREEN\n\s*return <SplashScreen onComplete/g, "// APP ENTRANCE SPLASH SCREEN\n    if (!hasShownAppSplash) {\n      return <SplashScreen onComplete");

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Fixed App.tsx syntax actually");
