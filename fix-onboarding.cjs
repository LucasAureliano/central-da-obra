const fs = require('fs');
let code = fs.readFileSync('src/components/onboarding/OnboardingEngine.tsx', 'utf8');

code = code.replace(/localStorage\.setItem\('guestHasSeenWelcome', 'true'\);\n\s*if \(selectedRole\) localStorage\.setItem\('pendingRole', selectedRole\);\n\s*\}\n\s*onComplete\(\);/g, `localStorage.setItem('guestHasSeenWelcome', 'true');\n      if (selectedRole) localStorage.setItem('pendingRole', selectedRole);\n      window.location.reload();\n    }\n    \n    onComplete();`);

// Also fix overflow on mobile
// The root div has overflow: 'hidden'. The stages need `overflowY: 'auto'`
code = code.replace(/style=\{\{ display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 24px', maxWidth: 800, margin: '0 auto' \}\}/g, "style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '80px 24px 40px', maxWidth: 800, margin: '0 auto', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}");

// We need to auto-advance when a role is clicked
code = code.replace(/onClick=\{\(\) => setSelectedRole\(r\.id as UserRole\)\}/g, "onClick={() => {\n                setSelectedRole(r.id as UserRole);\n                setTimeout(() => {\n                  setStage('presentation');\n                }, 400);\n              }}");

fs.writeFileSync('src/components/onboarding/OnboardingEngine.tsx', code, 'utf8');
console.log("Updated OnboardingEngine");
