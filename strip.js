const fs = require('fs');
let code = fs.readFileSync('src/hooks/useInsights.tsx', 'utf-8');
let newCode = code.split('\n').filter(line => !line.includes('weather-alert') && !line.includes('Alerta Clim') && !line.includes('chuvas fortes')).join('\n');
fs.writeFileSync('src/hooks/useInsights.tsx', newCode, 'utf-8');
