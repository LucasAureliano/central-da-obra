const fs = require('fs');
let code = fs.readFileSync('src/components/SubscriptionPlans.tsx', 'utf-8');
code = code.replace('const businessPrice = 99.99;', 'const businessPrice = 79.90;');
fs.writeFileSync('src/components/SubscriptionPlans.tsx', code, 'utf-8');
