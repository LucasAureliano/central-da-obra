import { motion } from 'framer-motion';

interface QuoteStepTypeProps {
  TEMPLATES: Record<string, any>;
  serviceType: string;
  applyTemplate: (key: string) => void;
  setServiceType: (type: string) => void;
  setServices: (services: any[]) => void;
  setStep: (step: number) => void;
  activeRole?: string;
}

export function QuoteStepType({ TEMPLATES, serviceType, applyTemplate, setServiceType, setServices, setStep, activeRole }: QuoteStepTypeProps) {
  const architectTemplates = ['Projeto Arquitetônico', 'Projeto Estrutural', 'Compatibilização BIM', 'Emissão de ART/RRT'];
  
  const filteredTemplates = Object.keys(TEMPLATES).filter(key => {
    if (activeRole === 'architect' || activeRole === 'engineer') {
      return architectTemplates.includes(key);
    } else {
      return !architectTemplates.includes(key);
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Selecione um modelo pré-configurado. Você poderá editar os itens livremente nas próximas etapas.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {filteredTemplates.map(key => (
          <motion.div 
            key={key} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => applyTemplate(key)}
            className="glass-panel"
            style={{ 
              padding: 24, borderRadius: 24, 
              border: `2px solid ${serviceType === key ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
              backgroundColor: serviceType === key ? 'rgba(30, 58, 138, 0.05)' : 'var(--bg-elevated)',
              cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {TEMPLATES[key].icon}
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>{key}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {TEMPLATES[key].desc}
            </p>
          </motion.div>
        ))}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setServiceType('Outros'); setServices([]); setStep(4); }}
          style={{ 
            padding: 24, borderRadius: 24, border: '2px dashed var(--border-subtle)',
            backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, justifyContent: 'center'
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)' }}>Em Branco (Outro)</span>
        </motion.div>
      </div>
    </div>
  );
}
