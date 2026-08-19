const fs = require('fs');

const path = 'src/components/provider/ProviderDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/const { user } = useAuth\(\);/, 'const { user, profile } = useAuth();');

if (!code.includes('Olá, {user?.displayName || \'Profissional\'}')) {
  const target = `<div style={{ padding: '24px 20px', paddingBottom: 24 }}>`;
  const header = `
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
            Olá, {profile?.displayName || user?.displayName || 'Profissional'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Bem-vindo ao seu painel.</span>
            <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', borderRadius: 12, fontWeight: 800 }}>
              {(profile as any)?.specialty || localStorage.getItem('pendingSpecialty') || 'Prestador de Serviço'}
            </span>
          </div>
        </div>
      </div>
  `;
  code = code.replace(target, target + header);
}

fs.writeFileSync(path, code, 'utf8');
