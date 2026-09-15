const fs = require('fs');
let code = fs.readFileSync('api/copilot.ts', 'utf8');

// Fix content.toLowerCase() crash when content is an array
code = code.replace(/const lastUserMsg = messages\[messages\.length - 1\]\.content\.toLowerCase\(\);/, 
`const lastContent = messages[messages.length - 1].content;
      const lastUserMsg = (typeof lastContent === 'string' ? lastContent : lastContent.map((c: any) => c.text || '').join(' ')).toLowerCase();`);

fs.writeFileSync('api/copilot.ts', code, 'utf8');
console.log("Fixed mock response array crash");
