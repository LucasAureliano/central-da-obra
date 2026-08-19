import { useState } from 'react';
import { Zap, ArrowLeft, CheckCircle2, Sparkles, ShoppingCart, Trash2, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CircuitProps {
  id: string;
  name: string;
  type: string;
  power: number; // Watts
  voltage: number; // Volts
  estimatedCost: number; // For real-time price estimation
}

export function ElectricalDesignStudio({ onBack }: { onBack?: () => void }) {
  const [circuits, setCircuits] = useState<CircuitProps[]>([
    { id: '1', name: 'Iluminação Geral', type: 'Iluminação', power: 800, voltage: 127, estimatedCost: 150 },
    { id: '2', name: 'Tomadas Uso Geral (TUG)', type: 'TUG', power: 2000, voltage: 127, estimatedCost: 280 },
    { id: '3', name: 'Ar Condicionado Suite', type: 'TUE', power: 1500, voltage: 220, estimatedCost: 450 },
    { id: '4', name: 'Chuveiro Elétrico', type: 'TUE', power: 5500, voltage: 220, estimatedCost: 320 },
  ]);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('TUG');
  const [newPower, setNewPower] = useState('1000');
  const [newVoltage, setNewVoltage] = useState('127');

  // Simulated Price API logic
  const fetchEstimatedCost = (type: string, power: number, voltage: number) => {
    // Mock logic: higher power or special types cost more in materials (breakers, wires)
    let base = 50;
    if (type === 'TUE') base += 100;
    if (power > 2000) base += 150;
    base += (power * 0.05); // wire scaling
    return base;
  };

  const addCircuit = () => {
    if (!newName) return;
    const powerNum = Number(newPower);
    const voltNum = Number(newVoltage);
    setCircuits([...circuits, {
      id: crypto.randomUUID(),
      name: newName,
      type: newType,
      power: powerNum,
      voltage: voltNum,
      estimatedCost: fetchEstimatedCost(newType, powerNum, voltNum)
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

  const totalEstimatedCost = circuits.reduce((acc, c) => acc + c.estimatedCost, 0);

  // Simulated Quotes
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
        <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', padding: 12, borderRadius: 16 }}>
          <Zap size={28} color="#EAB308" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Projeto Elétrico</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Dimensionamento rápido e cotação em tempo real</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* ADD CIRCUIT FORM */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#EAB308" /> Adicionar Circuito
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
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

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>POTÊNCIA (W)</label>
              <input 
                type="number" 
                value={newPower}
                onChange={e => setNewPower(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
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
          </div>
          
          <button 
            onClick={addCircuit}
            className="btn-primary"
            style={{ width: '100%', marginTop: 24, padding: 14, borderRadius: 12, fontWeight: 700 }}
          >
            Dimensionar e Adicionar
          </button>
        </div>

        {/* LIST OF CIRCUITS (CARDS) */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Circuitos do Quadro</h3>
          {circuits.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Nenhum circuito adicionado ainda.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              <AnimatePresence>
                {circuits.map(c => {
                  const breaker = suggestBreaker(c.power, c.voltage);
                  const wire = suggestWire(breaker);
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{ backgroundColor: 'var(--bg-panel)', padding: 20, borderRadius: 20, border: '1px solid var(--border-subtle)', position: 'relative' }}
                    >
                      <button onClick={() => deleteCircuit(c.id)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 700, paddingRight: 24 }}>{c.name}</h4>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 16 }}>{c.type} • {c.power}W ({c.voltage}V)</span>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 10, borderRadius: 12 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>CORRENTE</span>
                          <strong style={{ fontSize: 14, color: 'var(--text-main)' }}>{calculateCurrent(c.power, c.voltage)}A</strong>
                        </div>
                        <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', padding: 10, borderRadius: 12 }}>
                          <span style={{ fontSize: 10, color: '#EAB308', display: 'block', marginBottom: 4, fontWeight: 700 }}>DISJUNTOR (Sugerido)</span>
                          <strong style={{ fontSize: 14, color: '#EAB308' }}>{breaker}A</strong>
                        </div>
                        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 10, borderRadius: 12 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>FIAÇÃO MÍN.</span>
                          <strong style={{ fontSize: 14, color: 'var(--text-main)' }}>{wire}</strong>
                        </div>
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 12 }}>
                          <span style={{ fontSize: 10, color: '#10B981', display: 'block', marginBottom: 4, fontWeight: 700 }}>CUSTO ESTIMADO</span>
                          <strong style={{ fontSize: 14, color: '#10B981' }}>R$ {c.estimatedCost.toFixed(2)}</strong>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ESTIMATOR & QUOTATION SUMMARY */}
        {circuits.length > 0 && (
          <div style={{ backgroundColor: 'var(--bg-panel)', padding: 24, borderRadius: 24, border: '1px solid var(--border-subtle)', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <ShoppingCart size={24} color="#10B981" />
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Cotação em Tempo Real (API)</h2>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Total Estimado de Materiais (Fios, Disjuntores, Eletrodutos, etc)</span>
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
