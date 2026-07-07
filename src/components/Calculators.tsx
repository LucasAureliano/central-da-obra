import { useState } from 'react';
import { Search, ChevronRight, Ruler, Droplet, Hammer, FileText } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { MaterialsCalculator } from './MaterialsCalculator';
import { ConcreteCalculator } from './ConcreteCalculator';
import { RoofCalculator } from './RoofCalculator';
import { NormsLibrary } from './NormsLibrary';

export function Calculators() {
  const [search, setSearch] = useState('');
  const [activeCalc, setActiveCalc] = useState<string | null>(null);

  const allTools = [
    { id: 'materiais', title: 'Calculadora de Materiais', desc: 'Tijolos, blocos e argamassa', icon: <Ruler size={24} color="#F59E0B" />, category: 'Essencial' },
    { id: 'concreto', title: 'Traço de Concreto (FCK)', desc: 'Cimento, areia, brita e água', icon: <Droplet size={24} color="#3B82F6" />, category: 'Estrutura' },
    { id: 'telhado', title: 'Madeiramento de Telhado', desc: 'Caibros, ripas e telhas', icon: <Hammer size={24} color="#8B5CF6" />, category: 'Cobertura' },
    { id: 'normas', title: 'Biblioteca de Normas', desc: 'Consulta rápida ABNT', icon: <FileText size={24} color="#10B981" />, category: 'Consulta' },
  ];

  const filteredTools = allTools.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  if (activeCalc === 'materiais') return <MaterialsCalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'concreto') return <ConcreteCalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'telhado') return <RoofCalculator onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'normas') return <NormsLibrary onBack={() => setActiveCalc(null)} />;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <div className="animate-stagger-1" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Ferramentas</h1>
        <p style={{ color: 'var(--text-muted)' }}>Cálculos e normas na palma da mão.</p>
      </div>

      <div className="animate-stagger-2" style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text"
          placeholder="Buscar calculadora..."
          className="input-premium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 48 }}
        />
      </div>

      <div className="animate-stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div 
              key={tool.id} 
              className="glass-panel card-premium-interactive" 
              style={{ display: 'flex', alignItems: 'center', padding: 20, borderRadius: 24, gap: 16 }}
              onClick={() => {
                if (tool.id === 'materiais') setActiveCalc('materiais');
                else if (tool.id === 'concreto') setActiveCalc('concreto');
                else if (tool.id === 'telhado') setActiveCalc('telhado');
                else if (tool.id === 'normas') setActiveCalc('normas');
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
                {tool.icon}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{tool.category}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{tool.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{tool.desc}</p>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          ))
        ) : (
          <EmptyState 
            title="Nenhuma ferramenta encontrada"
            description="Não encontramos nenhuma calculadora com esse nome."
            imageSrc="/assets/empty_calc.jpg"
            actionLabel="Limpar Busca"
            onAction={() => setSearch('')}
          />
        )}
      </div>
    </div>
  );
}
