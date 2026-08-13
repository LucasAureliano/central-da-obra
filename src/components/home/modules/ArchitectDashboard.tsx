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
// Widget inline: Projeto Luminotécnico
// --------------------------------------------------------------------------------------
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
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Calculadora Luminotécnica</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lux, Lumens, Watts e quantidade</span>
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

// --------------------------------------------------------------------------------------
// Widget inline: Projeto Elétrico
// --------------------------------------------------------------------------------------
function ElectricalDesignWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.22 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Zap size={18} color="#EAB308" />
          Projeto Elétrico
        </h3>
        <button
          onClick={() => onNavigate('projeto-eletrico')}
          style={{ background: 'none', border: 'none', color: '#EAB308', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Dimensionar <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          onClick={() => onNavigate('projeto-eletrico')}
          style={{ padding: 12, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', textAlign: 'left', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Quadro de Cargas</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Circuitos e Disjuntores</span>
        </button>

        <button
          onClick={() => onNavigate('projeto-eletrico')}
          style={{ padding: 12, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', textAlign: 'left', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Levantamento</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pontos TUG/TUE</span>
        </button>
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------------------
// Widget inline: Projeto Hidráulico
// --------------------------------------------------------------------------------------
function PlumbingDesignWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.24 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Droplet size={18} color="#0EA5E9" />
          Projeto Hidráulico
        </h3>
        <button
          onClick={() => onNavigate('projeto-hidraulico')}
          style={{ background: 'none', border: 'none', color: '#0EA5E9', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Planejar <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ padding: 14, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Mapeamento de Pontos</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Água fria, quente, esgoto e pluvial</span>
        </div>
        <button
          onClick={() => onNavigate('projeto-hidraulico')}
          className="btn-primary"
          style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, border: 'none', cursor: 'pointer', backgroundColor: '#0EA5E9', color: '#FFF' }}
        >
          Iniciar
        </button>
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------------------
// Widget inline: Projeto de Automação
// --------------------------------------------------------------------------------------
function AutomationDesignWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.26 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24, border: '1px solid rgba(16, 185, 129, 0.2)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Cpu size={18} color="#10B981" />
          Projeto de Automação
        </h3>
        <button
          onClick={() => onNavigate('projeto-automacao')}
          style={{ background: 'none', border: 'none', color: '#10B981', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Smart Home <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <button
          onClick={() => onNavigate('projeto-automacao')}
          style={{ padding: 12, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', textAlign: 'left', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Dispositivos</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lista de equipamentos</span>
        </button>

        <button
          onClick={() => onNavigate('projeto-automacao')}
          style={{ padding: 12, borderRadius: 14, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', textAlign: 'left', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>Cenas (Smart)</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Rotinas e integrações</span>
        </button>
      </div>
      
      <div style={{ padding: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 12, border: '1px dashed #10B981', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>Infraestrutura: Verificação de Cabos, Hubs e Redes</span>
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
    'vistorias',
    'studio-interiores',
    'luminotecnico',
    'eletrico',
    'hidraulico',
    'automacao',
    'biblioteca',
    'dicas'
  ];

  const WIDGET_NAMES = {
    projetos:            'Gestão de Projetos',
    acompanhamento:      'Acompanhamento de Obras',
    agenda:              'Agenda Técnica',
    vistorias:           'Vistorias Técnicas',
    'studio-interiores': 'Studio de Interiores',
    luminotecnico:       'Projeto Luminotécnico',
    eletrico:            'Projeto Elétrico',
    hidraulico:          'Projeto Hidráulico',
    automacao:           'Projeto de Automação',
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
      case 'luminotecnico':       return <LightingDesignWidget onNavigate={onNavigate} key="luminotecnico" />;
      case 'eletrico':            return <ElectricalDesignWidget onNavigate={onNavigate} key="eletrico" />;
      case 'hidraulico':          return <PlumbingDesignWidget onNavigate={onNavigate} key="hidraulico" />;
      case 'automacao':           return <AutomationDesignWidget onNavigate={onNavigate} key="automacao" />;
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
