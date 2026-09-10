const fs = require('fs');
let code = fs.readFileSync('src/components/onboarding/OnboardingEngine.tsx', 'utf8');

// 1. Increase spacing and reduce padding on mobile
code = code.replace(/padding: '80px 24px 40px'/g, "padding: 'clamp(60px, 10vh, 100px) 20px 40px'");

// 2. Add stagger effects to ROLES.map
code = code.replace(/ROLES\.map\(\(r\) => \{/g, "ROLES.map((r, index) => {");
code = code.replace(/whileHover=\{\{ scale: 1\.02 \}\}\n\s*whileTap=\{\{ scale: 0\.98 \}\}/g, "initial={{ opacity: 0, y: 20 }}\n                animate={{ opacity: 1, y: 0 }}\n                transition={{ delay: index * 0.1, duration: 0.3 }}\n                whileHover={{ scale: 1.02, translateY: -4 }}\n                whileTap={{ scale: 0.98 }}");

// 3. Add stagger effects to Presentation topics
code = code.replace(/presentationTopics\.map\(\(topic, i\) => \(/g, "presentationTopics.map((topic, index) => (");
code = code.replace(/<div key=\{i\} style=\{\{ display: 'flex', gap: 16 \}\}>/g, "<motion.div \n              key={index} \n              initial={{ opacity: 0, x: -20 }}\n              animate={{ opacity: 1, x: 0 }}\n              transition={{ delay: 0.2 + (index * 0.1) }}\n              style={{ display: 'flex', gap: 16 }}\n            >");
code = code.replace(/<\/p>\n\s*<\/div>\n\s*<\/div>\n\s*\)\)/g, "</p>\n              </div>\n            </motion.div>\n          ))");

// Remove hardcoded scale(1.5) on Logo which might be breaking mobile layout
code = code.replace(/<div style=\{\{ marginBottom: 40, transform: 'scale\(1\.5\)' \}\}>/g, "<motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} transition={{ duration: 0.8, type: 'spring' }} style={{ marginBottom: 40 }}>");
code = code.replace(/<Logo variant="splash" theme="dark" \/>\n\s*<\/div>/g, "<Logo variant=\"splash\" theme=\"dark\" />\n        </motion.div>");


fs.writeFileSync('src/components/onboarding/OnboardingEngine.tsx', code, 'utf8');
console.log("Updated OnboardingEngine effects and mobile sizes");
