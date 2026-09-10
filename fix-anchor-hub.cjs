const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCalculatorsHubView.tsx', 'utf8');

code = code.replace(/<a href="\/" style=\{\{ color: 'var\(--color-primary\)', fontWeight: 700 \}\}>Crie sua conta grǭtis agora\.<\/motion\.a>/g, "<a href=\"/\" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Crie sua conta grátis agora.</a>");

if (!code.includes("import { motion } from 'framer-motion'")) {
  code = code.replace(/import \{ Helmet \} from 'react-helmet-async';/, "import { Helmet } from 'react-helmet-async';\nimport { motion } from 'framer-motion';");
}

fs.writeFileSync('src/components/public/PublicCalculatorsHubView.tsx', code, 'utf8');
console.log("Fixed anchor bug in Hub");
