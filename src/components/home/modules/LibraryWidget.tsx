import { motion } from 'framer-motion';
import { Search, ChevronRight, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export function LibraryWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const { profile } = useAuth();
  const role = profile?.role || 'owner';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigate('central-tecnica');
    }
  };

  let placeholder = 'Pesquisar normas, materiais, guias...';
  if (role === 'owner') placeholder = 'Pesquisar: Tinta, Piso...';
  if (role === 'service') placeholder = 'Pesquisar: Porcelanato, Execução...';
  if (role === 'architect') placeholder = 'Pesquisar: Laje, NBR, Boas práticas...';
  if (role === 'builder') placeholder = 'Pesquisar: Cronograma, Planejamento...';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.3 }}
      className="glass-panel" 
      style={{ padding: 20, borderRadius: 24, marginBottom: 24, position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={18} color="var(--color-primary)" />
          Biblioteca & Normas
        </h3>
        <button 
          onClick={() => onNavigate('central-tecnica')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Abrir Biblioteca <ChevronRight size={14} />
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ position: 'relative' }}>
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-premium"
          style={{ paddingLeft: 40, height: 44, borderRadius: 12, fontSize: 14 }}
        />
      </form>
    </motion.div>
  );
}
