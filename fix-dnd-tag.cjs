const fs = require('fs');
let code = fs.readFileSync('src/components/Works.tsx', 'utf8');

// The file might use CRLF. Let's convert everything to LF first to match the regex.
code = code.replace(/\r\n/g, '\n');

// Try replacing again
code = code.replace(/<\/div>\n\n                <\/div>\n              \);\n            \}\)\}\n          <\/div>/g, 
"</div>\n\n                </div>\n                </Reorder.Item>\n              );\n            })}\n          </Reorder.Group>\n          </div>"
);

fs.writeFileSync('src/components/Works.tsx', code, 'utf8');
console.log("Fixed Reorder.Group closing tag");
