import React, { useState } from 'react';
import { Users, Search, Plus, Phone, Mail, MoreVertical } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastService: string;
  totalValue: number;
  totalServices: number;
}

export const ClientsManager: React.FC = () => {
  const [clients] = useState<Client[]>([
    { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', lastService: '10/06/2026', totalValue: 12500, totalServices: 3 },
    { id: '2', name: 'Maria Oliveira', email: 'maria@email.com', phone: '(11) 98888-8888', lastService: '15/07/2026', totalValue: 4200, totalServices: 1 },
    { id: '3', name: 'Condomínio Alpha', email: 'sindico@alpha.com', phone: '(11) 97777-7777', lastService: '02/05/2026', totalValue: 35000, totalServices: 8 }
  ]);

  const [filter, setFilter] = useState('');

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Meus Clientes</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gestão e histórico de contatos</p>
        </div>
        <button className="btn-primary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
        <input 
          type="text" 
          placeholder="Buscar cliente..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '14px 16px 14px 48px', 
            borderRadius: 16, 
            border: '1px solid var(--border-light)', 
            backgroundColor: 'var(--bg-elevated)', 
            color: 'var(--text-main)',
            fontSize: 15
          }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredClients.map(client => (
          <div key={client.id} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{client.name}</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{client.totalServices} {client.totalServices === 1 ? 'serviço realizado' : 'serviços realizados'}</span>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <MoreVertical size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: 12, borderRadius: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Valor Total Contratado</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>R$ {client.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: 12, borderRadius: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Último Atendimento</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{client.lastService}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '10px 0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
                <Phone size={16} /> Ligar
              </button>
              <button className="btn-secondary" style={{ flex: 1, padding: '10px 0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
                <Mail size={16} /> E-mail
              </button>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Users size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Nenhum cliente encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
