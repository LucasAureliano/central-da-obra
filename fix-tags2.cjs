const fs = require('fs');
let code = fs.readFileSync('src/components/Works.tsx', 'utf8');
const search = "                </div>\n              );\n            })}\n          </div>";
const replacement = "                </div>\n                </Reorder.Item>\n              );\n            })}\n          </Reorder.Group>";
code = code.replace(search, replacement);
fs.writeFileSync('src/components/Works.tsx', code, 'utf8');
console.log('Fixed tags');
