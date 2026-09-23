const fs = require('fs');
let code = fs.readFileSync('src/components/calculators_library/CalculatorsWizard.tsx', 'utf8');

code = code.replace("</motion.div>", "</div>");
fs.writeFileSync('src/components/calculators_library/CalculatorsWizard.tsx', code, 'utf8');
console.log("Fixed motion div mismatch");
