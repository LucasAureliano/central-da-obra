const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ RoleSelection \} from '\.\/components\/RoleSelection';\r?\n?/g, '');
code = code.replace(/import \{ RoleSelection \} from "\.\/components\/RoleSelection";\r?\n?/g, '');

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Removed RoleSelection import');
