const fs = require('fs');

const path = 'src/components/assistant/SmartAssistant.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove the entire view block
const viewBlockRegex = /if \(!isPremium\) \{\s*return \(\s*<div className="screen-content animate-fade-in"[\s\S]*?<\/div>\s*\);\s*\}/;
code = code.replace(viewBlockRegex, '');

// 2. Add free quota logic
// We'll add a `freeCount` state
if (!code.includes('const [freeCount, setFreeCount] = useState(0);')) {
  code = code.replace(
    /const \[messages, setMessages\] = useState/,
    `const [freeCount, setFreeCount] = useState(0);\n  const [messages, setMessages] = useState`
  );
}

// 3. Update handleSend
const handleSendBlockRegex = /if \(!isPremium\) \{\s*setTimeout\(\(\) => \{[\s\S]*?\}, 600\);\s*return;\s*\}/;
const newHandleSendLogic = `if (!isPremium && freeCount >= 3) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: 'Você atingiu o limite de uso gratuito do Copilot (3/3 mensagens). A Inteligência Artificial avançada é exclusiva dos planos PRO e Business. Faça o upgrade para continuar!',
          suggestions: [
            { label: 'Ver Planos', action: () => onNavigate('planos'), icon: <Sparkles size={16} /> }
          ]
        }]);
        setIsTyping(false);
      }, 600);
      return;
    }
    
    if (!isPremium) setFreeCount(prev => prev + 1);`;

code = code.replace(handleSendBlockRegex, newHandleSendLogic);

// Ensure it replaced successfully
fs.writeFileSync(path, code, 'utf8');
