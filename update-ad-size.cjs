const fs = require('fs');
let code = fs.readFileSync('src/components/shared/SponsoredAd.tsx', 'utf8');

code = code.replace(/data-ad-format="auto"/g, 'data-ad-format="horizontal"');
code = code.replace(/minHeight: 120/g, 'minHeight: 100');

fs.writeFileSync('src/components/shared/SponsoredAd.tsx', code, 'utf8');
console.log("Fixed AdSense size");
