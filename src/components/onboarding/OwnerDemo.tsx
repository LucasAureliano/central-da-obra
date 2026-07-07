import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calculator, Plus } from 'lucide-react';

interface DemoProps {
  step: number;
  onActionComplete: () => void;
}

export const OwnerDemo: React.FC<DemoProps> = ({ step, onActionComplete }) => {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    setInteracted(false);
  }, [step]);

  const handleInteract = () => {
    setInteracted(true);
    onActionComplete();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Title & Description */}
      <div style={{ textAlign: 'center', marginBottom: 40, height: 100 }}>
        <motion.h2 
          key={`title-${step}`}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}
        >
          {step === 0 && 'Cadastre sua Obra'}
          {step === 1 && 'Acompanhe o Progresso'}
          {step === 2 && 'Calcule Materiais'}
          {step === 3 && 'Gestão Financeira'}
        </motion.h2>
        <motion.p 
          key={`desc-${step}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 16, color: 'var(--text-muted)' }}
        >
          {step === 0 && 'Comece criando o perfil da sua construção.'}
          {step === 1 && 'Siga os passos e veja a evolução em tempo real.'}
          {step === 2 && 'Calcule a quantidade exata para evitar desperdícios.'}
          {step === 3 && 'Controle cada centavo gasto na sua obra.'}
        </motion.p>
      </div>

      {/* Interactive Mockup */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 400, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {step === 0 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ height: 48, background: 'var(--bg-input-glass)', borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'center', padding: '0 16px', color: 'var(--text-main)', fontWeight: 600 }}>Minha Casa</div>
            <div style={{ height: 48, background: 'var(--bg-input-glass)', borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', padding: '0 16px', color: 'var(--text-muted)' }}>Residencial</div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-success" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {interacted ? <><Check size={20} /> Obra Criada</> : <><Plus size={20} /> Criar Obra</>}
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: 'var(--text-muted)' }}>Progresso Geral</span>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{interacted ? '15%' : '0%'}</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 4, marginBottom: 32, overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }} animate={{ width: interacted ? '15%' : '0%' }} transition={{ type: 'spring' }}
                style={{ height: '100%', background: 'var(--color-primary)' }} 
              />
            </div>
            
            <button 
              onClick={handleInteract}
              style={{ width: '100%', padding: 16, borderRadius: 16, background: interacted ? 'var(--color-success-alpha)' : 'var(--bg-glass)', border: interacted ? '1px solid var(--color-success)' : '1px solid var(--color-primary)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: interacted ? 'var(--color-success)' : 'transparent', border: interacted ? 'none' : '2px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {interacted && <Check size={14} color="#fff" />}
              </div>
              <span style={{ color: interacted ? 'var(--color-success)' : 'var(--text-main)', fontWeight: 600 }}>Fundação Concluída</span>
              {!interacted && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} style={{ width: 8, height: 8, background: 'var(--color-primary)', borderRadius: 4, marginLeft: 'auto' }} />}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ padding: 12, background: 'var(--color-primary-alpha)', borderRadius: 12, color: 'var(--color-primary)' }}><Calculator size={24} /></div>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Calculadora de Piso</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ height: 40, background: 'var(--bg-input-glass)', borderRadius: 8, padding: '0 12px', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}>Larg: 5m</div>
              <div style={{ height: 40, background: 'var(--bg-input-glass)', borderRadius: 8, padding: '0 12px', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}>Comp: 4m</div>
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-secondary" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600 }}
            >
              {interacted ? 'Calculado' : 'Calcular Material'}
            </button>

            <AnimatePresence>
              {interacted && (
                <motion.div layout initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} style={{ marginTop: 24, padding: 16, background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', overflow: 'hidden' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Piso necessário:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>22 m²</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Saldo da Obra</span>
              <motion.div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>
                {interacted ? 'R$ 49.500,00' : 'R$ 50.000,00'}
              </motion.div>
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-secondary" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}
            >
              {interacted ? <><Check size={20} /> Gasto Adicionado</> : <><Plus size={20} /> Adicionar Gasto de R$ 500</>}
            </button>

            <AnimatePresence>
              {interacted && (
                <motion.div layout initial={{ opacity: 0, x: -20, height: 0 }} animate={{ opacity: 1, x: 0, height: 'auto' }} style={{ display: 'flex', justifyContent: 'space-between', padding: 16, background: 'var(--bg-elevated)', borderRadius: 12, borderLeft: '4px solid #ef4444', overflow: 'hidden' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Cimento</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Materiais</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#ef4444' }}>- R$ 500,00</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};
