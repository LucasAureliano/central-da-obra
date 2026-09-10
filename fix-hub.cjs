const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCalculatorsHubView.tsx', 'utf8');

// Fix the SEO text
code = code.replace(/<a href="\/" style=\{\{ color: 'var\(--color-primary\)', fontWeight: 700 \}\}>Crie sua conta grátis agora\.<\/motion\.a>/g, "<a href=\"/\" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Crie sua conta grátis agora.</a>");

// Fix CalcCard
code = code.replace(/<\/motion\.a>\s*\n\s*\);\s*\n\s*\}/, "</a>\n  );\n}");

// Actually, I'll just change all </motion.a> back to </a> because I didn't actually change any <a to <motion.a properly.
code = code.replace(/<\/motion\.a>/g, '</a>');

// Now, to animate the cards, let's wrap CalcCard in a motion.div when calling it, or just leave it since the parent grid is already a motion.div with staggerChildren! 
// Wait, staggerChildren only animates children that are motion components with variants!
// So let's make CalcCard a motion.a!

code = code.replace(/function CalcCard\(\{ title/g, "const CalcCard = React.forwardRef<HTMLAnchorElement, { title: string, desc: string, icon: React.ReactNode, link: string, comingSoon?: boolean }>(({ title, desc, icon, link, comingSoon }, ref) => {");

code = code.replace(/return \(\s*<a\s*href=/g, "return (\n    <a ref={ref}\n      href=");
code = code.replace(/Acessar <ArrowRight size=\{14\} \/>\s*<\/div>\s*\)\}\s*<\/a>\s*\);\s*\}/, "Acessar <ArrowRight size={14} />\n        </div>\n      )}\n    </a>\n  );\n});\nconst MotionCalcCard = motion(CalcCard);");

code = code.replace(/<CalcCard /g, "<MotionCalcCard variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02, translateY: -4 }} whileTap={{ scale: 0.98 }} ");

fs.writeFileSync('src/components/public/PublicCalculatorsHubView.tsx', code, 'utf8');
console.log("Fixed framer motion variants in Hub");
