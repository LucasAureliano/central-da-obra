import { useState } from 'react';
import { Zap, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CircuitProps {
  id: string;
  name: string;
  type: string;
  power: number; // Watts
  voltage: number; // Volts
}

export function ElectricalDesignStudio({ onBack }: { onBack?: () => void }) {
  const [circuits, setCircuits] = useState<CircuitProps[]>([
    { id: '1', name: 'Iluminação Geral', type: 'Iluminação', power: 800, voltage: 127 },
    { id: '2', name: 'Tomadas Uso Geral (TUG)', type: 'TUG', power: 2000, voltage: 127 },
    { id: '3', name: 'Ar Condicionado Suite', type: 'TUE', power: 1500, voltage: 220 },
    { id: '4', name: 'Chuveiro Elétrico', type: 'TUE', power: 5500, voltage: 220 },
  ]);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('TUG');
  const [newPower, setNewPower] = useState('1000');
  const [newVoltage, setNewVoltage] = useState('127');

  const addCircuit = () => {
    if (!newName) return;
    setCircuits([...circuits, {
      id: crypto.randomUUID(),
      name: newName,
      type: newType,
      power: Number(newPower),
      voltage: Number(newVoltage),
    }]);
    setNewName('');
    setNewPower('1000');
  };

  const deleteCircuit = (id: string) => {
    setCircuits(circuits.filter(c => c.id !== id));
  };

  const calculateCurrent = (power: number, voltage: number) => {
    return (power / voltage).toFixed(1);
  };

  const suggestBreaker = (power: number, voltage: number) => {
    const current = power / voltage;
    const breakers = [10, 16, 20, 25, 32, 40, 50, 63];
    const recommended = breakers.find(b => b > current * 1.25);
    return recommended || 63;
  };

  const suggestWire = (breaker: number) => {
    if (breaker <= 16) return '2,5 mm²';
    if (breaker <= 25) return '4,0 mm²';
    if (breaker <= 32) return '6,0 mm²';
    if (breaker <= 40) return '10,0 mm²';
    return '16,0 mm²';
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
        <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', padding: 12, borderRadius: 16 }}>
          <Zap size={28} color="#EAB308" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Quadro de Cargas Elétrico</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Dimensionamento rápido de circuitos, disjuntores e condutores</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 24, alignItems: 'start' }}>
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#EAB308" /> Novo Circuito
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>NOME DO CIRCUITO</label>
              <input 
                type="text" 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Ex: Ar Condicionado"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>TIPO</label>
              <select 
                value={newType}
                onChange={e => setNewType(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              >
                <option value="Iluminação">Iluminação</option>
                <option value="TUG">TUG (Uso Geral)</option>
                <option value="TUE">TUE (Uso Específico)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>TENSÃO (V)</label>
                <select 
                  value={newVoltage}
                  onChange={e => setNewVoltage(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                >
                  <option value="127">127V</option>
                  <option value="220">220V</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>POTÊNCIA (W)</label>
                <input 
                  type="number" 
                  value={newPower}
                  onChange={e => setNewPower(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <button 
              onClick={addCircuit}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: 12, backgroundColor: '#EAB308', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
            >
              Adicionar Circuito
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Quadro Resumo</h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)' }}>CIRCUITO</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)' }}>TIPO</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)' }}>CARGA</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)' }}>CORRENTE</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)' }}>DISJUNTOR</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)' }}>FIO</th>
                  <th style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)' }}>AÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {circuits.map(c => {
                  const breaker = suggestBreaker(c.power, c.voltage);
                  const wire = suggestWire(breaker);
                  return (
                    <motion.tr 
                      key={c.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <td style={{ padding: '16px 8px', fontWeight: 600, fontSize: 14, color: 'var(--text-main)' }}>{c.name}</td>
                      <td style={{ padding: '16px 8px', fontSize: 14, color: 'var(--text-muted)' }}>{c.type}</td>
                      <td style={{ padding: '16px 8px', fontSize: 14, color: 'var(--text-main)' }}>{c.power}W <span style={{fontSize:11, color:'var(--text-muted)'}}>({c.voltage}V)</span></td>
                      <td style={{ padding: '16px 8px', fontSize: 14, color: 'var(--text-main)', fontWeight: 600 }}>{calculateCurrent(c.power, c.voltage)}A</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#EAB308', padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                          {breaker}A
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: 14, color: 'var(--text-main)' }}>{wire}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <button onClick={() => deleteCircuit(c.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remover</button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
