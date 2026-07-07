import os

path = r'C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we add Activity to the imports again
content = content.replace(
    "Home, HardHat, User, WifiOff, \n  RefreshCw",
    "Home, HardHat, User, WifiOff, Activity,\n  RefreshCw"
)

# Desktop Sidebar
old_desktop = """            <button onClick={() => { setActiveTab('central'); setActiveWorkId('work-1'); }} className={`desktop-nav-item ${activeTab === 'central' ? 'desktop-nav-item-active' : ''}`}>
              <Home size={20} /> Início
            </button>"""
new_desktop = """            <button onClick={() => { setActiveTab('central'); setActiveWorkId('work-1'); }} className={`desktop-nav-item ${activeTab === 'central' ? 'desktop-nav-item-active' : ''}`}>
              <Home size={20} /> Central
            </button>
            <button onClick={() => { setActiveTab('painel'); setActiveWorkId('work-1'); }} className={`desktop-nav-item ${activeTab === 'painel' ? 'desktop-nav-item-active' : ''}`}>
              <Activity size={20} /> Painel
            </button>"""
content = content.replace(old_desktop, new_desktop)

# Bottom Nav
old_bottom = """              <button onClick={() => { setActiveTab('central'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'central' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Home size={20} /> Início
              </button>"""
new_bottom = """              <button onClick={() => { setActiveTab('central'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'central' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Home size={20} /> Central
              </button>
              <button onClick={() => { setActiveTab('painel'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'painel' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Activity size={20} /> Painel
              </button>"""
content = content.replace(old_bottom, new_bottom)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("App.tsx fixed.")
