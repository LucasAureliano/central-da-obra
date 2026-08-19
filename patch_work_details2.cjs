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
      return []; 
    }
    return ['eletrico', 'hidraulico', 'luminotecnico', 'automacao'];
  };

  const availableProjects = getAvailableProjects();
  const showProjectsTab = availableProjects.length > 0;
`;

if(!code.includes('getAvailableProjects')) {
  code = code.replace(logicTarget, logicReplacement);
}

// 2. Filter tabs
const tabRegex = /\{\s*id:\s*'projetos',\s*label:\s*'Projetos',\s*icon:\s*<Briefcase size=\{14\}\s*\/>\s*\}/;
code = code.replace(tabRegex, `...(showProjectsTab ? [{ id: 'projetos', label: 'Projetos', icon: <Briefcase size={14} /> }] : [])`);

// 3. Filter the grid buttons
code = code.replace(
  /<button onClick=\{\(\) => setActiveProject\('eletrico'\)\}/,
  `{availableProjects.includes('eletrico') && (\n<button onClick={() => setActiveProject('eletrico')}`
);
code = code.replace(
  /<\/button>\s*<button onClick=\{\(\) => setActiveProject\('hidraulico'\)\}/,
  `</button>\n)}\n{availableProjects.includes('hidraulico') && (\n<button onClick={() => setActiveProject('hidraulico')}`
);
code = code.replace(
  /<\/button>\s*<button onClick=\{\(\) => setActiveProject\('luminotecnico'\)\}/,
  `</button>\n)}\n{availableProjects.includes('luminotecnico') && (\n<button onClick={() => setActiveProject('luminotecnico')}`
);
code = code.replace(
  /<\/button>\s*<button onClick=\{\(\) => setActiveProject\('automacao'\)\}/,
  `</button>\n)}\n{availableProjects.includes('automacao') && (\n<button onClick={() => setActiveProject('automacao')}`
);
code = code.replace(
  /<h3 style=\{\{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var\(--text-main\)' \}\}>Automa.*?<\/h3>\s*<\/button>\s*<\/div>/,
  (match) => match.replace(/<\/button>\s*<\/div>/, `</button>\n)}\n</div>`)
);

fs.writeFileSync(path, code, 'utf8');
