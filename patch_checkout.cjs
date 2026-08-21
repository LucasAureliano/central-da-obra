const fs = require('fs');

let checkoutCode = fs.readFileSync('api/stripe/create-checkout.ts', 'utf8');

checkoutCode = checkoutCode.replace(
  "const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY || '';",
  "const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';"
);

fs.writeFileSync('api/stripe/create-checkout.ts', checkoutCode, 'utf8');
