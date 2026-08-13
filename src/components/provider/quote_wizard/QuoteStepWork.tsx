import { MapPin } from 'lucide-react';

interface QuoteStepWorkProps {
  workData: { name: string; address: string; isNew: boolean; id?: string };
  setWorkData: (workData: any) => void;
  existingWorks: any[];
}

export function QuoteStepWork({ workData, setWorkData, existingWorks }: QuoteStepWorkProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <button className={`btn-${workData.isNew ? 'primary' : 'secondary'}`} style={{ borderRadius: 16, padding: '16px' }} onClick={() => setWorkData({ ...workData, isNew: true })}>Nova Obra</button>
        <button className={`btn-${!workData.isNew ? 'primary' : 'secondary'}`} style={{ borderRadius: 16, padding: '16px' }} onClick={() => setWorkData({ ...workData, isNew: false })}>Existente</button>
      </div>

      {workData.isNew ? (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Nome da Obra</label>
            <input type="text" className="input-field" placeholder="Ex: Reforma Apto 402" value={workData.name} onChange={e => setWorkData({...workData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Endereço Completo</label>
            <div className="input-icon-wrapper">
              <MapPin size={20} />
              <input type="text" className="input-field" placeholder="Rua, Número, Bairro..." value={workData.address} onChange={e => setWorkData({...workData, address: e.target.value})} />
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Selecione a Obra</label>
            <select 
              className="input-field" 
              value={workData.id || ''} 
              onChange={e => {
                const w = existingWorks.find(wx => wx.id === e.target.value);
                setWorkData({...workData, id: w?.id, name: w?.name || '', address: w?.address || ''});
              }}
            >
              <option value="">-- Selecione --</option>
              {existingWorks.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
