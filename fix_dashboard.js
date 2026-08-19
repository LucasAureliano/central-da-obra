import fs from 'fs';

let content = fs.readFileSync('src/components/provider/ProviderWorkDashboard.tsx', 'utf8');

// Ensure profile is available
if (!content.includes('const { profile } = useAuth()')) {
  content = content.replace(
    'export function ProviderWorkDashboard({ workId, onBack }: ProviderWorkDashboardProps) {',
    'export function ProviderWorkDashboard({ workId, onBack }: ProviderWorkDashboardProps) {\n  const { profile } = useAuth();\n  const [activeProject, setActiveProject] = useState<string | null>(null);'
  );
}

// Add TabId properly
content = content.replace(
  /type TabId = .*?;/g,
  "type TabId = 'resumo' | 'cronograma' | 'financeiro' | 'fornecedores' | 'anotacoes' | 'fotos' | 'connect' | 'projetos';"
);

// Fix activeTab useState properly
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState\('resumo'\);/g,
  "const [activeTab, setActiveTab] = useState<TabId>('resumo');"
);

fs.writeFileSync('src/components/provider/ProviderWorkDashboard.tsx', content, 'utf8');
