import { useState } from 'react';
import { 
  MapPin, Plus, MoreVertical, Home, ArrowRight, Star, HardHat, Trash2, Edit3, Image, X
} from 'lucide-react';
import { NewWorkModal } from './NewWorkModal';
import { useWorks } from '../contexts/WorksContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useEffect } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import type { Work } from '../types';

interface WorksProps {
  onWorkSelect: (id: string | null) => void;
}

export function Works({ onWorkSelect }: WorksProps) {
  const { works, isLoadingWorks: loading, primaryWork, setPrimaryWork } = useWorks();
  const { profile } = useAuth();
  const isOwner = profile?.role === 'owner' || !profile?.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [contextMenuWorkId, setContextMenuWorkId] = useState<string | null>(null);

  const [localFilteredWorks, setLocalFilteredWorks] = useState<Work[]>([]);
  useEffect(() => {
    const filtered = works.filter(w => {
      if (filter === 'all') return true;
      const progress = w.progress || 0;
      if (filter === 'ongoing') return progress < 100;
      if (filter === 'completed') return progress === 100;
      return true;
    });
    setLocalFilteredWorks(filtered);
  }, [works, filter]);

  const handleReorder = async (newOrder: Work[]) => {
    setLocalFilteredWorks(newOrder);
    const promises = newOrder.map((w, index) => {
      return updateDoc(doc(db, 'works', w.id), { order: index });
    });
    try {
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar ordem');
    }
  };

  // Edit Cover Modal
  const [coverWork, setCoverWork] = useState<Work | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [updatingCover, setUpdatingCover] = useState(false);

  // Edit Work Modal
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editBudget, setEditBudget] = useState(0);
  const [editDeadline, setEditDeadline] = useState('');
  const [updatingWork, setUpdatingWork] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        setNewImageUrl(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const filteredWorks = works.filter(w => {
    if (filter === 'all') return true;
    const progress = w.progress || 0;
    if (filter === 'ongoing') return progress < 100;
    if (filter === 'completed') return progress === 100;
    return true;
  });

  const handleSetPrimary = async (workId: string) => {
    await setPrimaryWork(workId);
    setContextMenuWorkId(null);
    toast.success('Obra principal definida!');
  };

  const handleDelete = async (workId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta obra? Esta ação não pode ser desfeita.')) return;
    try {
      await deleteDoc(doc(db, 'works', workId));
      setContextMenuWorkId(null);
      toast.success('Obra excluída.');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao excluir obra.');
    }
  };

  const handleSaveCover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverWork) return;
    setUpdatingCover(true);
    try {
      await updateDoc(doc(db, 'works', coverWork.id), { image: newImageUrl });
      toast.success('Imagem de capa atualizada!');
      setCoverWork(null);
      setNewImageUrl('');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar capa');
    } finally {
      setUpdatingCover(false);
    }
  };

  const handleSaveWorkDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWork) return;
    setUpdatingWork(true);
    try {
      await updateDoc(doc(db, 'works', editingWork.id), {
        name: editName,
        address: editAddress,
        budget: editBudget,
        deadline: editDeadline
      });
      toast.success('Dados da obra atualizados!');
      setEditingWork(null);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar obra');
    } finally {
      setUpdatingWork(false);
    }
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 24px 20px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)' }}>
          {isOwner ? 'Minhas Obras' : 'Obras'}
        </h1>
        {works.length > 0 && (
          <button className="btn-primary" style={{ padding: '0 16px', height: 40, borderRadius: 12 }} onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span>{isOwner ? 'Nova Obra' : 'Nova'}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          <div className="skeleton-glass" style={{ height: 180, width: '100%', borderRadius: 24 }} />
          <div className="skeleton-glass" style={{ height: 180, width: '100%', borderRadius: 24 }} />
        </div>
      ) : works.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: -60 }}>
          <div style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 12px 40px rgba(var(--color-primary-rgb), 0.15)' }}>
            {isOwner ? <Home size={50} color="var(--color-primary)" /> : <HardHat size={50} color="var(--color-primary)" />}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12, textAlign: 'center' }}>
            {isOwner ? 'Nenhuma Obra Cadastrada' : 'Nenhuma Obra Ativa'}
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 340, lineHeight: 1.5, marginBottom: 32 }}>
            {isOwner 
              ? 'Comece adicionando sua construção para acompanhar progresso, custos e cronograma.'
              : 'Centralize a gestão de custos, equipes e cronogramas. Comece agora adicionando seu primeiro projeto.'}
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary hover-scale" 
            style={{ padding: '0 24px', height: 56, borderRadius: 16, fontSize: 16, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 24px rgba(var(--color-primary-rgb), 0.3)' }}
          >
            <Plus size={24} />
            <span>{isOwner ? 'Criar Minha Obra' : 'Criar Minha Primeira Obra'}</span>
            <ArrowRight size={20} style={{ marginLeft: 8 }} />
          </button>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
            <button 
              onClick={() => setFilter('all')}
              style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', fontWeight: filter === 'all' ? 700 : 600, color: filter === 'all' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: filter === 'all' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 4 }}
            >
              Todas ({works.length})
            </button>
            <button 
              onClick={() => setFilter('ongoing')}
              style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', fontWeight: filter === 'ongoing' ? 700 : 600, color: filter === 'ongoing' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: filter === 'ongoing' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 4 }}
            >
              Em Andamento
            </button>
            <button 
              onClick={() => setFilter('completed')}
              style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', fontWeight: filter === 'completed' ? 700 : 600, color: filter === 'completed' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: filter === 'completed' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 4 }}
            >
              Concluídas
            </button>
          </div>

          {/* List of Works */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, paddingBottom: 40 }}>
            {filteredWorks.map((work, index) => {
              const isPrimary = primaryWork?.id === work.id;
              return (
                <div key={work.id} className={`card-premium card-premium-interactive animate-stagger-${Math.min((index + 1), 5)}`} style={{ padding: 0, position: 'relative', zIndex: contextMenuWorkId === work.id ? 50 : 1 }} onClick={() => onWorkSelect(work.id)}>
                  
                  {/* Image Header */}
                  <div style={{ height: 120, position: 'relative', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }}>
                    {work.image ? (
                      <img src={work.image} alt={work.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: work.colorTheme || 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isOwner ? <Home size={40} color="rgba(255,255,255,0.8)" /> : <HardHat size={40} color="rgba(255,255,255,0.8)" />}
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
                    
                    {/* Primary Badge */}
                    {isPrimary && isOwner && (
                      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, backgroundColor: 'rgba(252, 211, 77, 0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(252, 211, 77, 0.4)' }}>
                        <Star size={12} color="#FCD34D" fill="#FCD34D" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#FCD34D' }}>Principal</span>
                      </div>
                    )}

                    {/* Context Menu Button */}
                    <div 
                      style={{ position: 'absolute', top: 12, right: 12 }}
                      onClick={(e) => { e.stopPropagation(); setContextMenuWorkId(contextMenuWorkId === work.id ? null : work.id); }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', cursor: 'pointer' }}>
                        <MoreVertical size={20} color="#FFF" />
                      </div>
                    </div>
                    
                    <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFF' }}>{work.name}</h3>
                      <span className={`status-chip ${(work.progress || 0) === 100 ? 'status-active' : (work.progress || 0) > 50 ? 'status-warning' : 'status-danger'}`} style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#FFF' }}>
                        {work.status || 'Ativa'}
                      </span>
                    </div>
                  </div>

                  {/* Context Menu Dropdown */}
                  <AnimatePresence>
                    {contextMenuWorkId === work.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="glass-panel"
                        style={{ position: 'absolute', top: 48, right: 12, zIndex: 1000, borderRadius: 14, padding: 6, minWidth: 200, boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}
                      >
                        {isOwner && !isPrimary && (
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSetPrimary(work.id); }}
                            style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer', color: 'var(--text-main)', fontSize: 13, fontWeight: 600 }}
                            className="card-premium-interactive"
                          >
                            <Star size={16} color="#FCD34D" /> Definir como principal
                          </button>
                        )}
                        {isOwner && isPrimary && (
                          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
                            <Star size={16} color="#FCD34D" fill="#FCD34D" /> Obra principal atual
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setContextMenuWorkId(null);
                            setCoverWork(work);
                            setNewImageUrl(work.image || '');
                          }}
                          style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer', color: 'var(--text-main)', fontSize: 13, fontWeight: 600 }}
                          className="card-premium-interactive"
                        >
                          <Image size={16} color="var(--color-primary)" /> Alterar Imagem de Capa
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setContextMenuWorkId(null);
                            setEditingWork(work);
                            setEditName(work.name || '');
                            setEditAddress(work.address || '');
                            setEditBudget(work.budget || 0);
                            setEditDeadline(work.deadline || '');
                          }}
                          style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer', color: 'var(--text-main)', fontSize: 13, fontWeight: 600 }}
                          className="card-premium-interactive"
                        >
                          <Edit3 size={16} /> Editar Dados da Obra
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(work.id); }}
                          style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer', color: '#EF4444', fontSize: 13, fontWeight: 600 }}
                          className="card-premium-interactive"
                        >
                          <Trash2 size={16} /> Excluir Obra
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Card Body */}
                  <div style={{ padding: 20 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <MapPin size={14} />
                      {work.address || 'Endereço não informado'}
                    </p>
                    {/* Only show client for non-owner profiles */}
                    {(!isOwner && work.client) && (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                        <HardHat size={14} /> Cliente: {work.client}
                      </p>
                    )}
                    {(isOwner && (work.providerName || work.client)) && (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                        <HardHat size={14} /> Prestador: {work.providerName || work.client}
                      </p>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Orçamento</p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>
                          {typeof work.budget === 'number' && work.budget > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(work.budget) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Prazo Final</p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{work.deadline || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>
                        <span>
                          {(() => {
                            const p = work.progress || 0;
                            if (p === 0) return 'Planejamento';
                            if (p <= 25) return 'Fundação';
                            if (p <= 60) return 'Estrutura';
                            if (p < 100) return 'Acabamento';
                            return 'Concluída';
                          })()}
                        </span>
                        <span>{work.progress || 0}%</span>
                      </div>
                      <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${work.progress || 0}%`, height: '100%', backgroundColor: (work.progress || 0) === 100 ? '#10B981' : 'var(--color-primary)', borderRadius: 3, transition: 'width 1s ease-out' }} />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}

      <NewWorkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Edit Cover Modal */}
      {coverWork && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: 440, maxHeight: '90dvh', overflowY: 'auto', borderRadius: 28, padding: 24, position: 'relative' }}>
            <button onClick={() => setCoverWork(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Alterar Capa da Obra</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>{coverWork.name}</p>

            <form onSubmit={handleSaveCover} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Upload de Imagem ou URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" placeholder="https://images.unsplash.com/..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="input-field" style={{ flex: 1, height: 44, borderRadius: 12, fontSize: 13 }} />
                  <label className="btn-secondary" style={{ width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, cursor: 'pointer', flexShrink: 0 }}>
                    <Image size={20} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Preset Covers */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Ou Escolha uma Capa Sugerida</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80'
                  ].map((url, idx) => (
                    <div key={idx} onClick={() => setNewImageUrl(url)} style={{ height: 60, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: newImageUrl === url ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)' }}>
                      <img src={url} alt="Preset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setCoverWork(null)} className="btn-secondary" style={{ flex: 1, padding: 12, borderRadius: 14 }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={updatingCover} style={{ flex: 1, padding: 12, borderRadius: 14 }}>
                  {updatingCover ? 'Salvando...' : 'Salvar Capa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Work Modal */}
      {editingWork && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: 440, maxHeight: '90dvh', overflowY: 'auto', borderRadius: 28, padding: 24, position: 'relative' }}>
            <button onClick={() => setEditingWork(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Editar Dados da Obra</h2>

            <form onSubmit={handleSaveWorkDetails} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Nome da Obra</label>
                <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Endereço</label>
                <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Orçamento Previsto (R$)</label>
                <input type="number" value={editBudget} onChange={e => setEditBudget(Number(e.target.value))} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Prazo de Entrega</label>
                <input type="text" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setEditingWork(null)} className="btn-secondary" style={{ flex: 1, padding: 12, borderRadius: 14 }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={updatingWork} style={{ flex: 1, padding: 12, borderRadius: 14 }}>
                  {updatingWork ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Click outside to close context menu */}
      {contextMenuWorkId && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
          onClick={() => setContextMenuWorkId(null)} 
        />
      )}
    </div>
  );
}
