const fs = require('fs');

let code = fs.readFileSync('src/index.css', 'utf8');

const target = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

if (!code.includes('@tailwind base;')) {
  code = target + '\n\n' + code;
  fs.writeFileSync('src/index.css', code, 'utf8');
}
