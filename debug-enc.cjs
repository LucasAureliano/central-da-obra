const fs = require('fs');
let text = fs.readFileSync('index.html', 'utf8');
let idx = text.indexOf('Constru');
if (idx !== -1) {
  let sub = text.substring(idx, idx + 15);
  for (let i = 0; i < sub.length; i++) {
    console.log(sub[i], sub.charCodeAt(i).toString(16));
  }
}
