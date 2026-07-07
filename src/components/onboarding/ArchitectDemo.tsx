import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Calendar, CheckCircle, Plus, FileText } from 'lucide-react';

interface DemoProps {
  step: number;
  onActionComplete: () => void;
}

export const ArchitectDemo: React.FC<DemoProps> = ({ step, onActionComplete }) => {
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
          {step === 0 && 'Gestão de Projetos'}
          {step === 1 && 'Cronograma de Obras'}
        </motion.h2>
        <motion.p 
          key={`desc-${step}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 16, color: 'var(--text-muted)' }}
        >
          {step === 0 && 'Organize plantas, contratos e documentos em um só lugar.'}
          {step === 1 && 'Acompanhe prazos com visões de Gantt interativas.'}
        </motion.p>
      </div>

      {/* Interactive Mockup */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 400, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {step === 0 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 60, background: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <FolderKanban size={24} />
              </div>
              <div style={{ flex: 1, height: 60, background: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <FileText size={24} />
              </div>
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-success" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {interacted ? <><CheckCircle size={20} /> Projeto Criado</> : <><Plus size={20} /> Novo Projeto</>}
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            {/* Fake Gantt */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, fontSize: 12, color: 'var(--text-muted)' }}>Fundações</div>
                <div style={{ flex: 1, height: 16, background: 'var(--bg-elevated)', borderRadius: 8 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 8 }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, fontSize: 12, color: 'var(--text-muted)' }}>Alvenaria</div>
                <div style={{ flex: 1, height: 16, background: 'var(--bg-elevated)', borderRadius: 8, position: 'relative' }}>
                  <AnimatePresence>
                    {interacted && <motion.div initial={{ width: 0, left: '60%' }} animate={{ width: '40%', left: '60%' }} style={{ position: 'absolute', height: '100%', background: 'var(--color-primary-light)', borderRadius: 8 }} />}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-secondary" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {interacted ? <><CheckCircle size={20} /> Etapa Adicionada</> : <><Calendar size={20} /> Adicionar Alvenaria</>}
            </button>
          </motion.div>
        )}


      </div>
    </div>
  );
};
