const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('const [localHasSeenWelcome, setLocalHasSeenWelcome] = useState(false);')) {
  code = code.replace(/const \[forceOnboarding, setForceOnboarding\] = useState\(false\);/, "const [forceOnboarding, setForceOnboarding] = useState(false);\n  const [localHasSeenWelcome, setLocalHasSeenWelcome] = useState(false);");
}

code = code.replace(/if \(\!profile\.hasSeenWelcome \|\| forceOnboarding\) \{/, "const hasSeenWelcome = profile.hasSeenWelcome || localHasSeenWelcome;\n      if (!hasSeenWelcome || forceOnboarding) {");

code = code.replace(/<OnboardingEngine onComplete=\{\(\) => setForceOnboarding\(false\)\} \/>/, "<OnboardingEngine onComplete={() => { setLocalHasSeenWelcome(true); setForceOnboarding(false); }} />");

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Updated App.tsx onboarding fallback");
