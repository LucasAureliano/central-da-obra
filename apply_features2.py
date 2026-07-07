import os
import re

src_dir = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src"
components_dir = os.path.join(src_dir, "components")

# App.tsx updates
app_path = os.path.join(src_dir, "App.tsx")
with open(app_path, "r", encoding="utf-8") as f:
    app_code = f.read()

# 1. Imports
app_code = app_code.replace(
    "import { Profile } from './components/Profile';",
    "import { Profile } from './components/Profile';\nimport { Team } from './components/Team';\nimport { Quotes } from './components/Quotes';\nimport { Agenda } from './components/Agenda';"
)

# 2. State Types
app_code = app_code.replace(
    "const [activeTab, setActiveTab] = useState<'inicio' | 'obras' | 'calculadoras' | 'compras' | 'perfil' | 'relatorios' | 'financeiro'>('inicio');",
    "const [activeTab, setActiveTab] = useState<'inicio' | 'obras' | 'calculadoras' | 'compras' | 'perfil' | 'relatorios' | 'financeiro' | 'team' | 'quotes' | 'agenda'>('inicio');"
)

# 3. Router
router_addition = """      case 'perfil':
        return (
          <Profile 
            currentProfile={currentProfile}
            theme={theme}
            onChangeProfile={setCurrentProfile}
            onChangeTheme={handleThemeChange}
            onResetData={handleResetData}
            onLogout={handleLogout}
          />
        );
      case 'team':
        return <Team />;
      case 'quotes':
        return <Quotes />;
      case 'agenda':
        return <Agenda />;"""

app_code = app_code.replace(
    """      case 'perfil':
        return (
          <Profile 
            currentProfile={currentProfile}
            theme={theme}
            onChangeProfile={setCurrentProfile}
            onChangeTheme={handleThemeChange}
            onResetData={handleResetData}
            onLogout={handleLogout}
          />
        );""",
    router_addition
)

# 4. Navbar replacement
nav_original = """              {/* Bottom Nav Bar */}
              <div className="bottom-nav">
                <button 
                  onClick={() => { setActiveTab('inicio'); setActiveWorkId('work-1'); }} 
                  className={`bottom-nav-item ${activeTab === 'inicio' ? 'bottom-nav-item-active' : ''}`}
                >
                  <Home size={20} />
                  Início
                </button>
                <button 
                  onClick={() => { setActiveTab('obras'); }} 
                  className={`bottom-nav-item ${activeTab === 'obras' ? 'bottom-nav-item-active' : ''}`}
                >
                  <HardHat size={20} />
                  Obras
                </button>
                <button 
                  onClick={() => setActiveTab('calculadoras')} 
                  className={`bottom-nav-item ${activeTab === 'calculadoras' ? 'bottom-nav-item-active' : ''}`}
                >
                  <Calculator size={20} />
                  Cálculos
                </button>
                <button 
                  onClick={() => setActiveTab('compras')} 
                  className={`bottom-nav-item ${activeTab === 'compras' ? 'bottom-nav-item-active' : ''}`}
                >
                  <ShoppingCart size={20} />
                  Compras
                </button>
                <button 
                  onClick={() => setActiveTab('perfil')} 
                  className={`bottom-nav-item ${activeTab === 'perfil' ? 'bottom-nav-item-active' : ''}`}
                >
                  <User size={20} />
                  Perfil
                </button>
              </div>"""

nav_new = """              {/* Bottom Nav Bar - Scrollable para caber tudo */}
              <div className="bottom-nav" style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '0 8px', justifyContent: 'flex-start', WebkitOverflowScrolling: 'touch' }}>
                <button onClick={() => { setActiveTab('inicio'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'inicio' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                  <Home size={20} /> Início
                </button>
                <button onClick={() => { setActiveTab('obras'); }} className={`bottom-nav-item ${activeTab === 'obras' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                  <HardHat size={20} /> Obras
                </button>
                <button onClick={() => setActiveTab('team')} className={`bottom-nav-item ${activeTab === 'team' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                  <User size={20} /> Equipe
                </button>
                <button onClick={() => setActiveTab('quotes')} className={`bottom-nav-item ${activeTab === 'quotes' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                  <FileText size={20} /> Orçamentos
                </button>
                <button onClick={() => setActiveTab('agenda')} className={`bottom-nav-item ${activeTab === 'agenda' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                  <Calendar size={20} /> Agenda
                </button>
                <button onClick={() => setActiveTab('perfil')} className={`bottom-nav-item ${activeTab === 'perfil' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                  <User size={20} /> Perfil
                </button>
              </div>"""

