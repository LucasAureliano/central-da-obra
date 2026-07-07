import { useState } from 'react';
import { ArrowLeft, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';

import { MasonryCalc } from '../calculators_library/MasonryCalc';
import { RoofingCalc } from '../calculators_library/RoofingCalc';
import { ConcreteMixCalc } from '../calculators_library/ConcreteMixCalc';
import { WallPaintCalc } from '../calculators_library/WallPaintCalc';

export type ProjectCategory = 'wall' | 'roof' | 'paint' | 'concrete' | null;
export type AssistantMode = 'fast' | 'pro' | null;

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function SmartAssistant({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState<ProjectCategory>(null);
  // Render the selected calculator
  if (category === 'wall') return <MasonryCalc onBack={() => setCategory(null)} />;
  if (category === 'roof') return <RoofingCalc onBack={() => setCategory(null)} />;
  if (category === 'concrete') return <ConcreteMixCalc onBack={() => setCategory(null)} />;
  if (category === 'paint') return <WallPaintCalc onBack={() => setCategory(null)} />;

  // Tela 1: O que deseja construir
  return (
    <motion.div 
      className="screen-content" 
      style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.button 
        variants={itemVariants}
        onClick={onBack} 
        style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={20} /> Fechar Consultor
      </motion.button>

      <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.2 }}>O que você deseja<br/>calcular?</h1>
        <p style={{ color: 'var(--text-muted)' }}>O Assistente Inteligente guiará você.</p>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <CategoryCard 
          icon={<Ruler size={32} color="#F59E0B" />} 
          title="Parede / Muro" 
          desc="Tijolos, blocos, argamassa e acabamentos" 
          onClick={() => setCategory('wall')} 
        />
        <CategoryCard 
          icon={<span style={{ fontSize: 32 }}>🏠</span>} 
          title="Telhado" 
          desc="Madeiramento e telhas" 
          onClick={() => setCategory('roof')} 
        />
        <CategoryCard 
          icon={<span style={{ fontSize: 32 }}>🎨</span>} 
          title="Pintura" 
          desc="Textura, selador e tinta" 
          onClick={() => setCategory('paint')} 
        />
        <CategoryCard 
          icon={<span style={{ fontSize: 32 }}>💧</span>} 
          title="Concreto" 
          desc="Traços FCK e volumes" 
          onClick={() => setCategory('concrete')} 
        />
      </motion.div>
    </motion.div>
  );
}

function CategoryCard({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
  return (
    <motion.div 
      whileHover={{ scale: 0.98, translateY: -2 }}
      whileTap={{ scale: 0.95 }}
      className="glass-panel" 
      onClick={onClick}
      style={{ padding: 20, borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer' }}
    >
      <div style={{ marginBottom: 16 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{title}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</p>
    </motion.div>
  );
}
