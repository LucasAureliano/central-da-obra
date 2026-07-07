import { BaseCalculatorLayout } from './BaseCalculatorLayout';
import { Lightbulb } from 'lucide-react';

export function LightingCalc({ onBack }: { onBack: () => void }) {
  return (
    <BaseCalculatorLayout
      title="Cálculo Luminotécnico"
      description="Estimar iluminação baseada na norma NBR ISO 8995-1"
      icon={<Lightbulb size={24} color="#F59E0B" />}
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
