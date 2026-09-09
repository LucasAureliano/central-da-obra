const fs = require('fs');
const text = fs.readFileSync('index.html', 'utf8');
const match = text.match(/[^\x00-\x7F\xC0-\xFF]/g);
if (match) {
  const unique = [...new Set(match)];
  console.log("Found:", unique.join(' '));
} else {
  console.log("No weird characters found.");
}
