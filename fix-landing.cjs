const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

if (!code.includes('SEOArticleBlock')) {
    code = code.replace("import { InstitutionalFooter } from './landing/InstitutionalFooter';", "import { InstitutionalFooter } from './landing/InstitutionalFooter';\nimport { SEOArticleBlock } from './landing/SEOArticleBlock';");
    code = code.replace("<InstitutionalFooter", "<SEOArticleBlock />\n\n      <InstitutionalFooter");
    fs.writeFileSync('src/components/LandingPage.tsx', code, 'utf8');
    console.log("Injected SEO article");
} else {
    console.log("Already injected");
}
