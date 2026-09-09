const fs = require('fs');
let text = fs.readFileSync('src/components/landing/CalculatorLandingSection.tsx', 'utf8');
let idx = text.indexOf('lculos');
if (idx !== -1) {
  let sub = text.substring(idx - 2, idx + 5);
  for (let i = 0; i < sub.length; i++) {
    console.log(sub[i], sub.charCodeAt(i).toString(16));
  }
}
