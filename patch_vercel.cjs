const fs = require('fs');

const vercelJsonPath = 'vercel.json';
const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

vercelJson.headers = [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "X-Frame-Options",
        "value": "DENY"
      },
      {
        "key": "X-Content-Type-Options",
        "value": "nosniff"
      },
      {
        "key": "Referrer-Policy",
        "value": "strict-origin-when-cross-origin"
      },
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://*.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://api.stripe.com;"
      }
    ]
  }
];

fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2), 'utf8');
