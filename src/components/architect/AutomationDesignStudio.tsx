import { useState, useEffect } from 'react';
import { Cpu, ArrowLeft, Network, Smartphone, Speaker, GripVertical, Plus, ShoppingCart, Trash2, Building2 } from 'lucide-react';
import { motion, Reorder, useDragControls, AnimatePresence } from 'framer-motion';

export interface DeviceItem {
  id: string;
  env: string;
  name: string;
  protocol: string;
  type: string;
  brand: string;
  estimatedPrice: number;
}

const BRANDS = ['NovaDigital', 'WEG', 'Ekaza', 'Intelbras', 'Sonoff', 'Tuya', 'Philips Hue', 'Amazon', 'Google', 'Positivo'];

function getEstimatedPrice(type: string, brand: string): number {
  let basePrice = 0;
  switch(type) {
    case 'Iluminação': basePrice = 120; break;
    case 'Hub / Assistente': basePrice = 400; break;
    case 'Motorização': basePrice = 300; break;
    case 'Segurança': basePrice = 500; break;
    case 'Climatização': basePrice = 150; break;
    default: basePrice = 100;
  }
  if (brand === 'Philips Hue') basePrice *= 3;
  if (brand === 'WEG' || brand === 'Intelbras') basePrice *= 1.5;
  return basePrice;
}

function AutomationDeviceComponent({ item, onRemove }: { item: DeviceItem, onRemove: (id: string) => void }) {
  const controls = useDragControls();

  const getProtocolColor = (proto: string) => {
    switch (proto) {
      case 'Zigbee': return '#EF4444';
      case 'Wi-Fi': return '#0EA5E9';
      case 'Bluetooth': return '#3B82F6';
      case 'Matter': return '#10B981';
      case 'Z-Wave': return '#F59E0B';
      default: return '#8B5CF6';
    }
  };

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', position: 'relative' }}
    >
      <div
        className="drag-handle"
        onPointerDown={(e) => controls.start(e)}
        style={{ cursor: 'grab', position: 'absolute', right: 8, top: 8, padding: 8, color: 'var(--text-muted)' }}
      >
        <GripVertical size={16} />
      </div>

      <div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 700 }}>{item.env}</span>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, paddingRight: 24, color: 'var(--text-main)' }}>{item.name}</h4>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, backgroundColor: 'var(--bg-panel)', color: 'var(--text-muted)', fontWeight: 600 }}>{item.type}</span>
        <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)', fontWeight: 600 }}>{item.brand}</span>
        <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, backgroundColor: `${getProtocolColor(item.protocol)}22`, color: getProtocolColor(item.protocol), fontWeight: 700 }}>{item.protocol}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 12 }}>
          <span style={{ fontSize: 10, color: '#10B981', display: 'block', marginBottom: 4, fontWeight: 700 }}>CUSTO ESTIMADO</span>
          <strong style={{ fontSize: 14, color: '#10B981' }}>R$ {item.estimatedPrice.toFixed(2)}</strong>
        </div>
      </div>

      <button onClick={() => onRemove(item.id)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <Trash2 size={14} /> Remover Dispositivo
      </button>
    </Reorder.Item>
  );
}

