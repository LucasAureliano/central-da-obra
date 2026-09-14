const fs = require('fs');

let code = fs.readFileSync('src/components/public/PublicCalculatorsHubView.tsx', 'utf8');
code = code.replace(/minHeight: '100dvh', display: 'flex', flexDirection: 'column'/g, "position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', overflowX: 'hidden'");
fs.writeFileSync('src/components/public/PublicCalculatorsHubView.tsx', code, 'utf8');

let code2 = fs.readFileSync('src/components/public/PublicCalculatorView.tsx', 'utf8');
code2 = code2.replace(/minHeight: '100dvh', display: 'flex', flexDirection: 'column'/g, "position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', overflowX: 'hidden'");
fs.writeFileSync('src/components/public/PublicCalculatorView.tsx', code2, 'utf8');

console.log("Restored scrolling behavior");
