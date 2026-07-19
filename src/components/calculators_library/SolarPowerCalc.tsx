import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Sun, Zap, Maximize, PiggyBank } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface SolarPowerCalcProps {
  onBack: () => void;
}

export function SolarPowerCalc({ onBack }: SolarPowerCalcProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    consumoKwh: '',
    hsp: '4.5', // Horas de Sol Pleno média Brasil
    potenciaPlaca: '550' // W
  });

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const consumo = parseFloat(data.consumoKwh) || 0;
    const hsp = parseFloat(data.hsp) || 4.5;
    const pot = parseFloat(data.potenciaPlaca) || 550;
    
    // Perdas do sistema (inversor, temperatura, sujeira) ~ 20%
    const eficiencia = 0.8; 
    
    // Consumo diário
    const consumoDiario = consumo / 30;

    // Potência do sistema em kWp necessária
    // Energia = Potência * HSP * Eficiencia -> Potência = Energia / (HSP * Eficiencia)
    const kWp = consumoDiario / (hsp * eficiencia);

    // Quantidade de Placas
    const potenciaPlacaKW = pot / 1000;
    const qtdPlacas = Math.ceil(kWp / potenciaPlacaKW);

    // Área necessária (Média 2.6m2 por placa de 550W)
    const areaTelhado = qtdPlacas * 2.6;

    // Economia Financeira Estimada (R$ 0.90 o kWh médio no Brasil)
    const tarifa = 0.90;
    // O cliente ainda paga a taxa de disponibilidade (ex: monofásico 30kwh = R$27)
    const taxaMinima = 30 * tarifa; 
    const contaAntiga = consumo * tarifa;
    const contaNova = taxaMinima; // Assumindo geração de 100%
    const economiaMensal = Math.max(0, contaAntiga - contaNova);
    const economiaAnual = economiaMensal * 12;

    return { 
      kWp: kWp.toFixed(2),
      qtdPlacas,
      areaTelhado: areaTelhado.toFixed(1),
      economiaMensal: economiaMensal.toFixed(2),
      economiaAnual: economiaAnual.toFixed(2)
    };
  };

  const results = step === 4 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Sun size={28} color="#F59E0B" />
        Calculadora Solar
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Dimensionamento off-grid / on-grid básico e placas.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={20} /> Consumo Mensal</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Veja na sua conta de luz (em kWh).</p>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.consumoKwh}
                  onChange={e => setData({ ...data, consumoKwh: e.target.value })}
                  placeholder="Ex: 500"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>kWh/mês</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Sun size={20} /> Incidência Solar (HSP)</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Horas de Sol Pleno (Média Brasil: 4.5)</p>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={data.hsp}
                  onChange={e => setData({ ...data, hsp: e.target.value })}
                  placeholder="Ex: 4.5"
                  className="input-base"
                  style={{ fontSize: 24, padding: '16px 20px' }}
                  autoFocus
                />
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>HSP</span>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Maximize size={20} /> Potência do Painel</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['450', '500', '550', '600'].map(pot => (
                  <button 
                    key={pot}
                    onClick={() => setData({ ...data, potenciaPlaca: pot })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.potenciaPlaca === pot ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.potenciaPlaca === pot ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.potenciaPlaca === pot ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.potenciaPlaca === pot ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    Módulo de {pot} W
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && results && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#F59E0B" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Sistema Fotovoltaico</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Quantidade de Painéis</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#F59E0B' }}>{results.qtdPlacas} un.</div>
                </div>
                <div className="card-premium" style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Potência Instalada</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)' }}>{results.kWp} kWp</div>
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><PiggyBank size={16} color="#10B981" /> Retorno e Economia</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Área Mínima no Telhado</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>~ {results.areaTelhado} m²</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Economia Mensal Estimada</span>
                    <span style={{ fontWeight: 600, color: '#10B981' }}>R$ {results.economiaMensal}</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Economia Anual Estimada</span>
                    <span style={{ fontWeight: 600, color: '#10B981' }}>R$ {results.economiaAnual}</span>
                  </li>
                </ul>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>*Considerando tarifa de R$0.90/kWh e perdas do sistema de 20%.</p>
              </div>

              <SmartResultActions 
                tags={['solar-power', 'electrical']}
                onGeneratePDF={() => alert('PDF Gerado!')}
                onAddBudget={() => alert('Adicionado ao Orçamento')}
                onAddShoppingList={() => alert('Adicionado à Lista de Compras')}
                onSaveHistory={() => alert('Salvo no Histórico')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        {step < 4 && (
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
              {step === 3 ? 'Calcular' : 'Avançar'}
              {step < 3 && <ArrowRight size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
