const fs = require('fs');
let text = fs.readFileSync('index.html', 'utf8');

text = text.replace(/ǜ/g, 'çã');
text = text.replace(//g, 'ç');
text = text.replace(/ǭ/g, 'á');
text = text.replace(/ǜ/g, 'ã');
text = text.replace(/Ǧ/g, 'ê');
text = text.replace(/Ǹ/g, 'é');
text = text.replace(/ǧ/g, 'ú');

fs.writeFileSync('index.html', text, 'utf8');
console.log('Fixed index.html literal');
