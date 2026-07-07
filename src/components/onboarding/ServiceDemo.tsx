import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, CheckCircle, TrendingUp, Plus } from 'lucide-react';

interface DemoProps {
  step: number;
  onActionComplete: () => void;
}

export const ServiceDemo: React.FC<DemoProps> = ({ step, onActionComplete }) => {
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
          {step === 0 && 'Gestão de Clientes'}
          {step === 1 && 'Orçamentos Profissionais'}
          {step === 2 && 'Orçamento Aprovado'}
          {step === 3 && 'Controle Financeiro'}
        </motion.h2>
        <motion.p 
          key={`desc-${step}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 16, color: 'var(--text-muted)' }}
        >
          {step === 0 && 'Cadastre seus clientes e tenha tudo organizado.'}
          {step === 1 && 'Gere PDFs com seu logotipo em poucos cliques.'}
          {step === 2 && 'Transforme o orçamento em uma obra ativa.'}
          {step === 3 && 'Dê baixa nos recebimentos e veja seu faturamento.'}
        </motion.p>
      </div>

      {/* Interactive Mockup */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 400, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {step === 0 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <Users size={24} />
              </div>
              <div style={{ height: 20, width: 150, background: 'var(--bg-input-glass)', borderRadius: 10 }} />
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-success" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {interacted ? <><CheckCircle size={20} /> Cliente Adicionado</> : <><Plus size={20} /> Cadastrar Cliente</>}
            </button>

            <AnimatePresence>
              {interacted && (
                <motion.div layout initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} style={{ marginTop: 24, padding: 16, background: 'var(--bg-elevated)', borderRadius: 12, border: '1px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                  <FileText size={24} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>João da Silva</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>(11) 98888-7777</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 12, marginBottom: 24, background: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-primary)', marginBottom: 16 }} />
              <div style={{ width: '80%', height: 12, background: '#e2e8f0', borderRadius: 6, marginBottom: 8 }} />
              <div style={{ width: '60%', height: 12, background: '#e2e8f0', borderRadius: 6, marginBottom: 24 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <div style={{ width: 80, height: 12, background: '#e2e8f0', borderRadius: 6 }} />
                <div style={{ width: 60, height: 16, background: 'var(--color-primary)', borderRadius: 8 }} />
              </div>

              {interacted && (
                <motion.div initial={{ left: '-100%' }} animate={{ left: '100%' }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
              )}
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-success" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {interacted ? <><CheckCircle size={20} /> PDF Gerado</> : <><FileText size={20} /> Gerar PDF</>}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Status do Orçamento</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: interacted ? 'var(--color-success)' : 'var(--text-main)' }}>
                {interacted ? 'APROVADO' : 'EM ANÁLISE'}
              </div>
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-secondary" : "btn-success glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {interacted ? 'Obra Criada' : 'Aprovar Orçamento'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>A Receber</span>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>{interacted ? 'R$ 0,00' : 'R$ 2.500,00'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Recebido</span>
                <motion.div animate={{ color: interacted ? '#10b981' : 'var(--text-main)' }} style={{ fontSize: 20, fontWeight: 700 }}>
                  {interacted ? 'R$ 2.500,00' : 'R$ 0,00'}
                </motion.div>
              </div>
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-secondary" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {interacted ? <><CheckCircle size={20} /> Baixa Realizada</> : <><TrendingUp size={20} /> Receber R$ 2.500</>}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
