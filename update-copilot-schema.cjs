const fs = require('fs');
let code = fs.readFileSync('api/copilot.ts', 'utf8');

code = code.replace(/const CopilotMessageSchema = z\.object\(\{\n  role: z\.enum\(\['user', 'assistant', 'system'\]\),\n  content: z\.string\(\)\.max\(2000\)\n\}\);/, 
`const CopilotContentPartSchema = z.object({
  type: z.enum(['text', 'image_url']),
  text: z.string().optional(),
  image_url: z.object({
    url: z.string()
  }).optional()
});

const CopilotMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.union([z.string().max(2000), z.array(CopilotContentPartSchema)])
});`);

fs.writeFileSync('api/copilot.ts', code, 'utf8');
console.log("Updated copilot schema");
