const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<OnboardingEngine onComplete=\{\(\) => \{ setLocalHasSeenWelcome\(true\); setForceOnboarding\(false\); \}\} \/>/,
  "<OnboardingEngine role={activeRole as any} onComplete={() => { setLocalHasSeenWelcome(true); setForceOnboarding(false); }} />"
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Fixed App.tsx OnboardingEngine props");
