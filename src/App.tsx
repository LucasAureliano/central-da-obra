/**
 * Copyright (c) 2026 CentralObra. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL
 * This software and its documentation are proprietary to CentralObra.
 */
import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
const DashboardRouter = lazy(() => import('./components/DashboardRouter').then(m => ({ default: m.DashboardRouter })));
const Works = lazy(() => import('./components/Works').then(m => ({ default: m.Works })));
const WorkDetails = lazy(() => import('./components/WorkDetails').then(m => ({ default: m.WorkDetails })));
import { Menu as MenuIcon, Home, Briefcase, LogIn, X, Loader2 } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './components/LandingPage';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { InteractiveTour } from './components/onboarding/InteractiveTour';
import { Menu } from './components/Menu';
import { InterstitialAd } from './components/shared/InterstitialAd';
import { GenericInfoPage } from './components/landing/GenericInfoPage';
import { PlansUpsellPopup } from './components/shared/PlansUpsellPopup';
import { AdMobService } from './services/ads/AdMobService';

const Profile = lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));
import { Login } from './components/Login';
import { NetworkStatus } from './components/ui/NetworkStatus';

// Lazy loaded heavy components
const CalculatorLibrary = lazy(() => import('./components/calculators_library/CalculatorLibrary').then(m => ({ default: m.CalculatorLibrary })));
const TechnicalCentral = lazy(() => import('./components/library/TechnicalCentral').then(m => ({ default: m.TechnicalCentral })));
const InsightsCentral = lazy(() => import('./components/insights/InsightsCentral').then(m => ({ default: m.InsightsCentral })));
const ProviderWorkDashboard = lazy(() => import('./components/provider/ProviderWorkDashboard').then(m => ({ default: m.ProviderWorkDashboard })));
const CalculatorsWizard = lazy(() => import('./components/calculators_library/CalculatorsWizard').then(m => ({ default: m.CalculatorsWizard })));
const Reports = lazy(() => import('./components/Reports').then(m => ({ default: m.Reports })));

// Connect Modules
const ProfessionalConnectDashboard = lazy(() => import('./components/connect/ProfessionalConnectDashboard').then(m => ({ default: m.ProfessionalConnectDashboard })));
const OwnerConnectDashboard = lazy(() => import('./components/connect/OwnerConnectDashboard').then(m => ({ default: m.OwnerConnectDashboard })));
const PublicProfileView = lazy(() => import('./components/connect/public/PublicProfileView').then(m => ({ default: m.PublicProfileView })));
const PublicPortfolioView = lazy(() => import('./components/connect/public/PublicPortfolioView').then(m => ({ default: m.PublicPortfolioView })));
const PublicBlogView = lazy(() => import('./components/public/PublicBlogView').then(m => ({ default: m.PublicBlogView })));
const PublicCalculatorsHubView = lazy(() => import('./components/public/PublicCalculatorsHubView').then(m => ({ default: m.PublicCalculatorsHubView })));
const PublicCalculatorView = lazy(() => import('./components/public/PublicCalculatorView').then(m => ({ default: m.PublicCalculatorView })));

const Finance = lazy(() => import('./components/Finance').then(m => ({ default: m.Finance })));
const Shopping = lazy(() => import('./components/Shopping').then(m => ({ default: m.Shopping })));
import { Register } from './components/Register';
import { RoleSelection } from './components/RoleSelection';
import { NamePromptModal } from './components/ui/NamePromptModal';
import { useAuth } from './contexts/AuthContext';
import { useAuthModal } from './contexts/AuthModalContext';
import { useWorks } from './contexts/WorksContext';
import { ConstructionIndexesProvider } from './contexts/ConstructionIndexesContext';
import { MapsProvider } from './contexts/MapsContext';
import { AssistantProvider } from './contexts/AssistantContext';
import { PortalProvider } from './contexts/PortalContext';
import { PlaceholderScreen } from './components/PlaceholderScreen';
import { SharedWorkView } from './components/SharedWorkView';
import { CustomToaster } from './components/ui/Toast';
import { CommercialQuotes } from './components/provider/CommercialQuotes';
import { ClientsManager } from './components/provider/ClientsManager';
import { ServicesCatalog } from './components/provider/ServicesCatalog';
import { ServicesManager } from './components/provider/ServicesManager';

