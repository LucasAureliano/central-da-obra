const fs = require('fs');
let code = fs.readFileSync('src/components/Menu.tsx', 'utf-8');

code = code.replace(
  "{ icon: <MapPin size={20} />, label: 'Encontrar Profissionais', color: '#8B5CF6', action: () => onMenuSelect('connect') }",
  "{ icon: <MapPin size={20} />, label: 'Encontrar Profissionais (Em breve)', color: '#8B5CF6', action: () => { toast('Essa funcionalidade estará disponível em breve!'); } }"
);

fs.writeFileSync('src/components/Menu.tsx', code, 'utf-8');
