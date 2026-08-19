import { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

export function ProjectPhotoGallery({ projectId }: { projectId: string }) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, `projects/${projectId}/photos`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [projectId]);

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `projects/${projectId}/photos`), {
        url: imageUrl,
        description: imageDescription,
        createdAt: serverTimestamp()
      });
      toast.success('Foto adicionada com sucesso!');
      setIsModalOpen(false);
      setImageUrl('');
      setImageDescription('');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao adicionar foto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (confirm('Tem certeza que deseja apagar esta foto?')) {
      try {
        await deleteDoc(doc(db, `projects/${projectId}/photos`, photoId));
        toast.success('Foto apagada.');
      } catch (e) {
        toast.error('Erro ao apagar foto.');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={20} color="var(--color-primary)" />
            Galeria da Obra
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Registro fotográfico de evolução técnica.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
          <Plus size={16} /> Adicionar Foto
        </button>
      </div>

      {photos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-elevated)', borderRadius: 16 }}>
          <Camera size={48} color="var(--border-subtle)" style={{ marginBottom: 16 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhuma foto adicionada ainda.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {photos.map(photo => (
            <motion.div 
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', backgroundColor: '#000', aspectRatio: '1/1' }}
            >
              <img 
                src={photo.url} 
                alt={photo.description} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
              
              <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, zIndex: 2 }}>
                <p style={{ color: '#fff', fontSize: 11, fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                  {photo.description || 'Sem descrição'}
                </p>
              </div>

              <button
                onClick={() => handleDelete(photo.id)}
                style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ width: '100%', maxWidth: 400, borderRadius: 24, padding: 24, position: 'relative', zIndex: 1 }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Adicionar Foto</h2>
              
              <form onSubmit={handleAddPhoto} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>URL da Imagem *</label>
                  <input required type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="input-premium" />
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Cole o link de uma imagem válida.</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Descrição</label>
                  <input value={imageDescription} onChange={e => setImageDescription(e.target.value)} placeholder="Ex: Vista da sala após pintura" className="input-premium" />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: 14, borderRadius: 12, marginTop: 8, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Foto'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
