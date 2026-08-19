const fs = require('fs');

let path = 'src/components/Register.tsx';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(/placeholder="Nome completo"/, 'placeholder="Como gostaria de ser chamado?"');
fs.writeFileSync(path, code, 'utf8');

path = 'src/components/Onboarding.tsx';
code = fs.readFileSync(path, 'utf8');
code = code.replace(/<span className="input-label">Nome Completo<\/span>/, '<span className="input-label">Como gostaria de ser chamado?</span>');
code = code.replace(/placeholder="Seu nome"/, 'placeholder="Digite seu nome"');
fs.writeFileSync(path, code, 'utf8');
