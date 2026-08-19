import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import type { PortfolioItem, PublicProfile } from '../../../types/connect';
import { MapPin, User, ChevronLeft, Calendar } from 'lucide-react';

export function PublicPortfolioView({ workId, uid, theme, onBack }: { workId: string, uid: string, theme: string, onBack: () => void }) {
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [workId, uid]);

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'users', uid, 'portfolio'), where('workId', '==', workId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setItem(snap.docs[0].data() as PortfolioItem);
      } else {
        const docSnap = await getDoc(doc(db, 'users', uid, 'portfolio', workId));
        if (docSnap.exists()) {
          setItem(docSnap.data() as PortfolioItem);
        }
      }

      const pSnap = await getDoc(doc(db, 'users', uid, 'public_profile', 'info'));
      if (pSnap.exists()) {
        setProfile(pSnap.data() as PublicProfile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}><p>Carregando portfólio...</p></div>;
  if (!item || !item.isPublic) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}><p>Esta obra não está disponível publicamente.</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(24px)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={{ color: '#FFF', background: 'none', border: 'none', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <span style={{ color: '#FFF', fontWeight: 600, fontSize: 16 }}>Portfólio</span>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px', paddingBottom: 100 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>{item.title}</h1>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24, color: 'var(--text-muted)', fontSize: 14 }}>
          {item.city && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={16} /> {item.city}</div>}
          {item.durationDays && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={16} /> {item.durationDays} dias</div>}
          {item.areaSize && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><strong>{item.areaSize}</strong> m²</div>}
        </div>

        {item.description && (
          <div className="glass-panel" style={{ padding: 20, borderRadius: 16, marginBottom: 32 }}>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{item.description}</p>
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Fotos do Projeto</h2>
          <div style={{ height: 240, backgroundColor: 'var(--bg-surface)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Fotos em breve...</span>
          </div>
        </div>

        {profile && (
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16 }}>Realizado por</h3>
            <div onClick={() => window.location.href = `?connect=${uid}`} className="card-premium-interactive" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>{profile.name.charAt(0)}</span>
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{profile.name}</h4>
                <p style={{ fontSize: 13, color: 'var(--color-primary)' }}>{profile.specialty}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}