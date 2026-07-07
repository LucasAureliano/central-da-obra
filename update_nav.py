import os

app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"

with open(app_path, "r", encoding="utf-8") as f:
    app_ts = f.read()

# 1. Add Library Import and Icon
app_ts = app_ts.replace("import { Calculators } from './components/Calculators';", "import { Calculators } from './components/Calculators';\nimport { Library } from './components/Library';")
app_ts = app_ts.replace("FileText, Calendar", "FileText, Calendar, Calculator, BookOpen")

# 2. Add 'biblioteca' to activeTab state
app_ts = app_ts.replace("'inicio' | 'obras' | 'calculadoras' | 'compras' | 'perfil' | 'relatorios' | 'financeiro' | 'team' | 'quotes' | 'agenda'", "'inicio' | 'obras' | 'calculadoras' | 'compras' | 'perfil' | 'relatorios' | 'financeiro' | 'team' | 'quotes' | 'agenda' | 'biblioteca'")

# 3. Add router case for biblioteca
router_library = """      case 'biblioteca':
        return <Library />;
"""
app_ts = app_ts.replace("case 'agenda':\n        return <Agenda />;", "case 'agenda':\n        return <Agenda />;\n" + router_library)


# 4. Inject into desktop-sidebar
# Find the end of the sidebar buttons before 'perfil'
sidebar_addition = """            <button onClick={() => setActiveTab('calculadoras')} className={`desktop-nav-item ${activeTab === 'calculadoras' ? 'desktop-nav-item-active' : ''}`}>
              <Calculator size={20} /> Calculadoras
            </button>
            <button onClick={() => setActiveTab('biblioteca')} className={`desktop-nav-item ${activeTab === 'biblioteca' ? 'desktop-nav-item-active' : ''}`}>
              <BookOpen size={20} /> Biblioteca
            </button>
          </div>
          
          <div style={{ marginTop: 'auto' }}>"""

app_ts = app_ts.replace("          </div>\n          \n          <div style={{ marginTop: 'auto' }}>", sidebar_addition)
if "Calculator size={20}" not in app_ts:
    app_ts = app_ts.replace("          </div>\r\n          \r\n          <div style={{ marginTop: 'auto' }}>", sidebar_addition)


# 5. Inject into bottom-nav
bottom_nav_addition = """              <button onClick={() => setActiveTab('calculadoras')} className={`bottom-nav-item ${activeTab === 'calculadoras' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Calculator size={20} /> Calc.
              </button>
              <button onClick={() => setActiveTab('biblioteca')} className={`bottom-nav-item ${activeTab === 'biblioteca' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <BookOpen size={20} /> Biblio.
              </button>
              <button onClick={() => setActiveTab('perfil')}"""

app_ts = app_ts.replace("              <button onClick={() => setActiveTab('perfil')}", bottom_nav_addition)


with open(app_path, "w", encoding="utf-8") as f:
    f.write(app_ts)

print("App.tsx updated for Calculators and Library.")
