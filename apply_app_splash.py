import os

app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
content = open(app_path, encoding='utf-8').read()

new_content = """import { useState, useEffect } from 'react';
import { 
  Home, 
  Briefcase, 
  Calculator,
  Menu as MenuIcon
} from 'lucide-react';

import { Dashboard } from './components/Dashboard';
import { Works } from './components/Works';
import { Calculators } from './components/Calculators';
import { Menu } from './components/Menu';
import { CustomLogo } from './components/CustomLogo';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [showSplash, setShowSplash] = useState(true);

  // Example handling theme (we stick to dark for now, but user can change it)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'inicio': return <Dashboard onNavigate={setActiveTab} />;
      case 'obras': return <Works onWorkSelect={(id) => console.log('Selected:', id)} />;
      case 'ferramentas': return <Calculators />;
      case 'menu': return <Menu />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <header 
        className="md:hidden flex items-center justify-between px-5 h-16 shrink-0"
        style={{ 
          backgroundColor: 'var(--bg-glass)', 
          borderBottom: '1px solid var(--border-subtle)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <CustomLogo />
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: 16, 
          backgroundColor: 'var(--color-primary)',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 14
        }}>
          JD
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content hide-scrollbar" style={{ paddingTop: 64 }}>
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav glass-panel">
        <button 
          className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`}
          onClick={() => setActiveTab('inicio')}
        >
          <div className="nav-icon-container">
            <Home size={22} />
          </div>
          <span>Início</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'obras' ? 'active' : ''}`}
          onClick={() => setActiveTab('obras')}
        >
          <div className="nav-icon-container">
            <Briefcase size={22} />
          </div>
          <span>Obras</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'ferramentas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ferramentas')}
        >
          <div className="nav-icon-container">
            <Calculator size={22} />
          </div>
          <span>Ferramentas</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <div className="nav-icon-container">
            <MenuIcon size={22} />
          </div>
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
"""
open(app_path, 'w', encoding='utf-8').write(new_content)
print("App updated with SplashScreen")
