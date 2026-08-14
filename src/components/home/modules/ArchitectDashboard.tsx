import { motion } from 'framer-motion';
import { ClipboardList, ChevronRight, Palette, Lightbulb, MapPin, Zap, Droplet, Cpu } from 'lucide-react';
import { InsightsWidget } from './InsightsWidget';
import { ProjectsWidget } from './ProjectsWidget';
import { LibraryWidget } from './LibraryWidget';
import { TipsWidget } from './TipsWidget';
import { AgendaWidget } from './AgendaWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';

// --------------------------------------------------------------------------------------
// Widget inline: Studio de Interiores
// --------------------------------------------------------------------------------------
function InteriorDesignWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
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
          Studio de Interiores
        </h3>
        <button
          onClick={() => onNavigate('studio-interiores')}
          style={{ background: 'none', border: 'none', color: '#D946EF', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Explorar <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          onClick={() => onNavigate('studio-interiores')}
          style={{ padding: 12, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', textAlign: 'left', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Inspirações</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Projetos em alta</span>
        </button>

        <button
          onClick={() => onNavigate('studio-interiores')}
          style={{ padding: 12, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', textAlign: 'left', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Moodboards</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Materiais e cores</span>
        </button>
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------------------
// Widget inline: Projetos Complementares
// --------------------------------------------------------------------------------------
function EngineeringProjectsWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Zap size={18} color="#0EA5E9" />
          Projetos Complementares
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        {/* Luminotécnico */}
        <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 8, borderRadius: 10 }}>
              <Lightbulb size={20} color="#F59E0B" />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Luminotécnico</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Cálculo de Lux e Lumens</span>
            </div>
          </div>
          <button onClick={() => onNavigate('projeto-luminotecnico')} className="btn-primary" style={{ padding: '6px 12px', borderRadius: 10, fontSize: 12, backgroundColor: '#F59E0B' }}>Abrir</button>
        </div>

        {/* Elétrico */}
        <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', padding: 8, borderRadius: 10 }}>
              <Zap size={20} color="#EAB308" />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Elétrico</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Quadro de Cargas, TUGs</span>
            </div>
          </div>
          <button onClick={() => onNavigate('projeto-eletrico')} className="btn-primary" style={{ padding: '6px 12px', borderRadius: 10, fontSize: 12, backgroundColor: '#EAB308' }}>Abrir</button>
        </div>

        {/* Hidráulico */}
        <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 8, borderRadius: 10 }}>
              <Droplet size={20} color="#0EA5E9" />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Hidráulico</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mapeamento de Pontos</span>
            </div>
          </div>
          <button onClick={() => onNavigate('projeto-hidraulico')} className="btn-primary" style={{ padding: '6px 12px', borderRadius: 10, fontSize: 12, backgroundColor: '#0EA5E9' }}>Abrir</button>
        </div>

        {/* Automação */}
        <div style={{ padding: 14, backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 16, border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 8, borderRadius: 10 }}>
              <Cpu size={20} color="#10B981" />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Automação (Smart)</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dispositivos e Cenas</span>
            </div>
          </div>
          <button onClick={() => onNavigate('projeto-automacao')} className="btn-primary" style={{ padding: '6px 12px', borderRadius: 10, fontSize: 12, backgroundColor: '#10B981' }}>Abrir</button>
        </div>
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------------------
// Widget inline: Acompanhamento de Obras
// --------------------------------------------------------------------------------------
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

// --------------------------------------------------------------------------------------
// Widget inline: Vistorias Técnicas
// --------------------------------------------------------------------------------------
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

// --------------------------------------------------------------------------------------
// Dashboard principal do Arquiteto
// --------------------------------------------------------------------------------------
export function ArchitectDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const DEFAULT_ORDER = [
    'projetos',
    'acompanhamento',
    'agenda',
    'projetos-complementares'
  ];

  const WIDGET_NAMES = {
    projetos:            'Gestão de Projetos',
    acompanhamento:      'Acompanhamento de Obras',
    agenda:              'Agenda Técnica',
    vistorias:           'Vistorias Técnicas',
    'studio-interiores': 'Studio de Interiores',
    'projetos-complementares': 'Projetos Complementares',
    biblioteca:          'Biblioteca Técnica',
    dicas:               'Dicas',
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'projetos':            return <ProjectsWidget onNavigate={onNavigate} key="projetos" />;
      case 'acompanhamento':      return <SiteVisitsWidget onNavigate={onNavigate} key="acompanhamento" />;
      case 'agenda':              return <AgendaWidget onNavigate={onNavigate} key="agenda" />;
      case 'vistorias':           return <InspectionsWidget onNavigate={onNavigate} key="vistorias" />;
      case 'studio-interiores':   return <InteriorDesignWidget onNavigate={onNavigate} key="studio-interiores" />;
      case 'projetos-complementares': return <EngineeringProjectsWidget onNavigate={onNavigate} key="projetos-complementares" />;
      case 'biblioteca':         return <LibraryWidget onNavigate={onNavigate} key="biblioteca" />;
      case 'dicas':              return <TipsWidget onNavigate={onNavigate} key="dicas" />;
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
