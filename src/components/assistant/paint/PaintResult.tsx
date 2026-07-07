import { CheckCircle2, ListChecks, Home } from 'lucide-react';
import type { PaintData } from './PaintWizard';
import type { AssistantMode } from '../SmartAssistant';

export function PaintResult({ data, mode, onHome }: { data: PaintData, mode: AssistantMode, onHome: () => void }) {
  
  const calculate = () => {
    const a = data.area;
    const lossMargin = mode === 'pro' ? 1.05 : 1.10; // 5% vs 10%
    
    let needsSealer = false;
    let needsMassa = false;
    let paintType = 'Tinta Acrílica Premium';
    let coats = 2; // Demãos
    
    if (data.condition.includes('Nova')) {
      needsSealer = true;
      needsMassa = true;
      coats = 3;
    } else if (data.condition.includes('Descascando')) {
      needsMassa = true;
      coats = 3;
    }

    if (data.surface.includes('Madeira')) {
      paintType = 'Esmalte Sintético ou Verniz';
      needsSealer = false;
    } else if (data.surface.includes('Metal')) {
      paintType = 'Esmalte Sintético';
      needsSealer = false;
    }

    // Rendimentos (Média lata 18L por demão = ~250m2, divido por coats)
    const items = [];
    
    if (needsSealer) {
      items.push({ name: 'Selador Acrílico (1 demão)', qty: Math.ceil((a / 100) * lossMargin) + ' latas (18L)' });
    }
    if (needsMassa) {
      const yieldMassa = data.surface.includes('Fachada') ? 30 : 50; // Massa acrilica gasta mais, massa corrida rende mais
      const massaType = data.surface.includes('Fachada') ? 'Massa Acrílica' : 'Massa Corrida';
      items.push({ name: `${massaType} (2 demãos)`, qty: Math.ceil((a / yieldMassa) * lossMargin) + ' latas (18L)' });
    }

    // Tinta
    const paintYieldPerTin = data.surface.includes('Madeira') || data.surface.includes('Metal') ? 40 : (250 / coats); // 3.6L para esmalte, 18L para parede
    const unit = data.surface.includes('Madeira') || data.surface.includes('Metal') ? 'galões (3.6L)' : 'latas (18L)';
    items.push({ name: `${paintType} (${coats} demãos)`, qty: Math.ceil((a / paintYieldPerTin) * lossMargin) + ` ${unit}` });

    return { items, coats };
  };

  const result = calculate();

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <CheckCircle2 size={32} color="#10B981" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Pintura Calculada</h2>
        <p style={{ color: 'var(--text-muted)' }}>Cálculo processado no Modo {mode === 'pro' ? 'Profissional' : 'Rápido'}.</p>
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 24, backgroundColor: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
        <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#EC4899', fontWeight: 700, marginBottom: 16 }}>Resumo da Superfície</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Área</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{data.area.toFixed(2)} m²</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Margem de Perda</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{mode === 'pro' ? '5%' : '10%'}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Materiais Necessários</h4>
          {result.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.qty}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>* O rendimento pode variar dependendo da absorção da parede e da marca da tinta utilizada.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn-primary" style={{ padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <ListChecks size={20} /> Salvar como Obra
        </button>
        <button onClick={onHome} style={{ padding: 16, borderRadius: 16, border: 'none', background: 'transparent', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <Home size={20} /> Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}
