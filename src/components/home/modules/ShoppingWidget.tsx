import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronRight, Package, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export function ShoppingWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user } = useAuth();
  const [pending, setPending] = useState(0);
  const [purchased, setPurchased] = useState(0);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'shopping'));
    const unsub = onSnapshot(q, (snap) => {
      let p = 0;
      let d = 0;
      snap.forEach(doc => {
        if (doc.data().isPurchased) d++;
        else p++;
      });
      setPending(p);
      setPurchased(d);
    });
    return () => unsub();
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.3 }}
      className="glass-panel" 
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingCart size={18} color="#F59E0B" />
          Lista de Compras
        </h3>
        <button 
          onClick={() => onNavigate('compras')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Mais <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Package size={18} color="#F59E0B" />
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>{pending}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pendentes</span>
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <CheckCircle size={18} color="#10B981" />
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>{purchased}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Comprados</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
