import { useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { generateDefaultStages } from '../lib/ChecklistGenerator';

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
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [address, setAddress] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name) return;

    setIsSubmitting(true);
    try {
      const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
      
      const newWorkRef = await addDoc(collection(db, 'works'), {
        userId: user.uid,
        name,
        client,
        address,
        budget: budget || 'R$ 0,00',
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
      // Reset form
      setName('');
      setClient('');
      setAddress('');
      setBudget('');
      setDeadline('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Erro ao salvar a obra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div 
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="glass-panel animate-slide-up" style={{ position: 'relative', width: '100%', maxWidth: 500, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <Building2 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Nova Obra</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Preencha os dados do projeto</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Cliente</label>
            <input 
              className="input-premium" 
              placeholder="Ex: João da Silva" 
              value={client} 
              onChange={e => setClient(e.target.value)} 
            />
          </div>
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
                placeholder="Ex: R$ 50.000" 
                value={budget} 
                onChange={e => setBudget(e.target.value)} 
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
          
          <div style={{ marginTop: 16 }}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary" 
              style={{ width: '100%', padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8, opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? (
                 <div style={{ width: 20, height: 20, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <Save size={20} />
                  Salvar Projeto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
