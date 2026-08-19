const fs = require('fs');

const path = 'src/components/Menu.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove from owner
const ownerWrong1 = `{ icon: <Wrench size={20} />, label: 'Alterar Especialidade', color: '#10B981', action: () => setShowSpecialtyModal(true) },`;
code = code.replace(ownerWrong1, '');

const ownerWrong2 = `...(activeRole as string === 'service' ? [{ icon: <Wrench size={20} />, label: 'Alterar Tipo de Servio', color: '#10B981', action: () => setShowSpecialtyModal(true) }] : []),`;
code = code.replace(ownerWrong2, '');
const ownerWrong2UTF = `...(activeRole as string === 'service' ? [{ icon: <Wrench size={20} />, label: 'Alterar Tipo de Serviço', color: '#10B981', action: () => setShowSpecialtyModal(true) }] : []),`;
code = code.replace(ownerWrong2UTF, '');


// 2. Add to service
const serviceConfigTarget = `{ icon: <Shield size={20} />, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: () => setShowRoleModal(true) },`;
const serviceConfigReplacement = `{ icon: <Shield size={20} />, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: () => setShowRoleModal(true) },
              { icon: <Wrench size={20} />, label: 'Alterar Especialidade', color: '#10B981', action: () => setShowSpecialtyModal(true) },`;

// replace only the FIRST occurrence after 'service' role check, to be safe we use regex
code = code.replace(
  /if \(activeRole === 'service'\) \{[\s\S]*?\{ icon: <Shield size=\{20\} \/>, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: \(\) => setShowRoleModal\(true\) \},/m,
  (match) => match + `\n              { icon: <Wrench size={20} />, label: 'Alterar Especialidade', color: '#10B981', action: () => setShowSpecialtyModal(true) },`
);

fs.writeFileSync(path, code, 'utf8');
