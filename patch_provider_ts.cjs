const fs = require('fs');

const path = 'src/components/provider/ProviderDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/profile\?\.displayName/g, "(profile as any)?.displayName");

fs.writeFileSync(path, code, 'utf8');
