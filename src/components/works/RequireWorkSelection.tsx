import React, { useState } from 'react';
import { useWorks } from '../../contexts/WorksContext';
import { Building2, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { NewWorkModal } from '../NewWorkModal';

interface RequireWorkSelectionProps {
  children: React.ReactNode;
  featureName: string;
  onBack: () => void;
}

export function RequireWorkSelection({ children, featureName, onBack }: RequireWorkSelectionProps) {
  const { activeWork, works, setActiveWork } = useWorks();
  const [showNewWorkModal, setShowNewWorkModal] = useState(false);

  if (activeWork) {
    return <>{children}</>;
  }

  return (
    <div className="animate-fade-in screen-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)' }}>
        <button onClick={onBack} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: 12, marginBottom: 16 }}>
          Voltar
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
          {featureName}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
          Os projetos precisam estar vinculados a uma obra.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Building2 size={64} style={{ color: 'var(--color-primary)', opacity: 0.5, marginBottom: 24, marginTop: 40 }} />
        
        {works.length > 0 ? (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: 'var(--text-main)', textAlign: 'center' }}>Selecione a obra para este projeto:</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
              {works.map((work) => (
                <motion.button
                  key={work.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveWork(work)}
                  style={{
                    padding: 16, borderRadius: 16, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: 16, color: 'var(--text-main)', marginBottom: 4 }}>{work.name}</strong>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{work.address || 'Sem endereço'}</span>
                  </div>
                  <ArrowRight size={20} color="var(--color-primary)" />
                </motion.button>
              ))}
            </div>
            
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>ou</span>
              <button onClick={() => setShowNewWorkModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px auto', background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}>
                <Plus size={18} /> Cadastrar Nova Obra
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, textAlign: 'center', color: 'var(--text-main)' }}>Nenhuma obra encontrada</h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 300, marginBottom: 24 }}>
              Você precisa cadastrar uma obra antes de iniciar o {featureName}.
            </p>
            <button onClick={() => setShowNewWorkModal(true)} className="btn-primary glow-effect" style={{ padding: '12px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
              <Plus size={20} /> Cadastrar Primeira Obra
            </button>
          </>
        )}
      </div>

      <NewWorkModal isOpen={showNewWorkModal} onClose={() => setShowNewWorkModal(false)} />
    </div>
  );
}
