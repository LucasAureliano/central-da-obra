import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus,
  MoreVertical,
  Briefcase
} from 'lucide-react';
import { EmptyState3D } from './EmptyState3D';
import { NewWorkModal } from './NewWorkModal';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

interface WorksProps {
  onWorkSelect: (id: string | null) => void;
}

export function Works({ onWorkSelect }: WorksProps) {
  const { user, isGuest } = useAuth();
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed'>('all');

  useEffect(() => {
    if (!user || isGuest) {
      setWorks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'works'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const worksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorks(worksData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching works:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isGuest]);

  const filteredWorks = works.filter(w => {
    if (filter === 'all') return true;
    if (filter === 'ongoing') return w.progress < 100;
    if (filter === 'completed') return w.progress === 100;
    return true;
  });

  return (
    <div className="screen-content animate-fade-in" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, gap: 24, paddingBottom: 100 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)' }}>Obras</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary" style={{ padding: '0 16px', height: 40, borderRadius: 12 }} onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span>Nova</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          <div className="skeleton-glass" style={{ height: 180, width: '100%', borderRadius: 24 }} />
          <div className="skeleton-glass" style={{ height: 180, width: '100%', borderRadius: 24 }} />
          <div className="skeleton-glass" style={{ height: 180, width: '100%', borderRadius: 24 }} />
        </div>
      ) : works.length === 0 ? (
        <div style={{ marginTop: 32 }}>
          <EmptyState3D 
            icon={<Briefcase size={40} />}
            title="Nenhuma obra iniciada"
            description="Você ainda não possui obras cadastradas. Adicione seu primeiro projeto para começar a gerenciar custos e cronograma."
            actionLabel="Criar Primeira Obra"
            onAction={() => setIsModalOpen(true)}
          />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
            <div 
              onClick={() => setFilter('all')}
              style={{ fontSize: 14, cursor: 'pointer', fontWeight: filter === 'all' ? 700 : 600, color: filter === 'all' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: filter === 'all' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 4 }}
            >
              Todas ({works.length})
            </div>
            <div 
              onClick={() => setFilter('ongoing')}
              style={{ fontSize: 14, cursor: 'pointer', fontWeight: filter === 'ongoing' ? 700 : 600, color: filter === 'ongoing' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: filter === 'ongoing' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 4 }}
            >
              Em Andamento
            </div>
            <div 
              onClick={() => setFilter('completed')}
              style={{ fontSize: 14, cursor: 'pointer', fontWeight: filter === 'completed' ? 700 : 600, color: filter === 'completed' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: filter === 'completed' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 4 }}
            >
              Concluídas
            </div>
          </div>

          {/* List of Works */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredWorks.map((work, index) => (
              <div key={work.id} className={`card-premium card-premium-interactive animate-stagger-${Math.min((index + 1), 5)}`} style={{ padding: 0, overflow: 'hidden' }} onClick={() => onWorkSelect(work.id)}>
                
                {/* Image Thumbnail Header */}
                <div style={{ height: 120, position: 'relative' }}>
                  <img src={work.image || 'https://images.unsplash.com/photo-1541888081622-19e5d424b94a?q=80&w=600&auto=format&fit=crop'} alt={work.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {/* Dark Gradient Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
                  
                  <div style={{ position: 'absolute', top: 16, right: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                      <MoreVertical size={20} color="#FFF" />
                    </div>
                  </div>
                  
                  <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFF' }}>{work.name}</h3>
                    <span className={`status-chip ${work.progress === 100 ? 'status-active' : work.progress > 50 ? 'status-warning' : 'status-danger'}`} style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#FFF' }}>
                      {work.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: 20 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                    <MapPin size={14} />
                    {work.address || 'Endereço não informado'}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Orçamento</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{work.budget || 'N/A'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Prazo Final</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{work.deadline || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>
                      <span>Progresso</span>
                      <span>{work.progress || 0}%</span>
                    </div>
                    <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${work.progress || 0}%`, height: '100%', backgroundColor: work.progress === 100 ? 'var(--color-success)' : 'var(--color-primary)', borderRadius: 3, transition: 'width 1s ease-out' }} />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

      <NewWorkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
