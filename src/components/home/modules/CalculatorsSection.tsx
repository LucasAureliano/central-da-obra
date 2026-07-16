import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Droplet, FileText, Zap, BrickWall, PaintRoller, LayoutGrid, Home } from 'lucide-react';

export function CalculatorsSection({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [searchCalc, setSearchCalc] = useState('');

  const calculators = [
    { id: 'concreto', title: 'Concreto', icon: <Droplet size={20} color="var(--color-primary)" /> },
    { id: 'alvenaria', title: 'Alvenaria', icon: <BrickWall size={20} color="#10B981" /> },
    { id: 'pintura', title: 'Pintura', icon: <PaintRoller size={20} color="#F59E0B" /> },
    { id: 'piso', title: 'Pisos', icon: <LayoutGrid size={20} color="#8B5CF6" /> },
    { id: 'telhado', title: 'Cobertura', icon: <Home size={20} color="#6366F1" /> },
    { id: 'hidraulica', title: 'Hidráulica', icon: <Droplet size={20} color="#3B82F6" /> },
    { id: 'eletrica', title: 'Elétrica', icon: <Zap size={20} color="#EF4444" /> },
    { id: 'todas', title: 'Todas', icon: <FileText size={20} color="#64748B" /> },
  ];

  const filteredCalculators = calculators.filter(c => c.title.toLowerCase().includes(searchCalc.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Calculadoras</h3>
      </div>
      
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text"
          placeholder="Pesquisar..."
          className="input-premium"
          value={searchCalc}
          onChange={(e) => setSearchCalc(e.target.value)}
          style={{ paddingLeft: 48, borderRadius: 16 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
        {filteredCalculators.map((calc, i) => (
          <motion.div 
            key={calc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.05) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="glass-panel card-premium-interactive"
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, cursor: 'pointer' }}
            onClick={() => onNavigate('ferramentas')}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {calc.icon}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{calc.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
