const fs = require('fs');
let code = fs.readFileSync('src/services/assistant/AssistantService.ts', 'utf8');

// Update AssistantQuery type
code = code.replace(/export interface AssistantQuery \{\n  messages: \{ role: 'user' \| 'assistant'; content: string \}\[\];\n  contextData\?: any;\n\}/, 
`export interface AssistantQuery {
  messages: { role: 'user' | 'assistant'; content: string | any[] }[];
  contextData?: any;
}`);

fs.writeFileSync('src/services/assistant/AssistantService.ts', code, 'utf8');
console.log("Updated AssistantService types");
