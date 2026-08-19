import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorks } from '../../contexts/WorksContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Plus, FileText, Trash2, Edit3, X, Calendar, User as UserIcon } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  creatorName: string;
  createdAt: any;
  updatedAt: any;
}

export function WorkNotes({ onBack }: { onBack: () => void }) {
  const { activeWork } = useWorks();
  const { user, profile } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!activeWork) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'works', activeWork.id, 'notes'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const loaded: Note[] = [];
      snapshot.forEach(doc => {
        loaded.push({ id: doc.id, ...doc.data() } as Note);
      });
      setNotes(loaded);
      setLoading(false);
    });

    return () => unsub();
  }, [activeWork]);

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWork || !user) return;
    if (!title.trim() || !content.trim()) {
      toast.error('Preencha título e conteúdo');
      return;
    }

    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        updatedAt: serverTimestamp(),
      };

      if (editingNote) {
        await updateDoc(doc(db, 'works', activeWork.id, 'notes', editingNote.id), noteData);
        toast.success('Nota atualizada');
      } else {
        await addDoc(collection(db, 'works', activeWork.id, 'notes'), {
          ...noteData,
          createdBy: user.uid,
          creatorName: profile?.name || user.email?.split('@')[0] || 'Usuário',
          createdAt: serverTimestamp(),
        });
        toast.success('Nota criada');
      }
      handleCloseModal();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar nota');
    }
  };

  const handleDelete = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeWork) return;
    if (window.confirm('Excluir esta nota?')) {
      try {
        await deleteDoc(doc(db, 'works', activeWork.id, 'notes', noteId));
        toast.success('Nota excluída');
      } catch (err) {
        toast.error('Erro ao excluir');
      }
    }
  };

  if (!activeWork) {
    return (
      <div className="screen-content" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: 20, color: 'var(--text-main)', marginBottom: 12 }}>Nenhuma obra selecionada</h2>
        <p style={{ color: 'var(--text-muted)' }}>Selecione uma obra para ver as notas.</p>
        <button onClick={onBack} className="btn-primary" style={{ marginTop: 24, padding: '12px 24px', borderRadius: 12 }}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in screen-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={onBack}
            style={{ padding: 8, borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={20} color="var(--text-main)" />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={20} color="var(--color-primary)" />
              Notas da Obra
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 13 }}>{activeWork.name}</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary glow-effect"
          style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={16} /> Nova Nota
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Carregando notas...</div>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 40 }}>
            <FileText size={48} opacity={0.2} style={{ marginBottom: 16 }} />
            <h3>Nenhuma nota encontrada</h3>
            <p>Clique em "Nova Nota" para começar a fazer anotações.</p>
          </div>
        ) : (
          <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleOpenModal(note)}
                  className="glass-panel"
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderLeft: '4px solid #F59E0B'
                  }}
                  whileHover={{ y: -2 }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, paddingRight: 24 }}>{note.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, whiteSpace: 'pre-wrap' }}>
                    {note.content}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                      <UserIcon size={12} /> {note.creatorName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                      <Calendar size={12} /> {note.updatedAt?.toDate().toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <button 
                    onClick={(e) => handleDelete(note.id, e)}
                    style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', opacity: 0.7 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: 600, backgroundColor: 'var(--bg-panel)', borderRadius: 24, display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{editingNote ? 'Editar Nota' : 'Nova Nota'}</h2>
                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input
                    type="text"
                    placeholder="Título da nota..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                    style={{ width: '100%', fontSize: 20, fontWeight: 700, color: 'var(--text-main)', backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                  />
                  <textarea
                    placeholder="Comece a digitar..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    style={{ width: '100%', minHeight: 300, fontSize: 15, lineHeight: 1.6, color: 'var(--text-main)', backgroundColor: 'transparent', border: 'none', outline: 'none', resize: 'vertical' }}
                  />
                </div>
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" onClick={handleCloseModal} className="btn-secondary" style={{ padding: '10px 20px', borderRadius: 12 }}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ padding: '10px 24px', borderRadius: 12, fontWeight: 700 }}>Salvar Nota</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
