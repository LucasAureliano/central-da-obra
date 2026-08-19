import React from 'react';
import { X, Lock, Cloud, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function GuestRestrictionModal() {
  const { showGuestModal, setShowGuestModal, guestActionName, signInWithGoogle, signOut } = useAuth();

  if (!showGuestModal) return null;

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      setShowGuestModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 24,
            padding: 0,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), #8B5CF6)',
            padding: '32px 24px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowGuestModal(false)}
              style={{
                position: 'absolute',
                top: 16, right: 16,
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                width: 32, height: 32,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFF', cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
            <div style={{
              width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', backdropFilter: 'blur(24px)'
            }}>
              <Lock size={32} color="#FFF" />
            </div>
            <h2 style={{ margin: 0, color: '#FFF', fontSize: 24, fontWeight: 800 }}>Ação Restrita</h2>
            <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
              Crie uma conta gratuita para <strong>{guestActionName}</strong> e liberar todos os recursos.
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Cloud size={20} color="#3B82F6" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>Salvar na Nuvem</h4>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Nunca perca seus dados, orçamentos ou obras. Acesse de qualquer lugar.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Download size={20} color="#10B981" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>Gerar PDFs</h4>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Exporte listas, cronogramas e orçamentos em PDF com a sua logo.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={20} color="#8B5CF6" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>Acesso Completo</h4>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Desbloqueie BI, relatórios financeiros e gestão inteligente de ponta a ponta.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={async () => {
                  setShowGuestModal(false);
                  if (signOut) signOut();
                }}
                className="btn-primary"
                style={{ width: '100%', height: 48, fontSize: 15, fontWeight: 700, display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', borderRadius: 16 }}
              >
                Criar Conta / Fazer Login <ChevronRight size={18} />
              </button>
              <button
                onClick={() => setShowGuestModal(false)}
                className="btn-secondary"
                style={{ width: '100%', height: 48, fontSize: 15, fontWeight: 700, borderRadius: 16, border: 'none', backgroundColor: 'transparent' }}
              >
                Continuar como Visitante
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
