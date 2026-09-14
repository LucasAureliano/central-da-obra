const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCalculatorsHubView.tsx', 'utf8');

// Update SponsoredAd location="hub_top" to include compact
code = code.replace(/<SponsoredAd probability=\{1\} location="hub_top"\s*\/>/, '<SponsoredAd probability={1} location="hub_top" compact={true} />');

// Make footer not shrink
code = code.replace(/<InstitutionalFooter theme=\{theme as 'light'\|'dark'\} onLogin=\{handleAuth\} onNavigate=\{handleNavigate\} \/>/, '<div style={{ flexShrink: 0 }}><InstitutionalFooter theme={theme as "light"|"dark"} onLogin={handleAuth} onNavigate={handleNavigate} /></div>');

fs.writeFileSync('src/components/public/PublicCalculatorsHubView.tsx', code, 'utf8');
console.log("Updated Hub View");
