import { useState, useEffect } from 'react';
import { 
  Home,
  Sparkles, 
  Briefcase, 
  Menu as MenuIcon,
  X,
  Search,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { DashboardRouter } from './components/DashboardRouter';
import { Works } from './components/Works';
import { WorkDetails } from './components/WorkDetails';
import { CalculatorLibrary } from './components/calculators_library/CalculatorLibrary';
import { SmartAssistant } from './components/assistant/SmartAssistant';
import { Menu } from './components/Menu';
import { CustomLogo } from './components/CustomLogo';
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './components/LandingPage';
import { OnboardingEngine } from './components/onboarding/OnboardingEngine';
import { Contacts } from './components/Contacts';
import { Shopping } from './components/Shopping';
import { Finance } from './components/Finance';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { RoleSelection } from './components/RoleSelection';
import { useAuth } from './contexts/AuthContext';
import { useAuthModal } from './contexts/AuthModalContext';
import { PlaceholderScreen } from './components/PlaceholderScreen';

function App() {
  const { user, profile, loading, isGuest } = useAuth();
  const { showAuthModal, closeAuthModal, openAuthModal } = useAuthModal();
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [menuTitle, setMenuTitle] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [forceOnboarding, setForceOnboarding] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if ((user || isGuest) && showAuthModal) {
      closeAuthModal();
    }
  }, [user, isGuest, showAuthModal, closeAuthModal]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (showSplash || loading) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // PRE-AUTH FLOW
  if (!user && !isGuest) {
    return (
      <>
        <LandingPage 
          theme={theme}
          onLogin={() => {
            setAuthView('login');
            openAuthModal();
          }} 
          onRegister={() => {
            setAuthView('register');
            openAuthModal();
          }} 
        />
        <AnimatePresence>
          {showAuthModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
              zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                style={{ width: '100%', height: '100%', maxWidth: 500, position: 'relative', overflowY: 'auto' }}
              >
                <button 
                  onClick={closeAuthModal}
                  style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
                
                {authView === 'login' 
                  ? <Login onGoToRegister={() => setAuthView('register')} theme={theme} /> 
                  : <Register onGoToLogin={() => setAuthView('login')} theme={theme} />}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // POST-AUTH ONBOARDING FLOW
  if (user && profile) {
    if (!profile.role) {
      return <RoleSelection />;
    }
    
    if (!profile.hasSeenWelcome || forceOnboarding) {
      return (
        <OnboardingEngine 
          role={profile.role} 
          onComplete={() => {
            if (isGuest) {
              sessionStorage.setItem('guestHasSeenWelcome', 'true');
              // Force reload or state update to reflect new sessionStorage
              window.location.reload();
            } else {
              setForceOnboarding(false);
            }
          }} 
        />
      );
    }
  }

  const handleMenuSelect = (title: string) => {
    if (title === 'Assistentes') {
      setActiveTab('library');
      return;
    }
    if (title === 'Contatos') {
      setActiveTab('contatos');
      return;
    }
    if (title === 'Compras') {
      setActiveTab('compras');
      return;
    }
    if (title === 'Financeiro') {
      setActiveTab('financeiro');
      return;
    }
    if (title === 'Meu Perfil') {
      setActiveTab('perfil');
      return;
    }
    setMenuTitle(title);
    setActiveTab('placeholder');
  };

  const renderContent = () => {
    if (activeTab === 'obras' && selectedWorkId) {
      return <WorkDetails key="work-details" workId={selectedWorkId} onBack={() => setSelectedWorkId(null)} />;
    }

    switch(activeTab) {
      case 'inicio': return <DashboardRouter key="inicio" onNavigate={setActiveTab} />;
      case 'obras': return <Works key="obras" onWorkSelect={(id) => setSelectedWorkId(id)} />;
      case 'ferramentas': return <SmartAssistant key="ferramentas" onBack={() => setActiveTab('inicio')} />;
      case 'library': return <CalculatorLibrary key="library" />;
      case 'contatos': return <Contacts key="contatos" />;
      case 'compras': return <Shopping key="compras" />;
      case 'financeiro': return <Finance key="financeiro" />;
      case 'perfil': return <Profile key="perfil" />;
      case 'menu': return <Menu key="menu" theme={theme} onToggleTheme={toggleTheme} onMenuSelect={handleMenuSelect} onReplayOnboarding={() => setForceOnboarding(true)} />;
      case 'placeholder': return <PlaceholderScreen key="placeholder" title={menuTitle} onBack={() => setActiveTab('menu')} />;
      default: return <DashboardRouter key="default" onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      
      {/* Desktop Sidebar Navigation */}
      <aside className="sidebar-nav glass-panel">
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 16 }}>
          <CustomLogo theme={theme} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px' }}>
          <button 
            className={`nav-item-desktop ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => setActiveTab('inicio')}
          >
            <Home size={20} />
            <span>Início</span>
          </button>
          
          <button 
            className={`nav-item-desktop ${activeTab === 'obras' ? 'active' : ''}`}
            onClick={() => setActiveTab('obras')}
          >
            <Briefcase size={20} />
            <span>Obras</span>
          </button>

          <button 
            className={`nav-item-desktop ${activeTab === 'ferramentas' ? 'active' : ''}`}
            onClick={() => setActiveTab('ferramentas')}
          >
            <Sparkles size={20} />
            <span>Assistente</span>
          </button>

          <button 
            className={`nav-item-desktop ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <MenuIcon size={20} />
            <span>Menu</span>
          </button>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: 20, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 16, 
            backgroundColor: user ? 'var(--color-primary)' : 'var(--bg-glass)',
            color: user ? '#FFF' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 14,
            border: '1px solid var(--border-subtle)'
          }}>
            {user && user.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{user ? 'Minha Conta' : 'Visitante'}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user ? user.email : 'Faça login para salvar'}</span>
          </div>
        </div>
      </aside>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
        {/* Global Smart Topbar */}
        <header 
          className="mobile-header glass-panel"
          style={{ display: 'flex', padding: '0 20px', zIndex: 40 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <div className="desktop-hidden">
              <CustomLogo theme={theme} />
            </div>
            
            <div className="mobile-hidden" style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Pesquisar..."
                className="input-premium"
                style={{ height: 44, paddingLeft: 44, borderRadius: 22, fontSize: 14 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn-icon" style={{ width: 40, height: 40, borderRadius: 20 }} onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn-icon" style={{ width: 40, height: 40, borderRadius: 20, position: 'relative' }}>
              <Bell size={18} />
              {!isGuest && <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: 'var(--color-primary)', border: '2px solid var(--bg-base)' }} />}
            </button>
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 18, 
              backgroundColor: user ? 'var(--color-primary)' : 'var(--bg-glass)',
              color: user ? '#FFF' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('menu')}
            >
              {user && user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ minHeight: '100%' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

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
            <Sparkles size={22} />
          </div>
          <span>Assistente</span>
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

      {/* Auth Modal Overlay for Logged-in/Guest inside app */}
      <AnimatePresence>
        {showAuthModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ width: '100%', height: '100%', maxWidth: 500, position: 'relative', overflowY: 'auto' }}
            >
              <button 
                onClick={closeAuthModal}
                style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
              
              {authView === 'login' 
                ? <Login onGoToRegister={() => setAuthView('register')} theme={theme} /> 
                : <Register onGoToLogin={() => setAuthView('login')} theme={theme} />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
