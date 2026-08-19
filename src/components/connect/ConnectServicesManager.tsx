import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { ProfessionalService } from '../../types/connect';
import { Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ConnectServicesManager() {
  const { user } = useAuth();
  const [services, setServices] = useState<ProfessionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // New service form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    if (user) fetchServices();
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'public_services'));
      setServices(snap.docs.map(d => ({ ...d.data(), id: d.id } as ProfessionalService)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const newSrv: Omit<ProfessionalService, 'id'> = {
        name,
        description,
        basePrice: basePrice === '' ? undefined : Number(basePrice),
        unit, order: services.length,
        isPublic: true
      };
      
      const docRef = await addDoc(collection(db, 'users', user.uid, 'public_services'), newSrv);
      setServices([...services, { ...newSrv, id: docRef.id }]);
      setIsAdding(false);
      setName('');
      setDescription('');
      setBasePrice('');
      setUnit('');
      toast.success('Serviço adicionado!');
    } catch (e) {
      toast.error('Erro ao adicionar');
    }
  };

  const toggleVisibility = async (id: string, currentVal: boolean) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'public_services', id), { isPublic: !currentVal });
      setServices(services.map(s => s.id === id ? { ...s, isPublic: !currentVal } : s));
    } catch (e) {
      toast.error('Erro ao atualizar status');
    }
  };

  const remove = async (id: string) => {
    if (!user || !confirm('Remover este serviço?')) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'public_services', id));
      setServices(services.filter(s => s.id !== id));
      toast.success('Removido');
    } catch (e) {
      toast.error('Erro ao remover');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>Serviços Oferecidos</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          {isAdding ? 'Cancelar' : <><Plus size={16} /> Novo Serviço</>}
        </button>
      </div>

      {isAdding && (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: 20, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label>Nome do Serviço</label>
              <input type="text" className="input-field" placeholder="Ex: Pintura Residencial" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Descrição</label>
              <textarea className="input-field" placeholder="Descreva os detalhes..." value={description} onChange={e => setDescription(e.target.value)} rows={3} required />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Preço Base Opcional (R$)</label>
                <input type="number" className="input-field" placeholder="Ex: 150" value={basePrice} onChange={e => setBasePrice(e.target.value ? Number(e.target.value) : '')} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Unidade de Cobrança</label>
                <input type="text" className="input-field" placeholder="Ex: m², dia, hora, empreitada" value={unit} onChange={e => setUnit(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: 12 }}>
              Salvar Serviço
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      ) : services.length === 0 && !isAdding ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Nenhum serviço cadastrado.</p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {services.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-base)', padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{s.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{s.description}</p>
                {(s.basePrice || s.unit) && (
                  <p style={{ color: 'var(--color-primary)', fontSize: 12, fontWeight: 700, marginTop: 8 }}>
                    {s.basePrice ? `A partir de R$ ${s.basePrice}` : ''} {s.unit ? ` por ${s.unit}` : ''}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button 
                  onClick={() => toggleVisibility(s.id, s.isPublic)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, border: 'none', backgroundColor: s.isPublic ? 'rgba(16,185,129,0.1)' : 'var(--bg-surface)', color: s.isPublic ? '#10B981' : 'var(--text-muted)' }}
                >
                  <CheckCircle2 size={14} /> {s.isPublic ? 'Público' : 'Oculto'}
                </button>
                <button className="btn-secondary" style={{ padding: 8, borderRadius: 8, color: '#EF4444' }} onClick={() => remove(s.id)}>
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