const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCalculatorsHubView.tsx', 'utf8');

code = code.replace(/style=\{\{\s*backgroundColor:\s*'var\(--bg-base\)',\s*fontFamily:\s*"'Inter', sans-serif",\s*position:\s*'absolute',\s*top:\s*0,\s*left:\s*0,\s*right:\s*0,\s*bottom:\s*0,\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*overflowY:\s*'auto',\s*WebkitOverflowScrolling:\s*'touch',\s*overflowX:\s*'hidden'\s*\}\}/g, `style={{ backgroundColor: 'var(--bg-base)', fontFamily: "'Inter', sans-serif", position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', overflowX: 'hidden' }}`);

// Fix header overlapping title on mobile
code = code.replace(/padding: '120px 20px 40px'/g, "padding: '140px 20px 40px'");

// Add more Framer Motion staggered animations to the grid
// We will wrap the grid items with a stagger pattern
code = code.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(auto-fit, minmax\(280px, 1fr\)\)', gap: 24 \}\}>/, '<motion.div \n          initial="hidden"\n          animate="show"\n          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}\n          style={{ display: \'grid\', gridTemplateColumns: \'repeat(auto-fit, minmax(280px, 1fr))\', gap: 24 }}\n        >');

code = code.replace(/<\/div>\s*<\/main>/, '</motion.div>\n      </main>');

code = code.replace(/<a\s+key=\{calc\.id\}\s+href=\{`\/\?calc=\$\{calc\.id\}`\}\s+style=\{\{\s*display:\s*'block',/g, `<motion.a \n              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}\n              whileHover={{ scale: 1.02, translateY: -4 }}\n              whileTap={{ scale: 0.98 }}\n              key={calc.id} \n              href={\`/?calc=\${calc.id}\`} \n              style={{ display: 'block',`);

code = code.replace(/<\/a>/g, '</motion.a>');
// Revert the a tag changes for LandingNavbar and Footer which were affected by the blind replace
code = code.replace(/<\/motion.a><\/li>/g, '</a></li>');
code = code.replace(/<\/motion.a>\s*<div className="desktop-only">/g, '</a>\n            <div className="desktop-only">');
code = code.replace(/<motion.a \n              variants=\{\{ hidden: \{ opacity: 0, y: 20 \}, show: \{ opacity: 1, y: 0 \} \}\}\n              whileHover=\{\{ scale: 1.02, translateY: -4 \}\}\n              whileTap=\{\{ scale: 0.98 \}\}\n              key=\{calc.id\} \n              href=\{\`\/\?calc=\$\{calc.id\}\`\} \n              style=\{\{ display: 'block',/g, 'Should be caught by exact match but just in case');

fs.writeFileSync('src/components/public/PublicCalculatorsHubView.tsx', code, 'utf8');
console.log("Updated PublicCalculatorsHubView layout and effects");
