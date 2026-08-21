import { Plus, ArrowRight, Calculator, Briefcase, Activity, Sparkles, CheckSquare, GripVertical, Rocket, Target, Users, Clock, AlertCircle, Calendar, CheckCircle, Clipboard, Camera, FileCheck, AlertTriangle, LayoutDashboard, FileSignature } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TiltCard } from './TiltCard';
import { useWorks } from '../contexts/WorksContext';
import { Skeleton } from './ui/Skeleton';

// Import extracted components
import { DashboardMetrics } from './dashboard/DashboardMetrics';
import { DashboardQuickActions } from './dashboard/DashboardQuickActions';
import { DashboardWorks } from './dashboard/DashboardWorks';
import { DashboardTasks } from './dashboard/DashboardTasks';
import { DashboardAssistants } from './dashboard/DashboardAssistants';
import { DashboardTip } from './dashboard/DashboardTip';

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

const DraggableWidget = ({ widgetId, renderFn }: { widgetId: string, renderFn: (controls: any) => any }) => {
  const controls = useDragControls();
  const content = renderFn(controls);
  if (!content) return null;
  return (
    <Reorder.Item value={widgetId} dragListener={false} dragControls={controls} style={{ marginBottom: 40, touchAction: 'pan-y' }}>
      <motion.div variants={itemVariants}>
        {content}
      </motion.div>
    </Reorder.Item>
  );
};

import { TechnicalDashboard } from './dashboard/TechnicalDashboard';


import { ProviderDashboard } from './provider/ProviderDashboard';
import { SponsoredAd } from './shared/SponsoredAd';


