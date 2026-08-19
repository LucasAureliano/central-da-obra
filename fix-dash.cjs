const fs = require('fs');

let profDash = fs.readFileSync('src/components/connect/ProfessionalConnectDashboard.tsx', 'utf8');
profDash = profDash.replace('import { ConnectServicesManager } from \'./ConnectServicesManager\';', 'import { ConnectProfileForm } from \'./ConnectProfileForm\';\nimport { ConnectServicesManager } from \'./ConnectServicesManager\';');
profDash = profDash.replace('{activeTab === \'profile\' && <div>Em breve</div>}', '{activeTab === \'profile\' && <ConnectProfileForm />}');
fs.writeFileSync('src/components/connect/ProfessionalConnectDashboard.tsx', profDash);
