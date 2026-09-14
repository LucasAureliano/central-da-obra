const fs = require('fs');
let code = fs.readFileSync('src/components/assistant/SmartAssistant.tsx', 'utf8');

code = code.replace(/<div className="message-content">/g, `{msg.imageUrl && <img src={msg.imageUrl} alt="Anexo" style={{maxWidth: '100%', borderRadius: 8, marginBottom: 8}} />}\n                <div className="message-content">`);

fs.writeFileSync('src/components/assistant/SmartAssistant.tsx', code, 'utf8');
console.log("Added image render in chat");
