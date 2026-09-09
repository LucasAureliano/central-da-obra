const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("import { InteractiveTour } from './components/onboarding/InteractiveTour';", "import { InteractiveTour } from './components/onboarding/InteractiveTour';\nimport { OnboardingEngine } from './components/onboarding/OnboardingEngine';");
fs.writeFileSync('src/App.tsx', code, 'utf8');
