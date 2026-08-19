const fs = require('fs');

const path = 'src/components/public/PublicCalculatorView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/..\/..\/components\//g, '../');

fs.writeFileSync(path, code, 'utf8');
