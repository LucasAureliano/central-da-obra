import { InsightsWidget } from './InsightsWidget';
import { MinhaEmpresaWidget } from './MinhaEmpresaWidget';
import { AgendaWidget } from './AgendaWidget';
import { BudgetWidget } from './BudgetWidget';
import { ServiceFinanceWidget } from './ServiceFinanceWidget';
import { CalculatorsCentralWidget } from './CalculatorsCentralWidget';
import { TipsWidget } from './TipsWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';

export function ProfessionalDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const DEFAULT_ORDER = ['insights', 'minha-empresa', 'agenda', 'orcamentos', 'recebimentos', 'dicas'];

  const WIDGET_NAMES = {
    insights: 'Insights da Obra',
    'minha-empresa': 'Minha Empresa',
    agenda: 'Agenda',
    orcamentos: 'Orçamentos',
    recebimentos: 'Recebimentos',
    dicas: 'Dicas',
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'insights':      return <InsightsWidget onNavigate={onNavigate} />;
      case 'minha-empresa': return <MinhaEmpresaWidget onNavigate={onNavigate} />;
      case 'agenda':        return <AgendaWidget onNavigate={onNavigate} />;
      case 'orcamentos':    return <BudgetWidget onNavigate={onNavigate} />;
      case 'recebimentos':  return <ServiceFinanceWidget onNavigate={onNavigate} />;
      case 'dicas':         return <TipsWidget onNavigate={onNavigate} />;
      default:              return null;
    }
  };

  return (
    <ReorderableDashboardLayout
      defaultOrder={DEFAULT_ORDER}
      renderWidget={renderWidget}
      widgetNames={WIDGET_NAMES}
    >
      <CalculatorsCentralWidget onNavigate={onNavigate} />
    </ReorderableDashboardLayout>
  );
}