app_code = app_code.replace(nav_original, nav_new)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(app_code)


# Works.tsx updates
works_path = os.path.join(components_dir, "Works.tsx")
with open(works_path, "r", encoding="utf-8") as f:
    works_code = f.read()

# 1. State tabs
works_code = works_code.replace(
    "const [activeTab, setActiveTab] = useState<'resumo' | 'compras' | 'financeiro' | 'diario'>('resumo');",
    "const [activeTab, setActiveTab] = useState<'resumo' | 'gantt' | 'checklist' | 'clima' | 'diario'>('resumo');\n  const [checklists, setChecklists] = useState<{[key: string]: boolean}>({'escavacao': true, 'compactacao': false});"
)

# 2. Buttons
buttons_original = """            {(['resumo', 'compras', 'financeiro', 'diario'] as const).map(tab => ("""
buttons_new = """            {(['resumo', 'gantt', 'checklist', 'clima', 'diario'] as const).map(tab => ("""
works_code = works_code.replace(buttons_original, buttons_new)

# 3. Add content for Gantt, Checklist, Weather right before diario
diario_code = "{/* TAB 4: DIÁRIO */}"
new_tabs_code = """
            {/* NOVO: GANTT */}
            {activeTab === 'gantt' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h3 className="text-sm font-bold text-primary">Cronograma Visual (Gantt)</h3>
                <div className="card-premium">
                  {[{name: 'Fundação', p: 100}, {name: 'Alvenaria', p: 65}, {name: 'Cobertura', p: 20}].map((s,i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div className="flex-space-between text-xs" style={{ marginBottom: 4 }}>
                        <span className="font-bold">{s.name}</span>
                        <span style={{ color: 'var(--color-primary)' }}>{s.p}%</span>
                      </div>
                      <div style={{ width: '100%', height: 8, backgroundColor: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${s.p}%`, height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOVO: CHECKLIST */}
            {activeTab === 'checklist' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="flex-space-between">
                  <h3 className="text-sm font-bold text-primary">Checklist de Execução</h3>
                  <span className="badge badge-orange">1/5 Concluído</span>
                </div>
                
                <div className="card-premium" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-light)', fontWeight: 'bold', fontSize: 12, color: 'var(--color-primary)' }}>
                    1. Fundação
                  </div>
                  <div className="flex-space-between" style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                      <input type="checkbox" checked={checklists.escavacao} onChange={() => setChecklists({...checklists, escavacao: !checklists.escavacao})} />
                      <span style={{ textDecoration: checklists.escavacao ? 'line-through' : 'none', color: checklists.escavacao ? 'var(--text-muted)' : 'var(--text-main)' }}>Escavação</span>
                    </label>
                  </div>
                  <div className="flex-space-between" style={{ padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                      <input type="checkbox" checked={checklists.compactacao} onChange={() => setChecklists({...checklists, compactacao: !checklists.compactacao})} />
                      <span style={{ textDecoration: checklists.compactacao ? 'line-through' : 'none', color: checklists.compactacao ? 'var(--text-muted)' : 'var(--text-main)' }}>Compactação</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* NOVO: CLIMA E DOCS */}
            {activeTab === 'clima' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="card-premium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6' }}>
                  <h3 className="text-sm font-bold text-blue-500 mb-2">Clima Local</h3>
                  <div className="flex-space-between">
                    <div>
                      <div className="text-3xl font-black text-blue-600">28°C</div>
                      <div className="text-xs text-blue-500">Ensolarado • 10% chuva</div>
                    </div>
                  </div>
                </div>
                
                <div className="card-premium">
                  <h3 className="text-sm font-bold mb-2">Documentos da Obra</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="flex-space-between text-xs" style={{ padding: 8, backgroundColor: 'var(--bg-surface-hover)', borderRadius: 4 }}>
                      <span>Projeto_Arquitetonico.pdf</span>
                    </div>
                    <div className="flex-space-between text-xs" style={{ padding: 8, backgroundColor: 'var(--bg-surface-hover)', borderRadius: 4 }}>
                      <span>ART_Engenheiro.pdf</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DIÁRIO */}
"""
works_code = works_code.replace(diario_code, new_tabs_code)

with open(works_path, "w", encoding="utf-8") as f:
    f.write(works_code)
