import { motion } from 'framer-motion';
import { ClipboardList, ChevronRight, Palette, Lightbulb, MapPin } from 'lucide-react';
import { InsightsWidget } from './InsightsWidget';
import { ProjectsWidget } from './ProjectsWidget';
import { LibraryWidget } from './LibraryWidget';
import { TipsWidget } from './TipsWidget';
import { ConstructionIndexesWidget } from '../../architect/ConstructionIndexesWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';

// ─── Widget inline: Tendências ───────────────────────────────────────
function TrendsWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
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
          <Palette size={18} color="#D946EF" />
          Tendências
        </h3>
        <button
          onClick={() => onNavigate('tendencias')}
          style={{ background: 'none', border: 'none', color: '#D946EF', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Explorar <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          onClick={() => onNavigate('tendencias')}
          style={{ padding: 12, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', textAlign: 'left', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Inspirações</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Projetos em alta</span>
        </button>

        <button
          onClick={() => onNavigate('tendencias')}
          style={{ padding: 12, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', textAlign: 'left', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Moodboards</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Materiais e cores</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Widget inline: Projeto Luminotécnico ─────────────────────────────────────
function LightingDesignWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
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
          <Lightbulb size={18} color="#F59E0B" />
          Projeto Luminotécnico
        </h3>
        <button
          onClick={() => onNavigate('projeto-luminotecnico')}
          style={{ background: 'none', border: 'none', color: '#F59E0B', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Calcular Lux <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Calculadora por NBR 8995-1</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lux, Lumens, Watts, Kelvin e quantidade</span>
        </div>
        <button
          onClick={() => onNavigate('projeto-luminotecnico')}
          className="btn-primary"
          style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, border: 'none', cursor: 'pointer', backgroundColor: '#F59E0B', color: '#FFF' }}
        >
          Iniciar
        </button>
      </div>
    </motion.div>
  );
}

// ─── Widget inline: Acompanhamento de Obras ─────────────────────────────────
function SiteVisitsWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
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
          <MapPin size={18} color="#8B5CF6" />
          Acompanhamento de Obras
        </h3>
        <button
          onClick={() => onNavigate('acompanhamento-obras')}
          style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Visitas <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Visitas Técnicas & Laudos PDF</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Registro de campo e relatórios técnicos</span>
        </div>
        <button onClick={() => onNavigate('acompanhamento-obras')} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12 }}>
          + Visita
        </button>
      </div>
    </motion.div>
  );
}

// ─── Widget inline: Vistorias Técnicas ────────────────────────────────────────
function InspectionsWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
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
          <ClipboardList size={18} color="#3B82F6" />
          Vistorias Técnicas
        </h3>
        <button
          onClick={() => onNavigate('vistorias')}
          style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Ver Vistorias <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Checklist por Disciplina</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fundação, estrutura, acabamento e instalações</span>
        </div>
        <button onClick={() => onNavigate('vistorias')} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12 }}>
          Vistorias
        </button>
      </div>
    </motion.div>
  );
}

// ─── Dashboard principal do Arquiteto ─────────────────────────────────────────
export function ArchitectDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const DEFAULT_ORDER = [
    'projetos',
    'acompanhamento',
    'vistorias',
    'tendencias',
    'luminotecnico',
    'indices-construcao',
    'biblioteca',
    'dicas'
  ];

  const WIDGET_NAMES = {
    projetos:            'Gestão de Projetos',
    acompanhamento:      'Acompanhamento de Obras',
    vistorias:           'Vistorias Técnicas',
    'tendencias':        'Tendências',
    luminotecnico:       'Projeto Luminotécnico',
    'indices-construcao':'Índices da Construção',
    biblioteca:          'Biblioteca Técnica',
    dicas:               'Dicas',
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'projetos':            return <ProjectsWidget onNavigate={onNavigate} />;
      case 'acompanhamento':      return <SiteVisitsWidget onNavigate={onNavigate} />;
      case 'vistorias':           return <InspectionsWidget onNavigate={onNavigate} />;
      case 'tendencias':          return <TrendsWidget onNavigate={onNavigate} />;
      case 'luminotecnico':       return <LightingDesignWidget onNavigate={onNavigate} />;
      case 'indices-construcao':  return <ConstructionIndexesWidget onNavigate={onNavigate} />;
      case 'biblioteca':         return <LibraryWidget onNavigate={onNavigate} />;
      case 'dicas':              return <TipsWidget onNavigate={onNavigate} />;
      default:                    return null;
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
