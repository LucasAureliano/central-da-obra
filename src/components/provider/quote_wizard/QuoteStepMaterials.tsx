import { motion } from 'framer-motion';
import { LayoutGrid, Package, Trash2, DollarSign, Plus, Search } from 'lucide-react';

interface QuoteStepMaterialsProps {
  materials: any[];
  setMaterials: (materials: any[]) => void;
  fetchMarketPrices: () => void;
  isFetchingPrices: boolean;
}

export function QuoteStepMaterials({ materials, setMaterials, fetchMarketPrices, isFetchingPrices }: QuoteStepMaterialsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <button className="btn-secondary" style={{ flex: 1, borderRadius: 16, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }} onClick={() => alert('Em breve: Importar das calculadoras de material.')}><LayoutGrid size={16} /> Importar Calculadora</button>
        <button className="btn-secondary" style={{ flex: 1, borderRadius: 16, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }} onClick={() => alert('Em breve: Importar da sua lista de compras salva.')}><Package size={16} /> Lista de Compras</button>
      </div>

      {materials.map((m, index) => (
        <motion.div key={m.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ padding: 20, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: '#10B981', fontSize: 14, textTransform: 'uppercase' }}>Material {index + 1}</span>
            <button className="btn-icon" onClick={() => setMaterials(materials.filter(x => x.id !== m.id))}><Trash2 size={18} color="var(--color-danger)" /></button>
          </div>
          <div className="input-group">
            <label>Nome do Material</label>
            <input type="text" className="input-field" placeholder="Ex: Cimento 50kg..." value={m.name} onChange={e => { const nm = [...materials]; nm[index].name = e.target.value; setMaterials(nm); }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
            <div className="input-group">
              <label>Qtd</label>
              <input type="number" className="input-field" value={m.qtd} onChange={e => { const nm = [...materials]; nm[index].qtd = Number(e.target.value); setMaterials(nm); }} />
            </div>
            <div className="input-group">
              <label>Valor Unit. (R$)</label>
              <div className="input-icon-wrapper">
                <DollarSign size={20} />
                <input type="number" className="input-field" value={m.price} onChange={e => { const nm = [...materials]; nm[index].price = Number(e.target.value); setMaterials(nm); }} />
              </div>
              {m.supplier && <span style={{ fontSize: 11, color: 'var(--color-primary)', marginTop: 4, display: 'block' }}>Ref: {m.supplier}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginTop: 4 }}>
            Subtotal: R$ {(m.qtd * (m.price || 0)).toFixed(2)}
          </div>
        </motion.div>
      ))}
      
      <div style={{ display: 'grid', gridTemplateColumns: materials.length > 0 ? '1fr 1fr' : '1fr', gap: 12 }}>
        <motion.button 
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="btn-secondary" 
          style={{ borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '2px dashed var(--border-subtle)', background: 'transparent' }}
          onClick={() => setMaterials([...materials, { id: Date.now().toString(), name: '', qtd: 1, price: 0 }])}
        >
          <Plus size={20} /> Adicionar Material Manualmente
        </motion.button>

        {materials.length > 0 && (
          <motion.button 
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="btn-primary" 
            onClick={fetchMarketPrices}
            disabled={isFetchingPrices}
            style={{ borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {isFetchingPrices ? <div style={{width:20,height:20,border:'2px solid #fff',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/> : <Search size={20} />}
            {isFetchingPrices ? 'Buscando...' : 'Preencher Preços de Mercado'}
          </motion.button>
        )}
      </div>
    </div>
  );
}
