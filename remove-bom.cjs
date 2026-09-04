const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
  fs.writeFileSync('index.html', content, 'utf8');
  console.log('Removed BOM from index.html');
} else {
  console.log('No BOM found in index.html');
}
