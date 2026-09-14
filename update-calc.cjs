const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCalculatorView.tsx', 'utf8');

// Update SponsoredAd location="calc_top" to include compact
code = code.replace(/<SponsoredAd probability=\{1\} location="calc_top" \/>/, '<SponsoredAd probability={1} location="calc_top" compact={true} />');

// Make footer not shrink
code = code.replace(/<InstitutionalFooter theme=\{theme as 'light'\|'dark'\} onLogin=\{handleAuth\} onNavigate=\{\(p\) => handleNavigate\(p\)\} \/>/, '<div style={{ flexShrink: 0 }}><InstitutionalFooter theme={theme as "light"|"dark"} onLogin={handleAuth} onNavigate={(p) => handleNavigate(p)} /></div>');

fs.writeFileSync('src/components/public/PublicCalculatorView.tsx', code, 'utf8');
console.log("Updated Calculator View");
