const fs = require('fs');

let code = fs.readFileSync('src/components/onboarding/InteractiveTour.tsx', 'utf8');

// The file still has `}, 1200); // Give the dashboard more than enough time to render completely`
// We need to replace it with `};` because we replaced the `setTimeout` with `const startTour = () => {` in `restore-tour2.cjs`.
code = code.replace(/\},\s*1200\);\s*\/\/\s*Give the dashboard more than enough time to render completely/g, "};");

fs.writeFileSync('src/components/onboarding/InteractiveTour.tsx', code, 'utf8');
console.log("Fixed InteractiveTour syntax actually");