export function Dashboard({ onNavigate }: DashboardProps) {
  const { isGuest, profile } = useAuth();
  
  const { works, activeWork, isLoadingWorks } = useWorks();
  
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
      const qStages = query(collection(db, 'works', work.id, 'schedule_stages'), orderBy('order', 'asc'));
      const unsubStages = onSnapshot(qStages, (snap) => {
        let pending: any[] = [];
        snap.forEach(doc => {
          const stage = doc.data();
          if (!stage.completed) {
            pending.push({ 
              title: stage.title, 
              isCompleted: stage.completed, 
              workName: work.name, 
              workId: work.id,
              date: stage.endDate || stage.startDate 
            });
          }
        });
        workTasks[work.id] = pending;
        const allPending = Object.values(workTasks).flat();
        setUpcomingTasks(allPending.slice(0, 3));
      });
      unsubscribeFns.push(unsubStages);
    });

    return () => {
      unsubscribeFns.forEach(fn => fn());
    };
  }, [works]);

  // --- Drag and Drop State ---
  const defaultOrder = ['stats', 'assistants', 'tasks', 'tip', 'works'];
  const [widgetOrder, setWidgetOrder] = useState(() => {
    const saved = localStorage.getItem('centralobra_dashboard_order');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return defaultOrder;
  });

  useEffect(() => {
    localStorage.setItem('centralobra_dashboard_order', JSON.stringify(widgetOrder));
  }, [widgetOrder]);

  if (profile?.role === 'architect' || profile?.role === 'engineer') {
    return <TechnicalDashboard onNavigate={onNavigate} />;
  }

  if (profile?.role === 'service') {
    return <ProviderDashboard onNavigate={onNavigate} />;
  }

  // Loading state
  if (isLoadingWorks) {
    return (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Skeleton height={200} borderRadius={24} variant="glass" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Skeleton height={120} borderRadius={16} variant="glass" />
          <Skeleton height={120} borderRadius={16} variant="glass" />
        </div>
      </div>
    );
  }

  // --- Render Widgets using Extracted Components ---
  const renderStats = () => <DashboardMetrics isGuest={isGuest} profile={profile} works={works} totalSpent={totalSpent} onNavigate={onNavigate} />;
  const renderTasks = () => <DashboardTasks isGuest={isGuest} profile={profile} upcomingTasks={upcomingTasks} onNavigate={onNavigate} />;
  const renderAssistants = () => <DashboardAssistants profile={profile} onNavigate={onNavigate} />;
  const renderTip = () => <DashboardTip />;
  const renderWorks = () => <DashboardWorks isGuest={isGuest} profile={profile} works={works} onNavigate={onNavigate} />;

  const widgetMap: Record<string, () => any> = {
    stats: renderStats,
    assistants: renderAssistants,
    tasks: renderTasks,
    tip: renderTip,
    works: renderWorks
  };

  const isEmptyState = !isGuest && works.length === 0;

  return (
    <motion.div 
      className="screen-content" 
      style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Empty State / Onboarding */}
      {isEmptyState ? (
        <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass-panel" style={{ padding: 32, borderRadius: 24, textAlign: 'center', background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-base) 100%)' }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Rocket size={40} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Sua jornada começa aqui!</h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 32px' }}>
              Você ainda não tem obras cadastradas. A CentralObra é o seu centro de comando para calcular materiais, planejar custos e gerenciar equipes.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, textAlign: 'left', marginBottom: 32 }}>
              <div style={{ padding: 20, borderRadius: 16, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                <Target size={24} color="var(--color-primary)" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Planejamento</h4>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Crie sua primeira obra e comece a adicionar o escopo e orçamento detalhado.</p>
              </div>
              <div style={{ padding: 20, borderRadius: 16, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                <Calculator size={24} color="#8B5CF6" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Assistentes 3D</h4>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Use nossas ferramentas interativas para calcular blocos, concreto, piso e mais.</p>
              </div>
              <div style={{ padding: 20, borderRadius: 16, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                <Users size={24} color="#10B981" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Colaboração</h4>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Convide mestres de obra e clientes para acompanharem o progresso em tempo real.</p>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ padding: '16px 32px', fontSize: 16, display: 'inline-flex', margin: '0 auto' }}
              onClick={() => onNavigate('obras')}
            >
              Criar Minha Primeira Obra <Plus size={20} />
            </button>
          </div>
          
          <div style={{ marginTop: 40 }}>
            {renderAssistants()}
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
              Olá, {(profile as any)?.displayName || '' || 'Usuário'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4 }}>Acompanhe o andamento das suas obras e tarefas.</p>
          </motion.div>

          <div style={{ paddingBottom: 24 }}>
            <SponsoredAd probability={1} location='dashboard_feed' />
          </div>

          {/* Hero Card for Active Work */}
          {activeWork && (
            <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
              <TiltCard 
                style={{ padding: 24, borderRadius: 24, background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => onNavigate('obras')}
              >
                <SponsoredAd probability={0.4} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'var(--color-primary-alpha)', padding: '4px 12px', borderRadius: 12, marginBottom: 12 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-primary)' }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Obra Ativa</span>
                    </div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, margin: 0 }}>
                      {activeWork.name}
                    </h2>
                  </div>
                  <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={24} color="var(--color-primary)" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <SponsoredAd probability={0.4} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Progresso Geral</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>{activeWork.progress || 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: 12, backgroundColor: 'var(--bg-base)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${activeWork.progress || 0}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-primary) 0%, #FF944D 100%)', borderRadius: 6 }} 
                    />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          )}

          {/* Quick Actions (Staggered Grid) */}
          <DashboardQuickActions onNavigate={onNavigate} containerVariants={containerVariants} itemVariants={itemVariants} />

          {/* Reorderable Dashboard for Active Users */}
        <Reorder.Group 
          axis="y" 
          values={widgetOrder} 
          onReorder={setWidgetOrder} 
          style={{ display: 'flex', flexDirection: 'column', listStyle: 'none', padding: 0, margin: 0 }}
        >
          {widgetOrder.map((widgetId: string) => {
            const renderFn = widgetMap[widgetId];
            if (!renderFn) return null;
            return <DraggableWidget key={widgetId} widgetId={widgetId} renderFn={renderFn} />;
          })}
        </Reorder.Group>
        </>
      )}

    </motion.div>
  );
}
