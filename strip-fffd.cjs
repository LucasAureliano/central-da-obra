const fs = require('fs');
let txt = fs.readFileSync('src/types/connect.ts', 'utf8');
if (txt.charCodeAt(0) === 0xFFFD) {
  txt = txt.slice(1);
  fs.writeFileSync('src/types/connect.ts', txt, 'utf8');
}
