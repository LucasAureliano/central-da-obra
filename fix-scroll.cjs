const fs = require('fs');

function fixFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  
  const searchStr = `height: '100dvh', display: 'flex'`;
  const replaceStr = `position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex'`;
  
  if (code.includes(searchStr)) {
    code = code.replace(searchStr, replaceStr);
    fs.writeFileSync(filename, code, 'utf8');
    console.log(`Fixed ${filename}`);
  } else {
    console.log(`Could not find target string in ${filename}`);
  }
}

fixFile('src/components/public/PublicCalculatorsHubView.tsx');
fixFile('src/components/public/PublicCalculatorView.tsx');
fixFile('src/components/public/PublicBlogView.tsx');
fixFile('src/components/connect/public/PublicProfileView.tsx');
fixFile('src/components/connect/public/PublicPortfolioView.tsx');
