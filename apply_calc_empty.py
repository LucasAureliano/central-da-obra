import os

calc_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Calculators.tsx"
content = open(calc_path, encoding='utf-8').read()

new_content = """import { useState } from 'react';
import { 
  Calculator,
  Search,
  BookOpen,
  Filter,
  ArrowRight
} from 'lucide-react';
import { EmptyState } from './EmptyState';

export function Calculators() {
  const [searchQuery, setSearchQuery] = useState('');

  const calculators = [
    {
      id: 'calc-1',
      title: 'Tijolos e Blocos',
      category: 'Alvenaria',
      icon: <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,107,0,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calculator size={20} /></div>
    },
    {
      id: 'calc-2',
      title: 'Concreto FCK',
      category: 'Estrutura',
      icon: <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calculator size={20} /></div>
    },
    {
      id: 'calc-3',
      title: 'Tinta e Verniz',
      category: 'Acabamento',
      icon: <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(59,130,246,0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calculator size={20} /></div>
    },
    {
      id: 'calc-4',
      title: 'Telhas',
      category: 'Cobertura',
      icon: <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(139,92,246,0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calculator size={20} /></div>
    }
  ];

  const filteredCalc = calculators.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, gap: 24 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)' }}>Cálculos</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Ferramentas de engenharia</p>
        </div>
        <button className="btn-icon">
          <BookOpen size={20} />
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Buscar calculadora..." 
            className="input-premium"
            style={{ paddingLeft: 48 }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-icon">
          <Filter size={20} />
        </button>
      </div>

      {filteredCalc.length === 0 ? (
        <div style={{ marginTop: 16, height: '50vh' }}>
          <EmptyState 
            imageSrc="/assets/empty_calc.jpg"
            title="Nenhum cálculo encontrado"
            description="Não encontramos nenhuma ferramenta com este termo. Tente buscar por categorias como alvenaria, fundação ou telhados."
          />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Populares</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {filteredCalc.map((calc, index) => (
              <div key={calc.id} className={`card-premium card-premium-interactive animate-stagger-${Math.min((index + 1), 5)}`} style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {calc.icon}
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{calc.title}</h4>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{calc.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Normas */}
          <div className="card-premium animate-stagger-5" style={{ background: 'linear-gradient(135deg, var(--bg-elevated) 0%, rgba(255,107,0,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Biblioteca ABNT</h4>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Acesse todas as normas técnicas</p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <ArrowRight size={20} />
            </div>
          </div>
        </>
      )}

    </div>
  );
}
"""
open(calc_path, 'w', encoding='utf-8').write(new_content)
print("Calculators updated")
