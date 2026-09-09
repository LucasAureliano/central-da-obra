const fs = require('fs');
let code = fs.readFileSync('src/components/landing/PricingSection.tsx', 'utf8');

const searchStr = `fontSize: 40, fontWeight: 900, color: 'var(--text-main)', marginBottom: 16`;
const replaceStr = `fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 16, whiteSpace: 'normal', overflow: 'visible'`;

code = code.replace(searchStr, replaceStr);

fs.writeFileSync('src/components/landing/PricingSection.tsx', code, 'utf8');
console.log('Fixed h2 style');
