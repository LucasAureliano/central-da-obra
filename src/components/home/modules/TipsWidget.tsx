import { motion } from 'framer-motion';
import { ChevronRight, Shield, TrendingDown, Package, Wrench } from 'lucide-react';

const tipsData = [
  {
    id: 1,
    category: 'Segurança',
    icon: Shield,
    color: '#F43F5E',
    text: 'Use sempre EPIs completos ao lidar com ferramentas elétricas ou trabalhos em altura.',
  },
  {
    id: 2,
    category: 'Economia',
    icon: TrendingDown,
    color: '#10B981',
    text: 'Comprar materiais a granel (areia, brita, cimento) geralmente reduz o custo final em 15 a 20%.',
  },
  {
    id: 3,
    category: 'Materiais',
    icon: Package,
    color: '#8B5CF6',
    text: 'Armazene cimento sobre estrados de madeira, longe da umidade, empilhando no máximo 10 sacos.',
  },
  {
    id: 4,
    category: 'Técnica',
    icon: Wrench,
    color: '#3B82F6',
    text: 'A cura do concreto é vital. Mantenha a superfície úmida por pelo menos 7 dias após a concretagem.',
  }
];

export function TipsWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  // Use day of the year to pick a static "tip of the day"
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const tip = tipsData[dayOfYear % tipsData.length];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.2 }}
      className="glass-panel" 
      style={{ padding: 20, borderRadius: 24, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 16,
        backgroundColor: `${tip.color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <tip.icon size={24} color={tip.color} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: tip.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Dica de {tip.category}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-main)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
          {tip.text}
        </p>
      </div>

      <button 
        onClick={() => onNavigate('central-tecnica')} // Just an example destination for more tips or articles
        style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-main)', cursor: 'pointer', flexShrink: 0
        }}
      >
        <ChevronRight size={16} />
      </button>
    </motion.div>
  );
}
