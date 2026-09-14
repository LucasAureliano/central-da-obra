const fs = require('fs');
let code = fs.readFileSync('src/components/shared/SponsoredAd.tsx', 'utf8');

if (!code.includes('compact?: boolean')) {
  code = code.replace(/interface SponsoredAdProps \{/, "interface SponsoredAdProps {\n  compact?: boolean;");
}
code = code.replace(/export const SponsoredAd: React.FC<SponsoredAdProps> = \(\{ probability = 0\.3, className = '', location = 'feed' \}\) => \{/, "export const SponsoredAd: React.FC<SponsoredAdProps> = ({ probability = 0.3, className = '', location = 'feed', compact = false }) => {");

code = code.replace(/padding: 16,\s*marginBottom: 24,\s*overflow: 'hidden',\s*boxShadow: '0 4px 20px rgba\\(0,0,0,0\\.05\\)',\s*minHeight: 100/g, "padding: compact ? 8 : 16,\n            marginBottom: compact ? 16 : 24,\n            overflow: 'hidden',\n            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',\n            minHeight: compact ? 60 : 100");

code = code.replace(/<div style=\{\{ minHeight: 90/g, "<div style={{ minHeight: compact ? 60 : 90");
code = code.replace(/style=\{\{ display: 'block', width: '100%', height: 90 \}\}/g, "style={{ display: 'block', width: '100%', height: compact ? 60 : 90 }}");

// also hide the label "Patrocinado" if compact to save vertical space
code = code.replace(/<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 \}\}>/g, "{!compact && (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>");
code = code.replace(/fill="#F59E0B" \/>\s*<\/div>\s*<\/div>/g, 'fill="#F59E0B" />\n            </div>\n          </div>)}');

fs.writeFileSync('src/components/shared/SponsoredAd.tsx', code, 'utf8');
console.log("Updated SponsoredAd");
