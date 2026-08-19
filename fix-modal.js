const fs = require('fs');
let code = fs.readFileSync('src/components/admin/UserManagementModal.tsx', 'utf-8');
const lastClosingTag = code.lastIndexOf('</AnimatePresence>');
if (lastClosingTag > -1) {
  // Replace the ending correctly
  // Normally it ends with </AnimatePresence>\n  );
  // We need to change it to </AnimatePresence>,\n    document.body\n  );
  code = code.replace(/<\/AnimatePresence>\s*\);/g, '</AnimatePresence>,\n    document.body\n  );');
  fs.writeFileSync('src/components/admin/UserManagementModal.tsx', code, 'utf-8');
  console.log('Fixed UserManagementModal!');
} else {
  console.log('Could not find </AnimatePresence>');
}
