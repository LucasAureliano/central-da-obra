const fs = require('fs');

const path = 'src/components/connect/public/PublicProfileView.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import { Helmet }')) {
  code = code.replace(
    `import { RequestQuoteModal } from './RequestQuoteModal';`,
    `import { RequestQuoteModal } from './RequestQuoteModal';\nimport { Helmet } from 'react-helmet-async';`
  );
  
  const target = `className="app-container" data-theme={theme}`;
  code = code.replace(
    `<div className="app-container" data-theme={theme} style={{ minHeight: '100vh', paddingBottom: 80 }}>`,
    `<div className="app-container" data-theme={theme} style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {profile && (
        <Helmet>
          <title>{profile.name} - {profile.specialty || 'Profissional'} | CentralObra</title>
          <meta name="description" content={\`Veja o perfil de \${profile.name}, \${profile.specialty}. Peça um orçamento sem compromisso no CentralObra.\`} />
          <meta property="og:title" content={\`\${profile.name} - \${profile.specialty || 'Profissional'}\`} />
          <meta property="og:description" content={\`Confira meu portfólio e serviços no CentralObra. Atendo na região de \${profile.city || 'sua cidade'}.\`} />
          {profile.avatar && <meta property="og:image" content={profile.avatar} />}
        </Helmet>
      )}`
  );
  
  fs.writeFileSync(path, code, 'utf8');
}
