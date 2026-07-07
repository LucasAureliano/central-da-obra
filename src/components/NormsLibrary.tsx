import { useState } from 'react';
import { ArrowLeft, FileText, Search, ChevronRight } from 'lucide-react';

const NORMS = [
  { id: 'nbr-6118', code: 'NBR 6118', title: 'Projeto de estruturas de concreto', desc: 'Procedimento padrão para projetos de concreto armado.', tags: ['Estrutura', 'Concreto'] },
  { id: 'nbr-5410', code: 'NBR 5410', title: 'Instalações elétricas de baixa tensão', desc: 'Requisitos para segurança em instalações elétricas.', tags: ['Elétrica'] },
  { id: 'nbr-9050', code: 'NBR 9050', title: 'Acessibilidade a edificações', desc: 'Mobiliário, espaços e equipamentos urbanos.', tags: ['Arquitetura', 'Acessibilidade'] },
  { id: 'nbr-15575', code: 'NBR 15575', title: 'Edificações habitacionais — Desempenho', desc: 'Requisitos de desempenho para construções residenciais.', tags: ['Desempenho'] },
  { id: 'nbr-6122', code: 'NBR 6122', title: 'Projeto e execução de fundações', desc: 'Normatização para sapatas, estacas e tubulões.', tags: ['Fundações'] },
  { id: 'nbr-13714', code: 'NBR 13714', title: 'Sistemas de hidrantes e mangotinhos', desc: 'Prevenção e combate a incêndios.', tags: ['Hidráulica', 'Segurança'] },
];

export function NormsLibrary({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');

  const filteredNorms = NORMS.filter(n => 
    n.code.toLowerCase().includes(search.toLowerCase()) || 
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="animate-stagger-1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={24} color="#10B981" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>Normas ABNT</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Consulta rápida e resumos</p>
        </div>
      </div>

      <div className="animate-stagger-2" style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text"
          placeholder="Buscar norma por código ou nome..."
          className="input-premium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 48, backgroundColor: 'var(--bg-input-glass)' }}
        />
      </div>

      <div className="animate-stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredNorms.length > 0 ? (
          filteredNorms.map((norm) => (
            <div 
              key={norm.id} 
              className="glass-panel card-premium-interactive" 
              style={{ display: 'flex', alignItems: 'center', padding: 20, borderRadius: 24, gap: 16 }}
              onClick={() => alert(`Resumo Completo da ${norm.code} em desenvolvimento. Aqui estariam os principais tópicos da norma.`)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {norm.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 100, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{norm.code}</h3>
                <h4 style={{ fontSize: 14, color: 'var(--text-main)', marginTop: 4 }}>{norm.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{norm.desc}</p>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            Nenhuma norma encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
