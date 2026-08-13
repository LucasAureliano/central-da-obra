import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TiltCard } from '../TiltCard';
import { Skeleton } from '../ui/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useWorks } from '../../contexts/WorksContext';
import { Plus, Calculator, Briefcase, Activity, Sparkles, Target, Users, Clock, AlertCircle, Calendar, CheckCircle, Clipboard, Camera, FileCheck, AlertTriangle, LayoutDashboard, FileSignature, ArrowRight } from 'lucide-react';

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

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function TechnicalDashboard({ onNavigate }: DashboardProps) {
  const { profile, user } = useAuth();
  const { works, isLoadingWorks } = useWorks();
  const [projects, setProjects] = useState<any[]>([]);
  
  const isArchitect = profile?.role === 'architect' || profile?.role === 'engineer';
  const [insights, setInsights] = useState<any[]>([]);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [pendenciesCount, setPendenciesCount] = useState(0);
  const [delayedCount, setDelayedCount] = useState(0);

  useEffect(() => {
    if (isArchitect && user) {
      const q = query(collection(db, 'projects'), where('userId', '==', user.uid));
      const unsub = onSnapshot(q, (snap) => {
        const loaded: any[] = [];
        snap.forEach(doc => loaded.push({ id: doc.id, ...doc.data() }));
        setProjects(loaded);
      });
      return () => unsub();
    }
  }, [isArchitect, user]);

  useEffect(() => {
    if (!works || works.length === 0) return;
    let unsubs: any[] = [];
    
    // Use objects to hold data per work to avoid infinite growing arrays
    const insightsByWork: Record<string, any[]> = {};
    const agendaByWork: Record<string, any[]> = {};
    const countsByWork: Record<string, { delayed: number, pendencies: number }> = {};

    const updateAggregates = () => {
      let totalDelayed = 0;
      let totalPendencies = 0;
      let allInsights: any[] = [];
      let allAgenda: any[] = [];
      
      Object.values(countsByWork).forEach(c => {
        totalDelayed += c.delayed;
        totalPendencies += c.pendencies;
      });
      
      Object.values(insightsByWork).forEach(arr => {
        allInsights = [...allInsights, ...arr];
      });
      
      Object.values(agendaByWork).forEach(arr => {
        allAgenda = [...allAgenda, ...arr];
      });
      
      setDelayedCount(totalDelayed);
      setPendenciesCount(totalPendencies);
      setInsights(allInsights.slice(0, 5));
      setAgenda(allAgenda.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 4));
    };

    works.forEach(work => {
      // 1. Fetch Stages for Pendencies and Delayed Insights
      const qStages = query(collection(db, 'works', work.id, 'schedule_stages'));
      const unsubStages = onSnapshot(qStages, (snap) => {
        let workInsights: any[] = [];
        let delayed = 0;
        let pendencies = 0;
        
        snap.forEach(doc => {
          const stage = doc.data();
          if (stage.endDate) {
            const end = new Date(stage.endDate);
            if (end < new Date() && !stage.completed) {
              delayed++;
              workInsights.push({
                id: doc.id,
                type: 'delayed',
                title: `Etapa Atrasada: ${stage.title}`,
                workName: work.name,
                workId: work.id,
                date: stage.endDate
              });
            }
          }
          if (!stage.completed && stage.startDate) {
            const start = new Date(stage.startDate);
            if (start <= new Date()) {
                pendencies++;
                workInsights.push({
                  id: doc.id,
                  type: 'pendency',
                  title: `Etapa Pendente: ${stage.title}`,
                  workName: work.name,
                  workId: work.id
                });
            }
          }
        });
        
        insightsByWork[work.id] = workInsights;
        countsByWork[work.id] = { delayed, pendencies };
        updateAggregates();
      });
      unsubs.push(unsubStages);

      // 2. Fetch Events for Agenda
      const qEvents = query(collection(db, 'works', work.id, 'events'));
      const unsubEvents = onSnapshot(qEvents, (snap) => {
        let workAgenda: any[] = [];
        snap.forEach(doc => {
          const event = doc.data();
          if (event.date) {
            workAgenda.push({
              id: doc.id,
              title: event.title || 'Visita Técnica',
              workName: work.name,
              date: event.date,
              type: event.type || 'visita'
            });
          }
        });
        agendaByWork[work.id] = workAgenda;
        updateAggregates();
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
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>
              {isArchitect ? 'Projetos Ativos' : 'Obras Ativas'}
            </span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>
            {isArchitect ? projects.length : works.length}
          </div>
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
            {isArchitect ? (
              <>
                <div className="btn-action" style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 16, backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
                  <Camera size={20} color="#8B5CF6" />
                  <span style={{ fontWeight: 600, color: '#8B5CF6' }}>Novo Projeto</span>
                </div>
                <div className="btn-action" style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 16, backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onNavigate('diario-tecnico')}>
                  <FileCheck size={20} color="#3B82F6" />
                  <span style={{ fontWeight: 600, color: '#3B82F6' }}>Novo Diário Técnico</span>
                </div>
              </>
            ) : (
              <>
                <div className="btn-action" style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 16, backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
                  <Camera size={20} color="#8B5CF6" />
                  <span style={{ fontWeight: 600, color: '#8B5CF6' }}>Nova Vistoria</span>
                </div>
                <div className="btn-action" style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 16, backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
                  <FileCheck size={20} color="#3B82F6" />
                  <span style={{ fontWeight: 600, color: '#3B82F6' }}>Novo Diário de Obra</span>
                </div>
              </>
            )}
            <div className="btn-action" style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onNavigate('library')}>
              <Calculator size={20} color="#10B981" />
              <span style={{ fontWeight: 600, color: '#10B981' }}>Memória de Cálculo</span>
            </div>
          </motion.div>

          {/* Minhas Obras / Projetos */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <LayoutDashboard size={24} color="var(--color-primary)" />
                {isArchitect ? 'Meus Projetos (Portfólio)' : 'Minhas Obras (Portfólio)'}
              </h2>
              <button onClick={() => onNavigate('obras')} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Ver {isArchitect ? 'todos' : 'todas'} <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {(isArchitect ? projects : works).map((item) => (
                <TiltCard key={item.id} style={{ padding: 0, borderRadius: 20, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', overflow: 'hidden', cursor: 'pointer' }} onClick={() => onNavigate('obras')}>
                  <div style={{ height: 100, background: 'linear-gradient(135deg, var(--color-primary-alpha) 0%, rgba(139, 92, 246, 0.1) 100%)', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: (item.progress || 0) >= 100 ? '#10B981' : '#3B82F6', boxShadow: `0 0 10px ${(item.progress || 0) >= 100 ? '#10B981' : '#3B82F6'}` }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {(item.progress || 0) >= 100 ? 'Concluído' : 'Em Andamento'}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Progresso</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }}>{item.progress || 0}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, backgroundColor: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress || 0}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 3 }} 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <div style={{ padding: '6px 12px', borderRadius: 8, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={12} /> Equipe: {item.teamCount || 0}
                      </div>
                      <div style={{ padding: '6px 12px', borderRadius: 8, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clipboard size={12} /> Diários: {item.diariesCount || 0}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
              {(isArchitect ? projects : works).length === 0 && (
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
