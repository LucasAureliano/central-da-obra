import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardRouter } from './components/DashboardRouter';
import { Works } from './components/Works';
import { WorkDetails } from './components/WorkDetails';
import { CalculatorLibrary } from './components/calculators_library/CalculatorLibrary';
import { TechnicalCentral } from './components/library/TechnicalCentral';
import { InsightsCentral } from './components/insights/InsightsCentral';
import { Menu as MenuIcon, Home, Briefcase, LogIn, X, Sparkles, Calendar, Calculator } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './components/LandingPage';
import { ProviderWorkDashboard } from './components/provider/ProviderWorkDashboard';
import { OnboardingEngine } from './components/onboarding/OnboardingEngine';
import { Shopping } from './components/Shopping';
import { Finance } from './components/Finance';
import { Menu } from './components/Menu';
import { CustomLogo } from './components/CustomLogo';
import { CalculatorsWizard } from './components/calculators_library/CalculatorsWizard';
import { Profile } from './components/Profile';
import { Reports } from './components/Reports';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { RoleSelection } from './components/RoleSelection';
import { useAuth } from './contexts/AuthContext';
import { useAuthModal } from './contexts/AuthModalContext';
import { useWorks } from './contexts/WorksContext';
import { WeatherProvider } from './contexts/WeatherContext';
import { ConstructionIndexesProvider } from './contexts/ConstructionIndexesContext';
import { MapsProvider } from './contexts/MapsContext';
import { AssistantProvider } from './contexts/AssistantContext';
import { PortalProvider } from './contexts/PortalContext';
import { PlaceholderScreen } from './components/PlaceholderScreen';
import { SharedWorkView } from './components/SharedWorkView';
import { CustomToaster } from './components/ui/Toast';
import { GlobalHeader } from './components/ui/GlobalHeader';
import { CommercialQuotes } from './components/provider/CommercialQuotes';
import { ClientsManager } from './components/provider/ClientsManager';
import { ServicesCatalog } from './components/provider/ServicesCatalog';
import { ServicesManager } from './components/provider/ServicesManager';
import { ReceiptsManager } from './components/provider/ReceiptsManager';
import { ProfessionalFinance } from './components/provider/ProfessionalFinance';
import { AppSettings } from './components/AppSettings';
import { ArchitecturalTrends } from './components/owner/ArchitecturalTrends';
import { InteractiveSchedule } from './components/owner/InteractiveSchedule';
import { TeamManagement } from './components/TeamManagement';
import { Agenda } from './components/Agenda';
import { ProjectControl } from './components/architect/ProjectControl';
import { TechnicalJournal } from './components/architect/TechnicalJournal';
import { Inspections } from './components/architect/Inspections';
import { Documents } from './components/architect/Documents';
import { Schedule } from './components/architect/Schedule';
import { LightingDesignEngine } from './components/architect/LightingDesignEngine';
import { SiteVisitsManager } from './components/architect/SiteVisitsManager';
import { ProjectCoordination } from './components/architect/ProjectCoordination';
import { ExecutiveTimeline } from './components/builder/ExecutiveTimeline';
import { EquipmentControl } from './components/builder/EquipmentControl';
import { OperationsHR } from './components/builder/OperationsHR';
import { QuoteWizard } from './components/provider/QuoteWizard';
import { SmartAssistant } from './components/assistant/SmartAssistant';
import { OwnerWorkDetails } from './components/owner/OwnerWorkDetails';
import { MarketingCenter } from './components/provider/MarketingCenter';
import { ReviewPublicPage } from './components/provider/ReviewPublicPage';

