const fs = require('fs');

const path = 'src/components/public/PublicCalculatorView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/standalone=\{true\}/g, "onBack={() => window.location.href = '/'}");

fs.writeFileSync(path, code, 'utf8');
