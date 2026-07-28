import { motion } from 'framer-motion';
import { ShoppingCart, Users, DollarSign, BarChart3, ChevronRight, MapPin } from 'lucide-react';
import { InsightsWidget } from './InsightsWidget';
import { WorksManagementWidget } from './WorksManagementWidget';
import { LibraryWidget } from './LibraryWidget';
import { TipsWidget } from './TipsWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';

// ─── Widget inline: Centro de Operações ───────────────────────────────────────
function OperationsCenterWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <MapPin size={18} color="#3B82F6" />
          Centro de Operações
        </h3>
        <button
          onClick={() => onNavigate('centro-operacoes')}
          style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Painel Executivo <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Comando Geral das Obras</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Indicadores em tempo real e mão de obra</span>
        </div>
        <button onClick={() => onNavigate('centro-operacoes')} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12 }}>
          Abrir
        </button>
      </div>
    </motion.div>
  );
}

// ─── Widget inline: Financeiro Corporativo ───────────────────────────────────
function CorporateFinanceWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <DollarSign size={18} color="#10B981" />
          Financeiro Corporativo
        </h3>
        <button
          onClick={() => onNavigate('financeiro-corporativo')}
          style={{ background: 'none', border: 'none', color: '#10B981', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          DRE & Fluxo <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>DRE por Centro de Custo</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Margem de lucro por obra e despesas</span>
        </div>
        <button onClick={() => onNavigate('financeiro-corporativo')} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, backgroundColor: '#10B981', border: 'none' }}>
          Ver DRE
        </button>
      </div>
    </motion.div>
  );
}

// ─── Widget inline: Gestão de Equipes ─────────────────────────────────────────
function TeamsWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Users size={18} color="#8B5CF6" />
          Equipes & Mão de Obra
        </h3>
        <button
          onClick={() => onNavigate('equipe')}
          style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Alocar Equipes <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Distribuição nos Canteiros</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Movimentação e cadastro de equipes</span>
        </div>
        <button onClick={() => onNavigate('equipe')} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12 }}>
          Equipes
        </button>
      </div>
    </motion.div>
  );
}

// ─── Widget inline: Centro de Compras ─────────────────────────────────────────
function ProcurementWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <ShoppingCart size={18} color="#F59E0B" />
          Centro de Compras
        </h3>
        <button
          onClick={() => onNavigate('centro-compras')}
          style={{ background: 'none', border: 'none', color: '#F59E0B', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Cotações <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Fluxo em 6 Etapas</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Da solicitação até a conferência de insumos</span>
        </div>
        <button onClick={() => onNavigate('centro-compras')} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, backgroundColor: '#F59E0B', border: 'none', color: '#FFF' }}>
          Compras
        </button>
      </div>
    </motion.div>
  );
}

// ─── Widget inline: Indicadores BI ────────────────────────────────────────────
function BIWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <BarChart3 size={18} color="#06B6D4" />
          Indicadores BI (Curva S)
        </h3>
        <button
          onClick={() => onNavigate('indicadores-bi')}
          style={{ background: 'none', border: 'none', color: '#06B6D4', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Curva S <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Avanço Físico x Financeiro</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Desempenho consolidado de obras</span>
        </div>
        <button onClick={() => onNavigate('indicadores-bi')} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12 }}>
          Abrir BI
        </button>
      </div>
    </motion.div>
  );
}

// ─── Dashboard principal da Construtora ───────────────────────────────────────
export function BuilderDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const DEFAULT_ORDER = [
    'operacoes',
    'obras',
    'financeiro',
    'equipes',
    'compras',
    'biblioteca',
    'indicadores',
    'dicas'
  ];

  const WIDGET_NAMES = {
    operacoes:   'Centro de Operações',
    obras:       'Obras Ativas',
    financeiro:  'Financeiro Corporativo',
    equipes:     'Equipes',
    compras:     'Centro de Compras',
    biblioteca:  'Biblioteca Técnica',
    indicadores: 'Indicadores BI',
    dicas:       'Dicas',
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'operacoes':   return <OperationsCenterWidget onNavigate={onNavigate} />;
      case 'obras':       return <WorksManagementWidget onNavigate={onNavigate} />;
      case 'financeiro':  return <CorporateFinanceWidget onNavigate={onNavigate} />;
      case 'equipes':     return <TeamsWidget onNavigate={onNavigate} />;
      case 'compras':     return <ProcurementWidget onNavigate={onNavigate} />;
      case 'biblioteca':  return <LibraryWidget onNavigate={onNavigate} />;
      case 'indicadores': return <BIWidget onNavigate={onNavigate} />;
      case 'dicas':       return <TipsWidget onNavigate={onNavigate} />;
      default:            return null;
    }
  };

  return (
    <ReorderableDashboardLayout
      defaultOrder={DEFAULT_ORDER}
      renderWidget={renderWidget}
      widgetNames={WIDGET_NAMES}
    >
      <InsightsWidget onNavigate={onNavigate} />
    </ReorderableDashboardLayout>
  );
}
