const fs = require('fs');
let code = fs.readFileSync('api/prices.ts', 'utf8');
code = code.replace("import { adminDb, adminAuth } from './_lib/firebase-admin.js';", "import { adminDb, adminAuth } from './_lib/firebase-admin';");
fs.writeFileSync('api/prices.ts', code, 'utf8');
console.log('Fixed import');
