import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, Ruler, ShieldAlert, ChevronRight, RefreshCw, X } from 'lucide-react';

const TIPS = [
  {
    id: 1,
    type: 'norma',
    title: 'NBR 15575 - Desempenho',
    content: 'Fique atento aos requisitos de desempenho acústico nas alvenarias de vedação. Paredes entre unidades diferentes exigem no mínimo 45 dB de isolamento.',
    icon: ShieldAlert,
    color: '#EF4444'
  },
  {
    id: 2,
    type: 'arquitetura',
    title: 'Iluminação Natural',
    content: 'O uso de iluminação zenital pode reduzir o consumo de energia em até 30% em galpões e áreas de pé direito duplo.',
    icon: Lightbulb,
    color: '#F59E0B'
  },
  {
    id: 3,
    type: 'engenharia',
    title: 'Cura do Concreto',
    content: 'A cura úmida nos primeiros 7 dias é vital para evitar fissuras de retração e garantir a resistência de projeto (fck).',
    icon: Ruler,
    color: '#3B82F6'
  },
  {
    id: 4,
    type: 'dica',
    title: 'Gestão de Obras',
    content: 'Registre as condições climáticas no Diário de Obra todos os dias. Isso resguarda a construtora em caso de atrasos no cronograma.',
    icon: BookOpen,
    color: '#8B5CF6'
  }
];

export function DailyTipCard() {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Randomize daily tip on mount based on date
  useEffect(() => {
    const today = new Date().getDate();
    setCurrentTip(today % TIPS.length);
  }, []);

  const handleNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % TIPS.length);
  };

  if (!isVisible) return null;

  const tip = TIPS[currentTip];
  const Icon = tip.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ marginBottom: 32 }}
    >
      <div 
        className="card-3d" 
        style={{ 
          padding: 20, 
          borderRadius: 24,
          position: 'relative'
        }}
      >
        <button 
          onClick={() => setIsVisible(false)}
          style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: `${tip.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={24} color={tip.color} />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="text-3d" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: tip.color }}>
                DICA • {tip.type}
              </span>
            </div>
            
            <h3 className="text-3d" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
              {tip.title}
            </h3>
            
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
              {tip.content}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={handleNextTip}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                <RefreshCw size={14} /> Outra Dica
              </button>
              
              <button 
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: tip.color, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Saber Mais <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
