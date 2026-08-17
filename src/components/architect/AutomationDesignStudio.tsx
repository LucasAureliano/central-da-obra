import { useState, useEffect } from 'react';
import { Cpu, ArrowLeft, Network, Smartphone, Speaker, GripVertical, Plus } from 'lucide-react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

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
    case 'Climatização': basePrice = 250; break;
    case 'Motorização': basePrice = 450; break;
    case 'Áudio/Vídeo': basePrice = 800; break;
    case 'Segurança': basePrice = 350; break;
    case 'Hub / Assistente': basePrice = 400; break;
    default: basePrice = 150;
  }
  if (brand === 'WEG' || brand === 'Philips Hue') basePrice *= 1.8;
  if (brand === 'NovaDigital' || brand === 'Sonoff') basePrice *= 0.8;
  return Math.round(basePrice);
}

function DeviceItemComponent({ item, onRemove }: { item: DeviceItem, onRemove: (id: string) => void }) {
  const controls = useDragControls();
  
  const getProtocolColor = (prot: string) => {
    switch (prot) {
      case 'Wi-Fi': return '#3B82F6';
      case 'Zigbee': return '#EAB308';
      case 'Bluetooth': return '#8B5CF6';
      case 'Cabeado (KNX)': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      style={{ padding: 16, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', position: 'relative' }}
    >
      <div
        className="drag-handle"
        onPointerDown={(e) => controls.start(e)}
        style={{ cursor: 'grab', position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', padding: 8, color: 'var(--text-muted)' }}
      >
        <GripVertical size={16} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingLeft: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.env}</span>
        <button type="button" onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 12, cursor: 'pointer' }}>Excluir</button>
      </div>
      <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 700, color: 'var(--text-main)', paddingLeft: 10 }}>{item.name}</h4>
      <p style={{ margin: '0 0 12px 0', fontSize: 12, color: 'var(--text-muted)', paddingLeft: 10 }}>
        Marca recomendada: <strong style={{ color: 'var(--text-main)' }}>{item.brand}</strong> | Est.: {formatCurrency(item.estimatedPrice)}
      </p>
      
      <div style={{ display: 'flex', gap: 8, paddingLeft: 10 }}>
        <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, backgroundColor: 'var(--bg-panel)', color: 'var(--text-muted)' }}>{item.type}</span>
        <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, backgroundColor: `${getProtocolColor(item.protocol)}22`, color: getProtocolColor(item.protocol), fontWeight: 600 }}>{item.protocol}</span>
      </div>
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

  const addDevice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name) return;
    
    setDevices([...devices, {
      id: Math.random().toString(36).substring(7),
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

  const totalValue = devices.reduce((acc, curr) => acc + curr.estimatedPrice, 0);

  return (
    <div className="animate-fade-in" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
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
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Projeto de Automação</h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Planejamento inteligente, dispositivos e cenários</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>ESTIMATIVA TOTAL</p>
            <h2 style={{ margin: 0, fontSize: 24, color: '#10B981', fontWeight: 900 }}>{formatCurrency(totalValue)}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'start' }}>
          <form onSubmit={addDevice} style={{ flex: '1 1 280px', backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Novo Dispositivo</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>AMBIENTE</label>
                <input 
                  type="text" 
                  value={env}
                  onChange={e => setEnv(e.target.value)}
                  placeholder="Ex: Sala de TV"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>TIPO DE DISPOSITIVO</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                >
                  <option value="Iluminação">Iluminação (Interruptor/Lâmpada)</option>
                  <option value="Climatização">Climatização (IR/Ar)</option>
                  <option value="Motorização">Motorização (Persiana/Cortina)</option>
                  <option value="Áudio/Vídeo">Áudio/Vídeo</option>
                  <option value="Segurança">Segurança (Câmera/Fechadura)</option>
                  <option value="Hub / Assistente">Hub / Assistente Virtual</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>PROTOCOLO</label>
                <select 
                  value={protocol}
                  onChange={e => setProtocol(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                >
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="Zigbee">Zigbee</option>
                  <option value="Bluetooth">Bluetooth / BLE</option>
                  <option value="Cabeado (KNX)">Cabeado (KNX / Ethernet)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>MARCA RECOMENDADA</label>
                <select 
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                >
                  {BRANDS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>NOME DO PRODUTO</label>
                <input 
                  type="text" 
                  value={name}
                  required
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Fechadura Smart"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                />
              </div>

              <button 
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: 12, backgroundColor: '#10B981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
              >
                Adicionar Dispositivo
              </button>
            </div>
          </form>

          <div style={{ flex: '2 1 280px', minWidth: 0 }}>
            <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Dispositivos Mapeados</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Arraste para reordenar</span>
              </div>
              
              <div style={{ overflowX: 'hidden', paddingBottom: 10 }}>
                <div style={{ width: '100%' }}>
                  <Reorder.Group 
                    axis="y" 
                    values={devices} 
                    onReorder={setDevices} 
                    style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0, listStyle: 'none' }}
                  >
                    {devices.map(d => (
                      <DeviceItemComponent key={d.id} item={d} onRemove={removeDevice} />
                    ))}
                  </Reorder.Group>
                </div>
              </div>

            {devices.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>Nenhum dispositivo adicionado.</p>
            )}

            <div style={{ marginTop: 24, padding: 16, borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px dashed #10B981' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: 13, color: '#10B981' }}>Infraestrutura Necessária</h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: 'var(--text-main)' }}>
                <li>Garantir caixas 4x2 ou 4x4 profundas para interruptores smart.</li>
                <li>Levar cabo neutro para todos os pontos de iluminação se usar Wi-Fi.</li>
                <li>Ponto de rede (RJ45) próximo ao roteador para o Hub Zigbee.</li>
              </ul>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

