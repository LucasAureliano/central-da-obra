import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Image, Filter, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../utils/formatters';

interface PortalGalleryProps {
  workId: string;
}

interface Photo {
  id: string;
  url: string;
  category: string;
  description: string;
  date: string;
}

export default function PortalGallery({ workId }: PortalGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const q = query(collection(db, 'works', workId, 'gallery'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));
        
        // Mock data fallback for previewing if empty
        if (fetched.length === 0) {
          setPhotos([
            { id: '1', url: 'https://images.unsplash.com/photo-1541888081622-1bb2cebf4817?auto=format&fit=crop&q=80', category: 'Fundação', description: 'Concretagem da fundação', date: new Date().toISOString() },
            { id: '2', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80', category: 'Estrutura', description: 'Levantamento de paredes', date: new Date().toISOString() },
            { id: '3', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80', category: 'Acabamento', description: 'Revestimento cerâmico', date: new Date().toISOString() },
          ]);
        } else {
          setPhotos(fetched);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [workId]);

  const categories = ['Todas', ...Array.from(new Set(photos.map(p => p.category)))];

  const filteredPhotos = activeCategory === 'Todas' 
    ? photos 
    : photos.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-glass" style={{ height: '200px', width: '100%' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Filters */}
      <div className="horizontal-scroll hide-scrollbar">
        {categories.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn-secondary animate-fade-in animate-stagger-${Math.min(idx + 1, 5)}`}
            style={{
              height: '40px',
              borderRadius: '20px',
              borderColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--border-subtle)',
              backgroundColor: activeCategory === cat ? 'var(--color-primary-alpha)' : 'transparent',
              color: activeCategory === cat ? 'var(--color-primary)' : 'var(--text-main)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat === 'Todas' && <Filter size={16} />}
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        <AnimatePresence>
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="card-premium"
              style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                <img 
                  src={photo.url} 
                  alt={photo.description}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {photo.category}
                </div>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: 'var(--text-main)' }}>
                  {photo.description || 'Sem descrição'}
                </p>
                {photo.date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <Calendar size={14} />
                    {formatDate(photo.date)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPhotos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
          <Image size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Nenhuma foto encontrada</h3>
          <p>Não há registros fotográficos para esta categoria no momento.</p>
        </div>
      )}
    </div>
  );
}
