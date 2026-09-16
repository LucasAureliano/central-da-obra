const fs = require('fs');
let code = fs.readFileSync('src/components/calculators_library/CalculatorsWizard.tsx', 'utf8');

const oldFlex = `<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>`;

const newFlex = `<motion.div 
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <AnimatePresence>`;

code = code.replace(oldFlex, newFlex);
code = code.replace(/<\/AnimatePresence>\s*\{filtered\.length === 0/, "</AnimatePresence>\n          {filtered.length === 0");
code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*$/m, "</motion.div>\n      </div>\n    </div>\n  );\n}\n");

const oldButton = /<motion\.button\s*key=\{item\.id\}\s*initial=\{\{ opacity: 0, y: 10 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}/g;
const newButton = `<motion.button 
                key={item.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}`;

code = code.replace(oldButton, newButton);

fs.writeFileSync('src/components/calculators_library/CalculatorsWizard.tsx', code, 'utf8');
console.log("Updated CalculatorsWizard flex animations");
