import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, BarChart3, Users2, CheckCircle, RefreshCw, Plus } from 'lucide-react';

interface DemoProps {
  step: number;
  onActionComplete: () => void;
}

export const BuilderDemo: React.FC<DemoProps> = ({ step, onActionComplete }) => {
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
          {step === 0 && 'Múltiplas Obras'}
          {step === 1 && 'Dashboards Executivos'}
          {step === 2 && 'Gestão de Equipes'}
        </motion.h2>
        <motion.p 
          key={`desc-${step}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 16, color: 'var(--text-muted)' }}
        >
          {step === 0 && 'Tenha a visão macro de todos os seus canteiros ativos.'}
          {step === 1 && 'Acompanhe a saúde financeira e a rentabilidade em tempo real.'}
          {step === 2 && 'Atribua tarefas e gerencie a produtividade do seu time.'}
        </motion.p>
      </div>

      {/* Interactive Mockup */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 400, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {step === 0 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ background: 'var(--color-primary-alpha)', padding: 16, borderRadius: 12, border: '2px solid var(--color-primary)' }}>
                <Building2 size={20} color="var(--color-primary)" style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Torre Sul</div>
              </div>
              <div style={{ background: interacted ? 'var(--color-primary-alpha)' : 'var(--bg-elevated)', padding: 16, borderRadius: 12, border: interacted ? '2px solid var(--color-primary)' : '2px solid transparent', transition: 'all 0.3s' }}>
                <Building2 size={20} color={interacted ? "var(--color-primary)" : "var(--text-muted)"} style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 700, color: interacted ? 'var(--color-primary)' : 'var(--text-muted)' }}>Vila Nova</div>
              </div>
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-secondary" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {interacted ? <><CheckCircle size={20} /> Obra Alternada</> : <><RefreshCw size={20} /> Trocar Obra</>}
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            {/* Fake Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 120, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
              <motion.div initial={{ height: 0 }} animate={{ height: '40%' }} style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: '8px 8px 0 0' }} />
              <motion.div initial={{ height: 0 }} animate={{ height: '70%' }} style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: '8px 8px 0 0' }} />
              <motion.div initial={{ height: 0 }} animate={{ height: interacted ? '100%' : '10%' }} transition={{ type: 'spring' }} style={{ flex: 1, background: 'var(--color-primary)', borderRadius: '8px 8px 0 0' }} />
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-secondary" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {interacted ? <><CheckCircle size={20} /> Gráfico Atualizado</> : <><BarChart3 size={20} /> Atualizar Relatório</>}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div layout initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 24, borderRadius: 24, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg-elevated)', borderRadius: 12, marginBottom: 24, border: interacted ? '1px solid var(--color-success)' : '1px solid var(--border-subtle)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--bg-input-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users2 size={20} color="var(--text-muted)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Carlos (Engenheiro)</div>
                <div style={{ fontSize: 13, color: interacted ? 'var(--color-success)' : 'var(--text-muted)' }}>{interacted ? 'Concretagem Laje 2' : 'Sem tarefas hoje'}</div>
              </div>
            </div>
            
            <button 
              onClick={handleInteract}
              className={interacted ? "btn-success" : "btn-primary glow-effect"}
              style={{ width: '100%', height: 48, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {interacted ? <><CheckCircle size={20} /> Tarefa Atribuída</> : <><Plus size={20} /> Atribuir Tarefa</>}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
