const fs = require('fs');
const files = [
  'src/components/WorkDetails.tsx',
  'src/components/architect/ArchitectProjectDetails.tsx',
  'src/components/owner/OwnerWorkDetails.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // The previous regex messed up tags. We have `<Suspense ...><Finance workId={workId} embedded />` inside.
    // Let's find `<Suspense fallback={<div style={{padding: 20}}>Carregando financeiro...</div>}><Finance `
    // and close it properly.
    
    // Remove the bad Suspense injected by previous script
    code = code.replace(/<Suspense fallback=\{<div style=\{\{padding: 20\}\}>Carregando financeiro\.\.\.<\/div>\}>/g, "");
    code = code.replace(/<Suspense fallback=\{<div style=\{\{padding: 20\}\}>Carregando compras\.\.\.<\/div>\}>/g, "");
    code = code.replace(/<\/Finance><\/Suspense>/g, "</Finance>");
    code = code.replace(/<\/Shopping><\/Suspense>/g, "</Shopping>");
    // Now wrap them securely using a safe regex that captures the whole tag:
    // It captures `<Finance ... />` or `<Finance> ... </Finance>`
    code = code.replace(/(<Finance[^>]*\/>)/g, "<Suspense fallback={<div style={{padding: 20}}>Carregando financeiro...</div>}>$1</Suspense>");
    code = code.replace(/(<Finance[^>]*>[^<]*<\/Finance>)/g, "<Suspense fallback={<div style={{padding: 20}}>Carregando financeiro...</div>}>$1</Suspense>");
    
    code = code.replace(/(<Shopping[^>]*\/>)/g, "<Suspense fallback={<div style={{padding: 20}}>Carregando compras...</div>}>$1</Suspense>");
    code = code.replace(/(<Shopping[^>]*>[^<]*<\/Shopping>)/g, "<Suspense fallback={<div style={{padding: 20}}>Carregando compras...</div>}>$1</Suspense>");
    
    fs.writeFileSync(file, code, 'utf8');
  }
});
console.log("Fixed suspense wrappers");
