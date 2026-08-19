const fs = require('fs');

const path = 'src/components/Menu.tsx';
let code = fs.readFileSync(path, 'utf8');

// Inside `if (activeRole === 'service') {`, add the button to its Configurações array
const serviceConfigTarget = `{ icon: <Shield size={20} />, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: () => setShowRoleModal(true) },`;
const serviceConfigReplacement = `{ icon: <Shield size={20} />, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: () => setShowRoleModal(true) },
              { icon: <Wrench size={20} />, label: 'Alterar Especialidade', color: '#10B981', action: () => setShowSpecialtyModal(true) },`;

code = code.replace(serviceConfigTarget, serviceConfigReplacement);

fs.writeFileSync(path, code, 'utf8');
