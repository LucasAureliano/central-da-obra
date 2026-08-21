import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

export function NamePromptModal({ onComplete }: { onComplete?: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: name.trim(), name: name.trim()
      });
      if (onComplete) onComplete(); else window.location.reload();
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--bg-base)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: 400, backgroundColor: 'var(--bg-surface)', padding: 32, borderRadius: 24, border: '1px solid var(--border-subtle)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <User size={32} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: 8 }}>Como podemos te chamar?</h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 32 }}>Para personalizar sua experiência, precisamos saber o seu nome.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>Seu Nome ou Apelido</span>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={18} /></span>
              <input type="text" placeholder="Ex: João Silva" value={name} onChange={(e) => setName(e.target.value)} required autoFocus style={{ width: '100%', padding: '16px 16px 16px 44px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 16, boxSizing: 'border-box' }} />
            </div>
          </div>
          <button type="submit" disabled={isSaving || !name.trim()} className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (isSaving || !name.trim()) ? 0.7 : 1 }}>
            {isSaving ? 'Salvando...' : 'Continuar'} <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
