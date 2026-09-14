const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(/userId\?: string;/g, "userId?: string;\n  client?: string;\n  providerName?: string;\n  colorTheme?: string;\n  order?: number;");
fs.writeFileSync('src/types.ts', code, 'utf8');
console.log("Updated types.ts");
