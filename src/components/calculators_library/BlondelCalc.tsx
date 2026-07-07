import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import { Ruler } from 'lucide-react';

export function BlondelCalc({ onBack }: { onBack: () => void }) {
  return (
    <BaseCalculatorLayout
      title="Fórmula de Blondel"
      description="Calcular degraus de escada (Espelho x Pisada)"
      icon={<Ruler size={24} color="#8B5CF6" />}
      onBack={onBack}
      tip="Esta é uma versão simplificada em desenvolvimento para Arquitetos."
      results={null}
    >
      <div style={{ padding: 16, color: 'var(--text-muted)', textAlign: 'center' }}>
        Funcionalidade em desenvolvimento.
      </div>
    </BaseCalculatorLayout>
  );
}
