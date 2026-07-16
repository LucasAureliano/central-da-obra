import { InsightsWidget } from './InsightsWidget';
import { ProjectsWidget } from './ProjectsWidget';
import { CalculatorsCentralWidget } from './CalculatorsCentralWidget';
import { LibraryWidget } from './LibraryWidget';
import { TipsWidget } from './TipsWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';

export function ArchitectDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const DEFAULT_ORDER = ['projetos', 'biblioteca', 'dicas'];
  
  const WIDGET_NAMES = {
    projetos: 'Gestão de Projetos',
    biblioteca: 'Biblioteca Técnica',
    dicas: 'Dicas'
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'projetos': return <ProjectsWidget onNavigate={onNavigate} />;
      case 'biblioteca': return <LibraryWidget onNavigate={onNavigate} />;
      case 'dicas': return <TipsWidget onNavigate={onNavigate} />;
      default: return null;
    }
  };

  return (
    <ReorderableDashboardLayout 
      defaultOrder={DEFAULT_ORDER} 
      renderWidget={renderWidget}
      widgetNames={WIDGET_NAMES}
    >
      <InsightsWidget onNavigate={onNavigate} />
      <CalculatorsCentralWidget onNavigate={onNavigate} />
    </ReorderableDashboardLayout>
  );
}
