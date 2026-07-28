import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Truck, Plus, Search, Star, Trash2, X, Save, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export interface SupplierItem {
  id?: string;
  name: string;
  category: string;
  cnpj?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  paymentTerms?: string;
  rating?: number; // 1 to 5
  notes?: string;
  createdAt?: any;
}

const CATEGORIES = [
  'Materiais Básicos (Cimento/Areia)',
  'Aço e Metalurgia',
  'Material Elétrico',
  'Tubos e Conexões (Hidráulica)',
  'Pisos e Porcelanatos',
  'Tintas e Vernizes',
  'Locação de Equipamentos',
  'EPIs e Segurança'
];

interface SuppliersManagerProps {
  onBack?: () => void;
}

export function SuppliersManager({ onBack }: SuppliersManagerProps) {
  const { user, isGuest } = useAuth();
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30 dias (Boleto)');
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'suppliers'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as SupplierItem));
        setSuppliers(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setSuppliers([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      try {
        const local = localStorage.getItem('co_suppliers');
        if (local) setSuppliers(JSON.parse(local));
        else setSuppliers([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (data: SupplierItem[]) => {
    localStorage.setItem('co_suppliers', JSON.stringify(data));
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setName('');
    setCategory(CATEGORIES[0]);
    setCnpj('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setAddress('');
    setPaymentTerms('30 dias (Boleto)');
    setRating(5);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe o nome da empresa fornecedora.');
      return;
    }

    setSubmitting(true);
    const payload: SupplierItem = {
      name,
      category,
      cnpj,
      phone,
      whatsapp: whatsapp || phone,
      email,
      address,
      paymentTerms,
      rating,
      notes,
    };

    try {
      if (user && !isGuest) {
        if (editingSupplier?.id) {
          const docRef = doc(db, 'users', user.uid, 'suppliers', editingSupplier.id);
          await updateDoc(docRef, { ...payload, updatedAt: serverTimestamp() });
          toast.success('Fornecedor atualizado!');
        } else {
          await addDoc(collection(db, 'users', user.uid, 'suppliers'), {
            ...payload,
            createdAt: serverTimestamp()
          });
          toast.success('Fornecedor cadastrado!');
        }
      } else {
        if (editingSupplier?.id) {
          const updated = suppliers.map(s => s.id === editingSupplier.id ? { ...s, ...payload } : s);
          setSuppliers(updated);
          saveToLocal(updated);
        } else {
          const newItem = { id: crypto.randomUUID(), ...payload };
          const updated = [newItem, ...suppliers];
          setSuppliers(updated);
          saveToLocal(updated);
        }
        toast.success('Fornecedor salvo localmente!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar fornecedor.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este fornecedor cadastrado?')) return;
    try {
      if (user && !isGuest) {
        await deleteDoc(doc(db, 'users', user.uid, 'suppliers', id));
      } else {
        const updated = suppliers.filter(s => s.id !== id);
        setSuppliers(updated);
        saveToLocal(updated);
      }
      toast.success('Fornecedor removido.');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.cnpj && s.cnpj.includes(searchQuery))
  );

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
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Gestão de Fornecedores</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Cadastro corporativo, prazos de pagamento e avaliações</p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Novo Fornecedor
        </button>
      </div>

      {/* Search Input */}
      {suppliers.length > 0 && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 13 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por razão social, CNPJ ou segmento..."
            className="input-premium"
            style={{ paddingLeft: 42, height: 44 }}
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 20 }} />
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 20 }} />
        </div>
      ) : suppliers.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Nenhum Fornecedor Cadastrado</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Organize sua rede de fornecedores homologados para agilizar cotações e faturamentos.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 14, marginTop: 4 }}>
            + Cadastrar Primeiro Fornecedor
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filteredSuppliers.map(s => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: 18, borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{s.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#F59E0B' }}>
                    <Star size={14} fill="#F59E0B" />
                    <span style={{ fontSize: 12, fontWeight: 800 }}>{s.rating || 5}.0</span>
                  </div>
                </div>

                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: 4 }}>{s.category}</span>
                {s.cnpj && <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>CNPJ: {s.cnpj}</span>}
                {s.paymentTerms && <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Prazo: {s.paymentTerms}</span>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                {s.whatsapp ? (
                  <a
                    href={`https://wa.me/55${s.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, color: '#10B981', fontSize: 12, fontWeight: 700 }}
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                ) : <span />}

                <button onClick={() => s.id && handleDelete(s.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Novo Fornecedor */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="glass-panel" style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '85vh', overflowY: 'auto' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Novo Fornecedor Homologado</h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nome Fantasia / Razão Social *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Gerdau Aços do Brasil" className="input-premium" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Categoria de Fornecimento</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="input-premium" style={{ height: 44 }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>CNPJ</label>
                    <input value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" className="input-premium" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>WhatsApp Comercial</label>
                    <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>E-mail de Vendas</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="vendas@fornecedor.com" className="input-premium" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Condição de Pagamento</label>
                    <input value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} placeholder="Ex: 28/56 dias boleto" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Avaliação (1 a 5 estrelas)</label>
                    <select value={rating} onChange={e => setRating(parseInt(e.target.value))} className="input-premium" style={{ height: 44 }}>
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Excelente)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Bom)</option>
                      <option value={3}>⭐⭐⭐ (3 - Regular)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar Fornecedor</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
