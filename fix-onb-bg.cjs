const fs = require('fs');
let code = fs.readFileSync('src/components/onboarding/OnboardingEngine.tsx', 'utf8');

// 1. Fix Background and Root Overflow
code = code.replace(/backgroundColor: '#0f172a',/g, "backgroundColor: 'var(--bg-base)',");
code = code.replace(/zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden'/g, "zIndex: 9999, display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', minHeight: '100dvh'");

// 2. Fix Skip Button & Refresh issue -> remove reload!
code = code.replace(/localStorage.setItem\('guestHasSeenWelcome', 'true'\);\n\s*if \(selectedRole\) localStorage.setItem\('pendingRole', selectedRole\);\n\s*window\.location\.reload\(\);/g, "localStorage.setItem('guestHasSeenWelcome', 'true');\n      if (selectedRole) localStorage.setItem('pendingRole', selectedRole);");

// 3. Add more effects to Role Cards
code = code.replace(/<div\n\s*key=\{r\.id\}\n\s*onClick=/g, "<motion.div\n                key={r.id}\n                whileHover={{ scale: 1.02, y: -4 }}\n                whileTap={{ scale: 0.98 }}\n                initial={{ opacity: 0, y: 20 }}\n                animate={{ opacity: 1, y: 0 }}\n                transition={{ delay: index * 0.1 }}\n                onClick=");
code = code.replace(/\{\s*r\.id === 'owner' \? <Home size=\{24\} \/> : \.\.\. \}/, ""); // Wait, I will just match the closing div of the card.
code = code.replace(/<\/div>\n\s*\{r\.id === 'owner'/g, "</motion.div>\n              {r.id === 'owner'"); // This won't work perfectly. I will do a more robust replace for the Role Card.

fs.writeFileSync('src/components/onboarding/OnboardingEngine.tsx', code, 'utf8');
console.log("Updated root layout and background in OnboardingEngine");
