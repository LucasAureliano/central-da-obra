import React, { useState, useEffect } from 'react';
import { Truck, Search, Plus, Trash2, X, Save, ArrowLeft } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export type EquipStatus = 'Em Operação' | 'Em Manutenção' | 'Disponível';

export interface EquipmentItem {
  id?: string;
  assetTag: string;
  name: string;
  category: string;
  status: EquipStatus;
  currentSite?: string;
  responsible?: string;
  nextMaintenance?: string;
  notes?: string;
  createdAt?: any;
}

const CATEGORIES = [
  'Maquinário Pesado (Escavadeira/Retro)',
  'Betoneira & Misturador',
  'Geradores & Compressores',
  'Andaimes & Alcoras',
  'Ferramentas Elétricas',
  'Veículos & Transporte'
];

export const EquipmentControl: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { user, isGuest } = useAuth();
  const [equipments, setEquipments] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquip, setEditingEquip] = useState<EquipmentItem | null>(null);

  // Form states
  const [assetTag, setAssetTag] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState<EquipStatus>('Em Operação');
  const [currentSite, setCurrentSite] = useState('Obra Principal');
  const [responsible, setResponsible] = useState('');
  const [nextMaintenance, setNextMaintenance] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'equipment_items'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as EquipmentItem));
        setEquipments(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setEquipments([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      try {
        const local = localStorage.getItem('co_equipment_items');
        if (local) setEquipments(JSON.parse(local));
        else setEquipments([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (data: EquipmentItem[]) => {
    localStorage.setItem('co_equipment_items', JSON.stringify(data));
  };

  const openAddModal = () => {
    setEditingEquip(null);
    setAssetTag(`PAT-${Math.floor(1000 + Math.random() * 9000)}`);
    setName('');
    setCategory(CATEGORIES[0]);
    setStatus('Em Operação');
    setCurrentSite('Obra Principal');
    setResponsible(user?.displayName || 'Encarregado de Equipamentos');
    setNextMaintenance('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe a descrição do equipamento.');
      return;
    }

    setSubmitting(true);
    const payload: EquipmentItem = {
      assetTag: assetTag || `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      category,
      status,
      currentSite,
      responsible,
      nextMaintenance,
      notes,
    };

    try {
      if (user && !isGuest) {
        if (editingEquip?.id) {
          const docRef = doc(db, 'users', user.uid, 'equipment_items', editingEquip.id);
          await updateDoc(docRef, { ...payload, updatedAt: serverTimestamp() });
          toast.success('Equipamento atualizado!');
        } else {
          await addDoc(collection(db, 'users', user.uid, 'equipment_items'), {
            ...payload,
            createdAt: serverTimestamp()
          });
          toast.success('Equipamento cadastrado!');
        }
      } else {
        if (editingEquip?.id) {
          const updated = equipments.map(e => e.id === editingEquip.id ? { ...e, ...payload } : e);
          setEquipments(updated);
          saveToLocal(updated);
        } else {
          const newItem = { id: crypto.randomUUID(), ...payload };
          const updated = [newItem, ...equipments];
          setEquipments(updated);
          saveToLocal(updated);
        }
        toast.success('Equipamento salvo localmente!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar equipamento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este equipamento patrimonial?')) return;
    try {
      if (user && !isGuest) {
        await deleteDoc(doc(db, 'users', user.uid, 'equipment_items', id));
      } else {
        const updated = equipments.filter(e => e.id !== id);
        setEquipments(updated);
        saveToLocal(updated);
      }
      toast.success('Equipamento removido.');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEquip = equipments.filter(e =>
    e.name.toLowerCase().includes(filter.toLowerCase()) ||
    e.assetTag.toLowerCase().includes(filter.toLowerCase()) ||
    (e.currentSite && e.currentSite.toLowerCase().includes(filter.toLowerCase()))
  );

  const getStatusColor = (st: EquipStatus) => {
    switch (st) {
      case 'Disponível': return '#10B981';
      case 'Em Operação': return '#3B82F6';
      case 'Em Manutenção': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Equipamentos & Patrimônio</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Controle de maquinário, alocações e manutenção</p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Novo Equipamento
        </button>
      </div>

      {/* Search Input */}
      {equipments.length > 0 && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 13 }} />
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Buscar por patrimônio, nome ou obra..."
            className="input-premium"
            style={{ paddingLeft: 42, height: 44 }}
          />
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 110, borderRadius: 20 }} />
          <div className="skeleton-glass" style={{ height: 110, borderRadius: 20 }} />
        </div>
      ) : equipments.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Nenhum Equipamento Cadastrado</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Cadastre betoneiras, geradores, veículos e ferramentas para controlar patrimônio e manutenção.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 14, marginTop: 4 }}>
            + Cadastrar Primeiro Equipamento
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {filteredEquip.map(e => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: 18, borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12, borderLeft: `4px solid ${getStatusColor(e.status)}` }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-alpha)', padding: '2px 8px', borderRadius: 6 }}>
                      {e.assetTag}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 2px' }}>{e.name}</h3>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: getStatusColor(e.status) }}>
                    {e.status}
                  </span>
                </div>

                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>{e.category}</span>
                <span style={{ fontSize: 12, color: 'var(--text-main)', display: 'block', marginTop: 4 }}>Alocado em: <strong>{e.currentSite || 'Central'}</strong></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Resp: {e.responsible || 'Engenharia'}</span>
                <button onClick={() => e.id && handleDelete(e.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Add Equipamento */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="glass-panel" style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '85vh', overflowY: 'auto' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Novo Equipamento Patrimonial</h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nº Patrimônio</label>
                    <input value={assetTag} onChange={e => setAssetTag(e.target.value)} placeholder="PAT-1092" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nome do Equipamento *</label>
                    <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Betoneira 400L CSM" className="input-premium" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Categoria</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="input-premium" style={{ height: 44 }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Situação Operacional</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="input-premium" style={{ height: 44 }}>
                      <option value="Em Operação">Em Operação</option>
                      <option value="Disponível">Disponível</option>
                      <option value="Em Manutenção">Em Manutenção</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Obra Alocada</label>
                    <input value={currentSite} onChange={e => setCurrentSite(e.target.value)} placeholder="Ex: Edifício Horizonte" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Responsável</label>
                    <input value={responsible} onChange={e => setResponsible(e.target.value)} placeholder="Mestre de Obras" className="input-premium" />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Equipamento</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
