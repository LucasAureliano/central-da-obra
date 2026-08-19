const fs = require('fs');

const path = 'src/components/WorkDetails.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add logic to determine available projects
const logicTarget = `const [activeTab, setActiveTab] = useState<'resumo' | 'cronograma' | 'financas' | 'compras' | 'orcamento' | 'diario' | 'documentos' | 'compartilhamento' | 'projetos'>('resumo');`;

const logicReplacement = `const [activeTab, setActiveTab] = useState<'resumo' | 'cronograma' | 'financas' | 'compras' | 'orcamento' | 'diario' | 'documentos' | 'compartilhamento' | 'projetos'>('resumo');

  const getAvailableProjects = () => {
    const role = profile?.role || localStorage.getItem('pendingRole');
    const spec = profile?.specialty || localStorage.getItem('pendingSpecialty');
    
    if (role === 'owner') return [];
    if (role === 'service') {
      if (spec === 'Eletricista') return ['eletrico', 'luminotecnico', 'automacao'];
      if (spec === 'Encanador') return ['hidraulico'];
      if (spec === 'Gesseiro') return ['luminotecnico'];
      return []; // Other service providers don't have a specific design studio in the app yet
    }
    return ['eletrico', 'hidraulico', 'luminotecnico', 'automacao'];
  };

  const availableProjects = getAvailableProjects();
  const showProjectsTab = availableProjects.length > 0;
`;

code = code.replace(logicTarget, logicReplacement);

// 2. Filter tabs
const tabsTarget = `[
            { id: 'resumo', label: 'Resumo', icon: <LayoutDashboard size={14} /> },
            { id: 'cronograma', label: 'Cronograma', icon: <CalendarDays size={14} /> },
            { id: 'financas', label: 'Finanas', icon: <Wallet size={14} /> },
            { id: 'compras', label: 'Materiais', icon: <Package size={14} /> },
            { id: 'orcamento', label: 'Oramentos', icon: <Calculator size={14} /> },
            { id: 'projetos', label: 'Projetos', icon: <Briefcase size={14} /> },
            { id: 'documentos', label: 'Documentos', icon: <FolderOpen size={14} /> },
            { id: 'compartilhamento', label: 'Compartilhamento', icon: <Users size={14} /> }
          ]`;

const tabsReplacement = `[
            { id: 'resumo', label: 'Resumo', icon: <LayoutDashboard size={14} /> },
            { id: 'cronograma', label: 'Cronograma', icon: <CalendarDays size={14} /> },
            { id: 'financas', label: 'Finanas', icon: <Wallet size={14} /> },
            { id: 'compras', label: 'Materiais', icon: <Package size={14} /> },
            { id: 'orcamento', label: 'Oramentos', icon: <Calculator size={14} /> },
            ...(showProjectsTab ? [{ id: 'projetos', label: 'Projetos', icon: <Briefcase size={14} /> }] : []),
            { id: 'documentos', label: 'Documentos', icon: <FolderOpen size={14} /> },
            { id: 'compartilhamento', label: 'Compartilhamento', icon: <Users size={14} /> }
          ]`;

code = code.replace(tabsTarget, tabsReplacement);

// 3. Filter the grid buttons
const gridTarget = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
                <button onClick={() => setActiveProject('eletrico')}`;

const gridReplacement = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
                {availableProjects.includes('eletrico') && (
                <button onClick={() => setActiveProject('eletrico')}`;

code = code.replace(gridTarget, gridReplacement);

const eletricoEndTarget = `</button>
                
                <button onClick={() => setActiveProject('hidraulico')}`;

const eletricoEndReplacement = `</button>
                )}
                
                {availableProjects.includes('hidraulico') && (
                <button onClick={() => setActiveProject('hidraulico')}`;

code = code.replace(eletricoEndTarget, eletricoEndReplacement);

const hidraEndTarget = `</button>
                
                <button onClick={() => setActiveProject('luminotecnico')}`;

const hidraEndReplacement = `</button>
                )}
                
                {availableProjects.includes('luminotecnico') && (
                <button onClick={() => setActiveProject('luminotecnico')}`;

code = code.replace(hidraEndTarget, hidraEndReplacement);

const lumiEndTarget = `</button>
                
                <button onClick={() => setActiveProject('automacao')}`;

const lumiEndReplacement = `</button>
                )}
                
                {availableProjects.includes('automacao') && (
                <button onClick={() => setActiveProject('automacao')}`;

code = code.replace(lumiEndTarget, lumiEndReplacement);

const autoEndTarget = `</button>
              </div>`;

const autoEndReplacement = `</button>
                )}
              </div>`;

code = code.replace(autoEndTarget, autoEndReplacement);

fs.writeFileSync(path, code, 'utf8');
