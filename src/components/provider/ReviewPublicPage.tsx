import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReviewPublicPage({ providerId }: { providerId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [clientName, setClientName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor, selecione uma nota.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'users', providerId, 'reviews'), {
        rating,
        comment,
        clientName,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (e) {
      alert('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'var(--bg-main)' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#10B981', marginBottom: 24 }}>
          <CheckCircle size={64} />
        </motion.div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, textAlign: 'center' }}>Avaliação Enviada!</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Muito obrigado por ajudar a construir uma comunidade de confiança na CentralObra.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'var(--bg-main)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: 400, padding: 32, borderRadius: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, textAlign: 'center' }}>Avaliar Profissional</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: 32 }}>Como foi sua experiência com este prestador?</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={32}
                fill={(hoverRating || rating) >= i ? '#F59E0B' : 'transparent'}
                color={(hoverRating || rating) >= i ? '#F59E0B' : 'var(--text-muted)'}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i)}
              />
            ))}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Seu Nome</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ex: João da Silva" 
              value={clientName} 
              onChange={e => setClientName(e.target.value)} 
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Comentário (opcional)</label>
            <textarea 
              className="input-field" 
              style={{ minHeight: 100, resize: 'vertical' }}
              placeholder="O que você achou do serviço?" 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 16, padding: 16, borderRadius: 12, opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
        </form>
      </div>
    </div>
  );
}
