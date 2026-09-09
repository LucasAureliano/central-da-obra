const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const regex = /<div id="calculadoras"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const importStr = `import { CalculatorLandingSection } from './landing/CalculatorLandingSection';\nimport { HeroSection }`;

code = code.replace(/import { HeroSection }/, importStr);
code = code.replace(regex, `<div id="calculadoras"><CalculatorLandingSection /></div>`);

fs.writeFileSync('src/components/LandingPage.tsx', code, 'utf8');
console.log('Injected CalculatorLandingSection into LandingPage');
