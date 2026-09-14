const fs = require('fs');
let code = fs.readFileSync('src/components/WorkDetails.tsx', 'utf8');
code = code.replace(/import\('\.\.\/Finance'\)/g, "import('./Finance')");
code = code.replace(/import\('\.\.\/Shopping'\)/g, "import('./Shopping')");
fs.writeFileSync('src/components/WorkDetails.tsx', code, 'utf8');

// Also, the error: `Type '{ workId: string; embedded: true; }' is not assignable to type 'IntrinsicAttributes'`
// This happens because `React.lazy` returns a component that might not have the correct types inferred if not typed properly, OR because we need to cast it.
// Actually, `const Finance = React.lazy(...)` loses the props types. We should do:
// `const Finance = React.lazy(() => import('./Finance').then(module => ({ default: module.Finance }))) as React.FC<any>;`

let files = ['src/components/WorkDetails.tsx', 'src/components/architect/ArchitectProjectDetails.tsx', 'src/components/owner/OwnerWorkDetails.tsx'];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/const Finance = React\.lazy\(\(\) => import\('([^']+)'\)\.then\(module => \(\{ default: module\.Finance \}\)\)\);/g, "const Finance = React.lazy(() => import('$1').then(module => ({ default: module.Finance }))) as React.FC<any>;");
  c = c.replace(/const Shopping = React\.lazy\(\(\) => import\('([^']+)'\)\.then\(module => \(\{ default: module\.Shopping \}\)\)\);/g, "const Shopping = React.lazy(() => import('$1').then(module => ({ default: module.Shopping }))) as React.FC<any>;");
  fs.writeFileSync(f, c, 'utf8');
});
console.log("Fixed lazy typing and paths");
