import { Plus, ArrowRight, Calculator, Briefcase, Activity, Sparkles, CheckSquare, GripVertical, Rocket, Target, Users, Clock, AlertCircle, Calendar, CheckCircle, Clipboard, Camera, FileCheck, AlertTriangle, LayoutDashboard, FileSignature } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, Reorder } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TiltCard } from './TiltCard';
import { useWorks } from '../contexts/WorksContext';
import { Skeleton } from './ui/Skeleton';

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

function TechnicalDashboard({ onNavigate }: DashboardProps) {
  const { profile } = useAuth();
  const { works, isLoadingWorks } = useWorks();
  const [insights, setInsights] = useState<any[]>([]);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [pendenciesCount, setPendenciesCount] = useState(0);
  const [delayedCount, setDelayedCount] = useState(0);

  useEffect(() => {
    if (!works || works.length === 0) return;
    let unsubs: any[] = [];
    let combinedInsights: any[] = [];
    let combinedAgenda: any[] = [];
    let localDelayedCount = 0;
    let localPendenciesCount = 0;

    works.forEach(work => {
      // 1. Fetch Stages for Pendencies and Delayed Insights
      const qStages = query(collection(db, 'works', work.id, 'stages'));
      const unsubStages = onSnapshot(qStages, (snap) => {
        snap.forEach(doc => {
          const stage = doc.data();
          if (stage.endDate) {
            const end = new Date(stage.endDate);
            if (end < new Date() && (stage.progress || 0) < 100) {
              localDelayedCount++;
              combinedInsights.push({
                id: doc.id,
                type: 'delayed',
                title: `Etapa Atrasada: ${stage.name}`,
                workName: work.name,
                workId: work.id,
                date: stage.endDate
              });
            }
          }
          if (stage.tasks) {
            stage.tasks.forEach((t: any) => {
              if (t.status === 'pending_approval' || (t.isCompleted === false && t.priority === 'high')) {
                localPendenciesCount++;
                combinedInsights.push({
                  id: t.id || Math.random().toString(),
                  type: 'pendency',
                  title: `Ação Requerida: ${t.title}`,
                  workName: work.name,
                  workId: work.id
                });
              }
            });
          }
        });
        
        setDelayedCount(localDelayedCount);
        setPendenciesCount(localPendenciesCount);
        setInsights(combinedInsights.slice(0, 5));
      });
      unsubs.push(unsubStages);

      // 2. Fetch Events for Agenda
      const qEvents = query(collection(db, 'works', work.id, 'events'));
      const unsubEvents = onSnapshot(qEvents, (snap) => {
        snap.forEach(doc => {
          const event = doc.data();
          if (event.date) {
            combinedAgenda.push({
              id: doc.id,
              title: event.title || 'Visita Técnica',
              workName: work.name,
              date: event.date,
              type: event.type || 'visita'
            });
          }
        });
        setAgenda(combinedAgenda.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 4));
      });
      unsubs.push(unsubEvents);
    });

    return () => unsubs.forEach(u => u());
  }, [works]);

  if (isLoadingWorks) {
    return (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Skeleton height={140} borderRadius={24} variant="glass" />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <Skeleton height={400} borderRadius={24} variant="glass" />
          <Skeleton height={400} borderRadius={24} variant="glass" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="screen-content" 
      style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 100, maxWidth: 1400, margin: '0 auto', width: '100%' }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Info */}
      <motion.div variants={itemVariants} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Olá, {profile?.name || 'Profissional'}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginTop: 4 }}>
            {profile?.role === 'architect' ? 'Painel de Arquitetura & Projetos' : 'Painel de Engenharia & Execução'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" style={{ padding: '10px 16px', borderRadius: 12 }} onClick={() => onNavigate('relatorios')}>
            <FileSignature size={18} />
            Gerar Relatório
          </button>
          <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: 12 }} onClick={() => onNavigate('obras')}>
            <Plus size={18} />
            Nova Vistoria
          </button>
        </div>
      </motion.div>

      {/* KPI Stats (Glassmorphism) */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        <TiltCard style={{ padding: 20, borderRadius: 24, background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} color="#3B82F6" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>Obras Ativas</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
        </TiltCard>

        <TiltCard style={{ padding: 20, borderRadius: 24, background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color="#F59E0B" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>Pendências</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#F59E0B' }}>{pendenciesCount}</div>
        </TiltCard>

        <TiltCard style={{ padding: 20, borderRadius: 24, background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 100%)', border: '1px solid rgba(239, 68, 68, 0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#EF4444" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>Etapas Atrasadas</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#EF4444' }}>{delayedCount}</div>
        </TiltCard>

        <TiltCard style={{ padding: 20, borderRadius: 24, background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => onNavigate('library')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator size={20} color="#10B981" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>Assistentes</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#10B981' }}>Pro</div>
        </TiltCard>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24 }}>
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Quick Actions Bar */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: 20, borderRadius: 24, display: 'flex', gap: 16, overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="btn-action" style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 16, backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
              <Camera size={20} color="#8B5CF6" />
              <span style={{ fontWeight: 600, color: '#8B5CF6' }}>Nova Vistoria</span>
            </div>
            <div className="btn-action" style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 16, backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
              <FileCheck size={20} color="#3B82F6" />
              <span style={{ fontWeight: 600, color: '#3B82F6' }}>Novo Diário de Obra</span>
            </div>
            <div className="btn-action" style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onNavigate('library')}>
              <Calculator size={20} color="#10B981" />
              <span style={{ fontWeight: 600, color: '#10B981' }}>Memória de Cálculo</span>
            </div>
          </motion.div>

          {/* Minhas Obras */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <LayoutDashboard size={24} color="var(--color-primary)" />
                Minhas Obras (Portfólio)
              </h2>
              <button onClick={() => onNavigate('obras')} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Ver todas <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {works.map((work) => (
                <TiltCard key={work.id} style={{ padding: 0, borderRadius: 20, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', overflow: 'hidden', cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
                  <div style={{ height: 100, background: 'linear-gradient(135deg, var(--color-primary-alpha) 0%, rgba(139, 92, 246, 0.1) 100%)', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: (work.progress || 0) >= 100 ? '#10B981' : '#3B82F6', boxShadow: `0 0 10px ${(work.progress || 0) >= 100 ? '#10B981' : '#3B82F6'}` }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {(work.progress || 0) >= 100 ? 'Concluída' : 'Em Execução'}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{work.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Progresso Técnico</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }}>{work.progress || 0}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, backgroundColor: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${work.progress || 0}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 3 }} 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <div style={{ padding: '6px 12px', borderRadius: 8, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={12} /> Equipe: {work.teamCount || 0}
                      </div>
                      <div style={{ padding: '6px 12px', borderRadius: 8, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clipboard size={12} /> Diários: {work.diariesCount || 0}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
              {works.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', backgroundColor: 'var(--bg-base)', borderRadius: 20, border: '1px dashed var(--border-subtle)' }}>
                  <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <h4 style={{ fontSize: 16, color: 'var(--text-main)', fontWeight: 600 }}>Nenhuma obra ativa</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Comece cadastrando um novo projeto para gerenciar.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column (Insights & Agenda) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Technical Insights */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="var(--color-primary)" />
              Insights Técnicos
            </h3>
            {insights.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {insights.map((insight, idx) => (
                  <div key={idx} style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)', borderLeft: `4px solid ${insight.type === 'delayed' ? '#EF4444' : '#F59E0B'}`, display: 'flex', gap: 12 }}>
                    <div style={{ marginTop: 2 }}>
                      {insight.type === 'delayed' ? <AlertCircle size={16} color="#EF4444" /> : <Clock size={16} color="#F59E0B" />}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', margin: '0 0 4px 0', lineHeight: 1.3 }}>{insight.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{insight.workName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 24, textAlign: 'center', backgroundColor: 'var(--bg-base)', borderRadius: 16, border: '1px dashed var(--border-subtle)' }}>
                <CheckCircle size={32} color="#10B981" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Tudo em dia!</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Sem pendências ou atrasos críticos.</p>
              </div>
            )}
          </motion.div>

          {/* Technical Agenda */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} color="#8B5CF6" />
              Agenda Técnica
            </h3>
            {agenda.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {agenda.map((item, idx) => (
                  <div key={idx} style={{ padding: 12, borderRadius: 12, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                      {new Date(item.date).getDate()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', margin: '0 0 2px 0' }}>{item.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{item.workName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 24, textAlign: 'center', backgroundColor: 'var(--bg-base)', borderRadius: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Nenhum evento agendado para os próximos dias.</p>
              </div>
            )}
            <button className="btn-secondary" style={{ width: '100%', marginTop: 16, justifyContent: 'center', borderRadius: 12 }} onClick={() => onNavigate('agenda')}>
              Abrir Agenda Completa
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}


export function Dashboard({ onNavigate }: DashboardProps) {
  const { isGuest, profile } = useAuth();
  
  if (profile?.role === 'architect' || profile?.role === 'engineer') {
    return <TechnicalDashboard onNavigate={onNavigate} />;
  }

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

  // --- Render Widgets ---
  const renderStats = () => {
    if (isGuest) return null;
    return (
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', position: 'relative' }}>
        <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'var(--text-muted)' }}>
          <GripVertical size={20} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Resumo Geral</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {profile?.role === 'owner' ? (
            <>
              <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Minhas Obras</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
              </TiltCard>
              <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Activity size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Gastos Registrados</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-danger)' }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
                </div>
              </TiltCard>
            </>
          ) : profile?.role === 'architect' ? (
            <>
              <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Projetos</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
              </TiltCard>
              <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('library')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Activity size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Assistentes</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>14+</div>
              </TiltCard>
            </>
          ) : profile?.role === 'builder' ? (
            <>
              <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Obras Ativas</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
              </TiltCard>
              <TiltCard style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('equipe')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Activity size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Equipes</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-success)' }}>Ativas</div>
              </TiltCard>
            </>
          ) : (
            <>
              <TiltCard style={{ padding: 16, borderRadius: 16, gridColumn: 'span 2', backgroundColor: 'var(--bg-base)' }} onClick={() => onNavigate('obras')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Obras em Andamento</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>{works.length}</div>
              </TiltCard>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderTasks = () => {
    if (isGuest || !(profile?.role === 'architect' || profile?.role === 'service') || upcomingTasks.length === 0) return null;
    return (
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', position: 'relative' }}>
        <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'var(--text-muted)' }}>
          <GripVertical size={20} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckSquare size={18} color="var(--color-primary)" />
          Próximas Tarefas
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {upcomingTasks.map((task, idx) => (
            <div key={idx} style={{ padding: 16, borderRadius: 12, backgroundColor: 'var(--bg-base)', borderLeft: '4px solid var(--color-primary)', cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{task.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>Obra: {task.workName}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAssistants = () => {
    if (profile?.role === 'owner') return null;
    return (
      <div style={{ position: 'relative' }}>
        <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'rgba(255,255,255,0.6)', zIndex: 10 }}>
          <GripVertical size={20} />
        </div>
        <TiltCard 
          style={{ 
            padding: 24,
            borderRadius: 24,
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #EA580C 100%)',
            boxShadow: '0 8px 32px rgba(255,107,0,0.3)',
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
      </div>
    );
  };

  const renderTip = () => {
    return (
      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, position: 'relative' }}>
        <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'var(--text-muted)' }}>
          <GripVertical size={20} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#8B5CF620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color="#8B5CF6" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 1 }}>Dica Funcional (3D)</span>
        </div>
        <p style={{ fontSize: 15, color: 'var(--text-main)', fontWeight: 600, marginBottom: 8 }}>O tempo de cura do concreto</p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>Lembre-se que o concreto leva cerca de 28 dias para atingir sua resistência máxima (Fck). Mantenha a cura úmida nos primeiros 7 dias para evitar fissuras.</p>
      </div>
    );
  };

  const renderWorks = () => {
    return (
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'var(--text-muted)' }}>
          <GripVertical size={20} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Obras Recentes</h2>
          {!isGuest && works.length > 0 && (
            <button onClick={() => onNavigate('obras')} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Ver todas
            </button>
          )}
        </div>

        {isGuest ? (
          <div style={{ padding: 24, borderRadius: 16, textAlign: 'center', backgroundColor: 'var(--bg-base)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Crie uma conta para salvar obras</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>No modo visitante, o salvamento de projetos está desativado.</p>
            <motion.button 
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => onNavigate('menu')}
            >
              Fazer Cadastro Gratuito
            </motion.button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory' }}>
            {profile?.role !== 'owner' && (
              <motion.div 
                whileHover={{ scale: 0.98, translateY: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('obras')}
                style={{ minWidth: 140, height: 160, borderRadius: 20, border: '2px dashed var(--color-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: 'var(--color-primary-alpha)', cursor: 'pointer', scrollSnapAlign: 'start' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={20} color="#FFF" />
                </div>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 14 }}>Nova Obra</span>
              </motion.div>
            )}

            {works.map((work) => (
              <motion.div 
                key={work.id} 
                whileHover={{ scale: 0.98, translateY: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('obras')}
                style={{ minWidth: 240, height: 160, padding: 20, borderRadius: 20, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', scrollSnapAlign: 'start' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: (work.progress || 0) > 30 ? '#10B981' : '#F59E0B' }} />
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
          </div>
        )}
      </div>
    );
  };

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
      style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 100, maxWidth: 1200, margin: '0 auto', width: '100%' }}
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
          {/* Hero Card for Active Work */}
          {activeWork && (
            <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
              <TiltCard 
                style={{ padding: 24, borderRadius: 24, background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => onNavigate('obras')}
              >
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
          <motion.div 
            variants={containerVariants}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}
          >
            <motion.div variants={itemVariants} className="btn-action glass-panel" onClick={() => onNavigate('financeiro')}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <Activity size={24} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Gastos</span>
            </motion.div>

            <motion.div variants={itemVariants} className="btn-action glass-panel" onClick={() => onNavigate('library')}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <Calculator size={24} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Calc</span>
            </motion.div>

            <motion.div variants={itemVariants} className="btn-action glass-panel" onClick={() => onNavigate('equipe')}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <Users size={24} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Equipe</span>
            </motion.div>

            <motion.div variants={itemVariants} className="btn-action glass-panel" onClick={() => onNavigate('relatorios')}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <Target size={24} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Relatórios</span>
            </motion.div>
          </motion.div>

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
            const content = renderFn();
            if (!content) return null;

            return (
              <Reorder.Item key={widgetId} value={widgetId} style={{ touchAction: 'none', marginBottom: 40 }}>
                <motion.div variants={itemVariants}>
                  {content}
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
        </>
      )}

    </motion.div>
  );
}
