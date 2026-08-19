import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';
import { useWorks } from '../contexts/WorksContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { SponsoredAd } from './shared/SponsoredAd';
import { AppInstallBanner } from './ui/AppInstallBanner';

import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Moon, 
  Sun,
  Wallet,
  Users,
  BookOpen,
  LogIn,
  Shield,
  X,
  RefreshCw,
  FileText,
  Sparkles,
  ShoppingCart,
  Briefcase,
  Camera,
  ClipboardCheck,
  CalendarDays,
  Palette,
  Building2,
  Plus,
  Share2,
  Receipt,
  Lightbulb,
  TrendingUp,
  Truck,
  Wrench,
  Link,
  ShieldCheck,
  ShieldAlert,
  Calculator,
  HelpCircle,
  Crown,
  MapPin,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MenuProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onMenuSelect: (title: string) => void;
  onReplayOnboarding?: () => void;
}

export function Menu({ theme, onToggleTheme, onMenuSelect, onReplayOnboarding }: MenuProps) {
  const { signOut, user, isGuest, profile } = useAuth();
  const worksContext = useWorks();
  const { works } = worksContext;
  const { openAuthModal } = useAuthModal();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [changingRole, setChangingRole] = useState(false);

  const isAuthenticated = user && !isGuest;
  const rawRole = profile?.role || localStorage.getItem('pendingRole');
  const activeRole = ['service', 'architect', 'engineer', 'builder'].includes(rawRole as string) ? rawRole : 'owner';

  const handleChangeRole = async () => {
    setChangingRole(true);
    if (!isAuthenticated) {
      localStorage.removeItem('pendingRole');
      window.location.reload();
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { role: null });
    } catch(err) {
      console.error(err);
      setChangingRole(false);
    }
  };

  const mainWork = works.length > 0 ? works[0] : null;

  // ─── 1. Header do Perfil Adaptativo ─────────────────────────────────────────
  const renderAdaptiveHeader = () => {
    const userName = user?.displayName || profile?.name || user?.email?.split('@')[0] || 'Usuário';
    const photoUrl = (profile as any)?.photoUrl || (profile as any)?.photoURL;

    if (activeRole === 'owner') {
      const workTitle = mainWork ? mainWork.name : 'Nenhuma Obra Ativa';
      const progress = mainWork?.progress || 0;
      const stage = worksContext.primaryWorkStats?.nextStage || mainWork?.stage || 'Em andamento';
      const budget = typeof mainWork?.budget === 'number' ? mainWork.budget : 0;
      const spent = worksContext.primaryWorkStats?.totalSpent || 0;
      const saldo = budget - spent;
      const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
      const daysRem = worksContext.primaryWorkStats?.daysRemaining;
      
      const photoStyle = mainWork?.image 
        ? { backgroundImage: `url(${mainWork.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};

      return (
        <div className="glass-panel" style={{ padding: 18, borderRadius: 24, marginBottom: 16, borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...photoStyle }}>
                {!mainWork?.image && <Building2 size={24} />}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{workTitle}</h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)' }}>Obra Principal</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--color-primary)', display: 'block' }}>{progress}%</span>
            </div>
          </div>

          <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 3 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
             <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '6px 10px', borderRadius: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block' }}>Gastos</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>{spent > 0 ? fmt(spent) : '—'}</span>
             </div>
             <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '6px 10px', borderRadius: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block' }}>Saldo</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: saldo >= 0 ? '#10B981' : '#EF4444' }}>{budget > 0 ? fmt(saldo) : '—'}</span>
             </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>Próx: <strong style={{ color: 'var(--text-main)' }}>{stage}</strong></span>
            {daysRem !== null && daysRem !== undefined && (
              <span><strong style={{ color: 'var(--text-main)' }}>{daysRem}</strong> dias rest.</span>
            )}
          </div>
        </div>
      );
    }

    if (activeRole === 'service') {
      return (
        <div className="glass-panel" style={{ padding: 18, borderRadius: 24, marginBottom: 16, borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, overflow: 'hidden' }}>
              {photoUrl ? <img src={photoUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{userName}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B' }}>Prestador de Serviços</span>
                <span style={{ fontSize: 10, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', padding: '1px 6px', borderRadius: 6, fontWeight: 800 }}>
                  Conta Pro
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeRole === 'architect' || activeRole === 'engineer') {
      return (
        <div className="glass-panel" style={{ padding: 18, borderRadius: 24, marginBottom: 16, borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, overflow: 'hidden' }}>
              {photoUrl ? <img src={photoUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{userName}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                {profile?.creaCau ? (
                  <>
                    <ShieldCheck size={13} color="#8B5CF6" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6' }}>CAU / CREA Verificado</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>CAU / CREA Não Informado</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-muted)' }}>
            <span><strong>{works.length}</strong> Projeto(s) Ativo(s)</span>
          </div>
        </div>
      );
    }

    if (activeRole === 'builder') {
      return (
        <div className="glass-panel" style={{ padding: 18, borderRadius: 24, marginBottom: 16, borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {photoUrl ? <img src={photoUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Building2 size={24} />}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{(profile as any)?.companyName || user?.displayName || user?.email?.split('@')[0] || 'Minha Empresa'}</h3>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#3B82F6' }}>Enterprise ERP</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Obras Ativas: <strong style={{ color: 'var(--text-main)' }}>{works.length}</strong></span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ─── 2. Atalhos Rápidos em 1 Toque ──────────────────────────────────────────
  const renderQuickActions = () => {
    let actions: { label: string; icon: React.ReactNode; action: () => void }[] = [];

    if (activeRole === 'owner') {
      actions = [
        { label: '+ Nova Obra', icon: <Plus size={14} />, action: () => onMenuSelect('Nova Obra') },
        { label: '+ Despesa', icon: <Wallet size={14} />, action: () => onMenuSelect('nova-despesa') },
        { label: 'Materiais', icon: <ShoppingCart size={14} />, action: () => onMenuSelect('Compras') },
        { label: 'Compartilhar', icon: <Share2 size={14} />, action: () => onMenuSelect('Compartilhamentos') },
      ];
    } else if (activeRole === 'service') {
      actions = [
        { label: '+ Orçamento', icon: <Plus size={14} />, action: () => onMenuSelect('Novo Orçamento') },
        { label: 'Cálculos', icon: <Calculator size={14} />, action: () => onMenuSelect('Calculadoras') },
        { label: 'Clientes', icon: <Users size={14} />, action: () => onMenuSelect('Clientes') },
        { label: 'Recebimentos', icon: <Receipt size={14} />, action: () => onMenuSelect('Recebimentos') },
      ];
    } else if (activeRole === 'architect' || activeRole === 'engineer') {
      actions = [
        { label: '+ Projeto', icon: <Plus size={14} />, action: () => onMenuSelect('Controle de Projetos') },
        { label: 'Diário Técnico', icon: <Camera size={14} />, action: () => onMenuSelect('Diário Técnico') },
        { label: 'Vistorias', icon: <ClipboardCheck size={14} />, action: () => onMenuSelect('Vistorias') },
        { label: 'Luminotécnico', icon: <Lightbulb size={14} />, action: () => onMenuSelect('Projeto Luminotécnico') },
      ];
    } else if (activeRole === 'builder') {
      actions = [
        { label: '+ Nova Obra', icon: <Plus size={14} />, action: () => onMenuSelect('Nova Obra') },
        { label: 'Equipes', icon: <Users size={14} />, action: () => onMenuSelect('Equipe') },
        { label: 'Materiais', icon: <ShoppingCart size={14} />, action: () => onMenuSelect('Centro de Compras') },
        { label: 'Financeiro', icon: <Wallet size={14} />, action: () => onMenuSelect('Financeiro Corporativo') },
      ];
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
        {actions.map((act, idx) => (
          <button
            key={idx}
            onClick={act.action}
            className="card-premium-interactive"
            style={{
              padding: '10px 4px', borderRadius: 14, border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer'
            }}
          >
            <div style={{ color: 'var(--color-primary)' }}>{act.icon}</div>
            <span style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{act.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // ─── 3. Seções do Menu Adaptativo (70% Comum / 30% Específico) ───────────────
  const getAdaptiveMenuSections = () => {
    if (activeRole === 'owner') {
      return [
        {
          title: 'Gestão da Obra',
          items: [
            { icon: <CalendarDays size={20} />, label: 'Cronograma', color: '#3B82F6', action: () => onMenuSelect('Cronograma') },
            { icon: <Wallet size={20} />, label: 'Financeiro', color: '#10B981', action: () => onMenuSelect('Financeiro') },
            { icon: <ShoppingCart size={20} />, label: 'Materiais', color: '#F59E0B', action: () => onMenuSelect('Materiais') },
            { icon: <Building2 size={20} />, label: 'Minhas Obras', color: '#8B5CF6', action: () => onMenuSelect('Minhas Obras') },
          ]
        },
        {
          title: 'Profissionais',
          items: [
            { icon: <MapPin size={20} />, label: 'Encontrar Profissionais', color: '#8B5CF6', action: () => onMenuSelect('connect') },
          ]
        },
        {
          title: 'Recursos & Inspiração',
          items: [
            { icon: <Sparkles size={20} />, label: 'Assistente Inteligente', color: '#10B981', action: () => onMenuSelect('Assistente') },
            { icon: <Calculator size={20} />, label: 'Central de Cálculos', color: '#3B82F6', action: () => onMenuSelect('Calculadoras') },
            { icon: <BookOpen size={20} />, label: 'Biblioteca Técnica', color: '#8B5CF6', action: () => onMenuSelect('Biblioteca & Normas') },
            { icon: <Palette size={20} />, label: 'Tendências', color: '#D946EF', action: () => onMenuSelect('Tendências') },
          ]
        },
        {
          title: 'Ajuda',
          items: [
            { icon: <HelpCircle size={20} />, label: 'Conhecer a Plataforma', color: '#10B981', action: onReplayOnboarding || (() => {}) }
          ]
        },
        {
          title: 'Configurações',
          items: [
            { icon: <User size={20} />, label: 'Meu Perfil', color: '#6B7280', action: () => onMenuSelect('Meu Perfil') },
            { icon: <Crown size={20} />, label: 'Meu Plano', color: '#F59E0B', action: () => onMenuSelect('planos') },
            { icon: <Shield size={20} />, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: () => setShowRoleModal(true) },
            { icon: theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />, label: theme === 'dark' ? 'Modo Claro' : 'Modo Escuro', color: '#6B7280', action: onToggleTheme },
            { icon: <Settings size={20} />, label: 'Ajustes do App', color: '#6B7280', action: () => onMenuSelect('Ajustes do App') },
          ]
        }
      ];
    }

    if (activeRole === 'service') {
      return [
        {
          title: 'Gestão & Negócios',
          items: [
            { icon: <Briefcase size={20} />, label: 'Minha Empresa', color: '#F59E0B', action: () => onMenuSelect('inicio') },
            { icon: <Plus size={20} />, label: 'Nova Obra', color: '#8B5CF6', action: () => onMenuSelect('Controle de Projetos') },
            { icon: <CalendarDays size={20} />, label: 'Agenda', color: '#3B82F6', action: () => onMenuSelect('Agenda') },
            { icon: <FileText size={20} />, label: 'Orçamentos', color: '#FF6B00', action: () => onMenuSelect('Orcamentos') },
            { icon: <Receipt size={20} />, label: 'Recebimentos', color: '#10B981', action: () => onMenuSelect('Recebimentos') },
            { icon: <Users size={20} />, label: 'Meus Clientes', color: '#8B5CF6', action: () => onMenuSelect('Clientes') },
            { icon: <Calculator size={20} />, label: 'Central de Cálculos', color: '#3B82F6', action: () => onMenuSelect('Calculadoras') },
            { icon: <Sparkles size={20} />, label: 'Dicas', color: '#10B981', action: () => onMenuSelect('Dicas') },
          ]
        },
        {
          title: 'Marketing & Portfólio',
          items: [
            { icon: <MapPin size={20} />, label: 'CentralObra Connect', color: '#8B5CF6', action: () => onMenuSelect('connect') },
          ]
        },
        {
          title: 'Configurações',
          items: [
            { icon: <User size={20} />, label: 'Perfil Profissional', color: '#6B7280', action: () => onMenuSelect('Meu Perfil') },
            { icon: <Crown size={20} />, label: 'Meu Plano', color: '#F59E0B', action: () => onMenuSelect('planos') },
            { icon: <Shield size={20} />, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: () => setShowRoleModal(true) },
            { icon: theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />, label: theme === 'dark' ? 'Modo Claro' : 'Modo Escuro', color: '#6B7280', action: onToggleTheme },
            { icon: <Settings size={20} />, label: 'Ajustes do App', color: '#6B7280', action: () => onMenuSelect('Ajustes do App') },
          ]
        }
      ];
    }

    if (activeRole === 'architect' || activeRole === 'engineer') {
      return [
        {
          title: 'Gestão de Projetos & Clientes',
          items: [
            { icon: <Briefcase size={20} />, label: 'Controle de Projetos', color: '#8B5CF6', action: () => onMenuSelect('Controle de Projetos') },
            { icon: <Users size={20} />, label: 'Clientes & Links', color: '#3B82F6', action: () => onMenuSelect('Clientes') },
            { icon: <CalendarDays size={20} />, label: 'Agenda Técnica', color: '#F59E0B', action: () => onMenuSelect('Agenda') },
            { icon: <ClipboardCheck size={20} />, label: 'Vistorias Técnicas', color: '#10B981', action: () => onMenuSelect('Vistorias') },
            { icon: <Camera size={20} />, label: 'Diário Técnico', color: '#EC4899', action: () => onMenuSelect('Diário Técnico') },
            { icon: <FileText size={20} />, label: 'Orçamentos', color: '#FF6B00', action: () => onMenuSelect('Orcamentos') },
            { icon: <Receipt size={20} />, label: 'Financeiro', color: '#10B981', action: () => onMenuSelect('Financeiro') },
          ]
        },
        {
          title: 'Marketing & Portfólio',
          items: [
            { icon: <MapPin size={20} />, label: 'CentralObra Connect', color: '#8B5CF6', action: () => onMenuSelect('connect') },
          ]
        },
        {
          title: 'Recursos & Especiais',
          items: [
            { icon: <Sparkles size={20} />, label: 'Assistente Inteligente', color: '#10B981', action: () => onMenuSelect('Assistente') },
            { icon: <BookOpen size={20} />, label: 'Biblioteca & Normas NBR', color: '#8B5CF6', action: () => onMenuSelect('Biblioteca & Normas') },
            { icon: <Palette size={20} />, label: 'Tendências', color: '#D946EF', action: () => onMenuSelect('Tendências') },
          ]
        },
        {
          title: 'Ferramentas',
          items: [
            { icon: <Calculator size={20} />, label: 'Calculadoras Técnicas', color: '#3B82F6', action: () => onMenuSelect('Calculadoras') },
            { icon: <FileText size={20} />, label: 'Relatórios Técnicos PDF', color: '#F43F5E', action: () => onMenuSelect('Relatórios') },
          ]
        },
        {
          title: 'Projetos Complementares',
          items: [
            { icon: <Palette size={20} />, label: 'Studio de Interiores', color: '#EC4899', action: () => onMenuSelect('Studio de Interiores') },
            { icon: <Lightbulb size={20} />, label: 'Projeto Elétrico', color: '#EAB308', action: () => onMenuSelect('Projeto Elétrico') },
            { icon: <Briefcase size={20} />, label: 'Projeto Hidráulico', color: '#0EA5E9', action: () => onMenuSelect('Projeto Hidráulico') },
            { icon: <Lightbulb size={20} />, label: 'Projeto Luminotécnico', color: '#F59E0B', action: () => onMenuSelect('Projeto Luminotécnico') },
            { icon: <Wrench size={20} />, label: 'Automação (Smart)', color: '#10B981', action: () => onMenuSelect('Projeto Automação') },
          ]
        },
        {
          title: 'Configurações',
          items: [
            { icon: <User size={20} />, label: 'Perfil Profissional (CREA/CAU)', color: '#6B7280', action: () => onMenuSelect('Meu Perfil') },
            { icon: <Crown size={20} />, label: 'Meu Plano', color: '#F59E0B', action: () => onMenuSelect('planos') },
            { icon: <Shield size={20} />, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: () => setShowRoleModal(true) },
            { icon: theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />, label: theme === 'dark' ? 'Modo Claro' : 'Modo Escuro', color: '#6B7280', action: onToggleTheme },
            { icon: <Settings size={20} />, label: 'Ajustes do App', color: '#6B7280', action: () => onMenuSelect('Ajustes do App') },
          ]
        }
      ];
    }

    if (activeRole === 'builder') {
      return [
        {
          title: 'Gestão Corporativa',
          items: [
            { icon: <Building2 size={20} />, label: 'Centro de Operações', color: '#3B82F6', action: () => onMenuSelect('Centro de Operações') },
            { icon: <Briefcase size={20} />, label: 'Gerenciamento de Obras', color: '#FF6B00', action: () => onMenuSelect('Obras') },
            { icon: <Users size={20} />, label: 'Equipes & Mão de Obra', color: '#8B5CF6', action: () => onMenuSelect('Equipe') },
            { icon: <ShoppingCart size={20} />, label: 'Centro de Materiais', color: '#F59E0B', action: () => onMenuSelect('Centro de Compras') },
            { icon: <Wallet size={20} />, label: 'Financeiro Corporativo', color: '#10B981', action: () => onMenuSelect('Financeiro Corporativo') },
          ]
        },
        {
          title: 'Marketing & Portfólio',
          items: [
            { icon: <MapPin size={20} />, label: 'CentralObra Connect', color: '#8B5CF6', action: () => onMenuSelect('connect') },
          ]
        },
        {
          title: 'Recursos & BI',
          items: [
            { icon: <BookOpen size={20} />, label: 'Biblioteca Técnica', color: '#8B5CF6', action: () => onMenuSelect('Biblioteca & Normas') },
            { icon: <Sparkles size={20} />, label: 'Assistente Inteligente', color: '#10B981', action: () => onMenuSelect('Assistente') },
            { icon: <TrendingUp size={20} />, label: 'Indicadores BI (Curva S)', color: '#06B6D4', action: () => onMenuSelect('Indicadores BI') },
            { icon: <FileText size={20} />, label: 'Relatórios Executivos PDF', color: '#F43F5E', action: () => onMenuSelect('Relatórios') },
          ]
        },
        {
          title: 'Empresa & Patrimônio',
          items: [
            { icon: <Truck size={20} />, label: 'Gestão de Fornecedores', color: '#3B82F6', action: () => onMenuSelect('Fornecedores') },
            { icon: <Wrench size={20} />, label: 'Equipamentos & Patrimônio', color: '#F59E0B', action: () => onMenuSelect('Equipamentos') },
            { icon: <Link size={20} />, label: 'CentralObra Connect', color: '#8B5CF6', action: () => onMenuSelect('connect') },
          ]
        },
        {
          title: 'Configurações',
          items: [
            { icon: <Building2 size={20} />, label: 'Dados da Empresa', color: '#6B7280', action: () => onMenuSelect('Meu Perfil') },
            { icon: <Crown size={20} />, label: 'Meu Plano', color: '#F59E0B', action: () => onMenuSelect('planos') },
            { icon: <Shield size={20} />, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: () => setShowRoleModal(true) },
            { icon: theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />, label: theme === 'dark' ? 'Modo Claro' : 'Modo Escuro', color: '#6B7280', action: onToggleTheme },
            { icon: <Settings size={20} />, label: 'Ajustes do App', color: '#6B7280', action: () => onMenuSelect('Ajustes do App') },
          ]
        }
      ];
    }

    return [];
  };

  const menuSections = getAdaptiveMenuSections();

  if (profile?.isAdmin) {
    const configSection = menuSections.find(s => s.title === 'Configurações');
    if (configSection) {
      configSection.items.push({ icon: <ShieldCheck size={20} />, label: 'Administração', color: '#EF4444', action: () => onMenuSelect('Administração') });
    }
  } else if (user?.email === 'lucassantosfuturo@gmail.com') {
    const configSection = menuSections.find(s => s.title === 'Configurações');
    if (configSection) {
      configSection.items.push({ 
        icon: <ShieldAlert size={20} />, 
        label: 'Forçar Admin (Dev)', 
        color: '#F59E0B', 
        action: async () => {
          try {
            await updateDoc(doc(db, 'users', user.uid), { isAdmin: true });
            toast.success('Admin ativado! Recarregando...');
            setTimeout(() => window.location.reload(), 1000);
          } catch(e) {
            toast.error('Erro ao ativar admin.');
          }
        } 
      });
    }
  }

  return (
    <div className="screen-content animate-fade-in" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24 }}>
      
      {/* 1. Profile Adaptive Header */}
      {renderAdaptiveHeader()}

      {/* 2. Quick Action Shortcuts */}
      {renderQuickActions()}

      {/* 3. Adaptive Menu Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {menuSections.map((section, idx) => (
          <div key={idx} className={`animate-stagger-${Math.min((idx + 1), 5)}`}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 12, marginLeft: 8 }}>
              {section.title}
            </h3>
            <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              {section.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx}
                  onClick={item.action}
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '16px 20px', 
                    borderBottom: itemIdx < section.items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    cursor: 'pointer'
                  }}
                  className="card-premium-interactive"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* App Install Banner no menu Ajuda / Footer */}
        <div className="animate-stagger-4" style={{ marginTop: 16 }}>
          <AppInstallBanner />
        </div>

        {/* Auth Actions - Conditionally Rendered */}
        <div style={{ marginTop: 8 }} className="animate-stagger-5">
          {isAuthenticated ? (
            <button 
              onClick={async () => {
                if (window.confirm('Tem certeza que deseja sair da conta?')) {
                  await signOut();
                  window.location.reload();
                }
              }}
              className="card-premium-interactive"
              style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--color-danger)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--color-danger)', borderRadius: 24, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
            >
              <LogOut size={20} />
              Sair da conta
            </button>
          ) : (
            <button 
              onClick={openAuthModal}
              className="card-premium-interactive"
              style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-alpha)', border: '1px solid var(--color-primary)', borderRadius: 24, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
            >
              <LogIn size={20} />
              Fazer Login / Criar Conta
            </button>
          )}
        </div>
      </div>

      {/* Role Change Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showRoleModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)',
              zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel"
                style={{ width: '100%', maxWidth: 400, padding: 24, borderRadius: 24, position: 'relative' }}
              >
                <button 
                  onClick={() => setShowRoleModal(false)}
                  style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>

                <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(59,130,246,0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <RefreshCw size={24} />
                </div>

                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
                  Alterar Perfil de Uso
                </h2>
                
                <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                  <p style={{ marginBottom: 12 }}>
                    Ao alterar o seu perfil, a interface do aplicativo será adaptada para mostrar apenas as ferramentas relevantes para a nova função.
                  </p>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 600, padding: '12px', backgroundColor: 'var(--color-primary-alpha)', borderRadius: 8 }}>
                    Nenhum dado será perdido! Suas obras, cálculos e documentos salvos no perfil atual continuarão seguros, e você pode retornar a este perfil sempre que quiser.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    onClick={() => setShowRoleModal(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600 }}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleChangeRole}
                    disabled={changingRole}
                    className="btn-primary"
                    style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600, display: 'flex', justifyContent: 'center' }}
                  >
                    {changingRole ? 'Aguarde...' : 'Alterar Perfil'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
