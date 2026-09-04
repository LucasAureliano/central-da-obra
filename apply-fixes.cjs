const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchRegex, replaceWith) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(searchRegex, replaceWith);
    fs.writeFileSync(filePath, content, 'utf8');
  } catch(e) {}
}

// 1. App.tsx
replaceInFile('src/App.tsx', /import \{ OnboardingEngine \} from '\.\/components\/onboarding\/OnboardingEngine';/g, "import { InteractiveTour } from './components/onboarding/InteractiveTour';");
replaceInFile('src/App.tsx', /<\?OnboardingEngine[\s\S]*?\/>/g, "<InteractiveTour onComplete={async () => { if (isGuest) { sessionStorage.setItem('guestHasSeenWelcome', 'true'); window.location.reload(); } else { setForceOnboarding(false); try { const { doc, updateDoc } = await import('firebase/firestore'); const { db } = await import('./lib/firebase'); const userRef = doc(db, 'users', user.uid); await updateDoc(userRef, { hasSeenWelcome: true }); } catch (e) { console.error('Error saving welcome state:', e); } } }} />");
replaceInFile('src/App.tsx', /const isCalculatorsHub = urlParams\.has\('calculadoras'\);/g, "const isCalculatorsHub = urlParams.has('calculadoras') || window.location.pathname === '/calculadoras';");
replaceInFile('src/App.tsx', /const isBlog = urlParams\.has\('blog'\);/g, "const isBlog = urlParams.has('blog') || window.location.pathname === '/blog';");

// 2. Finance.tsx
let financeCode = fs.readFileSync('src/components/Finance.tsx', 'utf8');
const containerCode = "const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };\nconst itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } } };";
financeCode = financeCode.replace("export function Finance", containerCode + "\n\nexport function Finance");
financeCode = financeCode.replace(/\{groupExpenses\.map\(exp => \([\s\S]*?<Trash2 size=\{16\} \/>\s*<\/button>\s*<\/div>\s*\)\)\}\s*<\/div>/g, "{groupExpenses.map(exp => (\n                    <motion.div variants={itemVariants} key={exp.id} className=\"glass-panel\" style={{ padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>\n                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>\n                        <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: exp.status === 'Pago' ? 'var(--color-success-bg)' : exp.status === 'Pendente' ? 'var(--color-warning-bg)' : 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: exp.status === 'Pago' ? 'var(--color-success)' : exp.status === 'Pendente' ? 'var(--color-warning)' : 'var(--text-muted)' }}>\n                          {exp.status === 'Pago' ? <CheckCircle2 size={24} /> : exp.status === 'Pendente' ? <Clock size={24} /> : <X size={24} />}\n                        </div>\n                        <div>\n                          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{exp.title}</h4>\n                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>\n                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{exp.category}</span>\n                            {isGlobal && exp.workName && (\n                              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>{exp.workName}</span>\n                            )}\n                          </div>\n                        </div>\n                      </div>\n                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>\n                        <div style={{ textAlign: 'right' }}>\n                          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>\n                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(exp.amount)}\n                          </p>\n                          <p style={{ margin: 0, fontSize: 12, color: exp.status === 'Pago' ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600, marginTop: 4 }}>\n                            {exp.status}\n                          </p>\n                        </div>\n                        <button onClick={() => handleDeleteExpense(exp)} style={{ background: 'none', border: 'none', padding: 8, color: 'var(--text-muted)', cursor: 'pointer' }}>\n                          <Trash2 size={16} />\n                        </button>\n                      </div>\n                    </motion.div>\n                  ))}\n                </motion.div>");
financeCode = financeCode.replace(/<div style=\{\{ display: 'flex', flexDirection: 'column', gap: 12 \}\}>\s*\{groupExpenses\.map/g, "<motion.div variants={containerVariants} initial=\"hidden\" animate=\"show\" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>\n                  {groupExpenses.map");
fs.writeFileSync('src/components/Finance.tsx', financeCode, 'utf8');

// 3. landing.css
replaceInFile('src/styles/landing.css', /background: radial-gradient\(circle at top right, #1a1a24 0%, #080808 100%\);/g, "background: var(--bg-base);");
replaceInFile('src/styles/landing.css', /background: #1f1f1f;/g, "background: var(--bg-surface);");
replaceInFile('src/styles/landing.css', /color: #A3A3A3;/g, "color: var(--text-muted);");
replaceInFile('src/styles/landing.css', /\.landing-card \{/g, ".landing-card { padding: 32px;");
replaceInFile('src/styles/landing.css', /@media \(max-width: 768px\) \{\s*\.landing-card \{/g, "@media (max-width: 768px) {\n  .landing-card {\n    padding: 24px;");

// 4. LandingNavbar.tsx
replaceInFile('src/components/landing/LandingNavbar.tsx', /className="landing-nav-link btn-3d"/g, 'className="landing-nav-link" style={{ background: \'transparent\', border: \'none\', cursor: \'pointer\', fontWeight: 600 }}');

// 5. InstitutionalFooter.tsx
replaceInFile('src/components/landing/InstitutionalFooter.tsx', /if \(window\.location\.pathname !== '\/' \|\| window\.location\.search\.includes\('calculadoras'\) \|\| window\.location\.search\.includes\('calc'\)\) \{/g, "if (window.location.pathname !== '/' || window.location.search !== '') {");
replaceInFile('src/components/landing/InstitutionalFooter.tsx', /style=\{\{ backgroundColor: '#000000', borderTop: '1px solid #1f1f1f', position: 'relative', zIndex: 10 \}\}/g, "style={{ position: 'relative', zIndex: 10 }}");
replaceInFile('src/components/landing/InstitutionalFooter.tsx', /data-theme="dark"/g, "");

// 6. OwnerConnectDashboard.tsx
replaceInFile('src/components/connect/OwnerConnectDashboard.tsx', /className="screen-content animate-fade-in" style=\{\{ padding: '24px 20px 100px' \}\}/g, "className=\"screen-content animate-fade-in\" style={{ padding: '24px 20px 100px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 140px)' }}");

// 7. Public views
['src/components/public/PublicCalculatorsHubView.tsx', 'src/components/public/PublicCalculatorView.tsx', 'src/components/public/PublicBlogView.tsx'].forEach(file => {
  replaceInFile(file, /minHeight: '100dvh', height: '100dvh'/g, "height: '100%'");
});

// 8. Global URL replacements
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if(file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}
walk('./src').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  if(content.includes('/?calculadoras=true')) { content = content.replace(/\/\?calculadoras=true/g, '/calculadoras'); changed = true; }
  if(content.includes('/?blog=true')) { content = content.replace(/\/\?blog=true/g, '/blog'); changed = true; }
  if(changed) fs.writeFileSync(file, content, 'utf8');
});

// Other fixes from previous stage
replaceInFile('src/components/landing/GlobalHeader.tsx', /<motion.div\s+initial=\{\{\s*opacity: 0\s*\}\}\s+animate=\{\{\s*opacity: 1\s*\}\}\s+className="header-logo"/g, "<div className=\"hide-on-desktop\">\n<motion.div\n            initial={{ opacity: 0 }}\n            animate={{ opacity: 1 }}\n            className=\"header-logo\"");
replaceInFile('src/components/landing/GlobalHeader.tsx', /<span style=\{\{ color: '#3B82F6' \}\}>Obra<\/span>\.\n\s*<\/motion.div>/g, "<span style={{ color: '#3B82F6' }}>Obra</span>.\n          </motion.div>\n</div>");
replaceInFile('src/styles/landing.css', /@media \(max-width: 768px\) \{/g, "@media (max-width: 1100px) {");

console.log("Done");
