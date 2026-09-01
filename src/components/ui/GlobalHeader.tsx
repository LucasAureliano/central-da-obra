import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CustomLogo } from '../CustomLogo';
import { NotificationsPanel } from '../NotificationsPanel';

interface GlobalHeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenMenu: () => void;
}

export function GlobalHeader({ 
  theme, toggleTheme, onOpenMenu 
}: GlobalHeaderProps) {
  const { user, isGuest, profile } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const initial = user?.email ? user.email[0].toUpperCase() : 'V';

  let headerTitle = 'CentralObra.';

  const handleHomeClick = () => {
    window.location.hash = '#/';
  };

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mobile-header glass-panel"
        style={{ padding: 'env(safe-area-inset-top, 0px) 20px 0 20px', height: 'calc(72px + env(safe-area-inset-top, 0px))', zIndex: 40 }}
      >
        <motion.div 
          onClick={handleHomeClick}
          className="hide-on-desktop"
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <CustomLogo theme={theme} variant="horizontal" size={32} />
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          <button className="btn-icon" style={{ width: 40, height: 40, borderRadius: 20 }} onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            className="btn-icon" 
            style={{ width: 40, height: 40, borderRadius: 20, position: 'relative' }}
            onClick={() => setIsNotificationsOpen(true)}
          >
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

      <NotificationsPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </>
  );
}
