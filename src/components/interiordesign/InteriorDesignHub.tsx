import { useState } from 'react';

import { ChevronLeft, Palette, Layout, Lamp, Ruler } from 'lucide-react';
import { ProjectWizard } from './ProjectWizard';
import { ColorPaletteGuide } from './ColorPaletteGuide';
import { ErgonomicsGuide } from './ErgonomicsGuide';
import { MaterialsCatalog } from './MaterialsCatalog';
import { LightingCatalog } from './LightingCatalog';

interface InteriorDesignHubProps {
  onBack: () => void;
  onNavigate: (tab: string, param?: string) => void;
}

export function InteriorDesignHub({ onBack, onNavigate }: InteriorDesignHubProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  if (activeTool === 'project-wizard') {
    return <ProjectWizard onBack={() => setActiveTool(null)} />;
  }
  if (activeTool === 'color-guide') {
    return <ColorPaletteGuide onBack={() => setActiveTool(null)} />;
  }
  if (activeTool === 'ergonomics') {
    return <ErgonomicsGuide onBack={() => setActiveTool(null)} />;
  }
  if (activeTool === 'materials-catalog') {
    return <MaterialsCatalog onBack={() => setActiveTool(null)} />;
  }
  if (activeTool === 'lighting-catalog') {
    return <LightingCatalog onBack={() => setActiveTool(null)} />;
  }

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Palette size={28} color="#D946EF" />
        Studio de Interiores
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Assistentes e guias para projetos de decoração e detalhamento.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <button 
          onClick={() => setActiveTool('project-wizard')}
          className="card-premium-interactive" 
          style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, border: 'none', background: 'var(--bg-input-glass)' }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(217, 70, 239, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layout size={24} color="#D946EF" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>Assistente de Projetos</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Workflow ambiente por ambiente.</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('calculos', 'lighting')}
          className="card-premium-interactive" 
          style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, border: 'none', background: 'var(--bg-input-glass)' }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lamp size={24} color="#F59E0B" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>Projeto Luminotécnico</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ir para Central de Cálculos.</p>
          </div>
        </button>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16 }}>Guias e Normas</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button 
          onClick={() => setActiveTool('color-guide')}
          className="card-premium-interactive" 
          style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, border: 'none', background: 'var(--bg-elevated)', width: '100%', textAlign: 'left' }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(217, 70, 239, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Palette size={20} color="#D946EF" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Cores e Revestimentos</h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tendências e combinações seguras.</p>
          </div>
          <ChevronLeft size={20} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </button>

        <button 
          onClick={() => setActiveTool('ergonomics')}
          className="card-premium-interactive" 
          style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, border: 'none', background: 'var(--bg-elevated)', width: '100%', textAlign: 'left' }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(217, 70, 239, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ruler size={20} color="#D946EF" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Medidas Ergonômicas</h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Alturas padrão para bancadas e móveis.</p>
          </div>
          <ChevronLeft size={20} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </button>

        <button 
          onClick={() => setActiveTool('materials-catalog')}
          className="card-premium-interactive" 
          style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, border: 'none', background: 'var(--bg-elevated)', width: '100%', textAlign: 'left' }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(217, 70, 239, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layout size={20} color="#D946EF" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Catálogo de Materiais</h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Comparativo de pisos, bancadas e revestimentos.</p>
          </div>
          <ChevronLeft size={20} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </button>

        <button 
          onClick={() => setActiveTool('lighting-catalog')}
          className="card-premium-interactive" 
          style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, border: 'none', background: 'var(--bg-elevated)', width: '100%', textAlign: 'left' }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lamp size={20} color="#F59E0B" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Catálogo de Iluminação</h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Lâmpadas, fitas LED, IRC e temperaturas.</p>
          </div>
          <ChevronLeft size={20} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </button>
      </div>
    </div>
  );
}
