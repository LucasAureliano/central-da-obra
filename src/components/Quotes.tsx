import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, Ban } from 'lucide-react';

export const Quotes: React.FC = () => {
  const [quotes] = useState([
    { id: 1, title: 'Material Elétrico', supplier: 'Elétrica Santos', value: 'R$ 4.500,00', status: 'Aprovado', date: '10/06/2026' },
    { id: 2, title: 'Cimento e Areia', supplier: 'Depósito Central', value: 'R$ 2.800,00', status: 'Pendente', date: '12/06/2026' },
    { id: 3, title: 'Esquadrias de Alumínio', supplier: 'Alumínios Brasil', value: 'R$ 15.200,00', status: 'Rejeitado', date: '05/06/2026' }
  ]);

  return (
    <div className="screen-content" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="flex-space-between">
        <div>
          <h1 className="text-2xl font-black">Orçamentos</h1>
          <p className="text-xs text-muted">Gerencie propostas de fornecedores</p>
        </div>
        <button 
          className="btn-primary" 
          style={{ width: 'auto', padding: '10px 16px', borderRadius: 'var(--radius-full)' }}
        >
          <Plus size={18} />
          <span className="text-sm">Novo</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {quotes.map(quote => (
          <div key={quote.id} className="card-premium">
            <div className="flex-space-between" style={{ marginBottom: 12 }}>
              <div>
                <h3 className="text-base font-bold">{quote.title}</h3>
                <span className="text-xs text-muted">{quote.supplier}</span>
              </div>
              <span className={`badge ${
                quote.status === 'Aprovado' ? 'badge-green' : 
                quote.status === 'Rejeitado' ? 'badge-red' : 
                'badge-orange'
              }`}>
                {quote.status === 'Aprovado' && <CheckCircle size={10} />}
                {quote.status === 'Pendente' && <Clock size={10} />}
                {quote.status === 'Rejeitado' && <Ban size={10} />}
                {quote.status}
              </span>
            </div>
            
            <div className="flex-space-between" style={{ borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
              <div className="text-xs text-muted">Data: {quote.date}</div>
              <div className="text-base font-bold text-primary">{quote.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
