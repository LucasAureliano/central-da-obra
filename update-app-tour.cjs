const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(!profile\.hasSeenWelcome \|\| forceOnboarding\) \{\s*return \(\s*<InteractiveTour[\s\S]*?\}\s*\} \/>\s*\);\s*\}/,
  `if (!profile.hasSeenWelcome || forceOnboarding) {
        return <OnboardingEngine onComplete={() => setForceOnboarding(false)} />;
      }`
);

// We need to inject <InteractiveTour /> inside AppLayout IF profile.hasSeenWelcome is true but profile.hasSeenTour is false
// Wait, we can just put it right after `<CustomToaster />` inside `<div className="app-container">`
const interactiveTourString = `{user && profile?.hasSeenWelcome && !profile?.hasSeenTour && <InteractiveTour onComplete={async () => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const { db } = await import('./lib/firebase');
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { hasSeenTour: true });
  } catch(e) {
    console.error(e);
  }
}} />}`;

code = code.replace(
  /<CustomToaster \/>/,
  `<CustomToaster />\n                  ${interactiveTourString}`
);

// Also we need to import OnboardingEngine if it's not imported
if (!code.includes('OnboardingEngine')) {
  code = code.replace("import { InteractiveTour }", "import { InteractiveTour } from './components/onboarding/InteractiveTour';\nimport { OnboardingEngine } from './components/onboarding/OnboardingEngine';\nimport { InteractiveTour }");
}

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Updated App.tsx to use unified OnboardingEngine + InteractiveTour architecture');
