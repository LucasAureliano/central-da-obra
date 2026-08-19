const fs = require('fs');
let code = fs.readFileSync('src/components/SubscriptionPlans.tsx', 'utf8');

// Fix prices to reflect new objects and /mês
code = code.replace(/\{starterPrice\.toFixed\(2\)\.replace\('\.', ','\)\}/g, "{starterPriceObj.val.toFixed(2).replace('.', ',')}");
code = code.replace(/\{proPrice\.toFixed\(2\)\.replace\('\.', ','\)\}/g, "{proPriceObj.val.toFixed(2).replace('.', ',')}");
code = code.replace(/\{businessPrice\.toFixed\(2\)\.replace\('\.', ','\)\}/g, "{businessPriceObj.val.toFixed(2).replace('.', ',')}");

code = code.replace(/\/mǦs/g, "{isAnnual ? '/ano' : '/mês'}");
code = code.replace(/\/mês/g, "{isAnnual ? '/ano' : '/mês'}");

fs.writeFileSync('src/components/SubscriptionPlans.tsx', code);
console.log('Done!');
