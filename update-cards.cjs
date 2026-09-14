const fs = require('fs');

let code = fs.readFileSync('src/components/Works.tsx', 'utf8');
code = code.replace(/<div\s+key=\{work\.id\}\s+onClick=\{/g, "<div key={work.id} className=\"premium-hover\" onClick={");
// Also find any card container
code = code.replace(/backgroundColor: 'var\(--bg-surface\)',\s*borderRadius: 16,\s*border: '1px solid var\(--border-subtle\)'/g, "backgroundColor: 'var(--bg-surface)', borderRadius: 16, border: '1px solid var(--border-subtle)', transition: 'all 0.3s ease'");

fs.writeFileSync('src/components/Works.tsx', code, 'utf8');

// Do the same for Dashboard summary cards
let dashCode = fs.readFileSync('src/components/owner/OwnerWorkDashboard.tsx', 'utf8');
dashCode = dashCode.replace(/<div style=\{\{\s*backgroundColor: 'var\(--bg-surface\)',\s*borderRadius: 16,/g, "<div className=\"premium-hover\" style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 16,");
fs.writeFileSync('src/components/owner/OwnerWorkDashboard.tsx', dashCode, 'utf8');

console.log("Applied premium-hover to cards");
