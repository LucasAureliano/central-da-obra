const fs = require('fs');
let file = fs.readFileSync('src/components/connect/ConnectProfileForm.tsx', 'utf8');
file = file.replace(/\\"/g, '"');
fs.writeFileSync('src/components/connect/ConnectProfileForm.tsx', file);
