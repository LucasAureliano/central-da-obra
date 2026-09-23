import os

with open('src/components/connect/public/PublicProfileView.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

old_header = "<div style={{ height: 160, background: 'linear-gradient(135deg, var(--color-primary), #1E3A8A)', position: 'relative' }}>"
new_header = """<div style={{ height: 64, backgroundColor: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'center' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <Logo variant="horizontal" theme={theme as any} />
          </a>
        </div>
        <div style={{ height: 160, background: 'linear-gradient(135deg, var(--color-primary), #1E3A8A)', position: 'relative' }}>"""

if 'Logo variant="horizontal"' not in code:
    code = code.replace("import { Helmet } from 'react-helmet-async';", "import { Helmet } from 'react-helmet-async';\nimport { Logo } from '../../../ui/Logo';")
    code = code.replace(old_header, new_header)
    with open('src/components/connect/public/PublicProfileView.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Injected header")
