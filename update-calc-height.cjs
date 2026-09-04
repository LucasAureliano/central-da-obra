const fs = require('fs');

const files = [
  'src/components/public/PublicCalculatorsHubView.tsx',
  'src/components/public/PublicCalculatorView.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/height:\s*'100%'/g, "height: '100dvh'");
  content = content.replace(/height:\s*"100%"/g, "height: '100dvh'");
  fs.writeFileSync(file, content, 'utf8');
});

console.log("Updated height to 100dvh in PublicCalculators views.");
