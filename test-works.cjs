const fs = require('fs');
let code = fs.readFileSync('src/components/Works.tsx', 'utf8');
console.log(code.includes("import { Reorder } from 'framer-motion'"));
