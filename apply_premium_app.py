import os

path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"

new_content = """import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calculator, 
  Wallet, 
  ShoppingCart,
  Menu as MenuIcon,
  Bell,
  Home,
  Tool
} from 'lucide-react';

import { CustomLogo } from './components/CustomLogo';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Works } from './components/Works';
import { Calculators } from './components/Calculators';
import { Menu } from './components/Menu';

// Types
import { CategoryType, CalculatorType } from './types/database';

export type TabType = 'inicio' | 'obras' | 'ferramentas' | 'menu';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('co_theme') as 'light' | 'dark') || 'dark';
  });

  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  
  // Specific states for components
  const [activeWorkId, setActiveWorkId] = useState<string | null>(null);
  const [activeCalcId, setActiveCalcId] = useState<string | null>(null);

  // Example empty states logic (mock)
  const tempEmptyStates = false;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('co_theme', theme);
  }, [theme]);

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  const renderScreenContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <Dashboard 
            onNavigate={(tab) => setActiveTab(tab as TabType)}
          />
        );
      case 'obras':
        return (
          <Works 
            activeWorkId={activeWorkId}
            onWorkSelect={setActiveWorkId}
          />
        );
      case 'ferramentas':
        return (
          <Calculators 
            activeCalculator={activeCalcId as any}
            onCalculatorSelect={setActiveCalcId as any}
          />
        );
      case 'menu':
        return (
          <Menu 
            onNavigate={(tab) => setActiveTab(tab as TabType)}
            theme={theme}
            onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
        );
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab as TabType)} />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <header 
        className="md:hidden flex items-center justify-between px-5 h-16 shrink-0"
        style={{ backgroundColor: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <CustomLogo />
        </div>
        <button className="btn-icon" style={{ width: 40, height: 40, borderRadius: 12 }}>
          <Bell size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="main-content hide-scrollbar">
        {renderScreenContent()}
      </main>

      {/* NEW Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`}
          onClick={() => setActiveTab('inicio')}
        >
          <div className="nav-icon-container">
            <Home size={24} strokeWidth={activeTab === 'inicio' ? 2.5 : 2} />
          </div>
          <span>Início</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'obras' ? 'active' : ''}`}
          onClick={() => setActiveTab('obras')}
        >
          <div className="nav-icon-container">
            <Building2 size={24} strokeWidth={activeTab === 'obras' ? 2.5 : 2} />
          </div>
          <span>Obras</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'ferramentas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ferramentas')}
        >
          <div className="nav-icon-container">
            <Tool size={24} strokeWidth={activeTab === 'ferramentas' ? 2.5 : 2} />
          </div>
          <span>Cálculos</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <div className="nav-icon-container">
            <MenuIcon size={24} strokeWidth={activeTab === 'menu' ? 2.5 : 2} />
          </div>
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)
print("App.tsx Updated")
