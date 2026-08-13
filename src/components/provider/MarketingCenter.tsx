import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { ArrowLeft, Star, Copy, Sparkles, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export function MarketingCenter({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'reviews' | 'social'>('reviews');
  const [copyText, setCopyText] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data: any[] = [];
      let totalRating = 0;
      snap.forEach(d => {
        const docData = d.data() as any;
        const rev = { id: d.id, ...docData };
        data.push(rev);
        totalRating += rev.rating || 5;
      });
      setReviews(data);
    });
    return () => unsub();
  }, [user]);

  const publicLink = `${window.location.origin}/#/avaliar/${user?.uid}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicLink);
    toast.success('Link copiado! Envie para seus clientes.');
  };

  const generateCopy = () => {
    setCopyText("Aqui vai uma dica incrível gerada por IA para você postar no Instagram hoje: 'Sabia que a manutenção preventiva elétrica pode economizar até 30% na sua conta de luz? Agende uma visita! ⚡ #eletricista #obra #manutenção'");
    toast.success('Copy gerado com sucesso!');
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 24px 20px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
        <button 
          onClick={onBack}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer', flexShrink: 0 }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0', lineHeight: 1.2 }}>
            Central de Marketing
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gerencie sua reputação e atraia mais clientes</p>
        </div>
      </div>

      <div className="hide-scrollbar" style={{ display: 'flex', gap: 24, overflowX: 'auto', borderBottom: '1px solid var(--border-subtle)', marginBottom: 24, paddingBottom: 12 }}>
        <button onClick={() => setActiveTab('reviews')} style={{ fontSize: 15, fontWeight: 600, color: activeTab === 'reviews' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'reviews' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 8, whiteSpace: 'nowrap' }}>
          Avaliações
        </button>
        <button onClick={() => setActiveTab('social')} style={{ fontSize: 15, fontWeight: 600, color: activeTab === 'social' ? 'var(--color-primary)' : 'var(--text-muted)', borderBottom: activeTab === 'social' ? '2px solid var(--color-primary)' : 'none', paddingBottom: 8, whiteSpace: 'nowrap' }}>
          Redes Sociais & IA
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--text-main)' }}>{averageRating === '0.0' ? '-' : averageRating}</div>
              <div style={{ display: 'flex', gap: 4, color: '#F59E0B', marginBottom: 8 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={20} fill={i <= parseFloat(averageRating) && averageRating !== '0.0' ? 'currentColor' : 'none'} />)}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}</div>
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Link de Avaliação</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Envie este link para seus clientes após finalizar uma obra para receber avaliações públicas.</p>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, padding: 12, backgroundColor: 'var(--bg-body)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: 'var(--text-muted)' }}>
                  {publicLink}
                </div>
                <button className="btn-primary" style={{ padding: '0 16px', borderRadius: 12 }} onClick={copyToClipboard}>
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Últimas Avaliações</h3>
            {reviews.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-base)', borderRadius: 24 }}>
                <Star size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p>Você ainda não possui avaliações.<br/>Compartilhe seu link com clientes!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map(rev => (
                  <div key={rev.id} style={{ padding: 16, backgroundColor: 'var(--bg-base)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{rev.clientName || 'Cliente'}</span>
                      <div style={{ display: 'flex', color: '#F59E0B' }}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= rev.rating ? 'currentColor' : 'none'} />)}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'social' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Gerador de Posts com IA</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Crie textos persuasivos para suas redes</p>
                </div>
              </div>
              
              <button className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8 }} onClick={generateCopy}>
                <MessageCircle size={20} /> Gerar Texto Automático
              </button>

              {copyText && (
                <div style={{ marginTop: 16, padding: 16, backgroundColor: 'var(--bg-body)', borderRadius: 16, border: '1px solid var(--border-subtle)', position: 'relative' }}>
                  <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: 16 }}>{copyText}</p>
                  <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8 }} onClick={() => { navigator.clipboard.writeText(copyText); toast.success('Texto copiado!'); }}>
                    <Copy size={16} /> Copiar Texto
                  </button>
                </div>
              )}
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Seu Portfólio Digital</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Suas fotos públicas (Em breve)</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>As fotos marcadas como "Publicável" no Diário de Obras aparecerão na sua página pública.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
