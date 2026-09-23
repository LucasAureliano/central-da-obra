const fs = require('fs');
let code = fs.readFileSync('src/components/connect/public/PublicProfileView.tsx', 'utf8');

if (!code.includes('Logo variant="horizontal"')) {
    code = code.replace("import { Helmet } from 'react-helmet-async';", "import { Helmet } from 'react-helmet-async';\nimport { Logo } from '../../../components/ui/Logo';");
    
    const oldHeader = <div style={{ height: 160, background: 'linear-gradient(135deg, var(--color-primary), #1E3A8A)', position: 'relative' }}>;
    
    const newHeader = <div style={{ height: 64, backgroundColor: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'center' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <Logo variant="horizontal" theme={theme as any} />
          </a>
        </div>
        <div style={{ height: 160, background: 'linear-gradient(135deg, var(--color-primary), #1E3A8A)', position: 'relative' }}>;
        
    code = code.replace(oldHeader, newHeader);
    fs.writeFileSync('src/components/connect/public/PublicProfileView.tsx', code, 'utf8');
    console.log("Injected header to PublicProfileView");
} else {
    console.log("Header already present");
}
