import { useState } from 'react';
import { Lightbulb, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export interface EnvironmentSetting {
  id: string;
  name: string;
  recommendedLux: number; // Lux target (NBR 8995-1)
  suggestedTempK: string;
  suggestedCRI: string;
}

export const ENVIRONMENTS: EnvironmentSetting[] = [
  { id: 'sala', name: 'Sala de Estar / Jantar', recommendedLux: 200, suggestedTempK: '2700K - 3000K (Quente)', suggestedCRI: 'IRC > 80' },
  { id: 'quarto', name: 'Quarto / Dormitório', recommendedLux: 150, suggestedTempK: '2700K - 3000K (Quente)', suggestedCRI: 'IRC > 80' },
  { id: 'cozinha', name: 'Cozinha / Área de Preparo', recommendedLux: 500, suggestedTempK: '4000K (Neutra)', suggestedCRI: 'IRC > 90' },
  { id: 'banheiro', name: 'Banheiro / Lavabo', recommendedLux: 300, suggestedTempK: '3000K - 4000K (Neutra)', suggestedCRI: 'IRC > 90 (Bancada)' },
  { id: 'gourmet', name: 'Área Gourmet / Varanda', recommendedLux: 200, suggestedTempK: '2700K - 3000K (Quente)', suggestedCRI: 'IRC > 80' },
  { id: 'escritorio', name: 'Escritório / Home Office', recommendedLux: 500, suggestedTempK: '4000K (Neutra)', suggestedCRI: 'IRC > 90' },
  { id: 'lavanderia', name: 'Lavanderia / Área de Serviço', recommendedLux: 300, suggestedTempK: '4000K - 5000K (Fria/Neutra)', suggestedCRI: 'IRC > 80' },
  { id: 'garagem', name: 'Garagem / Depósito', recommendedLux: 100, suggestedTempK: '4000K - 6500K (Fria)', suggestedCRI: 'IRC > 70' },
  { id: 'corredor', name: 'Corredor / Circulação', recommendedLux: 100, suggestedTempK: '2700K - 3000K (Quente)', suggestedCRI: 'IRC > 80' },
];

export interface FixtureOption {
  id: string;
  name: string;
  defaultLumens: number;
  defaultWatts: number;
  typicalUse: string;
}

export const FIXTURE_TYPES: FixtureOption[] = [
  { id: 'spot', name: 'Spot Embutido (LED 7W)', defaultLumens: 560, defaultWatts: 7, typicalUse: 'Foco pontual e iluminação de destaque' },
  { id: 'plafon', name: 'Plafon LED Quadrado/Redondo (24W)', defaultLumens: 1920, defaultWatts: 24, typicalUse: 'Iluminação geral difusa uniforme' },
  { id: 'pendente', name: 'Pendente Decorativo (12W)', defaultLumens: 960, defaultWatts: 12, typicalUse: 'Mesa de jantar, bancada gourmet ou criado' },
  { id: 'perfil', name: 'Perfil de Alumínio LED (20W/m)', defaultLumens: 1800, defaultWatts: 20, typicalUse: 'Linha contínua moderna e iluminação funcional' },
  { id: 'trilho', name: 'Trilho Eletrificado (3 Spots 10W)', defaultLumens: 2400, defaultWatts: 30, typicalUse: 'Estilo industrial versátil com spots direcionáveis' },
  { id: 'fita', name: 'Fita LED (14.4W/m)', defaultLumens: 1200, defaultWatts: 14.4, typicalUse: 'Sanca, marcenaria e iluminação indireta' },
  { id: 'lustre', name: 'Lustre Central / Chandelier', defaultLumens: 3200, defaultWatts: 40, typicalUse: 'Elemento imponente de destaque e hall de entrada' },
  { id: 'arandela', name: 'Arandela de Parede (6W)', defaultLumens: 480, defaultWatts: 6, typicalUse: 'Efeito lavagem de parede e balizamento' },
];

interface LightingDesignEngineProps {
  onBack?: () => void;
}

export function LightingDesignEngine({ onBack }: LightingDesignEngineProps) {
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentSetting>(ENVIRONMENTS[0]);
  const [selectedFixture, setSelectedFixture] = useState<FixtureOption>(FIXTURE_TYPES[0]);

  // Dimensions
  const [width, setWidth] = useState('4.0');
  const [length, setLength] = useState('5.0');
  const [height, setHeight] = useState('2.7');
  const [hoursPerDay] = useState('6');

  // Custom fixture overrides
  const [customLumens, setCustomLumens] = useState(FIXTURE_TYPES[0].defaultLumens.toString());
  const [customWatts, setCustomWatts] = useState(FIXTURE_TYPES[0].defaultWatts.toString());

  const handleFixtureChange = (fix: FixtureOption) => {
    setSelectedFixture(fix);
    setCustomLumens(fix.defaultLumens.toString());
    setCustomWatts(fix.defaultWatts.toString());
  };

  // Calculations
  const numWidth = parseFloat(width) || 0;
  const numLength = parseFloat(length) || 0;
  const area = numWidth * numLength;

  const lumensPerFixture = parseFloat(customLumens) || selectedFixture.defaultLumens;
  const wattsPerFixture = parseFloat(customWatts) || selectedFixture.defaultWatts;
  const hours = parseFloat(hoursPerDay) || 6;

  // Total required lumens = Area * Lux_recommended / Utilization_factor (approx 0.6 for light walls)
  const totalRequiredLumens = Math.round((area * selectedEnv.recommendedLux) / 0.6);
  const fixtureQuantity = Math.max(1, Math.ceil(totalRequiredLumens / lumensPerFixture));
  const achievedLumens = fixtureQuantity * lumensPerFixture;
  const achievedLux = Math.round((achievedLumens * 0.6) / (area || 1));

  const totalPowerWatts = fixtureQuantity * wattsPerFixture;
  const monthlyKwh = parseFloat(((totalPowerWatts * hours * 30) / 1000).toFixed(2));
  const monthlyCostEstimate = parseFloat((monthlyKwh * 0.85).toFixed(2)); // R$ 0.85/kWh avg

  // Spacing calculation
  const gridRows = Math.round(Math.sqrt(fixtureQuantity));
  const gridCols = Math.ceil(fixtureQuantity / gridRows);
  const spacingX = (numWidth / (gridCols + 1)).toFixed(2);
  const spacingY = (numLength / (gridRows + 1)).toFixed(2);

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Projeto Luminotécnico</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Cálculo de iluminação por Lux (NBR 8995-1) e dimensionamento</p>
          </div>
        </div>
      </div>

      {/* 1. Seleção do Ambiente */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
          1. Selecione o Ambiente
        </label>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }} className="hide-scrollbar">
          {ENVIRONMENTS.map(env => (
            <button
              key={env.id}
              onClick={() => setSelectedEnv(env)}
              style={{
                padding: '8px 14px', borderRadius: 12, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                border: selectedEnv.id === env.id ? '1.5px solid #F59E0B' : '1px solid var(--border-subtle)',
                backgroundColor: selectedEnv.id === env.id ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-elevated)',
                color: selectedEnv.id === env.id ? '#F59E0B' : 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {env.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dimensões do Ambiente */}
      <div className="glass-panel" style={{ padding: 18, borderRadius: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 14px', textTransform: 'uppercase' }}>
          2. Dimensões do Ambiente
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Largura (m)</label>
            <input value={width} onChange={e => setWidth(e.target.value)} type="number" step="0.1" className="input-premium" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Comprimento (m)</label>
            <input value={length} onChange={e => setLength(e.target.value)} type="number" step="0.1" className="input-premium" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Pé-direito (m)</label>
            <input value={height} onChange={e => setHeight(e.target.value)} type="number" step="0.1" className="input-premium" />
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Área Calculada: <strong style={{ color: 'var(--text-main)' }}>{area.toFixed(2)} m²</strong></span>
          <span>Meta NBR 8995-1: <strong style={{ color: '#F59E0B' }}>{selectedEnv.recommendedLux} Lux</strong></span>
        </div>
      </div>

      {/* 3. Tipo de Luminária */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
          3. Tipo de Luminária Principal
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {FIXTURE_TYPES.map(fix => (
            <div
              key={fix.id}
              onClick={() => handleFixtureChange(fix)}
              style={{
                padding: 12, borderRadius: 14, cursor: 'pointer',
                backgroundColor: selectedFixture.id === fix.id ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-elevated)',
                border: selectedFixture.id === fix.id ? '1.5px solid #F59E0B' : '1px solid var(--border-subtle)',
              }}
            >
              <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 2px' }}>{fix.name}</h4>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>{fix.typicalUse}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RESULTADOS DO PROJETO LUMINOTÉCNICO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-mesh-gradient"
        style={{ padding: 24, borderRadius: 24, marginBottom: 24, color: '#FFF' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lightbulb size={22} color="#FFF" />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#FFF', margin: 0 }}>Resultado Luminotécnico</h3>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Dimensionamento para {selectedEnv.name}</span>
          </div>
        </div>

        {/* Quantidade e Lux */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', padding: 16, borderRadius: 18, textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 2 }}>Luminárias Necessárias</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#4ADE80' }}>{fixtureQuantity} {fixtureQuantity === 1 ? 'un' : 'unidades'}</span>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.14)', padding: 16, borderRadius: 18, textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 2 }}>Nível Lux Atingido</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#FFF' }}>{achievedLux} Lux</span>
          </div>
        </div>

        {/* Detalhes Técnicos de Iluminação */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, backgroundColor: 'rgba(0,0,0,0.2)', padding: 14, borderRadius: 16 }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Fluxo Luminoso Total:</span>
            <strong style={{ color: '#FFF' }}>{achievedLumens.toLocaleString('pt-BR')} Lumens</strong>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Potência Total:</span>
            <strong style={{ color: '#FFF' }}>{totalPowerWatts} Watts</strong>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Espaçamento Sugerido:</span>
            <strong style={{ color: '#FFF' }}>{spacingX}m x {spacingY}m</strong>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Consumo Estimado:</span>
            <strong style={{ color: '#4ADE80' }}>{monthlyKwh} kWh/mês (R$ {monthlyCostEstimate.toFixed(2)})</strong>
          </div>
        </div>

        {/* Recomendações de Temperatura e IRC */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color="#F59E0B" /> Temp. de Cor Recomendada: <strong>{selectedEnv.suggestedTempK}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={14} color="#4ADE80" /> Índice de Reprodução de Cor: <strong>{selectedEnv.suggestedCRI}</strong>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
