const fs = require('fs');

let menu = fs.readFileSync('src/components/Menu.tsx', 'utf8');
menu = menu.replace('Crown\r\n  MapPin,', 'Crown,\r\n  MapPin,');
menu = menu.replace('Crown\n  MapPin,', 'Crown,\n  MapPin,');
fs.writeFileSync('src/components/Menu.tsx', menu);
