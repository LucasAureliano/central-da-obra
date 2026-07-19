import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Square, Maximize, Ruler, Settings } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface PlasteringCalcProps {
  onBack: () => void;
}

export function PlasteringCalc({ onBack }: PlasteringCalcProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    area: '',
    tipo: '',
    tabica: 'Sim',
    perimetro: ''
  });

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const a = parseFloat(data.area) || 0;
    const p = parseFloat(data.perimetro) || 0;
    
    // Placas Drywall (Standard 1.20 x 1.80 = 2.16m²)
    // Placas de Gesso (Plaquinha comum 0.60 x 0.60 = 0.36m²)
    let placas = 0;
    let tipoPlaca = '';
    
    if (data.tipo === 'Drywall (Acartonado)') {
      // 10% de perda
      placas = Math.ceil((a * 1.1) / 2.16);
      tipoPlaca = 'Placas de Drywall ST (1.20 x 1.80m)';
    } else {
      placas = Math.ceil((a * 1.1) / 0.36);
      tipoPlaca = 'Plaquinhas de Gesso (60 x 60cm)';
    }

    // Tabica metálica (barras de 3m)
    const barrasTabica = data.tabica === 'Sim' ? Math.ceil((p * 1.1) / 3) : 0;
    
    // Insumos básicos para Drywall (Estimativa por m²)
    const perfisF53 = data.tipo === 'Drywall (Acartonado)' ? Math.ceil(a * 1.2 / 3) : 0; // Barras de 3m
    const massa = (a * 0.3).toFixed(1); // kg de massa
    const fita = Math.ceil(a * 1.5); // metros de fita

    return { 
      placas,
      tipoPlaca,
      barrasTabica,
      perfisF53,
      massa,
      fita
    };
  };

  const results = step === 5 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Square size={28} color="#94A3B8" />
        Calculadora de Forro
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Materiais para forro de gesso ou drywall.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Maximize size={20} /> Área do Teto</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.area}
                  onChange={e => setData({ ...data, area: e.target.value })}
                  placeholder="Ex: 25"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>m²</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Perímetro (para cantoneiras/tabica)</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.perimetro}
                  onChange={e => setData({ ...data, perimetro: e.target.value })}
                  placeholder="Ex: 20"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>m</span>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Square size={20} /> Tipo de Forro</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Drywall (Acartonado)', 'Gesso Comum (Plaquinha)'].map(tipo => (
                  <button 
                    key={tipo}
                    onClick={() => setData({ ...data, tipo })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.tipo === tipo ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.tipo === tipo ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.tipo === tipo ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.tipo === tipo ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Settings size={20} /> Acabamento Lateral</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Sim', 'Não'].map(tabica => (
                  <button 
                    key={tabica}
                    onClick={() => setData({ ...data, tabica })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.tabica === tabica ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.tabica === tabica ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.tabica === tabica ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.tabica === tabica ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {tabica === 'Sim' ? 'Com Tabica (Junta de Dilatação)' : 'Sem Tabica (Moldura/Lisa)'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && results && (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(148, 163, 184, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#94A3B8" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Lista de Materiais</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{results.tipoPlaca}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-primary)' }}>{results.placas} un.</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Já inclui 10% de perda</div>
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Acessórios e Insumos</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  {results.barrasTabica > 0 && (
                    <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tabica Metálica (3m)</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.barrasTabica} barras</span>
                    </li>
                  )}
                  {data.tipo === 'Drywall (Acartonado)' && (
                    <>
                      <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Perfil F53 (3m)</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.perfisF53} barras</span>
                      </li>
                      <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Massa para Junta</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>~{results.massa} kg</span>
                      </li>
                      <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Fita de Papel Microperfurada</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.fita} m</span>
                      </li>
                    </>
                  )}
                  {data.tipo === 'Gesso Comum (Plaquinha)' && (
                    <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Sisal e Arame (ou pendurais)</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Para {Math.ceil(parseFloat(data.area)*1.1)}m²</span>
                    </li>
                  )}
                </ul>
              </div>

              <SmartResultActions 
                tags={['plastering', 'drywall']}
                onGeneratePDF={() => alert('PDF Gerado!')}
                onAddBudget={() => alert('Adicionado ao Orçamento')}
                onAddShoppingList={() => alert('Adicionado à Lista de Compras')}
                onSaveHistory={() => alert('Salvo no Histórico')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {step < 5 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button 
              onClick={prevStep} 
              disabled={step === 1}
              className="btn-secondary" 
              style={{ flex: 1, padding: 16, opacity: step === 1 ? 0 : 1 }}
            >
              Voltar
            </button>
            <button 
              onClick={nextStep}
              className="btn-primary" 
              style={{ flex: 2, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {step === 4 ? 'Calcular' : 'Avançar'}
              {step < 4 && <ArrowRight size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
