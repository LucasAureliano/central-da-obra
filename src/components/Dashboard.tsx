import { Plus, ArrowRight, Calculator, Briefcase, Activity, Bell, Sparkles, CheckSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TiltCard } from './TiltCard';


interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, isGuest, profile } = useAuth();
  const [works, setWorks] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user || isGuest) return;
    
    const q = query(
      collection(db, 'works'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const worksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorks(worksData);
    });

    return () => unsubscribe();
  }, [user, isGuest]);

  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  useEffect(() => {
    if (works.length === 0) return;

    let unsubscribeFns: any[] = [];
    const workTotals: Record<string, number> = {};
    const workTasks: Record<string, any[]> = {};

    works.forEach(work => {
      // 1. Fetch calculations
      const qCalc = query(collection(db, 'works', work.id, 'calculations'));
      const unsubCalc = onSnapshot(qCalc, (snap) => {
        let workTotal = 0;
        snap.forEach(doc => {
          workTotal += (doc.data().totalCost || 0);
        });
        workTotals[work.id] = workTotal;
        setTotalSpent(Object.values(workTotals).reduce((a,b) => a+b, 0));
      });
      unsubscribeFns.push(unsubCalc);

      // 2. Fetch stages for upcoming tasks
      const qStages = query(collection(db, 'works', work.id, 'stages'), orderBy('order', 'asc'));
      const unsubStages = onSnapshot(qStages, (snap) => {
        let pending: any[] = [];
        snap.forEach(doc => {
          const stage = doc.data();
          if (stage.tasks) {
            stage.tasks.forEach((t: any) => {
              if (!t.isCompleted) {
                pending.push({ ...t, workName: work.name, workId: work.id });
              }
            });
          }
        });
        workTasks[work.id] = pending;
        // Merge and take first 3
        const allPending = Object.values(workTasks).flat();
        setUpcomingTasks(allPending.slice(0, 3));
      });
      unsubscribeFns.push(unsubStages);
    });

    return () => {
      unsubscribeFns.forEach(fn => fn());
    };
  }, [works]);

  return (
    <motion.div 
      className="screen-content" 
      style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 100 }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* Header Profile */}
      <motion.div variants={itemVariants} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            Olá, {user?.email?.split('@')[0] || 'Usuário'}!
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{isGuest ? 'Bem-vindo ao modo visitante' : 'Aqui está o resumo dos seus projetos'}</p>
        </div>
        {!isGuest && (
          <div style={{ position: 'relative' }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={24} color="var(--text-muted)" />
            </div>
            <div style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: 'var(--color-danger)', border: '2px solid var(--bg-main)' }} />
          </div>
        )}
      </motion.div>

      {/* Quick Stats Grid */}
      {!isGuest && (
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          {profile?.role === 'owner' ? (
            <>
              <TiltCard style={{ padding: 16, borderRadius: 20 }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Minhas Obras</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
              </TiltCard>
              <TiltCard style={{ padding: 16, borderRadius: 20 }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Activity size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Gastos Registrados</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-danger)' }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
                </div>
              </TiltCard>
            </>
          ) : profile?.role === 'architect' ? (
            <>
              <TiltCard style={{ padding: 16, borderRadius: 20 }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Projetos</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
              </TiltCard>
              <TiltCard style={{ padding: 16, borderRadius: 20 }} onClick={() => onNavigate('library')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Activity size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Assistentes</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>13+</div>
              </TiltCard>
            </>
          ) : profile?.role === 'builder' ? (
            <>
              <TiltCard style={{ padding: 16, borderRadius: 20 }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Obras Ativas</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
              </TiltCard>
              <TiltCard style={{ padding: 16, borderRadius: 20 }} onClick={() => onNavigate('equipe')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Activity size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Equipes</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-success)' }}>Ativas</div>
              </TiltCard>
            </>
          ) : profile?.role === 'service' ? (
            <>
              <TiltCard style={{ padding: 16, borderRadius: 20, gridColumn: 'span 2' }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Obras em Andamento</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
              </TiltCard>
            </>
          ) : (
            <>
              <TiltCard style={{ padding: 16, borderRadius: 20 }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Obras Ativas</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
              </TiltCard>
              <TiltCard style={{ padding: 16, borderRadius: 20 }} onClick={() => onNavigate('library')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Activity size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Assistentes</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>13+</div>
              </TiltCard>
            </>
          )}
        </motion.div>
      )}

      {/* CORE FEATURE: Upcoming Tasks (Arquiteto e Prestador) */}
      {!isGuest && (profile?.role === 'architect' || profile?.role === 'service') && upcomingTasks.length > 0 && (
        <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckSquare size={18} color="var(--color-primary)" />
            Próximas Tarefas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcomingTasks.map((task, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: 16, borderRadius: 16, borderLeft: '4px solid var(--color-primary)' }} onClick={() => onNavigate('obras')}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{task.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>Obra: {task.workName}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CORE FEATURE: Assistants Banner */}
      {profile?.role !== 'owner' && (
        <TiltCard 
          style={{ 
            padding: 24,
            borderRadius: 24,
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #EA580C 100%)',
            boxShadow: '0 8px 32px rgba(255,107,0,0.3)',
            marginBottom: 32,
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={() => onNavigate('library')}
        >
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.15 }}>
            <Calculator size={140} color="#FFF" />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#FFF" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: '#FFF' }}>Assistentes Técnicos</span>
          </div>
          
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF', marginBottom: 8 }}>
            Orçamentos Precisos em Segundos
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 20, maxWidth: '85%', lineHeight: 1.5 }}>
            Descubra a quantidade exata de blocos, concreto, pisos e tintas. Gere relatórios em PDF com sua taxa de perda!
          </p>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#FFF', fontWeight: 700, fontSize: 15, backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px 20px', borderRadius: 16 }}>
            Abrir Assistentes <ArrowRight size={18} color="#FFF" />
          </div>
        </TiltCard>
      )}
      
      {/* 3D Dica Funcional */}
      <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
        <TiltCard style={{ padding: 20, borderRadius: 20, borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#8B5CF620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#8B5CF6" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 1 }}>Dica Funcional (3D)</span>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-main)', fontWeight: 600, marginBottom: 8 }}>O tempo de cura do concreto</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Lembre-se que o concreto leva cerca de 28 dias para atingir sua resistência máxima (Fck). Mantenha a cura úmida nos primeiros 7 dias para evitar fissuras.</p>
        </TiltCard>
      </motion.div>



      {/* Works Section */}
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Obras Recentes</h2>
        {!isGuest && works.length > 0 && (
          <button onClick={() => onNavigate('obras')} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Ver todas
          </button>
        )}
      </motion.div>

      {isGuest ? (
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: 24, borderRadius: 24, textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Crie uma conta para salvar obras</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>No modo visitante, o salvamento de projetos está desativado.</p>
          <motion.button 
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onNavigate('menu')} // Send them to menu where they can login
          >
            Fazer Cadastro Gratuito
          </motion.button>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, margin: '0 -20px', padding: '0 20px', scrollSnapType: 'x mandatory' }}>
          
          {/* New Work Button */}
          {profile?.role !== 'owner' && (
            <motion.div 
              whileHover={{ scale: 0.98, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('obras')}
              style={{ minWidth: 140, height: 160, borderRadius: 24, border: '2px dashed var(--color-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: 'var(--color-primary-alpha)', cursor: 'pointer', scrollSnapAlign: 'start' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} color="#FFF" />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 14 }}>Nova Obra</span>
            </motion.div>
          )}

          {/* Work Cards */}
          {works.map((work) => (
            <motion.div 
              key={work.id} 
              whileHover={{ scale: 0.98, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('obras')}
              className="glass-panel card-premium-interactive" 
              style={{ minWidth: 240, height: 160, padding: 20, borderRadius: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', scrollSnapAlign: 'start' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: work.progress > 30 ? '#10B981' : '#F59E0B' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{work.status || 'Em andamento'}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{work.name}</h3>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progresso</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>
                    <span>{work.progress || 0}</span>%
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${work.progress || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 3 }} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

    </motion.div>
  );
}
