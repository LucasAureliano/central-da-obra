const fs = require('fs');

let code = fs.readFileSync('src/components/Works.tsx', 'utf8');

// 1. Replace `filteredWorks.map` with `localFilteredWorks.map` and wrap in `<Reorder.Group>`
code = code.replace(/\{filteredWorks\.map\(\(work, index\) => \{/g, "<Reorder.Group axis=\"y\" values={localFilteredWorks} onReorder={handleReorder} style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>\n            {localFilteredWorks.map((work, index) => {");

// 2. Replace the start of the card
code = code.replace(/return \(\n\s*<div key=\{work\.id\} className=\{`card-premium card-premium-interactive animate-stagger-\$\{Math\.min\(\(index \+ 1\), 5\)\}`\} style=\{\{ padding: 0, position: 'relative', zIndex: contextMenuWorkId === work\.id \? 50 : 1 \}\} onClick=\{\(\) => onWorkSelect\(work\.id\)\}>/g, 
"return (\n                <Reorder.Item key={work.id} value={work} id={work.id} style={{ position: 'relative', zIndex: contextMenuWorkId === work.id ? 50 : 1 }}>\n                  <div className={`card-premium card-premium-interactive animate-stagger-${Math.min((index + 1), 5)}`} style={{ padding: 0, position: 'relative' }} onClick={() => onWorkSelect(work.id)}>"
);

// 3. Replace the end of the card
code = code.replace(/<\/div>\n\n                <\/div>\n              \);\n            \}\)\}\n          <\/div>/g, 
"</div>\n\n                </div>\n                </Reorder.Item>\n              );\n            })}\n          </Reorder.Group>\n          </div>"
);

fs.writeFileSync('src/components/Works.tsx', code, 'utf8');
console.log("Applied drag and drop to Works");
