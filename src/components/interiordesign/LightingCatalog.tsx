import { useState } from 'react';
import { ChevronLeft, Search, Filter, Lightbulb, Sun, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LightingItem {
  id: string;
  name: string;
  category: string;
  description: string;
  colorTemp: string; // ex: '3000K (Branco Quente)'
  irc: string; // ex: '>90'
  lumens: string;
  power: string;
  features: string[];
}

const LIGHTING_DB: LightingItem[] = [
  {
    id: 'spot-led-7w',
    name: 'Spot LED Embutir 7W',
    category: 'Spots',
    description: 'Spot direcionável ideal para iluminação de destaque em salas e quartos.',
    colorTemp: '2700K (Ambar)',
    irc: '>80',
    lumens: '560 lm',
    power: '7W',
    features: ['Bivolt', 'Direcionável', 'Facho de 36°']
  },
  {
    id: 'fita-led-5w-ip20',
    name: 'Fita LED 5W/m IP20',
    category: 'Fitas LED',
    description: 'Fita LED para sancas e marcenaria. Uso interno (sem proteção contra água).',
    colorTemp: '3000K (Branco Quente)',
    irc: '>90',
    lumens: '400 lm/m',
    power: '5W/m',
    features: ['Corte a cada 5cm', 'Fita dupla face 3M', 'Requer Fonte 12V']
  },
  {
    id: 'fita-led-12w-ip65',
    name: 'Fita LED 12W/m IP65',
    category: 'Fitas LED',
    description: 'Fita LED de alta potência com proteção de silicone. Ideal para banheiros e cozinhas.',
    colorTemp: '4000K (Branco Neutro)',
    irc: '>85',
    lumens: '1100 lm/m',
    power: '12W/m',
    features: ['Proteção IP65 (Água/Poeira)', 'Alta Luminosidade', 'Requer Fonte 12V']
  },
  {
    id: 'painel-led-18w',
    name: 'Painel LED Embutir Plafon 18W',
    category: 'Plafons',
    description: 'Luminária de embutir com luz difusa para iluminação geral de ambientes.',
    colorTemp: '6000K (Branco Frio)',
    irc: '>70',
    lumens: '1260 lm',
    power: '18W',
    features: ['Bivolt', 'Luz Difusa', 'Driver Incluso']
  },
  {
    id: 'ar111-led-12w',
    name: 'Lâmpada LED AR111 12W',
    category: 'Lâmpadas Direcionais',
    description: 'Lâmpada de alto padrão para destaque de objetos e texturas em pé-direito duplo.',
    colorTemp: '2700K (Branco Quente)',
    irc: '>95',
    lumens: '950 lm',
    power: '12W',
    features: ['Facho estreito 24°', 'Alta Fidelidade de Cor (IRC >95)', 'Dimerizável']
  },
];

interface LightingCatalogProps {
  onBack: () => void;
}

export function LightingCatalog({ onBack }: LightingCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Spots', 'Fitas LED', 'Plafons', 'Lâmpadas Direcionais'];

  const filteredItems = LIGHTING_DB.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Lightbulb size={28} color="#F59E0B" />
        Catálogo de Iluminação
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Explore especificações técnicas de luminárias e LEDs para seu projeto.</p>

      {/* Busca e Filtro */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 11 }} />
          <input 
            type="text" 
            className="input-premium"
            placeholder="Buscar luminárias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 36, backgroundColor: 'var(--bg-input-glass)' }}
          />
        </div>
        <button className="btn-icon" style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <Filter size={18} />
        </button>
      </div>

      {/* Categorias */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, margin: '0 -20px', padding: '0 20px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: selectedCategory === cat ? 'none' : '1px solid var(--border-subtle)',
              background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--bg-glass)',
              color: selectedCategory === cat ? '#FFF' : 'var(--text-main)',
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de Itens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
        {filteredItems.map(item => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ padding: 20, borderRadius: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, display: 'block' }}>
                  {item.category}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{item.name}</h3>
              </div>
            </div>
            
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
              {item.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'var(--bg-input-glass)', padding: 12, borderRadius: 12 }}>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Temp. de Cor</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sun size={14} color="#F59E0B" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{item.colorTemp}</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-input-glass)', padding: 12, borderRadius: 12 }}>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>IRC (Fidelidade)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{item.irc}</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-input-glass)', padding: 12, borderRadius: 12 }}>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Fluxo Luminoso</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lightbulb size={14} color="var(--text-main)" opacity={0.7} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{item.lumens}</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-input-glass)', padding: 12, borderRadius: 12 }}>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Potência</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={14} color="#D946EF" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{item.power}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {item.features.map(feat => (
                <span key={feat} style={{ padding: '4px 8px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-muted)' }}>
                  {feat}
                </span>
              ))}
            </div>
          </motion.div>
        ))}

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhuma luminária encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
