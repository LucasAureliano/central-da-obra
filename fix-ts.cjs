const fs = require('fs');

let menu = fs.readFileSync('src/components/Menu.tsx', 'utf8');
menu = menu.replace(/Globe/g, 'MapPin');
fs.writeFileSync('src/components/Menu.tsx', menu);

let pfView = fs.readFileSync('src/components/connect/public/PublicProfileView.tsx', 'utf8');
pfView = pfView.replace(/import { MapPin, Star, Phone, Instagram, Globe, CheckCircle2, ShieldCheck, Mail }/g, 'import { MapPin, Star, Phone, Camera as Instagram, MapPin as Globe, CheckCircle2, ShieldCheck, Mail }');
pfView = pfView.replace(/import { PublicProfile/g, 'import type { PublicProfile');
fs.writeFileSync('src/components/connect/public/PublicProfileView.tsx', pfView);

let smArt = fs.readFileSync('src/components/connect/SocialMediaArtGenerator.tsx', 'utf8');
smArt = smArt.replace(/import { Download, Instagram, Camera }/g, 'import { Download, Camera as Instagram, Camera }');
smArt = smArt.replace(/import { PublicProfile/g, 'import type { PublicProfile');
fs.writeFileSync('src/components/connect/SocialMediaArtGenerator.tsx', smArt);

let pfPortView = fs.readFileSync('src/components/connect/public/PublicPortfolioView.tsx', 'utf8');
pfPortView = pfPortView.replace(/import { PortfolioItem, PublicProfile/g, 'import type { PortfolioItem, PublicProfile');
fs.writeFileSync('src/components/connect/public/PublicPortfolioView.tsx', pfPortView);

let reqModal = fs.readFileSync('src/components/connect/public/RequestQuoteModal.tsx', 'utf8');
reqModal = reqModal.replace(/import { PublicProfile/g, 'import type { PublicProfile');
fs.writeFileSync('src/components/connect/public/RequestQuoteModal.tsx', reqModal);

let ownerDash = fs.readFileSync('src/components/connect/OwnerConnectDashboard.tsx', 'utf8');
ownerDash = ownerDash.replace(/import { PublicProfile/g, 'import type { PublicProfile');
fs.writeFileSync('src/components/connect/OwnerConnectDashboard.tsx', ownerDash);

let profDash = fs.readFileSync('src/components/connect/ProfessionalConnectDashboard.tsx', 'utf8');
// remove ConnectProfileForm since it doesn't exist yet, we will render a placeholder
profDash = profDash.replace(/import { ConnectProfileForm } from '.\/ConnectProfileForm';/g, '');
profDash = profDash.replace(/<ConnectProfileForm \/>/g, '<div>Em breve</div>');
fs.writeFileSync('src/components/connect/ProfessionalConnectDashboard.tsx', profDash);

let reqMgr = fs.readFileSync('src/components/connect/ConnectRequestsManager.tsx', 'utf8');
reqMgr = reqMgr.replace(/import { ConnectQuoteRequest }/g, 'import type { ConnectQuoteRequest }');
fs.writeFileSync('src/components/connect/ConnectRequestsManager.tsx', reqMgr);

let srvMgr = fs.readFileSync('src/components/connect/ConnectServicesManager.tsx', 'utf8');
srvMgr = srvMgr.replace(/import { ProfessionalService }/g, 'import type { ProfessionalService }');
srvMgr = srvMgr.replace(/unit,/g, 'unit, order: services.length,');
fs.writeFileSync('src/components/connect/ConnectServicesManager.tsx', srvMgr);

let portMgr = fs.readFileSync('src/components/connect/ConnectPortfolioManager.tsx', 'utf8');
portMgr = portMgr.replace(/import { PortfolioItem }/g, 'import type { PortfolioItem }');
portMgr = portMgr.replace(/work.address\?\.city \|\| ''/g, "typeof work.address === 'string' ? work.address : ''");
portMgr = portMgr.replace(/images: \[\]/g, '');
portMgr = portMgr.replace(/<span>{p.images\?.length \|\| 0} fotos<\/span>/g, '');
fs.writeFileSync('src/components/connect/ConnectPortfolioManager.tsx', portMgr);

