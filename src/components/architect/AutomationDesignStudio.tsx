import { useState } from 'react';
import { Cpu, ArrowLeft, Network, Smartphone, Speaker } from 'lucide-react';
import { motion } from 'framer-motion';

export function AutomationDesignStudio({ onBack }: { onBack?: () => void }) {
  const [devices, setDevices] = useState([
    { id: '1', env: 'Sala de Estar', name: 'Interruptor Smart 3 Teclas', protocol: 'Wi-Fi', type: 'Iluminação' },
    { id: '2', env: 'Sala de Estar', name: 'Echo Dot (Alexa)', protocol: 'Wi-Fi', type: 'Hub / Assistente' },
    { id: '3', env: 'Quarto Casal', name: 'Módulo Relé Persiana', protocol: 'Zigbee', type: 'Motorização' },
    { id: '4', env: 'Corredor', name: 'Sensor de Presença Smart', protocol: 'Zigbee', type: 'Segurança' },
  ]);

  const [env, setEnv] = useState('Sala de Estar');
  const [name, setName] = useState('');
  const [protocol, setProtocol] = useState('Wi-Fi');
  const [type, setType] = useState('Iluminação');

  const addDevice = () => {
    if (!name) return;
    setDevices([...devices, {
      id: crypto.randomUUID(),
      env,
      name,
      protocol,
      type
    }]);
    setName('');
  };

  const removeDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

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
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Projeto de Automação</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Planejamento de casa inteligente, dispositivos e cenários</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Novo Dispositivo</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>AMBIENTE</label>
              <input 
                type="text" 
                value={env}
                onChange={e => setEnv(e.target.value)}
                placeholder="Ex: Sala de TV"
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
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>NOME DO PRODUTO</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Fechadura Smart"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>

            <button 
              onClick={addDevice}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: 12, backgroundColor: '#10B981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
            >
              Adicionar Dispositivo
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Dispositivos Mapeados</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {devices.map(d => (
              <motion.div 
                key={d.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ padding: 16, backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d.env}</span>
                  <button onClick={() => removeDevice(d.id)} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 12, cursor: 'pointer' }}>Excluir</button>
                </div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{d.name}</h4>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, backgroundColor: 'var(--bg-panel)', color: 'var(--text-muted)' }}>{d.type}</span>
                  <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, backgroundColor: `${getProtocolColor(d.protocol)}22`, color: getProtocolColor(d.protocol), fontWeight: 600 }}>{d.protocol}</span>
                </div>
              </motion.div>
            ))}
          </div>

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
  );
}
