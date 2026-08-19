const fs = require('fs');

const path = 'src/components/Register.tsx';
let code = fs.readFileSync(path, 'utf8');

const target = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');`;

const replacement = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const attemptsKey = \`register_attempts_device\`;
    const lockoutKey = \`register_lockout_device\`;
    
    const lockoutUntil = localStorage.getItem(lockoutKey);
    if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
      const remainingSecs = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000);
      setError(\`Muitas contas criadas recentemente. Por favor aguarde \${remainingSecs}s para tentar novamente.\`);
      return;
    }`;

code = code.replace(target, replacement);

const successTarget = `onSuccess();`;
const successReplacement = `const currentAttempts = parseInt(localStorage.getItem(attemptsKey) || '0') + 1;
      localStorage.setItem(attemptsKey, currentAttempts.toString());
      if (currentAttempts >= 3) {
        const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 mins
        localStorage.setItem(lockoutKey, lockoutTime.toString());
      }
      onSuccess();`;

code = code.replace(successTarget, successReplacement);

fs.writeFileSync(path, code, 'utf8');
