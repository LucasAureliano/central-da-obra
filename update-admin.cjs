const fs = require('fs');
let code = fs.readFileSync('src/components/admin/UserManagementModal.tsx', 'utf-8');

code = code.replace(/29,99/g, '29,90');
code = code.replace(/49,99/g, '49,90');
code = code.replace(/99,99/g, '79,90');

fs.writeFileSync('src/components/admin/UserManagementModal.tsx', code, 'utf-8');
