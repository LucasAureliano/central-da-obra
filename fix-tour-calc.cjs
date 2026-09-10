const fs = require('fs');
let code = fs.readFileSync('src/components/onboarding/InteractiveTour.tsx', 'utf8');

code = code.replace(/calculos: isDesktop \? '\.nav-item-desktop:has\(\.lucide-calculator\)' : '\.nav-item:has\(\.lucide-calculator\)'/g, "calculos: isDesktop ? '#tour-calculos-desktop' : '#tour-calculos-mobile'");

fs.writeFileSync('src/components/onboarding/InteractiveTour.tsx', code, 'utf8');
console.log("Updated InteractiveTour calc selector");
