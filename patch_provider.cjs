const fs = require('fs');
let content = fs.readFileSync('src/components/provider/ProviderWorkDashboard.tsx', 'utf8');

// 1. Add Icons
if (!content.includes('Briefcase')) {
  content = content.replace(
    `import { ArrowLeft, Clock, MapPin, Building2, LayoutDashboard, CalendarDays, Wallet, Truck, FileText, Image as ImageIcon, Users }`,
    `import { ArrowLeft, Clock, MapPin, Building2, LayoutDashboard, CalendarDays, Wallet, Truck, FileText, Image as ImageIcon, Users, Briefcase, Lightbulb, Wrench, Hammer }`
  );
}

// 2. Add Project Components
if (!content.includes('ElectricalDesignStudio')) {
  content = `import { ElectricalDesignStudio } from '../architect/ElectricalDesignStudio';
import { PlumbingDesignStudio } from '../architect/PlumbingDesignStudio';
import { LightingDesignEngine } from '../architect/LightingDesignEngine';
import { AutomationDesignStudio } from '../architect/AutomationDesignStudio';
import { WoodworkingDesignStudio } from '../architect/WoodworkingDesignStudio';\n` + content;
}

// 3. Add activeProject state
content = content.replace(
  `const [activeTab, setActiveTab] = useState('resumo');`,
  `const [activeTab, setActiveTab] = useState('resumo');\n  const [activeProject, setActiveProject] = useState<string | null>(null);`
);

// 4. Add Tab
content = content.replace(
  `{ id: 'anotacoes', label: 'Anotações', icon: <FileText size={14} /> },`,
  `{ id: 'projetos', label: 'Projetos', icon: <Briefcase size={14} /> },\n            { id: 'anotacoes', label: 'Anotações', icon: <FileText size={14} /> },`
);

// 5. Build Projects Tab based on specialty
const projectsContent = `
            {activeTab === 'projetos' && (
              <motion.div key="projetos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {!activeProject ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
                    {(!profile?.specialty || ['Eletricista', 'Empreiteiro Geral', 'Mestre de Obras', 'Construção Residencial'].includes(profile?.specialty)) && (
                      <>
                        <button onClick={() => setActiveProject('eletrico')} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                          <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
                            <Lightbulb size={24} color="#EAB308" />
                          </div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)', textAlign: 'center' }}>Projeto Elétrico</h3>
                        </button>
                        <button onClick={() => setActiveProject('luminotecnico')} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                          <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                            <Lightbulb size={24} color="#F59E0B" />
                          </div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)', textAlign: 'center' }}>Luminotécnico</h3>
                        </button>
                        <button onClick={() => setActiveProject('automacao')} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                          <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                            <Wrench size={24} color="#10B981" />
                          </div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)', textAlign: 'center' }}>Automação</h3>
                        </button>
                      </>
                    )}
                    
                    {(!profile?.specialty || ['Encanador', 'Empreiteiro Geral', 'Mestre de Obras', 'Construção Residencial'].includes(profile?.specialty)) && (
                      <button onClick={() => setActiveProject('hidraulico')} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                        <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(14, 165, 233, 0.1)' }}>
                          <Briefcase size={24} color="#0EA5E9" />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)', textAlign: 'center' }}>Projeto Hidráulico</h3>
                      </button>
                    )}

                    {(!profile?.specialty || ['Marceneiro', 'Carpinteiro', 'Empreiteiro Geral', 'Mestre de Obras', 'Construção Residencial'].includes(profile?.specialty)) && (
                      <button onClick={() => setActiveProject('marcenaria')} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                        <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                          <Hammer size={24} color="#8B5CF6" />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)', textAlign: 'center' }}>Marcenaria</h3>
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ position: 'relative', marginTop: -20, marginLeft: -20, marginRight: -20 }}>
                    {activeProject === 'eletrico' && <ElectricalDesignStudio onBack={() => setActiveProject(null)} />}
                    {activeProject === 'hidraulico' && <PlumbingDesignStudio onBack={() => setActiveProject(null)} />}
                    {activeProject === 'luminotecnico' && <LightingDesignEngine onBack={() => setActiveProject(null)} />}
                    {activeProject === 'automacao' && <AutomationDesignStudio onBack={() => setActiveProject(null)} />}
                    {activeProject === 'marcenaria' && <WoodworkingDesignStudio onBack={() => setActiveProject(null)} />}
                  </div>
                )}
              </motion.div>
            )}
`;

content = content.replace(
  `{activeTab === 'anotacoes' && (`,
  projectsContent + `\n            {activeTab === 'anotacoes' && (`
);

fs.writeFileSync('src/components/provider/ProviderWorkDashboard.tsx', content, 'utf8');
