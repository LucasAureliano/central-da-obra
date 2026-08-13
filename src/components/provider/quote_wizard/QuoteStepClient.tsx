import { Search, User, Phone, Mail } from 'lucide-react';

interface QuoteStepClientProps {
  client: { name: string; phone: string; email: string; address: string; city: string; isNew: boolean };
  setClient: (client: any) => void;
  existingClients: any[];
}

export function QuoteStepClient({ client, setClient, existingClients }: QuoteStepClientProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' }}>
        <Search size={20} color="var(--color-primary)" />
        <input type="text" placeholder="Pesquisar cliente existente..." style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', flex: 1, fontSize: 16 }} />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <button className={`btn-${client.isNew ? 'primary' : 'secondary'}`} style={{ borderRadius: 16, padding: '16px' }} onClick={() => setClient({ ...client, isNew: true })}>Novo Cliente</button>
        <button className={`btn-${!client.isNew ? 'primary' : 'secondary'}`} style={{ borderRadius: 16, padding: '16px' }} onClick={() => setClient({ ...client, isNew: false })}>Existente</button>
      </div>

      {client.isNew ? (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Nome Completo / Empresa</label>
            <div className="input-icon-wrapper">
              <User size={20} />
              <input type="text" className="input-field" placeholder="Ex: João da Silva" value={client.name} onChange={e => setClient({...client, name: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label>WhatsApp / Telefone</label>
            <div className="input-icon-wrapper">
              <Phone size={20} />
              <input type="tel" className="input-field" placeholder="(00) 00000-0000" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label>E-mail (opcional)</label>
            <div className="input-icon-wrapper">
              <Mail size={20} />
              <input type="email" className="input-field" placeholder="joao@email.com" value={client.email} onChange={e => setClient({...client, email: e.target.value})} />
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Selecione o Cliente</label>
            <select 
              className="input-field" 
              onChange={e => {
                const c = existingClients.find(cx => cx.id === e.target.value);
                if (c) setClient({ ...client, name: c.name, phone: c.phone || '', email: c.email || '', isNew: false });
              }}
            >
              <option value="">-- Selecione --</option>
              {existingClients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
