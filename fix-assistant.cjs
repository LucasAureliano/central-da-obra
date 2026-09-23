const fs = require('fs');
let code = fs.readFileSync('src/components/assistant/SmartAssistant.tsx', 'utf8');

// Change from absolute to relative to avoid rendering issues
code = code.replace(
  `style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', maxWidth: 800, margin: '0 auto', width: '100%', overflow: 'hidden' }}`,
  `style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 800, margin: '0 auto', width: '100%', overflow: 'hidden' }}`
);

// Verify that background doesn't stay black. The screen-content class has var(--bg-base), we can add background: 'transparent' inline to be safe.
code = code.replace(
  `className="screen-content" \n      style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 800, margin: '0 auto', width: '100%', overflow: 'hidden' }}`,
  `className="screen-content" \n      style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 800, margin: '0 auto', width: '100%', overflow: 'hidden', background: 'transparent' }}`
);

fs.writeFileSync('src/components/assistant/SmartAssistant.tsx', code, 'utf8');
console.log("Updated SmartAssistant layout");
