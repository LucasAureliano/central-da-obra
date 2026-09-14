const fs = require('fs');
let code = fs.readFileSync('src/components/assistant/SmartAssistant.tsx', 'utf8');

// 1. Imports
if (!code.includes('nativeCamera')) {
  code = code.replace(/import \{ motion, AnimatePresence \} from 'framer-motion';/, "import { motion, AnimatePresence } from 'framer-motion';\nimport { takePicture } from '../../utils/nativeCamera';\nimport { Camera as CameraIcon, X as XIcon } from 'lucide-react';");
}

// 2. State
if (!code.includes('attachment')) {
  code = code.replace(/const \[query, setQuery\] = useState\(''\);/, "const [query, setQuery] = useState('');\n  const [attachment, setAttachment] = useState<string | null>(null);");
}

code = code.replace(/const \[messages, setMessages\] = useState<\{role: 'assistant'\|'user', text: string, suggestions\?: any\[\]\}\[\]>\(\[\]\);/, "const [messages, setMessages] = useState<{role: 'assistant'|'user', text: string, imageUrl?: string, suggestions?: any[]}[]>([]);");

// 3. Handle Camera function
const handleCamera = `
  const handleCamera = async (e: any) => {
    e.preventDefault();
    try {
      const base64 = await takePicture();
      if (base64) {
        setAttachment(base64);
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as any).files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => setAttachment(reader.result as string);
            reader.readAsDataURL(file);
          }
        };
        input.click();
      }
    } catch (err) {
      console.error(err);
    }
  };
`;
if (!code.includes('handleCamera')) {
  code = code.replace(/const handleSend = async /, handleCamera + '\n  const handleSend = async ');
}

// 4. Update handleSend
code = code.replace(/const newMsg = \{ role: 'user' as const, text \};/, `const newMsg = { role: 'user' as const, text, imageUrl: attachment || undefined };`);
code = code.replace(/setQuery\(''\);/, "setQuery('');\n    const currentAttachment = attachment;\n    setAttachment(null);");

code = code.replace(/messages: \[\.\.\.messages, newMsg\]\.map\(m => \(\{ role: m\.role, content: m\.text \}\)\),/, 
`messages: [...messages, newMsg].map(m => {
          if (m.imageUrl) {
            return {
              role: m.role,
              content: [
                { type: 'text', text: m.text },
                { type: 'image_url', image_url: { url: m.imageUrl } }
              ]
            };
          }
          return { role: m.role, content: m.text };
        }),`);

// 5. Update input UI
// The original block is:
//           <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>
//             <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, padding: '8px 16px', border: '1px solid var(--border-light)' }}>
//               <MessageSquare size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
//               <input 

const originalInputHtml = `          <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, padding: '8px 16px', border: '1px solid var(--border-light)' }}>
              <MessageSquare size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
              <input`;

const newInputHtml = `          {attachment && (
            <div style={{ position: 'relative', width: 60, height: 60, marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}>
              <img src={attachment} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setAttachment(null)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: 'white', padding: 2, border: 'none' }}>
                <XIcon size={14} />
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, padding: '8px 16px', border: '1px solid var(--border-light)' }}>
              <button onClick={handleCamera} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <CameraIcon size={20} color="var(--color-primary)" style={{ marginRight: 12 }} />
              </button>
              <input`;

// Normalise crlf to lf first just in case
code = code.replace(/\r\n/g, '\n');
code = code.replace(originalInputHtml, newInputHtml);

// 6. Update message UI to show image
code = code.replace(/<div className="message-content">/g, `{msg.imageUrl && <img src={msg.imageUrl} alt="Anexo" style={{maxWidth: '100%', borderRadius: 8, marginBottom: 8}} />}\n                <div className="message-content">`);

fs.writeFileSync('src/components/assistant/SmartAssistant.tsx', code, 'utf8');
console.log("Successfully added vision!");
