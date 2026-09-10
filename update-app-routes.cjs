const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need to inject isHistory and isContact logic.
// Find: const isPrivacy = urlParams.has('privacy') || window.location.pathname === '/privacidade';
code = code.replace(/const isPrivacy = urlParams\.has\('privacy'\) \|\| window\.location\.pathname === '\/privacidade';/,
  "const isHistory = urlParams.has('sobre') || window.location.pathname === '/sobre';\n  const isContact = urlParams.has('contato') || window.location.pathname === '/contato';\n  const isPrivacy = urlParams.has('privacy') || window.location.pathname === '/privacidade';");

// Find: if (isPrivacy) { ... }
const historyContactLogic = `
    if (isHistory) {
      return <GenericInfoPage pageId="history" onBack={() => window.location.href = '/'} onLogin={() => window.location.href = '/?login=true'} onNavigate={(page) => window.location.href = '/' + (page === 'terms' ? 'termos' : page === 'privacy' ? 'privacidade' : page === 'history' ? 'sobre' : page === 'contact' ? 'contato' : '')} theme={theme} />;
    }

    if (isContact) {
      return <GenericInfoPage pageId="contact" onBack={() => window.location.href = '/'} onLogin={() => window.location.href = '/?login=true'} onNavigate={(page) => window.location.href = '/' + (page === 'terms' ? 'termos' : page === 'privacy' ? 'privacidade' : page === 'history' ? 'sobre' : page === 'contact' ? 'contato' : '')} theme={theme} />;
    }
`;

code = code.replace(/if \(isPrivacy\) \{/, historyContactLogic + '\n    if (isPrivacy) {');

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Updated App.tsx to support /sobre and /contato");
