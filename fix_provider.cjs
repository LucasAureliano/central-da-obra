const fs = require('fs');
let content = fs.readFileSync('src/components/provider/ProviderWorkDashboard.tsx', 'utf8');

content = content.replace(
  `import { ArrowLeft, MapPin, HardHat, CheckCircle2, LayoutDashboard, CalendarDays, Wallet, Truck, FileText, Image as ImageIcon, Users } from 'lucide-react';`,
  `import { ArrowLeft, MapPin, HardHat, CheckCircle2, LayoutDashboard, CalendarDays, Wallet, Truck, FileText, Image as ImageIcon, Users, Briefcase, Lightbulb, Wrench, Hammer } from 'lucide-react';\nimport { useAuth } from '../../contexts/AuthContext';`
);

content = content.replace(
  `const { works, setActiveWork } = useWorks();`,
  `const { works, setActiveWork } = useWorks();\n  const { profile } = useAuth();`
);

// fix TabId error
if (!content.includes('type TabId = ')) {
    content = content.replace(
      `export function ProviderWorkDashboard({ workId, onBack }: ProviderWorkDashboardProps) {`,
      `type TabId = 'resumo' | 'cronograma' | 'financeiro' | 'fornecedores' | 'anotacoes' | 'fotos' | 'connect' | 'projetos';\n\nexport function ProviderWorkDashboard({ workId, onBack }: ProviderWorkDashboardProps) {`
    );
}

content = content.replace(
  `onClick={() => setActiveTab(tab.id as any)}`,
  `onClick={() => setActiveTab(tab.id as TabId)}`
);

// also look for setActiveTab definition
content = content.replace(
  `const [activeTab, setActiveTab] = useState('resumo');`,
  `const [activeTab, setActiveTab] = useState<TabId>('resumo');`
);

fs.writeFileSync('src/components/provider/ProviderWorkDashboard.tsx', content, 'utf8');
