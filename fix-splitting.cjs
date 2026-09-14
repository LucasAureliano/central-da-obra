const fs = require('fs');

const files = [
  'src/components/WorkDetails.tsx',
  'src/components/architect/ArchitectProjectDetails.tsx',
  'src/components/owner/OwnerWorkDetails.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace static imports with lazy
    code = code.replace(/import\s*\{\s*Finance\s*\}\s*from\s*'[\.\/]+Finance';/g, "const Finance = React.lazy(() => import('../Finance').then(module => ({ default: module.Finance })));");
    code = code.replace(/import\s*\{\s*Shopping\s*\}\s*from\s*'[\.\/]+Shopping';/g, "const Shopping = React.lazy(() => import('../Shopping').then(module => ({ default: module.Shopping })));");
    
    // Some might have single quotes and . or .. paths, adjust regex slightly
    code = code.replace(/import\s*\{\s*Finance\s*\}\s*from\s*'\.\.\/Finance';/g, "const Finance = React.lazy(() => import('../Finance').then(module => ({ default: module.Finance })));");
    code = code.replace(/import\s*\{\s*Shopping\s*\}\s*from\s*'\.\.\/Shopping';/g, "const Shopping = React.lazy(() => import('../Shopping').then(module => ({ default: module.Shopping })));");

    code = code.replace(/import\s*\{\s*Finance\s*\}\s*from\s*'\.\/Finance';/g, "const Finance = React.lazy(() => import('./Finance').then(module => ({ default: module.Finance })));");
    code = code.replace(/import\s*\{\s*Shopping\s*\}\s*from\s*'\.\/Shopping';/g, "const Shopping = React.lazy(() => import('./Shopping').then(module => ({ default: module.Shopping })));");

    // Make sure React is imported, if not, wait they probably have it
    if (!code.includes('import React')) {
      code = "import React, { Suspense } from 'react';\n" + code;
    }
    
    // Ensure Suspense is used around Finance and Shopping
    // Actually we can just wrap the render
    code = code.replace(/<Finance\s/g, "<Suspense fallback={<div style={{padding: 20}}>Carregando financeiro...</div>}><Finance ");
    code = code.replace(/<\/Finance>/g, "</Finance></Suspense>");
    code = code.replace(/<Finance \/>/g, "<Suspense fallback={<div style={{padding: 20}}>Carregando financeiro...</div>}><Finance /></Suspense>");

    code = code.replace(/<Shopping\s/g, "<Suspense fallback={<div style={{padding: 20}}>Carregando compras...</div>}><Shopping ");
    code = code.replace(/<\/Shopping>/g, "</Shopping></Suspense>");
    code = code.replace(/<Shopping \/>/g, "<Suspense fallback={<div style={{padding: 20}}>Carregando compras...</div>}><Shopping /></Suspense>");

    fs.writeFileSync(file, code, 'utf8');
  }
});

console.log("Fixed code splitting in details components");
