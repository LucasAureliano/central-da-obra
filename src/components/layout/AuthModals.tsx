import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, LogIn } from 'lucide-react';
import { Login } from '../Login';
import { Register } from '../Register';
import { useAuthModal } from '../../contexts/AuthModalContext';

interface AuthModalsProps {
  theme: 'light' | 'dark';
  authView: 'login' | 'register';
  setAuthView: (view: 'login' | 'register') => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({ theme, authView, setAuthView }) => {
  const { showAuthModal, closeAuthModal, openAuthModal, showGuestAlert, closeGuestAlert } = useAuthModal();

  return (
    <>
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
              {authView === 'login' 
                ? <Login onGoToRegister={() => setAuthView('register')} theme={theme} /> 
                : <Register onGoToLogin={() => setAuthView('login')} theme={theme} />
              }
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
    </>
  );
};
