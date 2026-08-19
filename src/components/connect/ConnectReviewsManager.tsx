import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Star, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  createdAt: any;
  projectId?: string;
  projectName?: string;
  isPublic?: boolean;
}

export function ConnectReviewsManager() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'reviews'));
      const list = snap.docs.map(d => d.data() as Review).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setReviews(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const reviewLink = `${window.location.origin}${window.location.pathname}#/avaliar/${user?.uid}`;

  const copyLink = () => {
    navigator.clipboard.writeText(reviewLink);
    toast.success('Link copiado!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ backgroundColor: 'var(--bg-base)', padding: 20, borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>Seu Link de Avaliação</h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Envie este link para seus clientes ao final de uma obra para pedir uma avaliação.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="text" readOnly value={reviewLink} className="input-field" style={{ flex: 1, backgroundColor: 'var(--bg-surface)' }} />
          <button onClick={copyLink} className="btn-secondary" style={{ padding: 12, borderRadius: 12 }}>
            <LinkIcon size={16} /> Copiar
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Carregando avaliações...</p>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-base)', borderRadius: 16 }}>
          <Star size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>Nenhuma avaliação recebida.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Comece a enviar seu link para clientes satisfeitos!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {reviews.map(rev => (
            <div key={rev.id} style={{ backgroundColor: 'var(--bg-base)', padding: 20, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{rev.clientName}</h4>
                  {rev.projectName && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Projeto: {rev.projectName}</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontWeight: 800 }}>
                  <Star size={16} fill="#F59E0B" /> {rev.rating}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5, fontStyle: 'italic' }}>"{rev.comment}"</p>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rev.createdAt?.toDate ? rev.createdAt.toDate().toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
