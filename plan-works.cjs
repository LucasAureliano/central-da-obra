const fs = require('fs');

let code = fs.readFileSync('src/components/Works.tsx', 'utf8');

// 1. We have `const filteredWorks = works.filter...`
// But we also have `localFilteredWorks` already created by me earlier (Wait, did I create `localFilteredWorks` in Works.tsx? Let me check)
