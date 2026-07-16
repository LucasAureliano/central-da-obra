import { InsightsWidget } from './InsightsWidget';
import { WorksManagementWidget } from './WorksManagementWidget';
import { CorporateFinanceWidget } from './CorporateFinanceWidget';
import { TeamsWidget } from './TeamsWidget';
import { CalculatorsCentralWidget } from './CalculatorsCentralWidget';
import { LibraryWidget } from './LibraryWidget';
import { TipsWidget } from './TipsWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';
import { GanttWidget } from './GanttWidget';
import { EquipmentWidget } from './EquipmentWidget';

export function BuilderDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const DEFAULT_ORDER = ['obras', 'cronograma', 'financeiro', 'equipes', 'equipamentos', 'biblioteca'];
  
  const WIDGET_NAMES = {
    obras: 'Gestão de Obras',
    cronograma: 'Cronograma Geral',
    financeiro: 'Financeiro Corporativo',
    equipes: 'Equipes',
    equipamentos: 'Equipamentos',
    biblioteca: 'Biblioteca Técnica'
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'obras': return <WorksManagementWidget onNavigate={onNavigate} />;
      case 'cronograma': return <GanttWidget onNavigate={onNavigate} />;
      case 'financeiro': return <CorporateFinanceWidget onNavigate={onNavigate} />;
      case 'equipes': return <TeamsWidget onNavigate={onNavigate} />;
      case 'equipamentos': return <EquipmentWidget onNavigate={onNavigate} />;
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
