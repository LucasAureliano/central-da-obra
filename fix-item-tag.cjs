const fs = require('fs');
let code = fs.readFileSync('src/components/Works.tsx', 'utf8');

// The line is:
// <div key={work.id} className={`card-premium card-premium-interactive animate-stagger-${Math.min((index + 1), 5)}`} style={{ padding: 0, position: 'relative', zIndex: contextMenuWorkId === work.id ? 50 : 1 }} onClick={() => onWorkSelect(work.id)}>

code = code.replace(/<div key=\{work\.id\} className=\{`card-premium card-premium-interactive animate-stagger-\$\{Math\.min\(\(index \+ 1\), 5\)\}`\} style=\{\{ padding: 0, position: 'relative', zIndex: contextMenuWorkId === work\.id \? 50 : 1 \}\} onClick=\{\(\) => onWorkSelect\(work\.id\)\}>/g,
"<Reorder.Item key={work.id} value={work} id={work.id} style={{ position: 'relative', zIndex: contextMenuWorkId === work.id ? 50 : 1 }}>\n                  <div className={`card-premium card-premium-interactive animate-stagger-${Math.min((index + 1), 5)}`} style={{ padding: 0, position: 'relative' }} onClick={() => onWorkSelect(work.id)}>"
);

fs.writeFileSync('src/components/Works.tsx', code, 'utf8');
console.log("Fixed Reorder.Item start tag");
