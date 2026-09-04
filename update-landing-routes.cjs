const fs = require('fs');

// 1. InstitutionalFooter
let footer = fs.readFileSync('src/components/landing/InstitutionalFooter.tsx', 'utf8');
footer = footer.replace(/window\.location\.search\.includes\('calculadoras'\) \|\| window\.location\.search\.includes\('calc'\)/g, "window.location.search !== ''");
footer = footer.replace(/<footer className="landing-footer" style=\{\{ backgroundColor: '#000000', borderTop: '1px solid #1f1f1f', position: 'relative', zIndex: 10 \}\} data-theme="dark">/g, '<footer className="landing-footer" style={{ position: \'relative\', zIndex: 10 }} >');
footer = footer.replace(/href="\/\?calculadoras=true"/g, 'href="/calculadoras"');
footer = footer.replace(/href="\/\?blog=true"/g, 'href="/blog"');
fs.writeFileSync('src/components/landing/InstitutionalFooter.tsx', footer, 'utf8');

// 2. LandingNavbar
let nav = fs.readFileSync('src/components/landing/LandingNavbar.tsx', 'utf8');
nav = nav.replace(/href="\/\?calculadoras=true"/g, 'href="/calculadoras"');
nav = nav.replace(/<button onClick=\{onLogin\} className="landing-nav-link btn-3d" style=\{\{ fontWeight: 600 \}\}>Entrar<\/button>/g, '<button onClick={onLogin} className="landing-nav-link" style={{ background: \'transparent\', border: \'none\', cursor: \'pointer\', fontWeight: 600 }}>Entrar</button>');
fs.writeFileSync('src/components/landing/LandingNavbar.tsx', nav, 'utf8');

// 3. CalculatorLandingSection
let calc = fs.readFileSync('src/components/landing/CalculatorLandingSection.tsx', 'utf8');
calc = calc.replace(/onClick=\{\(\) => window\.location\.href = '\/\?calculadoras=true'\}/g, "onClick={() => window.location.href = '/calculadoras'}");
fs.writeFileSync('src/components/landing/CalculatorLandingSection.tsx', calc, 'utf8');

console.log("Done updating landing components");
