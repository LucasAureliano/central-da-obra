import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWorks } from '../../contexts/WorksContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { PortfolioItem } from '../../types/connect';
import { Plus, Trash2, Edit2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ConnectPortfolioManager() {
  const { user } = useAuth();
  const { works } = useWorks();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState('');
  
  // New item state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [areaSize, setAreaSize] = useState<number>(0);
  const [durationDays, setDurationDays] = useState<number>(0);

  useEffect(() => {
    if (user) fetchPortfolio();
  }, [user]);

  const fetchPortfolio = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'portfolio'));
      setPortfolio(snap.docs.map(d => ({ ...d.data(), id: d.id } as PortfolioItem)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWork = (workId: string) => {
    const work = works.find(w => w.id === workId);
    if (work) {
      setSelectedWorkId(workId);
      setTitle(work.name || '');
      setCity(typeof work.address === 'string' ? work.address : '');
      setAreaSize(work.areaSize || 0);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const newItem = {
        workId: selectedWorkId,
        title,
        description,
        city,
        areaSize,
        durationDays,
        isPublic: true,
        
      } as Omit<PortfolioItem, 'id'>;
      
      const docRef = await addDoc(collection(db, 'users', user.uid, 'portfolio'), newItem);
      setPortfolio([...portfolio, { ...newItem, id: docRef.id }]);
      setIsAdding(false);
      setSelectedWorkId('');
      toast.success('Adicionado ao portfólio!');
    } catch (e) {
      toast.error('Erro ao adicionar');
    }
  };

  const toggleVisibility = async (id: string, currentVal: boolean) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'portfolio', id), { isPublic: !currentVal });
      setPortfolio(portfolio.map(p => p.id === id ? { ...p, isPublic: !currentVal } : p));
    } catch (e) {
      toast.error('Erro ao atualizar status');
    }
  };

  const remove = async (id: string) => {
    if (!user || !confirm('Remover esta obra do portfólio público?')) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'portfolio', id));
      setPortfolio(portfolio.filter(p => p.id !== id));
      toast.success('Removido');
    } catch (e) {
      toast.error('Erro ao remover');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>Obras no Portfólio</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          {isAdding ? 'Cancelar' : <><Plus size={16} /> Importar Obra</>}
        </button>
      </div>

      {isAdding && (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: 20, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label>Selecionar Obra Existente</label>
              <select className="input-field" value={selectedWorkId} onChange={e => handleSelectWork(e.target.value)} required>
                <option value="">Selecione uma obra...</option>
                {works.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {selectedWorkId && (
              <>
                <div className="input-group">
                  <label>Título Público</label>
                  <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                
                <div className="input-group">
                  <label>Descrição do que foi feito</label>
                  <textarea className="input-field" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Descreva os desafios e resultados..." required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="input-group">
                    <label>Cidade</label>
                    <input type="text" className="input-field" value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Área (m²)</label>
                    <input type="number" className="input-field" value={areaSize} onChange={e => setAreaSize(Number(e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>Duração (dias)</label>
                    <input type="number" className="input-field" value={durationDays} onChange={e => setDurationDays(Number(e.target.value))} />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: 12 }}>
                  Salvar no Portfólio Público
                </button>
              </>
            )}
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      ) : portfolio.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-base)', borderRadius: 16, border: '1px dashed var(--border-subtle)' }}>
          <ImageIcon size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>Nenhuma obra no seu portfólio público.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Importe suas melhores obras para mostrar aos clientes.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {portfolio.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-base)', padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{p.title}</h4>
                <div style={{ display: 'flex', gap: 12, color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                  <span>{p.city}</span>
                  <span>{p.areaSize} m²</span>
                  
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button 
                  onClick={() => toggleVisibility(p.id, p.isPublic)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, border: 'none', backgroundColor: p.isPublic ? 'rgba(16,185,129,0.1)' : 'var(--bg-surface)', color: p.isPublic ? '#10B981' : 'var(--text-muted)' }}
                >
                  <CheckCircle2 size={14} /> {p.isPublic ? 'Público' : 'Oculto'}
                </button>
                <button className="btn-secondary" style={{ padding: 8, borderRadius: 8 }} onClick={() => alert('Módulo de fotos em breve!')} title="Adicionar Fotos (Antes/Depois)">
                  <ImageIcon size={16} />
                </button>
                <button className="btn-secondary" style={{ padding: 8, borderRadius: 8, color: '#EF4444' }} onClick={() => remove(p.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}