const fs = require('fs');
const buf = fs.readFileSync('src/types/connect.ts');
const str = buf.slice(3).toString('utf16le');
fs.writeFileSync('src/types/connect.ts', str, 'utf8');
console.log('Fixed connect.ts encoding');
