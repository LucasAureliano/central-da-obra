import { useState, useEffect, useRef } from 'react';
import { Search, Briefcase, Calculator, BookOpen, ChevronRight } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface GlobalSearchProps {
  onNavigateToWork: (id: string) => void;
  onNavigateToCalc: () => void;
  onNavigateToLibrary: () => void;
}

export function GlobalSearch({ onNavigateToWork, onNavigateToCalc, onNavigateToLibrary }: GlobalSearchProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [works, setWorks] = useState<any[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch works for the user once (so we can filter locally for speed)
  useEffect(() => {
    if (!user) return;
    const fetchWorks = async () => {
      const q = query(collection(db, 'works'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      setWorks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchWorks();
  }, [user]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsOpen(val.length > 0);
  };

  const handleSelectWork = (id: string) => {
    setIsOpen(false);
    setSearchTerm('');
    onNavigateToWork(id);
  };

  const handleSelectCalc = () => {
    setIsOpen(false);
    setSearchTerm('');
    onNavigateToCalc();
  };

  const handleSelectLibrary = () => {
    setIsOpen(false);
    setSearchTerm('');
    onNavigateToLibrary();
  };

  // Filter works
  const filteredWorks = works.filter(w => 
    w.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.client?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check for calculator matches
  const hasCalcMatch = "calculadora materiais blocos concreto".includes(searchTerm.toLowerCase());
  
  // Check for library matches
  const hasLibraryMatch = "biblioteca norma abnt 6118 9050 traço".includes(searchTerm.toLowerCase());

  return (
    <div ref={wrapperRef} className="mobile-hidden" style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
      <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
      <input 
        type="text"
        placeholder="Pesquisar obras, calculadoras..."
        className="input-premium"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => { if (searchTerm) setIsOpen(true); }}
        style={{ height: 44, paddingLeft: 44, borderRadius: 22, fontSize: 14, width: '100%', position: 'relative', zIndex: 1 }}
      />

      {isOpen && (
        <div 
          className="glass-panel animate-fade-in" 
          style={{ 
            position: 'absolute', top: 52, left: 0, right: 0, 
            borderRadius: 16, padding: 8, zIndex: 100,
            maxHeight: 400, overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          {filteredWorks.length === 0 && !hasCalcMatch && !hasLibraryMatch && (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>
              Nenhum resultado encontrado.
            </div>
          )}

          {filteredWorks.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 12px' }}>Obras</div>
              {filteredWorks.map(w => (
                <div 
                  key={w.id} 
                  onClick={() => handleSelectWork(w.id)}
                  style={{ padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                  className="card-premium-interactive hover-bg"
                >
                  <Briefcase size={16} color="var(--color-primary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{w.name}</div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}

          {hasCalcMatch && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 12px' }}>Ferramentas</div>
              <div 
                onClick={handleSelectCalc}
                style={{ padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                className="card-premium-interactive hover-bg"
              >
                <Calculator size={16} color="var(--color-success)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Central de Calculadoras</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>
          )}

          {hasLibraryMatch && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 12px' }}>Conhecimento</div>
              <div 
                onClick={handleSelectLibrary}
                style={{ padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                className="card-premium-interactive hover-bg"
              >
                <BookOpen size={16} color="#8B5CF6" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Biblioteca Técnica</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .hover-bg:hover {
          background-color: var(--bg-surface);
        }
      `}</style>
    </div>
  );
}
