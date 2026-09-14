const fs = require('fs');

let code = fs.readFileSync('src/components/onboarding/OnboardingEngine.tsx', 'utf8');

// Fix colors and layout size
// Replace the hardcoded #0f172a with app colors
code = code.replace(/backgroundColor: '#0f172a'/g, "background: 'linear-gradient(135deg, var(--bg-base) 0%, var(--bg-panel) 100%)'");
// Make sure the main content is scrollable if needed
code = code.replace(/overflow: 'hidden'/g, "overflowY: 'auto', WebkitOverflowScrolling: 'touch', overflowX: 'hidden'");

// Fix the "pular" button behaviour
code = code.replace(/window\.location\.reload\(\);/g, "// removed reload to avoid flashing");

// Enhance slide variants
code = code.replace(/const slideVariants = \{[\s\S]*?\};/, `const slideVariants = {
    enter: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)' },
    center: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -30, scale: 0.95, filter: 'blur(8px)' }
  };`);

// Write back to OnboardingEngine
fs.writeFileSync('src/components/onboarding/OnboardingEngine.tsx', code, 'utf8');

console.log("Restored and improved OnboardingEngine properly");
