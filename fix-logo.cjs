const fs = require('fs');
let code = fs.readFileSync('src/components/onboarding/OnboardingEngine.tsx', 'utf8');

code = code.replace(/<Logo variant="vertical"/g, '<Logo variant="splash"');

fs.writeFileSync('src/components/onboarding/OnboardingEngine.tsx', code, 'utf8');
console.log('Fixed Logo variant');
