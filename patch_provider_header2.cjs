const fs = require('fs');

const path = 'src/components/provider/ProviderDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /<h1 style={{ fontSize: 24, fontWeight: 800, color: 'var\(--text-main\)', margin: '0 0 4px' }}>[\s\S]*?<\/h1>/m;

const replacement = `<h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
            Olá, {(profile as any)?.displayName || user?.displayName || 'Profissional'} - {(profile as any)?.specialty || localStorage.getItem('pendingSpecialty') || 'Prestador de Serviço'}
          </h1>`;

code = code.replace(regex, replacement);

fs.writeFileSync(path, code, 'utf8');
