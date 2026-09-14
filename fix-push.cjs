const fs = require('fs');
let code = fs.readFileSync('src/hooks/usePushNotifications.ts', 'utf8');
code = code.replace(/profile\?\.id/g, 'profile?.uid');
code = code.replace(/profile\.id/g, 'profile.uid');
fs.writeFileSync('src/hooks/usePushNotifications.ts', code, 'utf8');
console.log("Fixed push profile id");
