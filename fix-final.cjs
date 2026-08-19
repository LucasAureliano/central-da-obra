const fs = require('fs');

let menu = fs.readFileSync('src/components/Menu.tsx', 'utf8');
menu = menu.replace('import { Home, Compass, Map, Building2, UserCircle, Calculator, ChevronRight, MessageSquare, Menu as MenuIcon, X, HardHat, FileText, Search, Star, MessageCircle, Settings, Store, Megaphone, Link as LinkIcon, ExternalLink } from \'lucide-react\';', 'import { Home, Compass, Map, Building2, UserCircle, Calculator, ChevronRight, MessageSquare, Menu as MenuIcon, X, HardHat, FileText, Search, Star, MessageCircle, Settings, Store, Megaphone, Link as LinkIcon, ExternalLink, MapPin } from \'lucide-react\';');
fs.writeFileSync('src/components/Menu.tsx', menu);

let portMgr = fs.readFileSync('src/components/connect/ConnectPortfolioManager.tsx', 'utf8');
portMgr = portMgr.replace('const newItem: Omit<PortfolioItem, \'id\'> = {', 'const newItem = {');
portMgr = portMgr.replace('images: []', '');
portMgr = portMgr.replace('};\n      \n      const docRef', '} as Omit<PortfolioItem, \'id\'>;\n      \n      const docRef');
fs.writeFileSync('src/components/connect/ConnectPortfolioManager.tsx', portMgr);

