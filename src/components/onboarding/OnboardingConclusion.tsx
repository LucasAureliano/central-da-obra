import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { UserRole } from '../../contexts/AuthContext';

interface OnboardingConclusionProps {
  role: UserRole;
  onComplete: () => void;
}

export const OnboardingConclusion: React.FC<OnboardingConclusionProps> = ({ role, onComplete }) => {
  const getMessage = () => {
    switch(role) {
      case 'owner': return "Você já pode criar sua primeira obra e acompanhar todos os gastos em um só lugar.";
      case 'service': return "Você está pronto para criar seu primeiro orçamento profissional e conquistar novos clientes.";
      case 'architect': return "Sua área técnica está pronta para organizar projetos, cronogramas e relatórios.";
      case 'builder': return "Sua plataforma está preparada para gerenciar múltiplas obras e equipes.";
      default: return "Suo CentralObra está preparada para você.";
    }
  };

  useEffect(() => {
    // Auto-complete after 4 seconds to simulate loading and building dashboard
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}
    >
      {/* Fake dashboard building background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, display: 'flex', flexWrap: 'wrap', gap: 16, padding: 40, pointerEvents: 'none' }}>
        <motion.div initial={{ height: 0 }} animate={{ height: 100 }} transition={{ duration: 1 }} style={{ width: '30%', background: '#fff', borderRadius: 16 }} />
        <motion.div initial={{ height: 0 }} animate={{ height: 100 }} transition={{ duration: 1.2 }} style={{ width: '30%', background: '#fff', borderRadius: 16 }} />
        <motion.div initial={{ height: 0 }} animate={{ height: 100 }} transition={{ duration: 1.4 }} style={{ width: '30%', background: '#fff', borderRadius: 16 }} />
        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} style={{ height: 200, background: '#fff', borderRadius: 16 }} />
      </div>

      <div className="glass-panel" style={{ padding: 40, borderRadius: 32, textAlign: 'center', maxWidth: 500, zIndex: 10 }}>
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring' }}
          style={{ width: 80, height: 80, borderRadius: 40, background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}
        >
          <CheckCircle size={40} color="#fff" />
        </motion.div>
        
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
          Tudo pronto!
        </h2>
        
        <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 32 }}>
          {getMessage()}
        </p>

        <button 
          onClick={onComplete}
          className="btn-primary glow-effect" 
          style={{ width: '100%', padding: '16px 24px', fontSize: 16, fontWeight: 700 }}
        >
          Entrar no Aplicativo
        </button>
      </div>
    </motion.div>
  );
};
