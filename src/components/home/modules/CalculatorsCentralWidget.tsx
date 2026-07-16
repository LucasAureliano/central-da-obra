import { motion } from 'framer-motion';
import { Search, ChevronRight, PaintBucket, Grid, Box, BoxSelect, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface CalculatorsCentralWidgetProps {
  onNavigate: (tab: string, param?: string) => void;
}

export function CalculatorsCentralWidget({ onNavigate }: CalculatorsCentralWidgetProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const shortcuts = [
    { id: 'pintura', name: 'Pintura', icon: PaintBucket, color: '#3B82F6' },
    { id: 'piso', name: 'Piso / Revestimento', icon: Grid, color: '#F59E0B' },
    { id: 'concreto', name: 'Concreto', icon: Box, color: '#6366F1' },
    { id: 'alvenaria', name: 'Alvenaria', icon: BoxSelect, color: '#10B981' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigate('calculos', searchTerm);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.1 }}
      className="glass-panel" 
      style={{ padding: 24, borderRadius: 24, marginBottom: 24, position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={20} color="var(--color-primary)" />
          Central de Cálculos
        </h3>
        <button 
          onClick={() => onNavigate('calculos')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver todas <ChevronRight size={16} />
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Qual calculadora você precisa?" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-premium"
          style={{ paddingLeft: 44, height: 48, borderRadius: 12 }}
        />
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {shortcuts.map((calc) => (
          <motion.button
            key={calc.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('calculos', calc.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              borderRadius: 16, cursor: 'pointer', textAlign: 'left'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${calc.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <calc.icon size={18} color={calc.color} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{calc.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
