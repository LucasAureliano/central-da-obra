const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCalculatorsHubView.tsx', 'utf8');
code = code.replace(/o/g, 'á');
code = code.replace(/?/g, 'é');
code = code.replace(/G/g, 'ê');
code = code.replace(/u/g, 'ã');
code = code.replace(//g, 'ç');
fs.writeFileSync('src/components/public/PublicCalculatorsHubView.tsx', code, 'utf8');