import { ProfessionalFinance } from './components/provider/ProfessionalFinance';
import { GuestRestrictionModal } from './components/GuestRestrictionModal';
import { TipsWidget } from './components/home/modules/TipsWidget';
import { AppSettings } from './components/AppSettings';
import { InteriorDesignStudio } from './components/architect/InteriorDesignStudio';
import { InteractiveSchedule } from './components/owner/InteractiveSchedule';
import { TeamManagement } from './components/TeamManagement';
import { Agenda } from './components/Agenda';
import { ProjectControl } from './components/architect/ProjectControl';
import { TechnicalJournal } from './components/architect/TechnicalJournal';
import { Inspections } from './components/architect/Inspections';
import { WorkNotes } from './components/works/WorkNotes';
import { RequireWorkSelection } from './components/works/RequireWorkSelection';
import { Documents } from './components/architect/Documents';
import { Schedule } from './components/architect/Schedule';
import { LightingDesignEngine } from './components/architect/LightingDesignEngine';
import { ElectricalDesignStudio } from './components/architect/ElectricalDesignStudio';
import { PlumbingDesignStudio } from './components/architect/PlumbingDesignStudio';
import { AutomationDesignStudio } from './components/architect/AutomationDesignStudio';
import { WoodworkingDesignStudio } from './components/architect/WoodworkingDesignStudio';
import { SiteVisitsManager } from './components/architect/SiteVisitsManager';
import { ProjectCoordination } from './components/architect/ProjectCoordination';
import { ExecutiveTimeline } from './components/builder/ExecutiveTimeline';
import { EquipmentControl } from './components/builder/EquipmentControl';
import { OperationsHR } from './components/builder/OperationsHR';
import { BuilderOperationsCenter } from './components/builder/BuilderOperationsCenter';
import { BuilderWorks } from './components/builder/BuilderWorks';
import { BuilderTeams } from './components/builder/BuilderTeams';
import { BuilderSuppliers } from './components/builder/BuilderSuppliers';
import { BuilderEquipment } from './components/builder/BuilderEquipment';
import { BuilderProcurement } from './components/builder/BuilderProcurement';
import { BuilderCorporateFinance } from './components/builder/BuilderCorporateFinance';
import { CorporateBI } from './components/builder/CorporateBI';
import { QuoteWizard } from './components/provider/QuoteWizard';
import { SmartAssistant } from './components/assistant/SmartAssistant';
import { OwnerWorkDetails } from './components/owner/OwnerWorkDetails';
import { MarketingCenter } from './components/provider/MarketingCenter';
import { ReviewPublicPage } from './components/provider/ReviewPublicPage';
import { UpgradeModal } from './components/shared/UpgradeModal';
import { QuotaBanner } from './components/shared/QuotaBanner';
import { AppLayout, AuthModals } from './components/layout';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  const { user, profile, loading, isGuest } = useAuth();
  const { showAuthModal, closeAuthModal, openAuthModal } = useAuthModal();
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
  const connectProfileId = urlParams.get('connect');
  const portfolioItemId = urlParams.get('portfolio');
  const isPreview = urlParams.get('preview');
  const isBlog = urlParams.has('blog') || window.location.pathname === '/blog';
  const isPrivacy = urlParams.has('privacy') || window.location.pathname === '/privacidade';
  const isTerms = urlParams.has('terms') || window.location.pathname === '/termos';
  const blogPostId = urlParams.get('blog');
  const isCalculatorsHub = urlParams.has('calculadoras') || window.location.pathname === '/calculadoras';
  const isFreeCalculator = urlParams.has('calc');
  const calcId = urlParams.get('calc');

  // Handle hash routes
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user && !isGuest && showAuthModal) {
      closeAuthModal();
    }
  }, [user, isGuest, showAuthModal, closeAuthModal]);

  useEffect(() => {
    AdMobService.initialize();

    // Show ONE interstitial ad after 60 seconds of app usage (Native only)
    if (Capacitor.isNativePlatform()) {
      const timer = setTimeout(() => {
        AdMobService.showInterstitial();
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (hash.startsWith('#/avaliar/')) {
    const providerId = hash.split('#/avaliar/')[1];
    if (providerId) {
      return <ReviewPublicPage providerId={providerId} />;
    }
  }

  if (hash.startsWith('#/checkout-success')) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Pagamento Aprovado!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400 }}>Sua assinatura foi processada com sucesso. Aproveite todos os recursos do seu novo plano.</p>
        <button 
          onClick={() => { window.location.hash = ''; window.location.reload(); }}
          className="btn-primary"
        >
          Voltar ao App
        </button>
      </div>
    );
  }

  if (hash.startsWith('#/checkout-failure') || hash.startsWith('#/checkout-pending')) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Pagamento Não Concluído</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400 }}>Não foi possível confirmar o pagamento ou ele está pendente. Verifique com a operadora do seu cartão.</p>
        <button 
          onClick={() => { window.location.hash = ''; window.location.reload(); }}
          className="btn-primary"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (sharedWorkId) {
    return <SharedWorkView token={sharedWorkId} theme={theme} />;
  }

  if (portfolioItemId && connectProfileId) {
    return <PublicPortfolioView workId={portfolioItemId} uid={connectProfileId} theme={theme} onBack={() => window.history.back()} />;
  }

  if (connectProfileId) {
    return <PublicProfileView uid={connectProfileId} theme={theme} />;
  }

  if (isFreeCalculator) {
      return <PublicCalculatorView theme={theme} calcId={calcId || 'concreto'} />;
    }

    if (isBlog) {
      return <PublicBlogView theme={theme} postId={blogPostId && blogPostId !== 'true' ? blogPostId : null} />;
    }

    if (isPrivacy) {
      return <GenericInfoPage pageId="privacy" onBack={() => window.location.href = '/'} onLogin={() => window.location.href = '/?login=true'} onNavigate={(page) => window.location.href = '/' + (page === 'terms' ? 'termos' : page === 'privacy' ? 'privacidade' : '')} theme={theme} />;
    }

    if (isTerms) {
      return <GenericInfoPage pageId="terms" onBack={() => window.location.href = '/'} onLogin={() => window.location.href = '/?login=true'} onNavigate={(page) => window.location.href = '/' + (page === 'terms' ? 'termos' : page === 'privacy' ? 'privacidade' : '')} theme={theme} />;
    }

    if (isPreview === 'true') {
    return <DashboardRouter onNavigate={() => {}} />;
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    // Show a plain background while Firebase restores session
    return <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }} />;
  }

  // PUBLIC CALCULATORS HUB (No auth required)
  if (isCalculatorsHub) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />}>
        <PublicCalculatorsHubView theme={theme} />
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
                {authView === 'login' ? (
                  <Login onGoToRegister={() => setAuthView('register')} theme={theme} />
                ) : (
                  <Register onGoToLogin={() => setAuthView('login')} theme={theme} />
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Suspense>
    );
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
        <InteractiveTour onComplete={async () => {
    if (isGuest) {
      sessionStorage.setItem('guestHasSeenWelcome', 'true');
      window.location.reload();
    } else {
      setForceOnboarding(false);
      try {
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('./lib/firebase');
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { hasSeenWelcome: true });
      } catch (e) {
        console.error('Error saving welcome state:', e);
      }
    }
  }} />
      );
    }
    
    // Check if the user needs to provide a name (only for non-guests)
    if (!isGuest && !(profile as any).displayName && !user.displayName) {
      return <NamePromptModal />;
    }
  }

  const handleMenuSelect = (title: string) => {
    if (title === 'connect') {
      setActiveTab('connect');
      return;
    }
    if (title === 'planos' || title === 'Meu Plano' || title === 'Planos' || title === 'Assinatura' || title === 'Meu Plano & Assinatura') {
      setActiveTab('planos');
      return;
    }
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

    if (title === 'Tendências' || title === 'Studio de Interiores') {
      setActiveTab('studio-interiores');
      return;
    }
      if (title === 'Projeto Elétrico') {
        setActiveTab('projeto-eletrico');
        return;
      }
      if (title === 'Projeto Hidráulico') {
        setActiveTab('projeto-hidraulico');
        return;
      }
      if (title === 'Projeto Automação') {
        setActiveTab('projeto-automacao');
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
    if (title === 'Controle de Projetos' || title === 'Projetos' || title === 'projetos') {
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
    if (title === 'Dicas') {
      setActiveTab('dicas');
      return;
    }
    if (title === 'Administração') {
      setActiveTab('admin');
      return;
    }
    if (title === 'Funil de Negócios' || title === 'Funil de Negócios (CRM)' || title === 'crm' || title === 'CRM' || title === 'Clientes & CRM' || title === 'CRM de Vendas') {
      setActiveTab('clientes');
      return;
    }
    if (title === 'Propostas' || title === 'Propostas Comerciais') {
      setActiveTab('orcamentos');
      return;
    }
    if (title === 'Portal do Cliente') {
      setActiveTab('portal-cliente');
      return;
    }
    if (title === 'Imóveis' || title === 'Portfólio de Imóveis') {
      setActiveTab('imoveis');
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
      case 'obras': 
        if (activeRole === 'architect' || activeRole === 'engineer') {
          return <ProjectControl key="projetos" />;
        }
        if (activeRole === 'builder') {
          return <BuilderWorks key="obras" onWorkSelect={(id) => setSelectedWorkId(id)} />;
        }
        return <Works key="obras" onWorkSelect={(id) => setSelectedWorkId(id)} />;
      case 'assistente': return <SmartAssistant key="assistente" onNavigate={handleNavigate} />;
      case 'ferramentas': return <CalculatorsWizard key="ferramentas" onNavigate={handleNavigate} initialQuery={activeWizardQuery || undefined} />;
      case 'calculos': return <CalculatorsWizard key="calculos" onNavigate={handleNavigate} initialQuery={activeWizardQuery || undefined} />;
      case 'library': return <CalculatorLibrary key="library" onNavigate={handleNavigate} />;
      case 'insights': return <InsightsCentral key="insights" onBack={() => handleNavigate('inicio')} onNavigate={handleNavigate} />;
      case 'central-tecnica': return <TechnicalCentral key="central" onNavigate={handleNavigate} initialArticleId={activeArticleId || undefined} />;
      case 'relatorios': return <Reports key="relatorios" />;
      case 'compras': return <Shopping key="compras" />;
      case 'centro-compras':
        if (activeRole === 'builder') {
          return <BuilderProcurement key="centro-compras" onBack={() => handleNavigate('inicio')} />;
        }
        return <Shopping key="centro-compras" />;
      case 'orcamentos': return <CommercialQuotes key="orcamentos" onNavigate={handleNavigate} />;
      case 'clientes': return <ClientsManager key="clientes" />;
      case 'crm': return <ClientsManager key="crm" />;
      case 'medicao': return <Schedule key="medicao" />;
      case 'portfolio': return <Works key="portfolio" onWorkSelect={(id) => setSelectedWorkId(id)} />;
      case 'recebimentos': return <Finance key="recebimentos" />;
      case 'financas': return <Finance key="financas" />;
      case 'agenda-completa': return <Agenda key="agenda" />;
      case 'controle-projetos': return <ProjectControl key="projetos" />;
      case 'studio-interiores': return <RequireWorkSelection featureName="Studio de Interiores" onBack={() => handleNavigate('inicio')}><InteriorDesignStudio key="studio-interiores" onBack={() => handleNavigate('inicio')} /></RequireWorkSelection>;
      case 'projeto-luminotecnico': return <RequireWorkSelection featureName="Projeto Luminotécnico" onBack={() => handleNavigate('inicio')}><LightingDesignEngine key="luminotecnico" onBack={() => handleNavigate('inicio')} /></RequireWorkSelection>;
      case 'projeto-eletrico': return <RequireWorkSelection featureName="Projeto Elétrico" onBack={() => handleNavigate('inicio')}><ElectricalDesignStudio key="eletrico" onBack={() => handleNavigate('inicio')} /></RequireWorkSelection>;
      case 'projeto-hidraulico': return <RequireWorkSelection featureName="Projeto Hidráulico" onBack={() => handleNavigate('inicio')}><PlumbingDesignStudio key="hidraulico" onBack={() => handleNavigate('inicio')} /></RequireWorkSelection>;
      case 'projeto-automacao': return <RequireWorkSelection featureName="Projeto de Automação" onBack={() => handleNavigate('inicio')}><AutomationDesignStudio key="automacao" onBack={() => handleNavigate('inicio')} /></RequireWorkSelection>;
      case 'projeto-marcenaria': return <RequireWorkSelection featureName="Projeto de Marcenaria" onBack={() => handleNavigate('inicio')}><WoodworkingDesignStudio key="marcenaria" onBack={() => handleNavigate('inicio')} /></RequireWorkSelection>;
      case 'acompanhamento-obras': return <SiteVisitsManager key="acompanhamento" onBack={() => handleNavigate('inicio')} />;
      case 'compatibilizacao': return <ProjectCoordination key="compatibilizacao" onBack={() => handleNavigate('inicio')} />;
      case 'diario-tecnico': return <TechnicalJournal key="diario-tecnico" />;
      case 'vistorias': return <Inspections key="vistorias" />;
      case 'notas': return <WorkNotes key="notas" onBack={() => handleNavigate('inicio')} />;
      case 'documentos-tecnicos': return <Documents key="documentos-tecnicos" />;
      case 'cronograma-medicoes': return activeRole === 'owner' ? <InteractiveSchedule key="cronograma-owner" onBack={() => handleNavigate('inicio')} /> : <Schedule key="cronograma-medicoes" />;
      case 'centro-operacoes': 
        if (activeRole === 'builder') {
          return <BuilderOperationsCenter key="centro-operacoes" onBack={() => handleNavigate('inicio')} />;
        }
        return <ProjectControl key="projetos" />;
      case 'cronograma-geral': return activeRole === 'owner' ? <InteractiveSchedule key="cronograma-geral" onBack={() => handleNavigate('inicio')} /> : <ExecutiveTimeline key="cronograma" />;
      case 'cronograma': return <InteractiveSchedule key="cronograma-interactive" onBack={() => handleNavigate('inicio')} />;
      case 'equipamentos': 
        if (activeRole === 'builder') return <BuilderEquipment key="equipamentos" onBack={() => handleNavigate('inicio')} />;
        return <EquipmentControl key="equipamentos" onBack={() => handleNavigate('inicio')} />;
      case 'rh-produtividade': 
        if (activeRole === 'builder') return <BuilderTeams key="rh" onBack={() => handleNavigate('inicio')} />;
        return <OperationsHR key="rh" onBack={() => handleNavigate('inicio')} />;
      case 'novo-orcamento': return <QuoteWizard key="novo-orcamento" onFinish={() => setActiveTab('orcamentos')} />;
      case 'catalogo-servicos': return <ServicesCatalog key="catalogo" onBack={() => handleNavigate('inicio')} />;
      case 'meus-servicos': return <ServicesManager key="meus-servicos" onBack={() => handleNavigate('inicio')} />;
      case 'nova-despesa': return <Finance key="nova-despesa" initialShowAddModal={true} onBack={() => handleNavigate('inicio')} />;
      case 'marketing': return <MarketingCenter key="marketing" onBack={() => handleNavigate('inicio')} />;
      case 'financeiro-profissional': return <ProfessionalFinance key="fin-pro" onBack={() => handleNavigate('inicio')} />;
      case 'financeiro': 
        if (activeRole === 'builder') {
          return <BuilderCorporateFinance key="financeiro" onBack={() => handleNavigate('inicio')} />;
        }
        return activeRole === 'service' ? <ProfessionalFinance key="financeiro-pro" onBack={() => handleNavigate('inicio')} /> : <Finance key="financeiro" initialShowAddModal={false} onBack={() => handleNavigate('inicio')} />;
      case 'perfil': return <Profile key="perfil" />;
      case 'fornecedores': return <BuilderSuppliers key="fornecedores" onBack={() => handleNavigate('inicio')} />;
      case 'equipe': 
        if (activeRole === 'builder') return <BuilderTeams key="equipe" onBack={() => handleNavigate('menu')} />;
        return <TeamManagement key="equipe" onBack={() => handleNavigate('menu')} />;
      case 'connect':
        if (activeRole === 'owner') return <OwnerConnectDashboard key="connect" onNavigate={handleNavigate} />;
        return <ProfessionalConnectDashboard key="connect" onNavigate={handleNavigate} />;
      case 'ajustes': return <AppSettings key="ajustes" onBack={() => handleNavigate('menu')} onNavigate={handleNavigate} />;
      case 'planos': return <SubscriptionPlans key="planos" onBack={() => handleNavigate('menu')} />;
      case 'dicas': return <div key="dicas" className="screen-content" style={{ padding: '24px 20px' }}><TipsWidget onNavigate={handleNavigate} /></div>;
      case 'indicadores-bi': return <CorporateBI key="indicadores-bi" onBack={() => handleNavigate('inicio')} />;
      case 'admin': return <AdminDashboard key="admin" onNavigate={handleNavigate} />;
      case 'menu': return <Menu key="menu" theme={theme} onToggleTheme={toggleTheme} onMenuSelect={handleMenuSelect} onReplayOnboarding={() => setForceOnboarding(true)} />;
      case 'placeholder': return <PlaceholderScreen key="placeholder" title={menuTitle} onBack={() => handleNavigate('menu')} />;
      default: return <DashboardRouter key="default" onNavigate={handleNavigate} />;
    }
  };

  return (
    
      <>
      <NetworkStatus />
      <ConstructionIndexesProvider>
        <MapsProvider>
          <AssistantProvider>
            <PortalProvider>
              <div className="app-container">
                <CustomToaster />
                <AppLayout 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  theme={theme} 
                  toggleTheme={toggleTheme} 
                  user={user} 
                  activeRole={activeRole as string}
                >
                  {!isGuest && <QuotaBanner onNavigate={setActiveTab} />}
                  <Suspense fallback={<div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>{renderContent()}</Suspense>
                </AppLayout>
                <AuthModals 
                  theme={theme} 
                  authView={authView} 
                  setAuthView={setAuthView} 
                />
                <GuestRestrictionModal />
                <PlansUpsellPopup onGoToPlans={() => handleNavigate('planos')} />
                <UpgradeModal onNavigate={handleNavigate} />
              </div>
            </PortalProvider>
          </AssistantProvider>
        </MapsProvider>
      </ConstructionIndexesProvider>
    </>
  );
}

export default App;
