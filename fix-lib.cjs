const fs = require('fs');
let code = fs.readFileSync('src/components/calculators_library/CalculatorLibrary.tsx', 'utf8');

code = code.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(auto-fill, minmax\(280px, 1fr\)\)', gap: 20 \}\}>/g, 
  `<motion.div 
     initial="hidden" 
     animate="visible" 
     variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} 
     style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}` + `>`);

const oldCard = /<motion\.div\s*key=\{calc\.id\}\s*initial=\{\{ opacity: 0, y: 10 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*whileHover=\{\{ y: -2 \}\}/g;
const newCard = `<motion.div 
                  key={calc.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
                  whileHover={{ scale: 1.03, y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}`;
code = code.replace(oldCard, newCard);

fs.writeFileSync('src/components/calculators_library/CalculatorLibrary.tsx', code, 'utf8');
console.log("Updated CalculatorLibrary animations");
