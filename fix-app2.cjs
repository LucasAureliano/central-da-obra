const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("<AppSettings key=\"ajustes\" onBack={() => handleNavigate('menu')} />", "<AppSettings key=\"ajustes\" onBack={() => handleNavigate('menu')} onNavigate={handleNavigate} />");
fs.writeFileSync('src/App.tsx', app, 'utf8');
console.log('Fixed App.tsx missing onNavigate');
