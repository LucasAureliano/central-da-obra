const fs = require('fs');
let txt = fs.readFileSync('src/components/AppSettings.tsx', 'utf8');
txt = txt.replace("}; onBack }: { onBack: () => void }) {", "};");
fs.writeFileSync('src/components/AppSettings.tsx', txt, 'utf8');
