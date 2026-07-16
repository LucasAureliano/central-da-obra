import { useState } from 'react';
import { X, Save, Building2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { generateDefaultStages } from '../lib/ChecklistGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface NewWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultImages = [
  'https://images.unsplash.com/photo-1541888081622-19e5d424b94a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop'
];

export function NewWorkModal({ isOpen, onClose }: NewWorkModalProps) {
  const { user, profile } = useAuth();
  
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [address, setAddress] = useState('');
  const [budgetInput, setBudgetInput] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Helper to format currency
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const amount = parseInt(numbers) / 100;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setBudgetInput(formatted);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name) return;

    setIsSubmitting(true);
    try {
      const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
      
      const numericBudget = budgetInput ? parseInt(budgetInput.replace(/\D/g, '')) / 100 : 0;

      const newWorkRef = await addDoc(collection(db, 'works'), {
        userId: user.uid,
        name,
        client,
        address,
        budget: numericBudget,
        deadline: deadline || 'N/A',
        status: 'Em andamento',
        progress: 0,
        image: randomImage,
        createdAt: serverTimestamp(),
      });
      
      // Auto-generate default stages (Checklist)
      const defaultStages = generateDefaultStages();
      const batch = writeBatch(db);
      defaultStages.forEach(stage => {
        const stageRef = doc(collection(db, `works/${newWorkRef.id}/stages`));
        batch.set(stageRef, stage);
      });
      await batch.commit();
      
      onClose();
      setStep(1);
      // Reset form
      setName('');
      setClient('');
      setAddress('');
      setBudgetInput('');
      setDeadline('');
      toast.success('Obra criada com sucesso!');
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Erro ao salvar a obra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
            onClick={onClose}
          />
          
          {/* Modal / Bottom Sheet */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-panel" 
            style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: 500, 
              borderTopLeftRadius: 32, 
              borderTopRightRadius: 32,
              borderBottomLeftRadius: 0, 
              borderBottomRightRadius: 0, 
              padding: '32px 24px calc(24px + env(safe-area-inset-bottom, 0px)) 24px', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderBottom: 'none'
            }}
          >
            <button 
              onClick={onClose}
              style={{ position: 'absolute', top: 24, right: 24, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              {step === 2 && (
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: 0, cursor: 'pointer' }}>
                  <ChevronLeft size={24} />
                </button>
              )}
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Building2 size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Nova Obra</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Etapa {step} de 2</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Nome da Obra *</label>
                    <input 
                      required
                      className="input-premium" 
                      placeholder="Ex: Residencial Alphaville" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                    />
                  </div>
                  {profile?.role !== 'owner' && (
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                        {profile?.role === 'architect' ? 'Cliente' : 'Cliente / Proprietário'}
                      </label>
                      <input 
                        className="input-premium" 
                        placeholder="Ex: João da Silva" 
                        value={client} 
                        onChange={e => setClient(e.target.value)} 
                      />
                    </div>
                  )}
                  {profile?.role === 'owner' && (
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                        Construtor / Empreiteiro (Opcional)
                      </label>
                      <input 
                        className="input-premium" 
                        placeholder="Ex: Construtora Silva" 
                        value={client} 
                        onChange={e => setClient(e.target.value)} 
                      />
                    </div>
                  )}
                  <button 
                    type="button" 
                    className="btn-primary" 
                    style={{ width: '100%', padding: 16, borderRadius: 16, marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}
                    onClick={() => {
                      if (!name) return toast.error('Preencha o nome da obra');
                      setStep(2);
                    }}
                  >
                    Próxima Etapa <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Endereço</label>
                    <input 
                      className="input-premium" 
                      placeholder="Ex: Rua das Flores, 123" 
                      value={address} 
                      onChange={e => setAddress(e.target.value)} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Orçamento Inicial</label>
                      <input 
                        className="input-premium" 
                        placeholder="R$ 0,00" 
                        value={budgetInput} 
                        onChange={handleBudgetChange} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Prazo / Conclusão</label>
                      <input 
                        className="input-premium" 
                        placeholder="Ex: Dez 2024" 
                        value={deadline} 
                        onChange={e => setDeadline(e.target.value)} 
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-primary" 
                    style={{ width: '100%', padding: 16, borderRadius: 16, marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8, opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? (
                      <div style={{ width: 20, height: 20, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <>
                        <Save size={20} />
                        Concluir e Criar
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
