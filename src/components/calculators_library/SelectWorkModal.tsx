import { useState, useEffect } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface SelectWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (workId: string) => void;
}

export function SelectWorkModal({ isOpen, onClose, onSelect }: SelectWorkModalProps) {
  const { user, isGuest } = useAuth();
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !user || isGuest) return;

    const fetchWorks = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'works'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWorks(data);
      } catch (err) {
        console.error("Failed to fetch works", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, [isOpen, user, isGuest]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div 
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="glass-panel animate-slide-up" style={{ position: 'relative', width: '100%', maxWidth: 500, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: 24, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <FolderPlus size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Salvar na Obra</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Selecione o projeto</p>
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
               <div style={{ width: 32, height: 32, border: '3px solid var(--border-strong)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
             </div>
          ) : works.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhuma obra cadastrada.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>Vá até a aba "Obras" para criar seu primeiro projeto.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {works.map(work => (
                <button
                  key={work.id}
                  onClick={() => onSelect(work.id)}
                  className="card-premium-interactive"
                  style={{ width: '100%', textAlign: 'left', padding: 16, display: 'flex', alignItems: 'center', gap: 16, border: '1px solid var(--border-subtle)', background: 'var(--bg-input-glass)', borderRadius: 16, cursor: 'pointer' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={work.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{work.name}</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{work.address || 'Sem endereço'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
