import React, { useState } from 'react';
import { BookOpen, Search, Download, ExternalLink, ShieldAlert, FileText, Bookmark } from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: 'abnt' | 'manuais' | 'seguranca';
  size: string;
  date: string;
  isBookmarked?: boolean;
}

const initialLibraryData: LibraryItem[] = [
  { id: 'lib-1', title: 'NBR 6118:2023 - Projeto de estruturas de concreto', description: 'Procedimentos e diretrizes para projetos em concreto armado e protendido.', category: 'abnt', size: '4.2 MB', date: 'Atualizado em 2023' },
  { id: 'lib-2', title: 'NBR 9050:2020 - Acessibilidade', description: 'Acessibilidade a edificações, mobiliário, espaços e equipamentos urbanos.', category: 'abnt', size: '8.1 MB', date: 'Atualizado em 2020' },
  { id: 'lib-3', title: 'NR 18 - Segurança e Saúde no Trabalho na Indústria da Construção', description: 'Norma Regulamentadora principal para segurança em canteiros de obra.', category: 'seguranca', size: '2.5 MB', date: 'Atualizado em 2021' },
  { id: 'lib-4', title: 'NR 35 - Trabalho em Altura', description: 'Requisitos mínimos e medidas de proteção para o trabalho em altura.', category: 'seguranca', size: '1.8 MB', date: 'Atualizado em 2012' },
  { id: 'lib-5', title: 'Manual de Execução de Alvenaria Estrutural', description: 'Boas práticas, paginação e procedimentos para blocos de concreto e cerâmicos.', category: 'manuais', size: '12.4 MB', date: 'Janeiro 2024' },
  { id: 'lib-6', title: 'Guia Prático de Impermeabilização', description: 'Sistemas de impermeabilização rígidos e flexíveis para lajes, banheiros e fundações.', category: 'manuais', size: '5.6 MB', date: 'Março 2025' },
];

export const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'tudo' | 'abnt' | 'manuais' | 'seguranca'>('tudo');
  const [items, setItems] = useState<LibraryItem[]>(initialLibraryData);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'tudo' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    // Simulate network download
    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  const toggleBookmark = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item));
  };

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '24px 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h1 className="text-2xl font-black text-main">Biblioteca Técnica</h1>
          <p className="text-xs text-muted">Acesse normas, manuais e guias de segurança na palma da mão.</p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={18} className="text-muted" style={{ position: 'absolute', left: 16, top: 13 }} />
          <input 
            type="text" 
            placeholder="Pesquisar por NBR, NR ou termo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field" 
            style={{ paddingLeft: 44, borderRadius: 24, backgroundColor: 'var(--bg-surface-hover)' }} 
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="hide-scrollbar" style={{ 
        display: 'flex', 
        padding: '0 16px 16px 16px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        gap: '8px',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none'
      }}>
        <button 
          onClick={() => setActiveCategory('tudo')}
          className={`badge ${activeCategory === 'tudo' ? 'badge-orange' : ''}`}
          style={{ padding: '8px 16px', fontSize: 13, border: '1px solid', borderColor: activeCategory === 'tudo' ? 'transparent' : 'var(--border-medium)', color: activeCategory === 'tudo' ? '#FFF' : 'var(--text-main)', backgroundColor: activeCategory === 'tudo' ? 'var(--color-primary)' : 'transparent', cursor: 'pointer' }}
        >
          Todos
        </button>
        <button 
          onClick={() => setActiveCategory('abnt')}
          className={`badge ${activeCategory === 'abnt' ? 'badge-orange' : ''}`}
          style={{ padding: '8px 16px', fontSize: 13, border: '1px solid', borderColor: activeCategory === 'abnt' ? 'transparent' : 'var(--border-medium)', color: activeCategory === 'abnt' ? '#FFF' : 'var(--text-main)', backgroundColor: activeCategory === 'abnt' ? '#3b82f6' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <FileText size={14} /> Normas ABNT
        </button>
        <button 
          onClick={() => setActiveCategory('seguranca')}
          className={`badge ${activeCategory === 'seguranca' ? 'badge-orange' : ''}`}
          style={{ padding: '8px 16px', fontSize: 13, border: '1px solid', borderColor: activeCategory === 'seguranca' ? 'transparent' : 'var(--border-medium)', color: activeCategory === 'seguranca' ? '#FFF' : 'var(--text-main)', backgroundColor: activeCategory === 'seguranca' ? '#ef4444' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ShieldAlert size={14} /> Seg. do Trabalho (NRs)
        </button>
        <button 
          onClick={() => setActiveCategory('manuais')}
          className={`badge ${activeCategory === 'manuais' ? 'badge-orange' : ''}`}
          style={{ padding: '8px 16px', fontSize: 13, border: '1px solid', borderColor: activeCategory === 'manuais' ? 'transparent' : 'var(--border-medium)', color: activeCategory === 'manuais' ? '#FFF' : 'var(--text-main)', backgroundColor: activeCategory === 'manuais' ? '#22c55e' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <BookOpen size={14} /> Manuais Práticos
        </button>
      </div>

      {/* List */}
      <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
            <Search size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p className="text-sm">Nenhum documento encontrado para "{searchTerm}".</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="card-premium animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                  backgroundColor: item.category === 'abnt' ? 'rgba(59, 130, 246, 0.1)' : item.category === 'seguranca' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.category === 'abnt' ? '#3b82f6' : item.category === 'seguranca' ? '#ef4444' : '#22c55e'
                }}>
                  {item.category === 'abnt' ? <FileText size={24} /> : item.category === 'seguranca' ? <ShieldAlert size={24} /> : <BookOpen size={24} />}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div className="flex-space-between" style={{ alignItems: 'flex-start' }}>
                    <h3 className="text-sm font-bold" style={{ lineHeight: 1.3, marginBottom: 4, paddingRight: 8 }}>{item.title}</h3>
                    <button onClick={() => toggleBookmark(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.isBookmarked ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                      <Bookmark size={18} fill={item.isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <p className="text-xs text-muted" style={{ lineHeight: 1.4, marginBottom: 8 }}>{item.description}</p>
                  
                  <div className="flex-space-between text-xs text-muted">
                    <span style={{ fontWeight: 600 }}>{item.size}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: 'var(--border-light)', margin: '4px 0' }}></div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => handleDownload(item.id)}
                  disabled={downloadingId === item.id}
                  className="btn-primary" 
                  style={{ flex: 1, padding: 8, fontSize: 12, opacity: downloadingId === item.id ? 0.7 : 1 }}
                >
                  {downloadingId === item.id ? (
                    'Baixando...'
                  ) : (
                    <><Download size={14} /> Download PDF</>
                  )}
                </button>
                <button className="btn-secondary" style={{ padding: '8px 12px', fontSize: 12, flex: 0 }}>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
