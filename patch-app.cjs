const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace OnboardingEngine
content = content.replace(
  "import { OnboardingEngine } from './components/onboarding/OnboardingEngine';",
  "import { InteractiveTour } from './components/onboarding/InteractiveTour';"
);

content = content.replace(
  /<OnboardingEngine[\s\S]*?\/>/,
  `<InteractiveTour onComplete={async () => {
    if (isGuest) {
      sessionStorage.setItem('guestHasSeenWelcome', 'true');
      window.location.reload();
    } else {
      setForceOnboarding(false);
      try {
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('./lib/firebase');
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { hasSeenWelcome: true });
      } catch (e) {
        console.error('Error saving welcome state:', e);
      }
    }
  }} />`
);

// Add GenericInfoPage import
content = content.replace(
  "import { InterstitialAd } from './components/shared/InterstitialAd';",
  "import { InterstitialAd } from './components/shared/InterstitialAd';\nimport { GenericInfoPage } from './components/landing/GenericInfoPage';"
);

// Update route definitions
content = content.replace(
  "const isBlog = urlParams.has('blog');",
  "const isBlog = urlParams.has('blog') || window.location.pathname === '/blog';\n  const isPrivacy = urlParams.has('privacy') || window.location.pathname === '/privacidade';\n  const isTerms = urlParams.has('terms') || window.location.pathname === '/termos';"
);

content = content.replace(
  "const isCalculatorsHub = urlParams.has('calculadoras');",
  "const isCalculatorsHub = urlParams.has('calculadoras') || window.location.pathname === '/calculadoras';"
);

// Add privacy and terms routes
content = content.replace(
  /if \(isBlog\) \{\s*return <PublicBlogView theme=\{theme\} postId=\{blogPostId && blogPostId !== 'true' \? blogPostId : null\} \/>;\s*\}/,
  `if (isBlog) {
      return <PublicBlogView theme={theme} postId={blogPostId && blogPostId !== 'true' ? blogPostId : null} />;
    }

    if (isPrivacy) {
      return <GenericInfoPage pageId="privacy" onBack={() => window.location.href = '/'} onLogin={() => window.location.href = '/?login=true'} onNavigate={(page) => window.location.href = '/' + (page === 'terms' ? 'termos' : page === 'privacy' ? 'privacidade' : '')} theme={theme} />;
    }

    if (isTerms) {
      return <GenericInfoPage pageId="terms" onBack={() => window.location.href = '/'} onLogin={() => window.location.href = '/?login=true'} onNavigate={(page) => window.location.href = '/' + (page === 'terms' ? 'termos' : page === 'privacy' ? 'privacidade' : '')} theme={theme} />;
    }`
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
