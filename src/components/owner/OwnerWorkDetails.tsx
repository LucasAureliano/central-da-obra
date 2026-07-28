import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, MapPin, Star, Activity, DollarSign, ShoppingCart, Calendar, Share2, Users, Lightbulb, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { ShareWorkView } from '../works/ShareWorkView';
import { InteractiveSchedule } from './InteractiveSchedule';
import { Finance } from '../Finance';
import { Shopping } from '../Shopping';
import { ProviderQuotes } from './ProviderQuotes';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useWorks } from '../../contexts/WorksContext';

interface OwnerWorkDetailsProps {
  workId: string;
  onBack: () => void;
  initialTab?: TabId;
}

type TabId = 'resumo' | 'cronograma' | 'financeiro' | 'compras' | 'cotacoes' | 'compartilhamento';

export function OwnerWorkDetails({ workId, onBack, initialTab }: OwnerWorkDetailsProps) {
  const { user } = useAuth();
  const { primaryWork } = useWorks();
  const [work, setWork] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabId>(initialTab || 'resumo');
  const [totalSpent, setTotalSpent] = useState(0);
  const [stagesInfo, setStagesInfo] = useState({ total: 0, completed: 0, nextStage: '', stages: [] as any[] });
  const [shoppingInfo, setShoppingInfo] = useState({ pending: 0, purchased: 0 });

  const isPrimary = primaryWork?.id === workId;

  // Listen to work document
  useEffect(() => {
    const docRef = doc(db, 'works', workId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setWork({ id: snap.id, ...snap.data() });
      }
    });

    // Listen to calculations (expenses)
    const calcsQuery = collection(db, 'works', workId, 'calculations');
    const unsubscribeCalcs = onSnapshot(calcsQuery, (snap) => {
      const calcs: any[] = [];
      let spent = 0;
      snap.forEach(c => {
        const data = c.data();
        calcs.push({ id: c.id, ...data });
        if (data.totalCost) spent += data.totalCost;
      });
      calcs.sort((a, b) => {
        const dateA = a.savedAt?.toDate ? a.savedAt.toDate() : new Date();
        const dateB = b.savedAt?.toDate ? b.savedAt.toDate() : new Date();
        return dateB.getTime() - dateA.getTime();
      });
      setTotalSpent(spent);
    });

    // Listen to stages
    const stagesQuery = collection(db, `works/${workId}/stages`);
    const unsubscribeStages = onSnapshot(stagesQuery, (snap) => {
      const stgs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
      stgs.sort((a, b) => (a.order || 0) - (b.order || 0));
      let total = 0, completed = 0, nextStage = '';
      stgs.forEach(s => {
        total++;
        const allDone = s.tasks?.every((t: any) => t.isCompleted) && s.tasks?.length > 0;
        if (allDone) completed++;
        else if (!nextStage) nextStage = s.name || s.title || '';
      });
      setStagesInfo({ total, completed, nextStage, stages: stgs });
    });

    // Listen to user shopping
    if (user) {
      const shopQuery = collection(db, 'users', user.uid, 'shopping');
      const unsubShop = onSnapshot(shopQuery, (snap) => {
        let p = 0, d = 0;
        snap.forEach(doc => { if (doc.data().isPurchased) d++; else p++; });
        setShoppingInfo({ pending: p, purchased: d });
      });
      return () => { unsubscribe(); unsubscribeCalcs(); unsubscribeStages(); unsubShop(); };
    }

    return () => { unsubscribe(); unsubscribeCalcs(); unsubscribeStages(); };
  }, [workId, user]);

  if (!work) {
    return (
      <div className="screen-content animate-fade-in" style={{ padding: 20, textAlign: 'center' }}>
        <div className="skeleton-glass" style={{ height: 200, borderRadius: 24, marginBottom: 16 }} />
        <div className="skeleton-glass" style={{ height: 40, borderRadius: 12, marginBottom: 12 }} />
        <div className="skeleton-glass" style={{ height: 200, borderRadius: 24 }} />
      </div>
    );
  }

  const budget = typeof work.budget === 'number' ? work.budget : 0;
  const saldo = budget - totalSpent;
  const percentConsumed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;
  const progress = work.progress || 0;
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  // Generate smart insights
  const insights: { text: string; icon: React.ReactNode; color: string }[] = [];
  if (progress > 0) insights.push({ text: `A obra está ${progress}% concluída.`, icon: <Activity size={14} />, color: '#3B82F6' });
  if (stagesInfo.nextStage) insights.push({ text: `A próxima etapa prevista é ${stagesInfo.nextStage}.`, icon: <TrendingUp size={14} />, color: '#8B5CF6' });
  if (shoppingInfo.pending > 0) insights.push({ text: `Existem ${shoppingInfo.pending} compras pendentes.`, icon: <ShoppingCart size={14} />, color: '#F59E0B' });
  if (budget > 0 && totalSpent > 0) insights.push({ text: `Seu gasto representa ${percentConsumed}% do orçamento.`, icon: <DollarSign size={14} />, color: percentConsumed > 80 ? '#EF4444' : '#10B981' });
  if (budget > 0 && saldo < 0) insights.push({ text: `Atenção: o orçamento foi ultrapassado em ${fmt(Math.abs(saldo))}.`, icon: <AlertTriangle size={14} />, color: '#EF4444' });

  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'resumo', label: 'Resumo', icon: <Activity size={14} /> },
    { id: 'cronograma', label: 'Cronograma', icon: <Calendar size={14} /> },
    { id: 'financeiro', label: 'Financeiro', icon: <DollarSign size={14} /> },
    { id: 'compras', label: 'Materiais', icon: <ShoppingCart size={14} /> },
    { id: 'cotacoes', label: 'Cotações', icon: <Users size={14} /> },
    { id: 'compartilhamento', label: 'Compartilhar', icon: <Share2 size={14} /> },
  ];

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: 100 }}>
      {/* Banner */}
      <div style={{ height: 200, position: 'relative' }}>
        {work.image ? (
          <img src={work.image} alt={work.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${work.colorTheme || '#3B82F6'}, ${work.colorTheme || '#3B82F6'}99)` }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
        
        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: 'max(20px, env(safe-area-inset-top))', left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          {isPrimary && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, backgroundColor: 'rgba(252, 211, 77, 0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(252, 211, 77, 0.4)', marginBottom: 6 }}>
              <Star size={10} color="#FCD34D" fill="#FCD34D" />
              <span style={{ fontSize: 9, fontWeight: 700, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: 0.5 }}>Obra Principal</span>
            </div>
          )}
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#FFF', margin: 0 }}>{work.name}</h1>
          {work.address && (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 0' }}>
              <MapPin size={14} /> {work.address}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 14px', borderRadius: 10, whiteSpace: 'nowrap',
              border: activeTab === tab.id ? '1.5px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === tab.id ? 'var(--color-primary-alpha)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
          
          {/* === RESUMO === */}
          {activeTab === 'resumo' && (
            <div style={{ padding: 20 }}>
              {/* Progress */}
              <div className="glass-panel" style={{ padding: 20, borderRadius: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Activity size={18} color="var(--color-primary)" />
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Progresso Geral</h3>
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-primary)' }}>{progress}%</span>
                </div>
                <div style={{ height: 10, backgroundColor: 'var(--bg-elevated)', borderRadius: 5, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
                    style={{ height: '100%', backgroundColor: progress === 100 ? '#10B981' : 'var(--color-primary)', borderRadius: 5 }} />
                </div>
                {stagesInfo.total > 0 && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, textAlign: 'center' }}>
                    {stagesInfo.completed} de {stagesInfo.total} etapas concluídas
                  </p>
                )}
              </div>

              {/* Financial Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div className="glass-panel" style={{ padding: 14, borderRadius: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Orçamento</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{budget > 0 ? fmt(budget) : '—'}</span>
                </div>
                <div className="glass-panel" style={{ padding: 14, borderRadius: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Gasto</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>{totalSpent > 0 ? fmt(totalSpent) : '—'}</span>
                </div>
                <div className="glass-panel" style={{ padding: 14, borderRadius: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Saldo</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: saldo >= 0 ? '#10B981' : '#EF4444' }}>{budget > 0 ? fmt(saldo) : '—'}</span>
                </div>
              </div>

              {/* Smart Insights */}
              {insights.length > 0 && (
                <div className="glass-panel" style={{ padding: 16, borderRadius: 20, marginBottom: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Lightbulb size={16} color="var(--color-primary)" /> Insights da Obra
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {insights.map((ins, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', backgroundColor: 'var(--bg-elevated)', borderRadius: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: `${ins.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: ins.color }}>
                          {ins.icon}
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.4 }}>{ins.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stages Preview */}
              {stagesInfo.nextStage && (
                <div className="glass-panel" style={{ padding: 16, borderRadius: 20, marginBottom: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>Próxima Etapa</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, backgroundColor: 'var(--color-primary-alpha)', borderRadius: 12 }}>
                    <Clock size={18} color="var(--color-primary)" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)' }}>{stagesInfo.nextStage}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === CRONOGRAMA === */}
          {activeTab === 'cronograma' && (
            <div style={{ padding: '20px' }}>
              <InteractiveSchedule workId={workId} embedded />
            </div>
          )}

          {/* === FINANCEIRO === */}
          {activeTab === 'financeiro' && (
            <div style={{ padding: 20 }}>
              <Finance workId={workId} embedded />
            </div>
          )}

          {/* === COMPRAS === */}
          {activeTab === 'compras' && (
            <div style={{ padding: 20 }}>
              <Shopping workId={workId} embedded />
            </div>
          )}

          {/* === COTAÇÕES === */}
          {activeTab === 'cotacoes' && (
            <ProviderQuotes workId={workId} />
          )}

          {/* === COMPARTILHAMENTO === */}
          {activeTab === 'compartilhamento' && (
            <div className="animate-fade-in">
              <ShareWorkView workId={work.id} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