function App() {
  const { user, profile, loading, isGuest } = useAuth();
  const { showAuthModal, closeAuthModal, openAuthModal, showGuestAlert, closeGuestAlert } = useAuthModal();
  const { works, activeWork } = useWorks(); // Now we have access!
  const [activeTab, setActiveTab] = useState('inicio');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeWizardQuery, setActiveWizardQuery] = useState<string | null>(null);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [initialWorkTab, setInitialWorkTab] = useState<string | undefined>(undefined);
  const [menuTitle, setMenuTitle] = useState('');
  const [hasShownAppSplash, setHasShownAppSplash] = useState(() => {
    return sessionStorage.getItem('hasShownAppSplash') === 'true';
  });
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [forceOnboarding, setForceOnboarding] = useState(false);
  const rawRole = profile?.role || localStorage.getItem('pendingRole');
  const activeRole = ['service', 'architect', 'engineer', 'builder'].includes(rawRole as string) ? rawRole : 'owner';

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  const urlParams = new URLSearchParams(window.location.search);
  const sharedWorkId = urlParams.get('shared');
  const isPreview = urlParams.get('preview');

  // Handle hash routes
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (hash.startsWith('#/avaliar/')) {
    const providerId = hash.split('#/avaliar/')[1];
    if (providerId) {
      return <ReviewPublicPage providerId={providerId} />;
    }
  }

  if (sharedWorkId) {
    return <SharedWorkView token={sharedWorkId} theme={theme} />;
  }

  if (isPreview === 'true') {
    return <DashboardRouter onNavigate={() => {}} />;
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user && !isGuest && showAuthModal) {
      closeAuthModal();
    }
  }, [user, isGuest, showAuthModal, closeAuthModal]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    // Show a plain background while Firebase restores session
    return <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }} />;
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

  // APP ENTRANCE SPLASH SCREEN
  if (!hasShownAppSplash) {
    return <SplashScreen onComplete={() => {
      sessionStorage.setItem('hasShownAppSplash', 'true');
      setHasShownAppSplash(true);
    }} />;
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
    if (title === 'Minhas Obras' || title === 'Obras') {
      setActiveTab('obras');
      return;
    }
    if (title === 'Nova Obra') {
      setActiveTab('obras');
      return;
    }
    if (title === 'Assistente' || title === 'Assistente Inteligente') {
      setActiveTab('assistente');
      return;
    }
    if (title === 'Compartilhamentos') {
      const currentWork = activeWork || (works.length > 0 ? works[0] : null);
      if (currentWork) {
        setSelectedWorkId(currentWork.id);
        setInitialWorkTab('compartilhamento');
        setActiveTab('obras');
      } else {
        setActiveTab('obras');
      }
      return;
    }
    if (title === 'Cálculos' || title === 'Central de Cálculos' || title === 'Calculadoras' || title === 'Calculadoras Técnicas') {
      setActiveTab('calculos');
      return;
    }
    if (title === 'Relatórios' || title === 'Relatórios Técnicos PDF' || title === 'Relatórios Executivos PDF') {
      setActiveTab('relatorios');
      return;
    }
    if (title === 'Materiais' || title === 'Lista de Materiais') {
      setActiveTab('compras');
      return;
    }
    if (title === 'Centro de Compras') {
      setActiveTab('centro-compras');
      return;
    }
    if (title === 'Financeiro') {
      setActiveTab('financeiro');
      return;
    }
    if (title === 'Financeiro Corporativo') {
      setActiveTab('financeiro-corporativo');
      return;
    }
    if (title === 'Financeiro Profissional') {
      setActiveTab('financeiro-profissional');
      return;
    }
    if (title === 'Biblioteca & Normas' || title === 'Biblioteca Técnica' || title === 'Biblioteca & Normas NBR' || title === 'Índices da Construção') {
      setActiveTab('central-tecnica');
      return;
    }

    if (title === 'Tendências') {
      setActiveTab('tendencias');
      return;
    }
    if (title === 'nova-despesa') {
      setActiveTab('nova-despesa');
      return;
    }
    if (title === 'Projeto Luminotécnico') {
      setActiveTab('projeto-luminotecnico');
      return;
    }
    if (title === 'Controle de Projetos') {
      setActiveTab('controle-projetos');
      return;
    }
    if (title === 'Fornecedores') {
      setActiveTab('fornecedores');
      return;
    }
    if (title === 'Indicadores BI') {
      setActiveTab('indicadores-bi');
      return;
    }
    if (title === 'Meu Perfil' || title === 'Perfil Profissional' || title === 'Perfil Profissional (CREA/CAU)' || title === 'Dados da Empresa') {
      setActiveTab('perfil');
      return;
    }
    if (title === 'Clientes' || title === 'Meus Clientes' || title === 'Clientes & Links') {
      setActiveTab('clientes');
      return;
    }
    if (title === 'Orçamentos' || title === 'Cotações de Prestadores' || title === 'Orcamentos') {
      setActiveTab('orcamentos');
      return;
    }
    if (title === 'Agenda' || title === 'Agenda de Serviços' || title === 'Agenda Técnica') {
      setActiveTab('agenda-completa');
      return;
    }
    if (title === 'Diário Técnico' || title === 'Diário Técnico de Obra') {
      setActiveTab('diario-tecnico');
      return;
    }
    if (title === 'Vistorias' || title === 'Vistorias Técnicas') {
      setActiveTab('vistorias');
      return;
    }
    if (title === 'Documentos Técnicos') {
      setActiveTab('documentos-tecnicos');
      return;
    }
    if (title === 'Cronograma e Medições') {
      setActiveTab('cronograma-medicoes');
      return;
    }
    if (title === 'Pendências Técnicas') {
      setActiveTab('pendencias-tecnicas');
      return;
    }
    if (title === 'Centro de Operações') {
      setActiveTab('centro-operacoes');
      return;
    }
    if (title === 'Cronograma') {
      setActiveTab('cronograma-geral');
      return;
    }
    if (title === 'Equipamentos' || title === 'Equipamentos & Patrimônio') {
      setActiveTab('equipamentos');
      return;
    }
    if (title === 'Produtividade & RH' || title === 'Equipes & Mão de Obra') {
      setActiveTab('rh-produtividade');
      return;
    }
    if (title === 'Novo Orçamento') {
      setActiveTab('novo-orcamento');
      return;
    }
    if (title === 'Recebimentos') {
      setActiveTab('recebimentos');
      return;
    }
    if (title === 'Meu Catálogo' || title === 'Catálogo de Serviços') {
      setActiveTab('meus-servicos');
      return;
    }
    if (title === 'Equipe') {
      setActiveTab('equipe');
      return;
    }
    if (title === 'Ajustes do App') {
      setActiveTab('ajustes');
      return;
    }
    setMenuTitle(title);
    setActiveTab('placeholder');
  };

  const handleNavigate = (tab: string, param?: string) => {
    setActiveTab(tab);
    if (tab === 'central-tecnica' && param) {
      setActiveArticleId(param);
    } else {
      setActiveArticleId(null);
    }
    
    if (tab === 'calculos' && param) {
      setActiveWizardQuery(param);
    } else {
      setActiveWizardQuery(null);
    }
  };

  const renderContent = () => {
    if (activeTab === 'obras' && selectedWorkId) {
      // Service gets dedicated work details
      if (profile?.role === 'service') {
        return <ProviderWorkDashboard key="provider-work-details" workId={selectedWorkId} onBack={() => { setSelectedWorkId(null); setInitialWorkTab(undefined); }} />;
      }
      // Owner gets dedicated work details
      if (profile?.role === 'owner' || (!profile?.role && isGuest)) {
        return <OwnerWorkDetails key="owner-work-details" workId={selectedWorkId} initialTab={initialWorkTab as any} onBack={() => { setSelectedWorkId(null); setInitialWorkTab(undefined); }} />;
      }
      return <WorkDetails key="work-details" workId={selectedWorkId} onBack={() => { setSelectedWorkId(null); setInitialWorkTab(undefined); }} />;
    }

    switch(activeTab) {
      case 'inicio': return <DashboardRouter key="inicio" onNavigate={handleNavigate} />;
      case 'obras': return <Works key="obras" onWorkSelect={(id) => setSelectedWorkId(id)} />;
      case 'assistente': return <SmartAssistant key="assistente" onNavigate={handleNavigate} />;
      case 'ferramentas': return <CalculatorsWizard key="ferramentas" onNavigate={handleNavigate} initialQuery={activeWizardQuery || undefined} />;
      case 'calculos': return <CalculatorsWizard key="calculos" onNavigate={handleNavigate} initialQuery={activeWizardQuery || undefined} />;
      case 'library': return <CalculatorLibrary key="library" onNavigate={handleNavigate} />;
      case 'insights': return <InsightsCentral key="insights" onBack={() => handleNavigate('inicio')} onNavigate={handleNavigate} />;
      case 'central-tecnica': return <TechnicalCentral key="central" onNavigate={handleNavigate} initialArticleId={activeArticleId || undefined} />;
      case 'relatorios': return <Reports key="relatorios" />;
      case 'compras': return <Shopping key="compras" />;
      case 'orcamentos': return activeRole === 'service' ? <CommercialQuotes key="orcamentos" /> : <PlaceholderScreen key="orcamentos" title="Orçamentos" onBack={() => handleNavigate('inicio')} />;
      case 'clientes': return <ClientsManager key="clientes" />;
      case 'agenda-completa': return <Agenda key="agenda" />;
      case 'controle-projetos': return <ProjectControl key="projetos" />;
      case 'tendencias': return <ArchitecturalTrends key="tendencias" onBack={() => handleNavigate('inicio')} />;
      case 'projeto-luminotecnico': return <LightingDesignEngine key="luminotecnico" onBack={() => handleNavigate('inicio')} />;
      case 'acompanhamento-obras': return <SiteVisitsManager key="acompanhamento" onBack={() => handleNavigate('inicio')} />;
      case 'compatibilizacao': return <ProjectCoordination key="compatibilizacao" onBack={() => handleNavigate('inicio')} />;
      case 'diario-tecnico': return <TechnicalJournal key="diario-tecnico" />;
      case 'vistorias': return <Inspections key="vistorias" />;
      case 'documentos-tecnicos': return <Documents key="documentos-tecnicos" />;
      case 'cronograma-medicoes': return activeRole === 'owner' ? <InteractiveSchedule key="cronograma-owner" onBack={() => handleNavigate('inicio')} /> : <Schedule key="cronograma-medicoes" />;
      case 'cronograma-geral': return activeRole === 'owner' ? <InteractiveSchedule key="cronograma-geral" onBack={() => handleNavigate('inicio')} /> : <ExecutiveTimeline key="cronograma" />;
      case 'cronograma': return <InteractiveSchedule key="cronograma-interactive" onBack={() => handleNavigate('inicio')} />;
      case 'equipamentos': return <EquipmentControl key="equipamentos" onBack={() => handleNavigate('inicio')} />;
      case 'rh-produtividade': return <OperationsHR key="rh" onBack={() => handleNavigate('inicio')} />;
      case 'novo-orcamento': return <QuoteWizard key="novo-orcamento" onFinish={() => setActiveTab('orcamentos')} />;
      case 'catalogo-servicos': return <ServicesCatalog key="catalogo" onBack={() => handleNavigate('inicio')} />;
      case 'meus-servicos': return <ServicesManager key="meus-servicos" onBack={() => handleNavigate('inicio')} />;
      case 'recebimentos': return <ReceiptsManager key="recebimentos" onBack={() => handleNavigate('inicio')} />;
      case 'nova-despesa': return <Finance key="nova-despesa" initialShowAddModal={true} onBack={() => handleNavigate('inicio')} />;
      case 'marketing': return <MarketingCenter key="marketing" onBack={() => handleNavigate('inicio')} />;
      case 'financeiro-profissional': return <ProfessionalFinance key="fin-pro" onBack={() => handleNavigate('inicio')} />;
      case 'financeiro': return activeRole === 'service' ? <ProfessionalFinance key="financeiro-pro" onBack={() => handleNavigate('inicio')} /> : <Finance key="financeiro" initialShowAddModal={false} onBack={() => handleNavigate('inicio')} />;
      case 'perfil': return <Profile key="perfil" />;
      case 'equipe': return <TeamManagement key="equipe" onBack={() => handleNavigate('menu')} />;
      case 'ajustes': return <AppSettings key="ajustes" onBack={() => handleNavigate('menu')} />;
      case 'menu': return <Menu key="menu" theme={theme} onToggleTheme={toggleTheme} onMenuSelect={handleMenuSelect} onReplayOnboarding={() => setForceOnboarding(true)} />;
      case 'placeholder': return <PlaceholderScreen key="placeholder" title={menuTitle} onBack={() => handleNavigate('menu')} />;
      default: return <DashboardRouter key="default" onNavigate={handleNavigate} />;
    }
  };

  return (
    <WeatherProvider>
      <ConstructionIndexesProvider>
        <MapsProvider>
          <AssistantProvider>
            <PortalProvider>
              <div className="app-container">
                <CustomToaster />
      
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
            className={`nav-item-desktop ${activeTab === 'assistente' ? 'active' : ''}`}
            onClick={() => setActiveTab('assistente')}
          >
            <Sparkles size={20} />
            <span>Assistente</span>
          </button>
          
          {activeRole === 'owner' ? (
            <button 
              className={`nav-item-desktop ${activeTab === 'calculos' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculos')}
            >
              <Calculator size={20} />
              <span>Cálculos</span>
            </button>
          ) : (
            <button 
              className={`nav-item-desktop ${activeTab === 'agenda-completa' ? 'active' : ''}`}
              onClick={() => setActiveTab('agenda-completa')}
            >
              <Calendar size={20} />
              <span>Agenda</span>
            </button>
          )}

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
        <GlobalHeader 
          theme={theme} 
          toggleTheme={toggleTheme} 
          onOpenMenu={() => setActiveTab('menu')} 
        />

        {/* Main Content Area */}
        <main className="main-content hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
          className={`nav-item highlight-nav ${activeTab === 'assistente' ? 'active' : ''}`}
          onClick={() => setActiveTab('assistente')}
        >
          <div className="nav-icon-container">
            <Sparkles size={22} />
          </div>
          <span>Assistente</span>
        </button>

        {activeRole === 'owner' ? (
          <button 
            className={`nav-item ${activeTab === 'calculos' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculos')}
          >
            <div className="nav-icon-container">
              <Calculator size={22} />
            </div>
            <span>Cálculos</span>
          </button>
        ) : (
          <button 
            className={`nav-item ${activeTab === 'agenda-completa' ? 'active' : ''}`}
            onClick={() => setActiveTab('agenda-completa')}
          >
            <div className="nav-icon-container">
              <Calendar size={22} />
            </div>
            <span>Agenda</span>
          </button>
        )}

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
            <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: 400, borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
              <button 
                onClick={closeAuthModal}
                style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer', zIndex: 10 }}
              >
                <X size={18} />
              </button>
              {authView === 'login' ? <Login onGoToRegister={() => setAuthView('register')} theme={theme} /> : <Register onGoToLogin={() => setAuthView('login')} theme={theme} />}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Guest Alert Modal */}
      <AnimatePresence>
        {showGuestAlert && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: 400, padding: 24, borderRadius: 24, position: 'relative' }}
            >
              <button 
                onClick={closeGuestAlert}
                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
              
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <LogIn size={24} />
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
                Modo Visitante Limitado
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
                Você está utilizando a plataforma como visitante. Para salvar projetos, obras e orçamentos de forma definitiva, você precisa criar uma conta gratuita.
                <br /><br />
                Deseja criar uma conta ou fazer login agora para ter acesso total?
              </p>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={closeGuestAlert}
                  className="btn-secondary"
                  style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600 }}
                >
                  Continuar
                </button>
                <button 
                  onClick={() => {
                    closeGuestAlert();
                    setAuthView('login');
                    openAuthModal();
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600 }}
                >
                  Fazer Login
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
            </PortalProvider>
          </AssistantProvider>
        </MapsProvider>
      </ConstructionIndexesProvider>
    </WeatherProvider>
  );
}

export default App;
