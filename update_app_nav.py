import os

path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { Biblioteca } from './components/Biblioteca';",
    "import { Biblioteca } from './components/Biblioteca';\nimport { MenuMore } from './components/MenuMore';"
)

content = content.replace(
    "import { \n  Home, HardHat, User, WifiOff, Activity,\n  RefreshCw, Database, Sparkles, FileText, Calendar, Calculator, BookOpen \n} from 'lucide-react';",
    "import { \n  Home, HardHat, User, WifiOff, Activity, Menu,\n  RefreshCw, Database, Sparkles, FileText, Calendar, Calculator, BookOpen \n} from 'lucide-react';"
)

# 2. Add 'mais' to tab types (we won't mess with TS type of activeTab if it's broad, but let's check)
# Actually activeTab is `const [activeTab, setActiveTab] = useState('central');` so it's string.

# 3. Add to renderScreenContent
content = content.replace(
    "case 'obras':\n        return <Works onNavigate={(tab, params) => {",
    "case 'mais':\n        return <MenuMore onNavigate={setActiveTab as any} />;\n      case 'obras':\n        return <Works onNavigate={(tab, params) => {"
)

# 4. Replace bottom-nav entirely
old_bottom_nav = """            {/* Bottom Nav Bar - Mobile Only */}
            <div className="bottom-nav hide-scrollbar" style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '0 8px', justifyContent: 'flex-start', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
              <button onClick={() => { setActiveTab('central'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'central' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Home size={20} /> Central
              </button>
              <button onClick={() => { setActiveTab('painel'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'painel' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Activity size={20} /> Painel
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
              <button onClick={() => setActiveTab('calculadoras')} className={`bottom-nav-item ${activeTab === 'calculadoras' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Calculator size={20} /> Calc.
              </button>
              <button onClick={() => setActiveTab('biblioteca')} className={`bottom-nav-item ${activeTab === 'biblioteca' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <BookOpen size={20} /> Biblio.
              </button>
              <button onClick={() => setActiveTab('perfil')} className={`bottom-nav-item ${activeTab === 'perfil' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <User size={20} /> Perfil
              </button>
            </div>"""

new_bottom_nav = """            {/* Bottom Nav Bar - Mobile Only (Premium 5 Tabs) */}
            <div className="bottom-nav">
              <button onClick={() => setActiveTab('central')} className={`bottom-nav-item ${activeTab === 'central' ? 'bottom-nav-item-active' : ''}`}>
                <Home size={22} />
                <span>Central</span>
              </button>
              <button onClick={() => setActiveTab('obras')} className={`bottom-nav-item ${activeTab === 'obras' ? 'bottom-nav-item-active' : ''}`}>
                <HardHat size={22} />
                <span>Obras</span>
              </button>
              
              {/* Highlighted Center Button (Calculadoras) */}
              <div className="bottom-nav-center-wrapper">
                <button onClick={() => setActiveTab('calculadoras')} className="bottom-nav-center-btn shadow-premium">
                  <Calculator size={24} color="#ffffff" />
                </button>
                <span className="bottom-nav-center-label">Calc</span>
              </div>

              <button onClick={() => setActiveTab('quotes')} className={`bottom-nav-item ${activeTab === 'quotes' ? 'bottom-nav-item-active' : ''}`}>
                <FileText size={22} />
                <span>Finanças</span>
              </button>
              <button onClick={() => setActiveTab('mais')} className={`bottom-nav-item ${activeTab === 'mais' ? 'bottom-nav-item-active' : ''}`}>
                <Menu size={22} />
                <span>Mais</span>
              </button>
            </div>"""

content = content.replace(old_bottom_nav, new_bottom_nav)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("App.tsx bottom nav updated.")
