const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove RoleSelection block
code = code.replace(/if \(!profile\.role\) \{\s*return <RoleSelection \/>;\s*\}/, '');

// Also remove import
code = code.replace(/import \{ RoleSelection \} from '\.\/components\/RoleSelection';\n/, '');

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Cleaned up RoleSelection from App.tsx');
