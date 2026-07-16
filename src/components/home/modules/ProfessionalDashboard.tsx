import { InsightsWidget } from './InsightsWidget';
import { BudgetWidget } from './BudgetWidget';
import { AgendaWidget } from './AgendaWidget';
import { ServiceFinanceWidget } from './ServiceFinanceWidget';
import { CalculatorsCentralWidget } from './CalculatorsCentralWidget';
import { LibraryWidget } from './LibraryWidget';
import { TipsWidget } from './TipsWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';

export function ProfessionalDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const DEFAULT_ORDER = ['orcamentos', 'agenda', 'financeiro', 'dicas'];
  
  const WIDGET_NAMES = {
    orcamentos: 'Orçamentos e Serviços',
    agenda: 'Agenda',
    financeiro: 'Financeiro',
    dicas: 'Dicas'
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'orcamentos': return <BudgetWidget onNavigate={onNavigate} />;
      case 'agenda': return <AgendaWidget onNavigate={onNavigate} />;
      case 'financeiro': return <ServiceFinanceWidget onNavigate={onNavigate} />;
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
