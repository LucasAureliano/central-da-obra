const fs = require('fs');
let content = fs.readFileSync('api/stripe/create-checkout.ts', 'utf8');

content = content.replace(
  /const STRIPE_SECRET_KEY = process\.env\.STRIPE_SECRET_KEY \|\| '';/,
  `const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY || '';`
);

content = content.replace(
  /process\.env\.STRIPE_PRICE_STARTER_MONTHLY/g,
  `(process.env.STRIPE_PRICE_STARTER_MONTHLY || process.env.VITE_STRIPE_PRICE_STARTER_MONTHLY)`
);
content = content.replace(
  /process\.env\.STRIPE_PRICE_PRO_MONTHLY/g,
  `(process.env.STRIPE_PRICE_PRO_MONTHLY || process.env.VITE_STRIPE_PRICE_PRO_MONTHLY)`
);
content = content.replace(
  /process\.env\.STRIPE_PRICE_BUSINESS_MONTHLY/g,
  `(process.env.STRIPE_PRICE_BUSINESS_MONTHLY || process.env.VITE_STRIPE_PRICE_BUSINESS_MONTHLY)`
);
content = content.replace(
  /process\.env\.STRIPE_PRICE_STARTER_ANNUAL/g,
  `(process.env.STRIPE_PRICE_STARTER_ANNUAL || process.env.VITE_STRIPE_PRICE_STARTER_ANNUAL)`
);
content = content.replace(
  /process\.env\.STRIPE_PRICE_PRO_ANNUAL/g,
  `(process.env.STRIPE_PRICE_PRO_ANNUAL || process.env.VITE_STRIPE_PRICE_PRO_ANNUAL)`
);
content = content.replace(
  /process\.env\.STRIPE_PRICE_BUSINESS_ANNUAL/g,
  `(process.env.STRIPE_PRICE_BUSINESS_ANNUAL || process.env.VITE_STRIPE_PRICE_BUSINESS_ANNUAL)`
);

fs.writeFileSync('api/stripe/create-checkout.ts', content, 'utf8');
