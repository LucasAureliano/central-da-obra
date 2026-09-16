const fs = require('fs');

// Fix SmartAssistant
let code1 = fs.readFileSync('src/components/assistant/SmartAssistant.tsx', 'utf8');
code1 = code1.replace('<ArrowRight size={16} color="var(--text-muted)" />\n                  </button>', '<ArrowRight size={16} color="var(--text-muted)" />\n                  </motion.button>');
fs.writeFileSync('src/components/assistant/SmartAssistant.tsx', code1, 'utf8');

// Fix CalculatorsWizard
let code2 = fs.readFileSync('src/components/calculators_library/CalculatorsWizard.tsx', 'utf8');
// The issue is likely a missing </div> or </motion.div>
// Let's replace the ending tags properly.
code2 = code2.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*$/m, "</div>\n    </div>\n  );\n}\n");
fs.writeFileSync('src/components/calculators_library/CalculatorsWizard.tsx', code2, 'utf8');
console.log("Fixed JSX");
