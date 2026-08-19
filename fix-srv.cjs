const fs = require('fs');

let srvMgr = fs.readFileSync('src/components/connect/ConnectServicesManager.tsx', 'utf8');
srvMgr = srvMgr.replace('const [unit, order: services.length, setUnit] = useState(\'\');', 'const [unit, setUnit] = useState(\'\');');
fs.writeFileSync('src/components/connect/ConnectServicesManager.tsx', srvMgr);
