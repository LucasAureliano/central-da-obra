const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace theme={theme} with theme="dark" for Login and Register
code = code.replace(/<Login onGoToRegister=\{\(\) => setAuthView\('register'\)\} theme=\{theme\} \/>/g, '<Login onGoToRegister={() => setAuthView(\'register\')} theme="dark" />');
code = code.replace(/<Register onGoToLogin=\{\(\) => setAuthView\('login'\)\} theme=\{theme\} \/>/g, '<Register onGoToLogin={() => setAuthView(\'login\')} theme="dark" />');

// Force dark mode wrapper
code = code.replace(/<div className="glass-panel" style=\{\{ width: '100%', maxWidth: 480, margin: '0 20px', borderRadius: 32, overflow: 'hidden', position: 'relative' \}\}>/g, '<div className="glass-panel auth-modal-dark-force" style={{ width: \'100%\', maxWidth: 480, margin: \'0 20px\', borderRadius: 32, overflow: \'hidden\', position: \'relative\' }}>');

code = code.replace(/<motion\.div\s*initial=\{\{ opacity: 0, scale: 0\.95, y: 20 \}\}\s*animate=\{\{ opacity: 1, scale: 1, y: 0 \}\}\s*exit=\{\{ opacity: 0, scale: 0\.95, y: 20 \}\}\s*style=\{\{ width: '100%', maxWidth: 480, margin: '0 20px', background: 'var\(--bg-surface\)', borderRadius: 32, overflow: 'hidden', position: 'relative', border: '1px solid var\(--border-subtle\)' \}\}/g, `<motion.div\n                  initial={{ opacity: 0, scale: 0.95, y: 20 }}\n                  animate={{ opacity: 1, scale: 1, y: 0 }}\n                  exit={{ opacity: 0, scale: 0.95, y: 20 }}\n                  className="auth-modal-dark-force"\n                  style={{ width: '100%', maxWidth: 480, margin: '0 20px', background: 'var(--bg-surface)', borderRadius: 32, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-subtle)' }}`);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log("Updated App.tsx modals to dark mode");
