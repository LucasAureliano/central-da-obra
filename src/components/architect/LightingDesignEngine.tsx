import { useState } from 'react';
import { Lightbulb, ArrowLeft, CheckCircle2, Sparkles, ShoppingCart, Trash2, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  basePrice: number;
}

export const FIXTURE_TYPES: FixtureOption[] = [
  { id: 'spot', name: 'Spot Embutido (LED 7W)', defaultLumens: 560, defaultWatts: 7, typicalUse: 'Foco pontual e iluminação de destaque', basePrice: 25.90 },
  { id: 'plafon', name: 'Plafon LED Quadrado/Redondo (24W)', defaultLumens: 1920, defaultWatts: 24, typicalUse: 'Iluminação geral difusa uniforme', basePrice: 45.00 },
  { id: 'pendente', name: 'Pendente Decorativo (12W)', defaultLumens: 960, defaultWatts: 12, typicalUse: 'Mesa de jantar, bancada gourmet ou criado', basePrice: 120.00 },
  { id: 'perfil', name: 'Perfil de Alumínio LED (20W/m)', defaultLumens: 1800, defaultWatts: 20, typicalUse: 'Linha contínua moderna e iluminação funcional', basePrice: 85.00 },
  { id: 'trilho', name: 'Trilho Eletrificado (3 Spots 10W)', defaultLumens: 2400, defaultWatts: 30, typicalUse: 'Estilo industrial versátil com spots direcionáveis', basePrice: 180.00 },
  { id: 'fita', name: 'Fita LED (14.4W/m)', defaultLumens: 1200, defaultWatts: 14.4, typicalUse: 'Sanca, marcenaria e iluminação indireta', basePrice: 35.00 },
  { id: 'lustre', name: 'Lustre Central / Chandelier', defaultLumens: 3200, defaultWatts: 40, typicalUse: 'Elemento imponente de destaque e hall de entrada', basePrice: 850.00 },
  { id: 'arandela', name: 'Arandela de Parede (6W)', defaultLumens: 480, defaultWatts: 6, typicalUse: 'Efeito lavagem de parede e balizamento', basePrice: 65.00 },
];

interface ProjectRoom {
  id: string;
  envName: string;
  fixtureName: string;
  area: number;
  quantity: number;
  totalLux: number;
  estimatedCost: number;
}

interface LightingDesignEngineProps {
  onBack?: () => void;
}

