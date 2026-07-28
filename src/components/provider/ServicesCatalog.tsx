import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Briefcase, Clock, Package, Edit3, Trash2, X, Save, Search, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export interface CatalogServiceItem {
  id?: string;
  title: string;
  description: string;
  unit: string;
  suggestedPrice: number;
  averageDays: string;
  notes?: string;
  materials?: string;
  createdAt?: any;
}

const UNITS = ['m²', 'm', 'm³', 'un', 'pt (Ponto)', 'kg', 'saco', 'litro', 'peça', 'dia', 'verba'];

interface ServicesCatalogProps {
  onBack?: () => void;
  onSelectForQuote?: (service: CatalogServiceItem) => void;
}

export function ServicesCatalog({ onBack, onSelectForQuote }: ServicesCatalogProps) {
  const { user, isGuest } = useAuth();
  const [services, setServices] = useState<CatalogServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<CatalogServiceItem | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('m²');
  const [priceInput, setPriceInput] = useState('');
  const [averageDays, setAverageDays] = useState('');
  const [notes, setNotes] = useState('');
  const [materials, setMaterials] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'services_catalog'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as CatalogServiceItem));
        data.sort((a, b) => a.title.localeCompare(b.title));
        setServices(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setServices([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      // LocalStorage for guest
      try {
        const local = localStorage.getItem('co_services_catalog');
        if (local) {
          setServices(JSON.parse(local));
        } else {
          setServices([]);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (items: CatalogServiceItem[]) => {
    localStorage.setItem('co_services_catalog', JSON.stringify(items));
  };

  const openAddModal = () => {
    setEditingService(null);
    setTitle('');
    setDescription('');
    setUnit('m²');
    setPriceInput('');
    setAverageDays('');
    setNotes('');
    setMaterials('');
    setIsModalOpen(true);
  };

  const openEditModal = (srv: CatalogServiceItem) => {
    setEditingService(srv);
    setTitle(srv.title);
    setDescription(srv.description || '');
    setUnit(srv.unit || 'm²');
    setPriceInput(srv.suggestedPrice ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(srv.suggestedPrice) : '');
    setAverageDays(srv.averageDays || '');
    setNotes(srv.notes || '');
    setMaterials(srv.materials || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('O título do serviço é obrigatório.');
      return;
    }

    setSubmitting(true);
    const numericPrice = priceInput ? parseInt(priceInput.replace(/\D/g, '')) / 100 : 0;

    const serviceData: CatalogServiceItem = {
      title,
      description,
      unit,
      suggestedPrice: numericPrice,
      averageDays,
      notes,
      materials,
    };

    try {
      if (user && !isGuest) {
        if (editingService?.id) {
          const docRef = doc(db, 'users', user.uid, 'services_catalog', editingService.id);
          await updateDoc(docRef, { ...serviceData, updatedAt: serverTimestamp() });
          toast.success('Serviço atualizado!');
        } else {
          await addDoc(collection(db, 'users', user.uid, 'services_catalog'), {
            ...serviceData,
            createdAt: serverTimestamp()
          });
          toast.success('Serviço adicionado ao catálogo!');
        }
      } else {
        // Guest mode
        if (editingService?.id) {
          const updated = services.map(s => s.id === editingService.id ? { ...s, ...serviceData } : s);
          setServices(updated);
          saveToLocal(updated);
        } else {
          const newItem = { id: crypto.randomUUID(), ...serviceData };
          const updated = [...services, newItem];
          setServices(updated);
          saveToLocal(updated);
        }
        toast.success('Serviço salvo localmente!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar serviço.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço do catálogo?')) return;
    try {
      if (user && !isGuest) {
        await deleteDoc(doc(db, 'users', user.uid, 'services_catalog', id));
      } else {
        const updated = services.filter(s => s.id !== id);
        setServices(updated);
        saveToLocal(updated);
      }
      toast.success('Serviço removido.');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao remover serviço.');
    }
  };

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(filter.toLowerCase()) ||
    s.description?.toLowerCase().includes(filter.toLowerCase())
  );

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

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
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Catálogo de Serviços</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Serviços cadastrados com preços e prazos padrão</p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Novo Serviço
        </button>
      </div>

      {/* Search Filter */}
      {services.length > 0 && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 13 }} />
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Buscar serviço no catálogo..."
            className="input-premium"
            style={{ paddingLeft: 42, height: 44 }}
          />
        </div>
      )}

      {/* Services List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 16 }} />
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 16 }} />
        </div>
      ) : services.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Seu Catálogo está Vazio</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Cadastre os serviços que você presta (Pintura, Elétrica, Gesso, Alvenaria) com preço por m² ou unidade para orçar rapidamente.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 14, marginTop: 4 }}>
            + Cadastrar Primeiro Serviço
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredServices.map(srv => (
            <motion.div
              key={srv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: 18, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{srv.title}</h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', display: 'inline-block', marginTop: 4 }}>
                    {srv.unit}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>
                    {srv.suggestedPrice > 0 ? fmt(srv.suggestedPrice) : 'Preço Sob Consulta'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>
                    por {srv.unit}
                  </span>
                </div>
              </div>

              {srv.description && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {srv.description}
                </p>
              )}

              {/* Extra Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--text-muted)', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                {srv.averageDays && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} color="var(--color-primary)" /> Prazo médio: {srv.averageDays}
                  </span>
                )}
                {srv.materials && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Package size={14} color="#F59E0B" /> Materiais: {srv.materials}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                {onSelectForQuote ? (
                  <button
                    onClick={() => onSelectForQuote(srv)}
                    className="btn-primary"
                    style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12 }}
                  >
                    Usar no Orçamento
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEditModal(srv)} style={{ background: 'var(--bg-elevated)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => srv.id && handleDelete(srv.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '85vh', overflowY: 'auto' }}
            >
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>
                {editingService ? 'Editar Serviço' : 'Novo Serviço no Catálogo'}
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Nome do Serviço *
                  </label>
                  <input
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ex: Pintura Acrílica Residencial (2 Demãos)"
                    className="input-premium"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                      Unidade de Medida
                    </label>
                    <select value={unit} onChange={e => setUnit(e.target.value)} className="input-premium" style={{ height: 44 }}>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                      Preço Sugerido (R$)
                    </label>
                    <input
                      value={priceInput}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (!val) setPriceInput('');
                        else setPriceInput(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(val) / 100));
                      }}
                      placeholder="R$ 0,00"
                      className="input-premium"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Prazo Médio Estimado
                  </label>
                  <input
                    value={averageDays}
                    onChange={e => setAverageDays(e.target.value)}
                    placeholder="Ex: 5 a 7 dias úteis por 100m²"
                    className="input-premium"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Descrição dos Procedimentos
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Detalhamento técnico do que está incluído no serviço..."
                    className="input-premium"
                    style={{ minHeight: 70, resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Materiais Típicos Utilizados
                  </label>
                  <input
                    value={materials}
                    onChange={e => setMaterials(e.target.value)}
                    placeholder="Ex: Tinta acrílica premium, fita crepe, lixa 150, selador"
                    className="input-premium"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Observações & Recomendações
                  </label>
                  <input
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Ex: Cliente deve fornecer água e energia no local"
                    className="input-premium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}
                >
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Serviço no Catálogo</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
