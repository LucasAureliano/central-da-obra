import { motion } from 'framer-motion';
import { Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CustomLogo } from '../CustomLogo';

interface GlobalHeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenMenu: () => void;
}

export function GlobalHeader({ 
  theme, toggleTheme, onOpenMenu 
}: GlobalHeaderProps) {
  const { user, isGuest, profile } = useAuth();

  const initial = user?.email ? user.email[0].toUpperCase() : 'V';

  let headerTitle = 'CentralObra';
  if (!isGuest && profile) {
    if (profile.role === 'owner') headerTitle = 'Minha Obra';
    else if (profile.role === 'service') headerTitle = 'Meus Serviços';
    else if (profile.role === 'architect') headerTitle = 'Meus Projetos';
    else if (profile.role === 'builder') headerTitle = 'Painel Geral';
  }

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mobile-header glass-panel"
      style={{ display: 'flex', padding: 'env(safe-area-inset-top, 0px) 20px 0 20px', height: 'calc(72px + env(safe-area-inset-top, 0px))', zIndex: 40 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <CustomLogo theme={theme} variant="icon" size={32} />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', opacity: 0.9 }}>
          {headerTitle}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn-icon" style={{ width: 40, height: 40, borderRadius: 20 }} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="btn-icon" style={{ width: 40, height: 40, borderRadius: 20, position: 'relative' }}>
          <Bell size={18} />
          {!isGuest && <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: 'var(--color-primary)', border: '2px solid var(--bg-base)' }} />}
        </button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
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
            cursor: 'pointer',
            padding: 0
          }}
          onClick={onOpenMenu}
        >
          {initial}
        </motion.button>
      </div>
    </motion.header>
  );
}
