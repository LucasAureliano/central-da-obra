const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const startIdx = code.indexOf('<div id="calculadoras"');
const endIdx = code.indexOf('<div id="recursos">');

if (startIdx !== -1 && endIdx !== -1) {
  const newCode = code.substring(0, startIdx) + '<div id="calculadoras">\n        <CalculatorLandingSection />\n      </div>\n      \n      ' + code.substring(endIdx);
  fs.writeFileSync('src/components/LandingPage.tsx', newCode, 'utf8');
  console.log('Replaced calculadoras div!');
} else {
  console.log('Could not find boundaries');
}
