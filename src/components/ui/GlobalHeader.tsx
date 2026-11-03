import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const { user, isGuest } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const initial = user?.email ? user.email[0].toUpperCase() : 'V';

  const handleHomeClick = () => {
    window.location.hash = '#/';
  };

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mobile-header glass-panel"
        style={{ 
          padding: 'env(safe-area-inset-top, 0px) 20px 0 20px', 
          height: 'calc(72px + env(safe-area-inset-top, 0px))', 
          zIndex: 40,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <motion.div 
          onClick={handleHomeClick}
          className="hide-on-desktop"
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        >
          <CustomLogo theme={theme} variant="horizontal" size={32} />
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          {/* Theme Toggle Button with Rotation Animation */}
          <motion.button 
            className="btn-icon" 
            style={{ 
              width: 42, 
              height: 42, 
              borderRadius: 21,
              backgroundColor: 'var(--bg-card-glass-hover)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              position: 'relative',
              overflow: 'hidden'
            }} 
            onClick={toggleTheme}
            whileHover={{ scale: 1.08, backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-strong)' }}
            whileTap={{ scale: 0.92, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label="Alternar tema"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {theme === 'dark' ? <Sun size={19} color="#F59E0B" /> : <Moon size={19} color="#6366F1" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Notifications Button with Subtle Ping */}
          <motion.button 
            className="btn-icon" 
            style={{ 
              width: 42, 
              height: 42, 
              borderRadius: 21, 
              position: 'relative',
              backgroundColor: 'var(--bg-card-glass-hover)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)'
            }}
            onClick={() => setIsNotificationsOpen(true)}
            whileHover={{ scale: 1.08, backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-strong)' }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label="Notificações"
          >
            <Bell size={19} />
            {!isGuest && (
              <span style={{ position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: 'var(--color-primary)', display: 'flex' }}>
                <span 
                  style={{ 
                    position: 'absolute', 
                    inset: -2, 
                    borderRadius: 999, 
                    backgroundColor: 'var(--color-primary)', 
                    opacity: 0.75, 
                    animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' 
                  }} 
                />
              </span>
            )}
          </motion.button>

          {/* User Profile Avatar with Spring and Ring Glow */}
          <motion.button 
            whileHover={{ scale: 1.08, boxShadow: '0 0 16px var(--color-primary-glow)' }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: user ? 'var(--color-primary)' : 'var(--bg-elevated)',
              color: user ? '#FFFFFF' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 15,
              border: '2px solid var(--border-subtle)',
              cursor: 'pointer',
              padding: 0,
              boxShadow: user ? '0 2px 10px rgba(255, 107, 0, 0.25)' : 'none'
            }}
            onClick={onOpenMenu}
            aria-label="Abrir menu do perfil"
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
