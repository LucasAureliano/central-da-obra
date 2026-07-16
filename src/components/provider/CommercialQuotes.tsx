import React, { useState } from 'react';
import { Plus, Search, FileText, DollarSign } from 'lucide-react';

type QuoteStatus = 'Rascunho' | 'Enviado' | 'Em Negociação' | 'Aprovado' | 'Execução' | 'Concluído' | 'Recusado';

interface Quote {
  id: string;
  client: string;
  service: string;
  value: number;
  status: QuoteStatus;
  date: string;
}

const STATUSES: QuoteStatus[] = [
  'Rascunho', 'Enviado', 'Em Negociação', 'Aprovado', 'Execução', 'Concluído', 'Recusado'
];

export const CommercialQuotes: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([
    { id: '1', client: 'João Silva', service: 'Reforma de Banheiro', value: 8500, status: 'Em Negociação', date: '15/07/2026' },
    { id: '2', client: 'Maria Oliveira', service: 'Pintura Externa', value: 3200, status: 'Enviado', date: '16/07/2026' },
    { id: '3', client: 'Condomínio Alpha', service: 'Manutenção Elétrica', value: 1200, status: 'Aprovado', date: '10/07/2026' },
    { id: '4', client: 'Empresa XPTO', service: 'Instalação de Ar Condicionado', value: 4500, status: 'Rascunho', date: '17/07/2026' }
  ]);

  const [filter, setFilter] = useState('');

  const moveQuote = (id: string, newStatus: QuoteStatus) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Funil Comercial</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gerencie seus orçamentos e serviços</p>
        </div>
        <button className="btn-primary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
        <input 
          type="text" 
          placeholder="Buscar por cliente ou serviço..." 
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

      {/* Kanban Pipeline */}
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }} className="hide-scrollbar">
        {STATUSES.map(status => {
          const columnQuotes = quotes.filter(q => q.status === status && (q.client.toLowerCase().includes(filter.toLowerCase()) || q.service.toLowerCase().includes(filter.toLowerCase())));
          
          return (
            <div key={status} style={{ minWidth: 280, maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{status}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--bg-elevated)', padding: '4px 10px', borderRadius: 12 }}>
                  {columnQuotes.length}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 100 }}>
                {columnQuotes.map(quote => (
                  <div key={quote.id} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{quote.client}</h4>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>{quote.service}</span>
                      </div>
                      <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={16} />
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <DollarSign size={14} color="#10B981" />
                        {quote.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{quote.date}</span>
                    </div>

                    {/* Quick Move Action (Mobile friendly alternative to drag and drop) */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      {STATUSES.indexOf(status) > 0 && (
                        <button 
                          onClick={() => moveQuote(quote.id, STATUSES[STATUSES.indexOf(status) - 1])}
                          style={{ flex: 1, padding: '6px 0', borderRadius: 8, backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, border: 'none' }}
                        >
                          Voltar
                        </button>
                      )}
                      {STATUSES.indexOf(status) < STATUSES.length - 1 && (
                        <button 
                          onClick={() => moveQuote(quote.id, STATUSES[STATUSES.indexOf(status) + 1])}
                          style={{ flex: 1, padding: '6px 0', borderRadius: 8, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', fontSize: 12, fontWeight: 600, border: 'none' }}
                        >
                          Avançar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {columnQuotes.length === 0 && (
                  <div style={{ padding: 20, textAlign: 'center', backgroundColor: 'var(--bg-glass)', borderRadius: 16, border: '1px dashed var(--border-light)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Vazio</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
