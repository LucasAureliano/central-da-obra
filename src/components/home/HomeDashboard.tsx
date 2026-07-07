import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, Calculator, Plus, Briefcase, Users, ChevronRight, Building } from 'lucide-react';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { NewWorkModal } from '../NewWorkModal';
import { DailyTipCard } from './DailyTipCard';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

export function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const { user, profile, isGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [works, setWorks] = useState<any[]>([]);
  const [isNewWorkModalOpen, setIsNewWorkModalOpen] = useState(false);

  // Fetch real data
  useEffect(() => {
    if (isGuest || !user) {
      setTimeout(() => setIsLoading(false), 800); // Simulate network
      return;
    }

    const q = query(
      collection(db, 'works'),
      where('userId', '==', user.uid),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const worksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenar no cliente para evitar erro de índice composto no Firestore
      worksData.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setWorks(worksData.slice(0, 5));
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar obras:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, isGuest]);

  // Bento Grid Layout
  if (isLoading) {
    return (
      <div className="screen-content" style={{ padding: '24px 20px 100px 20px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 22 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '50%', height: 20, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '30%', height: 16 }} />
          </div>
        </div>
        <div className="skeleton-glass" style={{ width: '100%', height: 52, borderRadius: 26, marginBottom: 24 }} />
        <div className="skeleton-glass" style={{ width: '100%', height: 140, marginBottom: 24 }} />
      </div>
    );
  }

  return (
    <motion.div 
      className="screen-content" 
      style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
          Olá, {profile?.name ? profile.name.split(' ')[0] : 'Visitante'}
        </h2>
        <div style={{ padding: '6px 12px', borderRadius: 20, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} /> Premium
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gridAutoRows: 'minmax(100px, auto)',
        gap: 16 
      }}>
        
        {/* Bento Item: Overview (Span 2) */}
        <motion.div 
          variants={itemVariants}
          className="card-3d card-premium-interactive"
          style={{ gridColumn: 'span 2', padding: 20, borderRadius: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={() => onNavigate('obras')}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--color-primary)' }}>
              <Briefcase size={18} />
              <span style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Obras Ativas</span>
            </div>
            <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</span>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={24} color="var(--color-primary)" />
          </div>
        </motion.div>

        {/* Bento Item: Calculators (Span 2) */}
        <motion.div 
          variants={itemVariants}
          className="card-mesh-gradient"
          whileHover={{ scale: 0.98, translateY: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onNavigate('library')}
          style={{ 
            gridColumn: 'span 2', padding: 24, borderRadius: 24, cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(255,107,0,0.25)', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator size={20} color="#FFF" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.9)' }}>Assistente Inteligente</span>
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#FFF', marginBottom: 4, lineHeight: 1.2 }}>Calculadoras Técnicas</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0 }}>Gere orçamentos precisos em segundos.</p>
        </motion.div>

        {/* Bento Item: Quick Actions */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (isGuest) document.dispatchEvent(new CustomEvent('open-auth'));
            else setIsNewWorkModalOpen(true);
          }}
          className="card-3d"
          style={{ gridColumn: (profile?.role === 'owner') ? 'span 2' : 'span 1', backgroundColor: 'var(--bg-elevated)', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={24} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Nova Obra</span>
        </motion.div>

        {profile?.role !== 'owner' && (profile?.role as string) !== 'client' && !isGuest && (
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('menu')} // Pode direcionar para a tela de Clientes no futuro
            className="card-3d"
            style={{ gridColumn: 'span 1', backgroundColor: 'var(--bg-elevated)', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#10B98120', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Clientes</span>
          </motion.div>
        )}

        {/* Bento Item: Daily Tip (Span 2) */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 2' }}>
          <DailyTipCard />
        </motion.div>

        {/* Bento Item: Recent Works List (Span 2) */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 2', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, padding: 20, border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Recentes</h3>
            {!isGuest && works.length > 0 && (
              <button onClick={() => onNavigate('obras')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Ver Tudo
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {works.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{isGuest ? 'Faça login para ver suas obras.' : 'Nenhuma obra recente.'}</p>
            ) : (
              works.slice(0, 3).map(work => (
                <div key={work.id} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building size={18} color="var(--text-muted)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{work.name}</h4>
                    <div style={{ width: '100%', height: 4, backgroundColor: 'var(--bg-base)', borderRadius: 2, marginTop: 4 }}>
                      <div style={{ width: `${work.progress || 0}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
      
      <NewWorkModal isOpen={isNewWorkModalOpen} onClose={() => setIsNewWorkModalOpen(false)} />
    </motion.div>
  );
}
