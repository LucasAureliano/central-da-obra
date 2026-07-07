import os
import re

app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"

with open(app_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add imports
content = content.replace(
    "import { Dashboard } from './components/Dashboard';",
    "import { Dashboard } from './components/Dashboard';\nimport { Central } from './components/Central';"
)

content = content.replace(
    "Home, HardHat, User, WifiOff,",
    "Home, HardHat, User, WifiOff, Activity,"
)

# Add 'central' and 'painel' to activeTab state type, defaulting to 'central'
content = content.replace(
    "useState<'inicio' | 'obras' |",
    "useState<'central' | 'painel' | 'obras' |"
)
content = content.replace(
    "('inicio');",
    "('central');"
)

# handleFinishOnboarding sets 'central'
content = content.replace(
    "setActiveTab('inicio');",
    "setActiveTab('central');"
)

# renderScreenContent - replace 'inicio' case
inicio_case = """      case 'inicio':
        return (
          <Dashboard 
            profile={currentProfile}
            activeWork={activeWork}
            onNavigate={(tab) => setActiveTab(tab as any)}
            onOpenWorkDetail={() => setActiveTab('obras')}
            onOpenModal={(type) => {
              if (type === 'quick-transaction') setShowQuickTransactionModal(true);
              if (type === 'new-work') setActiveTab('obras');
            }}
          />
        );"""

new_cases = """      case 'central':
        return <Central onNavigate={(tab) => setActiveTab(tab as any)} />;
      case 'painel':
        return (
          <Dashboard 
            profile={currentProfile}
            activeWork={activeWork}
            onNavigate={(tab) => setActiveTab(tab as any)}
            onOpenWorkDetail={() => setActiveTab('obras')}
          />
        );"""

content = content.replace(inicio_case, new_cases)

# Update sidebar
old_sidebar_inicio = """<button onClick={() => { setActiveTab('inicio'); setActiveWorkId('work-1'); }} className={`desktop-nav-item ${activeTab === 'inicio' ? 'desktop-nav-item-active' : ''}`}>
              <Home size={20} /> Início
            </button>"""
new_sidebar_central = """<button onClick={() => { setActiveTab('central'); setActiveWorkId('work-1'); }} className={`desktop-nav-item ${activeTab === 'central' ? 'desktop-nav-item-active' : ''}`}>
              <Home size={20} /> Central
            </button>
            <button onClick={() => { setActiveTab('painel'); setActiveWorkId('work-1'); }} className={`desktop-nav-item ${activeTab === 'painel' ? 'desktop-nav-item-active' : ''}`}>
              <Activity size={20} /> Painel
            </button>"""
content = content.replace(old_sidebar_inicio, new_sidebar_central)

# Update bottom nav
old_bottom_inicio = """<button onClick={() => { setActiveTab('inicio'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'inicio' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Home size={20} /> Início
              </button>"""
new_bottom_central = """<button onClick={() => { setActiveTab('central'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'central' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Home size={20} /> Central
              </button>
              <button onClick={() => { setActiveTab('painel'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'painel' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Activity size={20} /> Painel
              </button>"""
content = content.replace(old_bottom_inicio, new_bottom_central)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated App.tsx")
