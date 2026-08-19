const fs = require('fs');
let code = fs.readFileSync('src/components/admin/UserManagementModal.tsx', 'utf-8');
code = code.replace(/<\/AnimatePresence>\s*\);/g, '</AnimatePresence>,\n    document.body\n  );');
fs.writeFileSync('src/components/admin/UserManagementModal.tsx', code, 'utf-8');
console.log('Fixed UserManagementModal!');
