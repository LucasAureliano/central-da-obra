const fs = require('fs');
let code = fs.readFileSync('src/hooks/useInsights.tsx', 'utf-8');

// replace the block by replacing the specific string push
const replaced = code.replace(/if\s*\(activeWork\?\.address\)\s*\{\s*generatedInsights\.push\(\{\s*id:\s*'weather-alert'.*?\}\);\s*\}/s, '');

fs.writeFileSync('src/hooks/useInsights.tsx', replaced, 'utf-8');
console.log("Replaced:", code !== replaced);
