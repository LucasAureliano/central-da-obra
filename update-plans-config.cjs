const fs = require('fs');
let code = fs.readFileSync('src/config/plans.ts', 'utf-8');

code = code.replace(/monthlyPrice: 29\.99/g, 'monthlyPrice: 29.90');
code = code.replace(/monthlyPrice: 49\.99/g, 'monthlyPrice: 49.90');
code = code.replace(/monthlyPrice: 99\.99/g, 'monthlyPrice: 79.90');

code = code.replace(/yearlyPrice: 479\.90/g, 'yearlyPrice: 499.90'); // Pro
// Note: We don't have all yearlyPrices, but whatever is there we can just let it be or replace

fs.writeFileSync('src/config/plans.ts', code, 'utf-8');
