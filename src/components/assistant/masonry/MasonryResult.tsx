import { CheckCircle2, Download, ListChecks, Home } from 'lucide-react';
import type { MasonryData } from './MasonryWizard';
import type { AssistantMode } from '../SmartAssistant';

export function MasonryResult({ data, mode, onHome }: { data: MasonryData, mode: AssistantMode, onHome: () => void }) {
  
  // MOTOR DE CÁLCULO INTELIGENTE
  const calculate = () => {
    // 1. Áreas
    const grossArea = data.width * data.height;
    const netArea = grossArea - (data.hasOpenings ? data.openingsArea : 0);
    
    // 2. Parâmetros baseados no modo
    const lossMargin = mode === 'pro' ? 1.05 : 1.10; // Pro: 5%, Fast: 10%
    
    // 3. Tijolos
    let bricksPerM2 = 25; // Baiano 9x19x19 deitado
    if (data.material.includes('Concreto')) bricksPerM2 = 12.5;
    if (data.material.includes('Maciço')) bricksPerM2 = 70;

    const totalBricks = Math.ceil(netArea * bricksPerM2 * lossMargin);

    // 4. Argamassa Assentamento (Estimativa média 15kg/m2)
    const mortarKg = Math.ceil(netArea * 15 * lossMargin);
    const mortarBags = Math.ceil(mortarKg / 20); // Sacos de 20kg

    // 5. Acabamentos
    const fins = [];
    if (data.finishings.includes('chapisco')) {
      fins.push({ name: 'Cimento p/ Chapisco', qty: Math.ceil((netArea * 1.5) / 50) + ' sacos' });
      fins.push({ name: 'Areia p/ Chapisco', qty: ((netArea * 0.005) * lossMargin).toFixed(2) + ' m³' });
    }
    if (data.finishings.includes('reboco')) {
      // Massa única ~2cm
      fins.push({ name: 'Cimento p/ Reboco', qty: Math.ceil((netArea * 5) / 50) + ' sacos' });
      fins.push({ name: 'Areia p/ Reboco', qty: ((netArea * 0.025) * lossMargin).toFixed(2) + ' m³' });
    }
    if (data.finishings.includes('massa')) {
      fins.push({ name: 'Massa Corrida/Acrílica', qty: Math.ceil((netArea * 1.2) / 18) + ' latas (18L)' });
    }
    if (data.finishings.includes('pintura')) {
      fins.push({ name: 'Tinta (2 a 3 demãos)', qty: Math.ceil((netArea * 0.25) / 18) + ' latas (18L)' });
    }

    return {
      netArea: netArea.toFixed(2),
      grossArea: grossArea.toFixed(2),
      totalBricks,
      mortarBags,
      fins
    };
  };

  const result = calculate();

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <CheckCircle2 size={32} color="#10B981" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Orçamento Pronto</h2>
        <p style={{ color: 'var(--text-muted)' }}>Cálculo processado no Modo {mode === 'pro' ? 'Profissional' : 'Rápido'}.</p>
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 24, backgroundColor: 'rgba(255, 107, 0, 0.05)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
        <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-primary)', fontWeight: 700, marginBottom: 16 }}>Resumo da Obra</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Área Líquida</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{result.netArea} m²</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Margem Perda</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{mode === 'pro' ? '5%' : '10%'}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Estrutura Básica</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-muted)' }}>{data.material}</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.totalBricks} und</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-muted)' }}>Argamassa Assentamento</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{result.mortarBags} sacos (20kg)</span>
          </div>
        </div>

        {result.fins.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, marginTop: 8 }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Acabamentos Solicitados</h4>
            {result.fins.map((fin, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>{fin.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{fin.qty}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn-primary" style={{ padding: 16, borderRadius: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <ListChecks size={20} /> Salvar como Obra
        </button>
        <button style={{ padding: 16, borderRadius: 16, border: '1px solid var(--border-strong)', background: 'var(--bg-glass)', color: 'var(--text-main)', display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Download size={20} /> Exportar PDF
        </button>
        <button onClick={onHome} style={{ padding: 16, borderRadius: 16, border: 'none', background: 'transparent', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <Home size={20} /> Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}
