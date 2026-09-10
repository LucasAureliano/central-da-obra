const fs = require('fs');
let code = fs.readFileSync('src/components/onboarding/InteractiveTour.tsx', 'utf8');

// Replace the end of the setTimeout
code = code.replace(/tour\.drive\(\);\n\s*\}, 1200\); \/\/ Give the dashboard more than enough time to render completely/g, "tour.drive();\n    };");

fs.writeFileSync('src/components/onboarding/InteractiveTour.tsx', code, 'utf8');
console.log("Fixed InteractiveTour syntax");
