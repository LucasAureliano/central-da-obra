import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, CheckCircle2, Droplets, Users, Home, Settings } from 'lucide-react';
import { SmartResultActions } from './SmartResultActions';

interface WaterTankCalcProps {
  onBack: () => void;
}

export function WaterTankCalc({ onBack }: WaterTankCalcProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    moradores: '4',
    tipoResidencia: '',
    diasReserva: '2'
  });

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const calculateResults = () => {
    const pessoas = parseInt(data.moradores) || 0;
    const dias = parseInt(data.diasReserva) || 2;
    
    // Consumo médio per capita (NBR 5626)
    let consumoPerCapita = 150; // Casa padrão
    if (data.tipoResidencia === 'Apartamento') consumoPerCapita = 200; // Apartamentos costumam gastar mais (pressão da água)
    if (data.tipoResidencia === 'Chácara/Rural') consumoPerCapita = 250; // Uso externo maior

    const volumeDiario = pessoas * consumoPerCapita;
    const volumeNecessario = volumeDiario * dias;

    // Tamanhos comerciais padrão de caixas d'água
    const tamanhosComerciais = [310, 500, 1000, 1500, 2000, 3000, 5000, 10000];
    
    // Achar o modelo que seja maior ou igual ao necessário, ou compor múltiplos
    let principal = tamanhosComerciais.find(t => t >= volumeNecessario);
    let multiplas = null;

    if (!principal) {
      // Se passar de 10.000, sugere múltiplas
      const maxCaixa = 10000;
      const qtd = Math.ceil(volumeNecessario / maxCaixa);
      multiplas = `${qtd}x caixas de ${maxCaixa}L`;
      principal = maxCaixa * qtd;
    }

    return { 
      volumeDiario,
      volumeNecessario,
      sugestao: multiplas || `1x Caixa de ${principal} Litros`
    };
  };

  const results = step === 4 ? calculateResults() : null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <button onClick={onBack} className="btn-icon" style={{ marginBottom: 16 }}>
        <ChevronLeft size={24} />
      </button>
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Droplets size={28} color="#0EA5E9" />
        Calculadora de Caixa d'Água
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Dimensionamento de reservatório segundo normas NBR.</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--color-primary)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={20} /> Moradores</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Quantas pessoas vivem ou viverão no local?</p>
              <input 
                type="number" 
                value={data.moradores}
                onChange={e => setData({ ...data, moradores: e.target.value })}
                placeholder="Ex: 4"
                className="input-base"
                style={{ fontSize: 24, padding: '16px 20px' }}
                autoFocus
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Home size={20} /> Tipo de Residência</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Casa Padrão', 'Apartamento', 'Chácara/Rural'].map(tipo => (
                  <button 
                    key={tipo}
                    onClick={() => setData({ ...data, tipoResidencia: tipo })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.tipoResidencia === tipo ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.tipoResidencia === tipo ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.tipoResidencia === tipo ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.tipoResidencia === tipo ? 600 : 400,
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

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Settings size={20} /> Dias de Reserva</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>A norma exige reserva para no mínimo 2 dias em caso de falta de água da rede.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { v: '1', l: '1 Dia (Baixa segurança)' },
                  { v: '2', l: '2 Dias (Padrão NBR)' },
                  { v: '3', l: '3 Dias (Alta segurança)' },
                ].map(d => (
                  <button 
                    key={d.v}
                    onClick={() => setData({ ...data, diasReserva: d.v })}
                    style={{ 
                      padding: '16px', 
                      borderRadius: 12, 
                      border: data.diasReserva === d.v ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: data.diasReserva === d.v ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      color: data.diasReserva === d.v ? 'var(--color-primary)' : 'var(--text-main)',
                      fontWeight: data.diasReserva === d.v ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {d.l}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && results && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#0EA5E9" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Dimensionamento Concluído</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
                <div className="card-premium" style={{ padding: 24, background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.02) 100%)', border: '1px solid rgba(14, 165, 233, 0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>Recomendação de Compra</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0EA5E9' }}>{results.sugestao}</div>
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>Detalhamento do Consumo</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Consumo Diário Total</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.volumeDiario} Litros</span>
                  </li>
                  <li style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Volume Necessário ({data.diasReserva} dias)</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{results.volumeNecessario} Litros</span>
                  </li>
                </ul>
              </div>

              <SmartResultActions 
                tags={['plumbing', 'water-tank', 'hidraulica']}
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
