import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

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
  Calculator,
  Sparkles,
  ShoppingCart
} from 'lucide-react';

interface MenuProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onMenuSelect: (title: string) => void;
  onReplayOnboarding?: () => void;
}

export function Menu({ theme, onToggleTheme, onMenuSelect, onReplayOnboarding }: MenuProps) {
  const { signOut, user, isGuest, profile } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [changingRole, setChangingRole] = useState(false);
  
  const isAuthenticated = user && !isGuest;

  const getRoleName = () => {
    const activeRole = profile?.role || localStorage.getItem('pendingRole');
    switch(activeRole) {
      case 'owner': return 'Proprietário';
      case 'service': return 'Prestador de Serviço';
      case 'architect': return 'Arquiteto';
      case 'engineer': return 'Engenheiro';
      case 'builder': return 'Construtora';
      case 'client': return 'Cliente';
      default: return 'Sem Perfil';
    }
  };

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
      // App.tsx vai automaticamente renderizar o RoleSelection porque o role vai virar null
    } catch(err) {
      console.error(err);
      setChangingRole(false);
    }
  };

  const activeRole = profile?.role || localStorage.getItem('pendingRole');

  const getGestaoItems = () => {
    const items = [
      { icon: <Wallet size={20} />, label: 'Financeiro', color: '#10B981', action: () => onMenuSelect('Financeiro') },
      { icon: <ShoppingCart size={20} />, label: 'Lista de Compras', color: '#8B5CF6', action: () => onMenuSelect('Compras') },
      { icon: <Users size={20} />, label: 'Contatos', color: '#3B82F6', action: () => onMenuSelect('Contatos') }
    ];

    if (activeRole === 'builder') {
      items.push({ icon: <Users size={20} />, label: 'Equipe', color: '#F59E0B', action: () => onMenuSelect('Equipe') });
    }

    items.push({ icon: <FileText size={20} />, label: 'Relatórios', color: '#F43F5E', action: () => onMenuSelect('Relatórios') });

    return items;
  };

  const menuSections = [
    {
      title: 'Gestão',
      items: getGestaoItems()
    },
    {
      title: 'Recursos',
      items: [
        { icon: <Calculator size={20} />, label: 'Assistentes Técnicos', color: '#10B981', action: () => onMenuSelect('Assistentes') },
        { icon: <BookOpen size={20} />, label: 'Biblioteca & Normas', color: '#8B5CF6', action: () => onMenuSelect('Biblioteca & Normas') },
      ]
    },
    {
      title: 'Ajuda',
      items: [
        { icon: <Sparkles size={20} />, label: 'Conhecer a Plataforma', color: '#10B981', action: onReplayOnboarding || (() => {}) }
      ]
    },
    {
      title: 'Configurações',
      items: [
        { icon: <User size={20} />, label: 'Meu Perfil', color: '#6B7280', action: () => onMenuSelect('Meu Perfil') },
        { icon: <Users size={20} />, label: 'Contatos', color: '#6B7280', action: () => onMenuSelect('Contatos') },
        { icon: <Shield size={20} />, label: 'Alterar Perfil de Uso', color: '#3B82F6', action: () => setShowRoleModal(true) },
        { icon: theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />, label: theme === 'dark' ? 'Modo Claro' : 'Modo Escuro', color: '#6B7280', action: onToggleTheme },
        { icon: <Settings size={20} />, label: 'Ajustes do App', color: '#6B7280', action: () => onMenuSelect('Ajustes do App') },
      ]
    }
  ];

  return (
    <div className="screen-content animate-fade-in" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24 }}>
      
      {/* Profile Header */}
      <div className="animate-stagger-1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={32} color="var(--text-muted)" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            {isAuthenticated ? (user.email || 'Usuário') : 'Visitante'}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-primary)', fontWeight: 600 }}>
            {getRoleName() !== 'Sem Perfil' ? `${getRoleName()}${!isAuthenticated ? ' (Visitante)' : ''}` : 'Conta Gratuita'}
          </p>
        </div>
      </div>

      {/* Menu Sections */}
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
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Auth Actions - Conditionally Rendered */}
        <div style={{ marginTop: 8 }} className="animate-stagger-5">
          {isAuthenticated ? (
            <button 
              onClick={async () => {
                await signOut();
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
      <AnimatePresence>
        {showRoleModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
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
      </AnimatePresence>

    </div>
  );
}
