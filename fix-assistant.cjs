const fs = require('fs');
let code = fs.readFileSync('src/components/assistant/SmartAssistant.tsx', 'utf8');

const oldHtml = `        <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>
          
          {attachment && (
            <div style={{ position: 'relative', width: 60, height: 60, marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}>
              <img src={attachment} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setAttachment(null)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: 'white', padding: 2, border: 'none' }}>
                <XIcon size={14} />
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>`;

const newHtml = `        <div>
          {attachment && (
            <div style={{ position: 'relative', width: 60, height: 60, marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}>
              <img src={attachment} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setAttachment(null)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: 'white', padding: 2, border: 'none' }}>
                <XIcon size={14} />
              </button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 800, margin: '0 auto' }}>`;

code = code.replace(oldHtml, newHtml);

// Wait, the first splice I did might have broken the exact string match, let me just find all duplicated <div style={{ display: 'flex', gap: 12... }}> and clean it up.
