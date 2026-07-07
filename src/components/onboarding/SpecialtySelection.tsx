import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const SPECIALTIES = [
  'Pedreiro', 'Pintor', 'Eletricista', 'Encanador', 'Gesseiro', 
  'Azulejista', 'Mestre de Obras', 'Carpinteiro', 'Serralheiro', 
  'Telhadista', 'Drywall', 'Piso Laminado', 'Piso Vinílico', 'Outro'
];

interface SpecialtySelectionProps {
  onSelect: (specialty: string) => void;
  isFinishing: boolean;
}

export const SpecialtySelection: React.FC<SpecialtySelectionProps> = ({ onSelect, isFinishing }) => {
  const [selected, setSelected] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32, maxWidth: 400 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>
          Qual a sua especialidade?
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
          Isso nos ajuda a personalizar as ferramentas e calculadoras sugeridas para você.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, width: '100%', maxWidth: 600 }}>
        {SPECIALTIES.map(spec => (
          <motion.button
            key={spec}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(spec)}
            className="glass-panel"
            style={{
              padding: '16px 12px',
              borderRadius: 16,
              backgroundColor: selected === spec ? 'var(--color-primary)' : 'var(--bg-glass)',
              color: selected === spec ? '#fff' : 'var(--text-main)',
              border: `2px solid ${selected === spec ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {spec}
          </motion.button>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: selected ? 1 : 0, y: selected ? 0 : 20 }}
        style={{ marginTop: 40 }}
      >
        <button 
          onClick={() => onSelect(selected)}
          disabled={!selected || isFinishing}
          className="btn-primary" 
          style={{ padding: '0 40px', height: 56, fontSize: 16, gap: 12 }}
        >
          {isFinishing ? 'Configurando...' : 'Continuar'} <Check size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
};
