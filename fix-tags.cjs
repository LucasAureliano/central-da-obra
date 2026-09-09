const fs = require('fs');
let code = fs.readFileSync('src/components/Works.tsx', 'utf8');
code = code.replace("</div>\n\n                </div>\n              );\n            })}\n          </div>", "</div>\n\n                </div>\n                </Reorder.Item>\n              );\n            })}\n          </Reorder.Group>");
fs.writeFileSync('src/components/Works.tsx', code, 'utf8');
console.log('Fixed Reorder tags');
