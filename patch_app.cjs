const fs = require('fs');

const path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const target1 = `if (portfolioItemId && connectProfileId) {
    return <PublicPortfolioView workId={portfolioItemId} uid={connectProfileId} theme={theme} onBack={() => window.history.back()} />;
  }

  if (connectProfileId) {
    return <PublicProfileView uid={connectProfileId} theme={theme} />;
  }

  if (isFreeCalculator) {
      return <PublicCalculatorView theme={theme} calcId={calcId || 'concreto'} />;
    return <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }} />;
  }`;

const replacement1 = `if (portfolioItemId && connectProfileId) {
    return (
      <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>
        <div className="app-container" style={{ overflowY: 'auto', display: 'block' }}>
          <PublicPortfolioView workId={portfolioItemId} uid={connectProfileId} theme={theme} onBack={() => window.history.back()} />
        </div>
      </Suspense>
    );
  }

  if (connectProfileId) {
    return (
      <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>
        <div className="app-container" style={{ overflowY: 'auto', display: 'block' }}>
          <PublicProfileView uid={connectProfileId} theme={theme} />
        </div>
      </Suspense>
    );
  }

  if (isFreeCalculator) {
    if (calcId) {
      return (
        <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>
          <div className="app-container" style={{ overflowY: 'auto', display: 'block' }}>
            <PublicCalculatorView theme={theme} calcId={calcId || 'concreto'} />
          </div>
        </Suspense>
      );
    }
    return <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }} />;
  }`;

code = code.replace(target1, replacement1);

// Add missing Loader2 import if it doesn't exist, though it's likely already there for main Suspense
if (!code.includes('Loader2')) {
  code = code.replace(`import { LayoutDashboard`, `import { Loader2, LayoutDashboard`);
}

fs.writeFileSync(path, code, 'utf8');
