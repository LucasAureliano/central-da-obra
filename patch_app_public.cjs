const fs = require('fs');

const path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('PublicBlogView')) {
  // Add imports
  code = code.replace(
    `const PublicPortfolioView = lazy(() => import('./components/connect/public/PublicPortfolioView').then(m => ({ default: m.PublicPortfolioView })));`,
    `const PublicPortfolioView = lazy(() => import('./components/connect/public/PublicPortfolioView').then(m => ({ default: m.PublicPortfolioView })));\nconst PublicBlogView = lazy(() => import('./components/public/PublicBlogView').then(m => ({ default: m.PublicBlogView })));\nconst PublicCalculatorView = lazy(() => import('./components/public/PublicCalculatorView').then(m => ({ default: m.PublicCalculatorView })));`
  );

  // Add url params checks
  code = code.replace(
    `const isPreview = urlParams.get('preview');`,
    `const isPreview = urlParams.get('preview');\n  const isBlog = urlParams.has('blog');\n  const blogPostId = urlParams.get('blog');\n  const isFreeCalculator = urlParams.has('calc');\n  const calcId = urlParams.get('calc');`
  );

  // Add render intercepts BEFORE authentication redirects
  code = code.replace(
    `if (isPreview === 'true') {`,
    `if (isFreeCalculator) {\n      return <PublicCalculatorView theme={theme} calcId={calcId || 'concreto'} />;\n    }\n\n    if (isBlog) {\n      return <PublicBlogView theme={theme} postId={blogPostId && blogPostId !== 'true' ? blogPostId : null} />;\n    }\n\n    if (isPreview === 'true') {`
  );

  fs.writeFileSync(path, code, 'utf8');
}
