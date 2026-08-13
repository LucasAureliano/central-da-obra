import { motion } from 'framer-motion';
import { Trash2, DollarSign, Plus } from 'lucide-react';

interface QuoteStepServicesProps {
  services: any[];
  setServices: (services: any[]) => void;
  existingCatalogServices: any[];
}

export function QuoteStepServices({ services, setServices, existingCatalogServices }: QuoteStepServicesProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {services.map((s, index) => (
        <motion.div key={s.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ padding: 20, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 14, textTransform: 'uppercase' }}>Serviço {index + 1}</span>
            <button className="btn-icon" onClick={() => setServices(services.filter(x => x.id !== s.id))}><Trash2 size={18} color="var(--color-danger)" /></button>
          </div>
          <div className="input-group">
            <label>Descrição do Serviço</label>
            <input type="text" className="input-field" placeholder="Ex: Pintura das paredes internas..." value={s.desc} onChange={e => { const ns = [...services]; ns[index].desc = e.target.value; setServices(ns); }} style={{ fontSize: 16 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
            <div className="input-group">
              <label>Qtd</label>
              <input type="number" className="input-field" value={s.qtd} onChange={e => { const ns = [...services]; ns[index].qtd = Number(e.target.value); setServices(ns); }} />
            </div>
            <div className="input-group">
              <label>Unidade</label>
              <input type="text" className="input-field" placeholder="Ex: m², un" value={s.un} onChange={e => { const ns = [...services]; ns[index].un = e.target.value; setServices(ns); }} />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Valor Unit. (R$)</label>
              <div className="input-icon-wrapper">
                <DollarSign size={20} />
                <input type="number" className="input-field" value={s.price} onChange={e => { const ns = [...services]; ns[index].price = Number(e.target.value); setServices(ns); }} />
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginTop: 4 }}>
            Subtotal: R$ {(s.qtd * s.price).toFixed(2)}
          </div>
        </motion.div>
      ))}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <motion.button 
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="btn-secondary" 
          style={{ borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '2px dashed var(--border-subtle)', background: 'transparent' }}
          onClick={() => setServices([...services, { id: Date.now().toString(), desc: '', qtd: 1, un: 'un', price: 0 }])}
        >
          <Plus size={20} /> Adicionar Novo Serviço
        </motion.button>
        <select 
          className="btn-secondary"
          style={{ borderRadius: 20, padding: '0 20px', border: '2px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', appearance: 'none' }}
          onChange={e => {
            const s = existingCatalogServices.find(x => x.id === e.target.value);
            if (s) {
              setServices([...services, { id: Date.now().toString(), desc: s.name, qtd: 1, un: s.unit || 'un', price: s.price || 0 }]);
            }
            e.target.value = '';
          }}
        >
          <option value="">+ Importar do Catálogo</option>
          {existingCatalogServices.map(s => <option key={s.id} value={s.id}>{s.name} ({s.category})</option>)}
        </select>
      </div>
    </div>
  );
}
