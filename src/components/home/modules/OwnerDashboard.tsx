import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ChevronDown, Star, DollarSign, ShoppingCart, ChevronRight, TrendingDown, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { InsightsWidget } from './InsightsWidget';
import { CalculatorsCentralWidget } from './CalculatorsCentralWidget';
import { TipsWidget } from './TipsWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';
import { useWorks, type Work } from '../../../contexts/WorksContext';
import { useAuth } from '../../../contexts/AuthContext';
import { PrimaryWorkSelector } from '../../ui/PrimaryWorkSelector';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// ─── Widget: Minha Obra Principal ──────────────────────────────────────────────
function MinhaObraWidget({ onNavigate, primaryWork }: { onNavigate: (tab: string) => void; primaryWork: Work }) {
  const [stagesInfo, setStagesInfo] = useState({ total: 0, completed: 0, nextStage: '' });

  useEffect(() => {
    if (!primaryWork?.id) return;
    const q = query(collection(db, `works/${primaryWork.id}/schedule_stages`));
    const unsub = onSnapshot(q, (snap) => {
      let total = 0;
      let completed = 0;
      let nextStage = '';
      const stages = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
      stages.sort((a, b) => (a.order || 0) - (b.order || 0));
      stages.forEach(s => {
        total++;
        if (s.completed) {
          completed++;
        } else if (!nextStage) {
          nextStage = s.title || s.name || '';
        }
      });
      setStagesInfo({ total, completed, nextStage });
    });
    return () => unsub();
  }, [primaryWork?.id]);

  const budget = primaryWork.budget || 0;
  const spent = primaryWork.spent || 0;
  const saldo = budget - spent;
  const progress = stagesInfo.total > 0 ? Math.round((stagesInfo.completed / stagesInfo.total) * 100) : (primaryWork.progress || 0);
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="glass-panel"
      style={{ borderRadius: 24, marginBottom: 24, overflow: 'hidden' }}
    >
      {/* Banner */}
      <div style={{ height: 120, position: 'relative' }}>
        {primaryWork.image ? (
          <img src={primaryWork.image} alt={primaryWork.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${primaryWork.colorTheme || '#3B82F6'}, ${primaryWork.colorTheme || '#3B82F6'}CC)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Home size={40} color="rgba(255,255,255,0.3)" />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        
        {/* Name + Badge */}
        <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Star size={12} color="#FCD34D" fill="#FCD34D" />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: 1 }}>Obra Principal</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', margin: 0 }}>{primaryWork.name}</h3>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Progress */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Progresso Geral</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)' }}>{progress}%</span>
          </div>
          <div style={{ height: 8, backgroundColor: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ height: '100%', backgroundColor: progress === 100 ? '#10B981' : 'var(--color-primary)', borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Financial Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Orçamento</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{budget > 0 ? fmt(budget) : '—'}</span>
          </div>
          <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Gasto</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>{spent > 0 ? fmt(spent) : '—'}</span>
          </div>
          <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Saldo</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: saldo >= 0 ? '#10B981' : '#EF4444' }}>{budget > 0 ? fmt(saldo) : '—'}</span>
          </div>
        </div>

        {/* Stages Info */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {stagesInfo.nextStage && (
            <div style={{ flex: 1, backgroundColor: 'var(--color-primary-alpha)', padding: 10, borderRadius: 12 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Próxima etapa</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>{stagesInfo.nextStage}</span>
            </div>
          )}
          {stagesInfo.total > 0 && (
            <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 10, borderRadius: 12, minWidth: 80, textAlign: 'center' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Etapas</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{stagesInfo.completed}/{stagesInfo.total}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onNavigate('obras')}
          className="btn-primary"
          style={{ width: '100%', borderRadius: 12, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Abrir Obra <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Widget: Financeiro da Obra ───────────────────────────────────────────────
function OwnerFinanceWidget({ onNavigate, primaryWork }: { onNavigate: (tab: string) => void; primaryWork: Work }) {
  const budget = primaryWork.budget || 0;
  const spent = primaryWork.spent || 0;
  const balance = budget - spent;
  const percent = budget > 0 ? (spent / budget) * 100 : 0;
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <DollarSign size={18} color="#10B981" />
          Financeiro
        </h3>
        <button
          onClick={() => onNavigate('financeiro')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Mais <ChevronRight size={14} />
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 14px', fontWeight: 600 }}>
        {primaryWork.name}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Previsto</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{budget > 0 ? fmt(budget) : '—'}</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Gasto</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#EF4444' }}>{spent > 0 ? fmt(spent) : '—'}</span>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Saldo</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: balance >= 0 ? '#10B981' : '#EF4444' }}>
            {budget > 0 ? fmt(balance) : '—'}
          </span>
        </div>
        {budget > 0 && (
          <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percent, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ height: '100%', backgroundColor: percent > 90 ? '#EF4444' : percent > 70 ? '#F59E0B' : '#10B981', borderRadius: 3 }}
            />
          </div>
        )}
      </div>

      <button
        onClick={() => onNavigate('financeiro')}
        className="btn-secondary"
        style={{ width: '100%', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <TrendingDown size={16} /> Registrar Despesa
      </button>
    </motion.div>
  );
}

// ─── Widget: Compras da Obra ──────────────────────────────────────────────────
function OwnerShoppingWidget({ onNavigate, primaryWork }: { onNavigate: (tab: string) => void; primaryWork: Work }) {
  const { user } = useAuth();
  const [pending, setPending] = useState(0);
  const [purchased, setPurchased] = useState(0);

  useEffect(() => {
    if (!user || !primaryWork?.id) return;
    // Try work-specific shopping first, fallback to user shopping
    const q = query(collection(db, 'users', user.uid, 'shopping'));
    const unsub = onSnapshot(q, (snap) => {
      let p = 0, d = 0;
      snap.forEach(doc => {
        if (doc.data().isPurchased) d++;
        else p++;
      });
      setPending(p);
      setPurchased(d);
    });
    return () => unsub();
  }, [user, primaryWork?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <ShoppingCart size={18} color="#F59E0B" />
          Lista de Compras
        </h3>
        <button
          onClick={() => onNavigate('compras')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Mais <ChevronRight size={14} />
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 14px', fontWeight: 600 }}>
        {primaryWork.name}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={18} color="#F59E0B" />
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>{pending}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pendentes</span>
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={18} color="#10B981" />
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>{purchased}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Comprados</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Zero State para quando não há obra principal ─────────────────────────────
function NoPrimaryWorkState({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ padding: 32, borderRadius: 24, marginBottom: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
    >
      <div style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Home size={36} color="var(--color-primary)" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Nenhuma Obra Cadastrada</h3>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 280, lineHeight: 1.5, margin: 0 }}>
        Crie sua primeira obra para começar a acompanhar o progresso, custos e cronograma da sua construção.
      </p>
      <button
        onClick={() => onNavigate('obras')}
        className="btn-primary"
        style={{ padding: '12px 24px', borderRadius: 14, fontSize: 15, marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <Home size={18} /> Criar Minha Obra
      </button>
    </motion.div>
  );
}

// ─── Dashboard Principal do Proprietário ──────────────────────────────────────
export function OwnerDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { works, primaryWork } = useWorks();
  const [showSelector, setShowSelector] = useState(false);

  // If multiple works and no primary selected, prompt
  const needsSelection = works.length > 1 && !primaryWork;

  const DEFAULT_ORDER = ['minha-obra', 'financeiro', 'compras', 'calculos', 'dicas'];

  const WIDGET_NAMES = {
    'minha-obra': 'Minha Obra',
    financeiro: 'Financeiro',
    compras: 'Lista de Compras',
    calculos: 'Central de Cálculos',
    dicas: 'Dicas'
  };

  const renderWidget = (id: string) => {
    if (!primaryWork && id !== 'calculos' && id !== 'dicas') return null;
    switch (id) {
      case 'minha-obra': return primaryWork ? <MinhaObraWidget onNavigate={onNavigate} primaryWork={primaryWork} /> : null;
      case 'financeiro': return primaryWork ? <OwnerFinanceWidget onNavigate={onNavigate} primaryWork={primaryWork} /> : null;
      case 'compras': return primaryWork ? <OwnerShoppingWidget onNavigate={onNavigate} primaryWork={primaryWork} /> : null;
      case 'calculos': return <CalculatorsCentralWidget onNavigate={onNavigate} />;
      case 'dicas': return <TipsWidget onNavigate={onNavigate} />;
      default: return null;
    }
  };

  return (
    <>
      <ReorderableDashboardLayout
        defaultOrder={DEFAULT_ORDER}
        renderWidget={renderWidget}
        widgetNames={WIDGET_NAMES}
      >
        {/* Fixed header section */}
        <InsightsWidget onNavigate={onNavigate} />

        {/* Primary work selector header */}
        {works.length > 0 && primaryWork && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowSelector(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 12, marginBottom: 16,
              backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              cursor: 'pointer', width: 'auto'
            }}
          >
            <Star size={14} color="#FCD34D" fill="#FCD34D" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{primaryWork.name}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </motion.button>
        )}

        {/* No works at all */}
        {works.length === 0 && <NoPrimaryWorkState onNavigate={onNavigate} />}

        {/* Multiple works but no primary selected */}
        {needsSelection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ padding: 24, borderRadius: 24, marginBottom: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
          >
            <Star size={32} color="var(--color-primary)" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Selecione sua Obra Principal</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Você possui {works.length} obras. Escolha qual deseja acompanhar na Home.</p>
            <button
              onClick={() => setShowSelector(true)}
              className="btn-primary"
              style={{ padding: '10px 20px', borderRadius: 12, fontSize: 14, marginTop: 4 }}
            >
              Selecionar Obra
            </button>
          </motion.div>
        )}
      </ReorderableDashboardLayout>

      {/* Bottom Sheet Selector */}
      <PrimaryWorkSelector isOpen={showSelector || needsSelection} onClose={() => setShowSelector(false)} />
    </>
  );
}