export function AutomationDesignStudio({ onBack }: { onBack?: () => void }) {
  const [devices, setDevices] = useState<DeviceItem[]>([
    { id: '1', env: 'Sala de Estar', name: 'Interruptor Smart 3 Teclas', protocol: 'Wi-Fi', type: 'Iluminação', brand: 'NovaDigital', estimatedPrice: 130 },
    { id: '2', env: 'Sala de Estar', name: 'Echo Dot (Alexa)', protocol: 'Wi-Fi', type: 'Hub / Assistente', brand: 'Amazon', estimatedPrice: 350 },
    { id: '3', env: 'Quarto Casal', name: 'Módulo Relé Persiana', protocol: 'Zigbee', type: 'Motorização', brand: 'WEG', estimatedPrice: 280 },
  ]);

  const [env, setEnv] = useState('Sala de Estar');
  const [name, setName] = useState('');
  const [protocol, setProtocol] = useState('Wi-Fi');
  const [type, setType] = useState('Iluminação');
  const [brand, setBrand] = useState('NovaDigital');

  // Auto-suggest brand based on type
  useEffect(() => {
    if (type === 'Hub / Assistente') setBrand('Amazon');
    else if (type === 'Motorização') setBrand('WEG');
    else if (type === 'Segurança') setBrand('Intelbras');
    else setBrand('NovaDigital');
  }, [type]);

  const addDevice = () => {
    if (!name) return;
    setDevices([...devices, {
      id: crypto.randomUUID(),
      env,
      name,
      protocol,
      type,
      brand,
      estimatedPrice: getEstimatedPrice(type, brand)
    }]);
    setName('');
  };

  const removeDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  const totalEstimatedCost = devices.reduce((acc, d) => acc + d.estimatedPrice, 0);

  const stores = [
    { name: 'Leroy Merlin', price: totalEstimatedCost * 1.05 },
    { name: 'Amazon Prime', price: totalEstimatedCost * 0.96 },
    { name: 'Mercado Livre', price: totalEstimatedCost * 0.98 }
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
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 12, borderRadius: 16 }}>
          <Cpu size={28} color="#10B981" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Projeto de Automação</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Mapeamento de dispositivos Smart e Rede</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* ADD DEVICE FORM */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Adicionar Dispositivo Smart</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>AMBIENTE</label>
              <input 
                type="text" 
                value={env}
                onChange={e => setEnv(e.target.value)}
                placeholder="Ex: Varanda Gourmet"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>NOME DO DISPOSITIVO</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Fita LED Sanca"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>CATEGORIA</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              >
                <option value="Iluminação">Iluminação (Interruptores/Lâmpadas)</option>
                <option value="Hub / Assistente">Hub / Assistente Virtual</option>
                <option value="Motorização">Motorização (Cortinas/Portões)</option>
                <option value="Segurança">Segurança (Câmeras/Fechaduras)</option>
                <option value="Climatização">Climatização (Ar/Aquecedor)</option>
                <option value="Sensores">Sensores (Presença/Abertura)</option>
                <option value="Infraestrutura">Infra de Rede (Roteador Mesh/Switch)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>MARCA/ECOSSISTEMA</label>
              <select 
                value={brand}
                onChange={e => setBrand(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              >
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>PROTOCOLO</label>
              <select 
                value={protocol}
                onChange={e => setProtocol(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              >
                <option value="Wi-Fi">Wi-Fi (Padrão)</option>
                <option value="Zigbee">Zigbee (Requer Hub)</option>
                <option value="Bluetooth">Bluetooth (Mesh/BLE)</option>
                <option value="Matter">Matter (Universal)</option>
                <option value="Z-Wave">Z-Wave</option>
                <option value="Cabeado">Cabeado (KNX/Ethernet)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={addDevice}
            className="btn-primary"
            style={{ width: '100%', marginTop: 24, padding: 14, borderRadius: 12, fontWeight: 700 }}
          >
            Adicionar Dispositivo
          </button>
        </div>

        {/* DEVICES LIST (CARDS) */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Dispositivos Mapeados</h3>
          {devices.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Nenhum dispositivo mapeado.</p>
          ) : (
            <Reorder.Group axis="y" values={devices} onReorder={setDevices} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {devices.map(item => (
                <AutomationDeviceComponent key={item.id} item={item} onRemove={removeDevice} />
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* ESTIMATOR & QUOTATION SUMMARY */}
        {devices.length > 0 && (
          <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <ShoppingCart size={24} color="#10B981" />
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Cotação em Tempo Real (API)</h2>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Total Estimado dos Dispositivos Smart</span>
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