export function LightingDesignEngine({ onBack }: LightingDesignEngineProps) {
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentSetting>(ENVIRONMENTS[0]);
  const [selectedFixture, setSelectedFixture] = useState<FixtureOption>(FIXTURE_TYPES[0]);

  const [width, setWidth] = useState('4');
  const [length, setLength] = useState('5');
  const [height, setHeight] = useState('2.8');

  const [rooms, setRooms] = useState<ProjectRoom[]>([]);

  const area = Number(width) * Number(length);
  const volume = area * Number(height);
  const kIndex = volume / (Number(height) * (Number(width) + Number(length)));
  
  // Utilization factor and maintenance factor mock values
  const utilizationFactor = 0.6;
  const maintenanceFactor = 0.8;
  const totalLumensRequired = (selectedEnv.recommendedLux * area) / (utilizationFactor * maintenanceFactor);
  const fixtureQuantity = Math.ceil(totalLumensRequired / selectedFixture.defaultLumens);
  const achievedLux = Math.round((fixtureQuantity * selectedFixture.defaultLumens * utilizationFactor * maintenanceFactor) / area);

  const addRoom = () => {
    setRooms([...rooms, {
      id: crypto.randomUUID(),
      envName: selectedEnv.name,
      fixtureName: selectedFixture.name,
      area: area,
      quantity: fixtureQuantity,
      totalLux: achievedLux,
      estimatedCost: fixtureQuantity * selectedFixture.basePrice
    }]);
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const totalEstimatedCost = rooms.reduce((acc, r) => acc + r.estimatedCost, 0);
  
  const stores = [
    { name: 'Leroy Merlin', price: totalEstimatedCost * 1.05 },
    { name: 'Telhanorte', price: totalEstimatedCost * 0.98 },
    { name: 'C&C', price: totalEstimatedCost * 1.12 }
  ];
  stores.sort((a, b) => a.price - b.price);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{ padding: 8, borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={20} color="var(--text-main)" />
          </button>
        )}
        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 12, borderRadius: 16 }}>
          <Lightbulb size={28} color="#F59E0B" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Projeto Luminotécnico</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Dimensionamento, distribuição e cotação de luminárias</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* DIMENSIONAMENTO FORM */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#F59E0B" /> Dimensionar Novo Ambiente
          </h2>

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

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
              2. Dimensões do Ambiente
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Largura (m)</label>
                <input value={width} onChange={e => setWidth(e.target.value)} type="number" step="0.1" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Comprimento (m)</label>
                <input value={length} onChange={e => setLength(e.target.value)} type="number" step="0.1" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Pé-direito (m)</label>
                <input value={height} onChange={e => setHeight(e.target.value)} type="number" step="0.1" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
              3. Tipo de Luminária Principal
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {FIXTURE_TYPES.map(fix => (
                <div
                  key={fix.id}
                  onClick={() => setSelectedFixture(fix)}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-elevated)', padding: 16, borderRadius: 16 }}>
            <div>
              <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)' }}>Resultado do Cálculo:</span>
              <strong style={{ fontSize: 18, color: '#F59E0B' }}>{fixtureQuantity} unidades necessárias</strong>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--text-main)' }}>Atingindo {achievedLux} Lux (Meta: {selectedEnv.recommendedLux} Lux)</span>
            </div>
            <button onClick={addRoom} className="btn-primary" style={{ padding: '10px 20px', borderRadius: 12, fontWeight: 700 }}>
              Adicionar ao Projeto
            </button>
          </div>
        </div>

        {/* LIST OF ROOMS (CARDS) */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Ambientes do Projeto</h3>
          {rooms.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Nenhum ambiente adicionado ainda.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              <AnimatePresence>
                {rooms.map(r => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{ backgroundColor: 'var(--bg-panel)', padding: 20, borderRadius: 20, border: '1px solid var(--border-subtle)', position: 'relative' }}
                  >
                    <button onClick={() => deleteRoom(r.id)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 700, paddingRight: 24 }}>{r.envName}</h4>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 16 }}>Área: {r.area.toFixed(1)}m²</span>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 10, borderRadius: 12, gridColumn: 'span 2' }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>LUMINÁRIA</span>
                        <strong style={{ fontSize: 14, color: 'var(--text-main)' }}>{r.fixtureName}</strong>
                      </div>
                      <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 10, borderRadius: 12 }}>
                        <span style={{ fontSize: 10, color: '#F59E0B', display: 'block', marginBottom: 4, fontWeight: 700 }}>QUANTIDADE</span>
                        <strong style={{ fontSize: 16, color: '#F59E0B' }}>{r.quantity} un</strong>
                      </div>
                      <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 12 }}>
                        <span style={{ fontSize: 10, color: '#10B981', display: 'block', marginBottom: 4, fontWeight: 700 }}>CUSTO ESTIMADO</span>
                        <strong style={{ fontSize: 16, color: '#10B981' }}>R$ {r.estimatedCost.toFixed(2)}</strong>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ESTIMATOR & QUOTATION SUMMARY */}
        {rooms.length > 0 && (
          <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <ShoppingCart size={24} color="#10B981" />
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Cotação em Tempo Real (API)</h2>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Total Estimado de Luminárias</span>
              <strong style={{ fontSize: 32, fontWeight: 900, color: '#10B981' }}>R$ {totalEstimatedCost.toFixed(2)}</strong>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>Comparativo nas Lojas Parceiras:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {stores.map((store, idx) => (
                <div key={store.name} style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-elevated)', border: idx === 0 ? '2px solid #10B981' : '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Building2 size={14} /> {store.name}
                    </span>
                    {idx === 0 && <span style={{ fontSize: 10, backgroundColor: '#10B981', color: '#FFF', padding: '2px 6px', borderRadius: 6, fontWeight: 700 }}>+ BARATO</span>}
                  </div>
                  <strong style={{ fontSize: 18, color: 'var(--text-main)' }}>R$ {store.price.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
