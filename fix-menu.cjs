const fs = require('fs');

let menu = fs.readFileSync('src/components/Menu.tsx', 'utf8');
menu = menu.replace('} from \'lucide-react\';', '  MapPin,\n} from \'lucide-react\';');
fs.writeFileSync('src/components/Menu.tsx', menu);
