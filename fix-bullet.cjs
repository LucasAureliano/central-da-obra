const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfGenerator.ts', 'utf8');
content = content.replace(/â€¢/g, '•');
fs.writeFileSync('src/utils/pdfGenerator.ts', content, 'utf8');
