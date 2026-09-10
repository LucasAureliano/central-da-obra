const fs = require('fs');
let code = fs.readFileSync('public/robots.txt', 'utf8');

code = code.replace(/Allow: \/\?blog=true\r?\n/, 'Allow: /?blog=true\nAllow: /privacidade\nAllow: /termos\nAllow: /sobre\nAllow: /contato\n');

fs.writeFileSync('public/robots.txt', code, 'utf8');
console.log("Updated robots.txt");
