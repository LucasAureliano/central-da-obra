import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, LogIn, Compass } from 'lucide-react';

interface AuthModalContextType {
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  showGuestAlert: boolean;
  triggerGuestAlert: () => void;
  closeGuestAlert: () => void;
  authView: 'login' | 'register';
  setAuthView: (view: 'login' | 'register') => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuestAlert, setShowGuestAlert] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (view: 'login' | 'register') => {
    setAuthView(view);
    setShowGuestAlert(false);
    setShowAuthModal(true);
  };

  return (
    <AuthModalContext.Provider 
      value={{ 
        showAuthModal, 
        openAuthModal: () => setShowAuthModal(true), 
        closeAuthModal: () => setShowAuthModal(false),
        showGuestAlert,
        triggerGuestAlert: () => setShowGuestAlert(true),
        closeGuestAlert: () => setShowGuestAlert(false),
        authView,
        setAuthView
      }}
    >
      {children}

      {/* Elegant Glassmorphism Guest Alert Modal */}
      <AnimatePresence>
        {showGuestAlert && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: '100%',
                maxWidth: 420,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
                borderRadius: 24,
                padding: 32,
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
              }}
              className="glass-panel"
            >
              <div style={{
                position: 'absolute',
                top: '-50%', left: '-50%', width: '200%', height: '200%',
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15), transparent 60%)',
                pointerEvents: 'none'
              }} />

              <button 
                onClick={() => setShowGuestAlert(false)}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  borderRadius: '50%', width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-main)', cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <X size={16} />
              </button>

              <div style={{
                width: 64, height: 64, borderRadius: 32,
                background: 'linear-gradient(135deg, var(--color-primary), #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
              }}>
                <Compass size={32} color="#fff" />
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
                Crie sua conta gratuitamente
              </h2>
              
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
                Assim você poderá salvar suas obras, sincronizar seus dados e acessar tudo em qualquer dispositivo.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => handleOpenAuth('login')}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 16,
                    background: 'var(--color-primary)', color: '#fff',
                    border: 'none', fontSize: 15, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    transition: 'transform 0.1s'
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <LogIn size={18} />
                  Entrar
                </button>

                <button
                  onClick={() => handleOpenAuth('register')}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 16,
                    background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-main)',
                    border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: 15, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.2s, transform 0.1s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <UserPlus size={18} />
                  Criar Conta
                </button>

                <button
                  onClick={() => setShowGuestAlert(false)}
                  style={{
                    width: '100%', padding: '12px', marginTop: 8,
                    background: 'transparent', color: 'var(--text-muted)',
                    border: 'none', fontSize: 14, fontWeight: 500,
                    cursor: 'pointer', transition: 'color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  Continuar como visitante
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
