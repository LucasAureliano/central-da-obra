const fs = require('fs');

let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');
code = code.replace(/<button /g, "<motion.button whileTap={{ scale: 0.95 }} ");
code = code.replace(/<\/button>/g, "</motion.button>");
fs.writeFileSync('src/components/layout/AppLayout.tsx', code, 'utf8');

console.log("Updated AppLayout with motion buttons");
