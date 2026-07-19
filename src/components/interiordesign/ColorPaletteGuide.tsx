import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Palette, Droplet } from 'lucide-react';

interface ColorPaletteGuideProps {
  onBack: () => void;
}

export function ColorPaletteGuide({ onBack }: ColorPaletteGuideProps) {
  const [activeTab, setActiveTab] = useState<'quentes' | 'frias' | 'neutras'>('neutras');

  const palettes = {
    quentes: [
      { name: 'Terracota', hex: '#E2725B', text: 'Traz aconchego e rusticidade. Ideal para salas e varandas.' },
      { name: 'Mostarda', hex: '#FFDB58', text: 'Estimula a criatividade e a fome. Ótimo para cozinhas e escritórios criativos.' },
      { name: 'Marsala', hex: '#955251', text: 'Tom sofisticado e acolhedor, perfeito para quartos e salas íntimas.' }
    ],
    frias: [
      { name: 'Azul Petróleo', hex: '#005f69', text: 'Transmite calma e profundidade. Excelente para quartos de casal.' },
      { name: 'Sálvia', hex: '#77815C', text: 'Traz a natureza para dentro. Relaxante, ótimo para banheiros e salas de estar.' },
      { name: 'Azul Sereno', hex: '#87CEEB', text: 'Amplia o espaço e traz frescor. Recomendado para quartos infantis ou escritórios.' }
    ],
    neutras: [
      { name: 'Gelo', hex: '#E8ECEF', text: 'Base clara e moderna, combina com tudo. Bom para espaços pequenos.' },
      { name: 'Areia', hex: '#E6D3B3', text: 'Base quente, traz mais aconchego que o branco puro.' },
      { name: 'Cinza Crômio', hex: '#A8A9AD', text: 'Neutro sofisticado, ideal para estilo industrial ou contemporâneo.' }
    ]
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Palette size={28} color="#D946EF" />
        Guia de Cores
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Inspire-se e entenda a psicologia das cores nos ambientes.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'neutras', label: 'Neutras' },
          { id: 'quentes', label: 'Quentes' },
          { id: 'frias', label: 'Frias' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 12,
              border: activeTab === tab.id ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              background: activeTab === tab.id ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-main)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {palettes[activeTab].map((color, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={color.name}
            className="card-premium" 
            style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: color.hex, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{color.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>{color.text}</p>
            </div>
            <Droplet size={20} color={color.hex} style={{ opacity: 0.5 }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
