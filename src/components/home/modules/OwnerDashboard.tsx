import { InsightsWidget } from './InsightsWidget';
import { CalculatorsCentralWidget } from './CalculatorsCentralWidget';
import { TipsWidget } from './TipsWidget';
import { LibraryWidget } from './LibraryWidget';
import { FinanceWidget } from './FinanceWidget';
import { ShoppingWidget } from './ShoppingWidget';
import { ReorderableDashboardLayout } from './ReorderableDashboardLayout';

export function OwnerDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const DEFAULT_ORDER = ['financeiro', 'compras', 'dicas'];
  
  const WIDGET_NAMES = {
    financeiro: 'Financeiro',
    compras: 'Lista de Compras',
    dicas: 'Dicas'
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'financeiro': return <FinanceWidget onNavigate={onNavigate} />;
      case 'compras': return <ShoppingWidget onNavigate={onNavigate} />;
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
