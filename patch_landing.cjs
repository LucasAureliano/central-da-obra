const fs = require('fs');

const path = 'src/components/landing/PricingSection.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/const starterMonthly = 29\.90;/, 'const starterMonthly = 29.99;');
code = code.replace(/const starterYearly = 24\.99; \/\/.*/, 'const starterYearly = 23.99; // (287.90 / 12)');

code = code.replace(/const proMonthly = 49\.90;/, 'const proMonthly = 49.99;');
code = code.replace(/const proYearly = 41\.65; \/\/.*/, 'const proYearly = 39.99; // (479.90 / 12)');

code = code.replace(/const businessMonthly = 149\.90;/, 'const businessMonthly = 99.99;');
code = code.replace(/const businessYearly = 124\.90; \/\/.*/, 'const businessYearly = 79.99; // (959.90 / 12)');

fs.writeFileSync(path, code, 'utf8');
