import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, doc, updateDoc, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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

interface CommercialQuotesProps {
  onNavigate?: (tab: string, param?: string) => void;
}

export const CommercialQuotes: React.FC<CommercialQuotesProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'quotes'));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Quote[];
        
        fetched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setQuotes(fetched);
      } catch (err) {
        console.error('Erro ao buscar orçamentos', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, [user]);

  const moveQuote = async (id: string, newStatus: QuoteStatus) => {
    const targetQuote = quotes.find(q => q.id === id);
    const previous = [...quotes];
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
    
    if (user && targetQuote) {
      try {
        await updateDoc(doc(db, 'users', user.uid, 'quotes', id), {
          status: newStatus
        });

        // Sync with Finance & Shopping when Approved
        if (newStatus === 'Aprovado') {
          const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
          // Add to Shopping
          await addDoc(collection(db, 'users', user.uid, 'shopping'), {
            name: `[Cotação] ${targetQuote.service} (${targetQuote.client})`,
            quantity: 1,
            unit: 'serviço',
            unitPrice: targetQuote.value,
            isPurchased: false,
            createdAt: serverTimestamp()
          });

          // Add to Finance (Receita/Contrato ou Despesa de Serviço)
          await addDoc(collection(db, 'users', user.uid, 'expenses'), {
            title: `Cotação Aprovada: ${targetQuote.service}`,
            amount: targetQuote.value,
            category: 'Mão de obra',
            status: 'Pendente',
            date: serverTimestamp(),
            supplier: targetQuote.client,
            notes: `Origem: Orçamento comercial ${targetQuote.id}`
          });

          const { toast } = await import('react-hot-toast');
          toast.success('Cotação aprovada! Sincronizada com o Financeiro e Lista de Compras.');
        }
      } catch (err) {
        console.error('Erro ao atualizar status', err);
        setQuotes(previous); // rollback
      }
    }
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1000 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>
            Orçamentos
          </h1>
          <button 
            onClick={() => onNavigate && onNavigate('novo-orcamento')}
            className="btn-primary btn-3d"
            style={{ borderRadius: 12, padding: '10px 16px', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
          >
            <Plus size={18} /> Novo Orçamento
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder="Buscar por cliente ou serviço..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '100%', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '16px 16px 16px 44px', fontSize: 15, color: 'var(--text-main)', outline: 'none', transition: 'border-color 0.2s' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <Loader2 size={32} className="spinner" color="var(--color-primary)" />
        </div>
      ) : quotes.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-subtle)', marginTop: 24, backgroundImage: 'linear-gradient(180deg, rgba(30, 58, 138, 0.02) 0%, rgba(30, 58, 138, 0) 100%)' }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid var(--border-subtle)' }}>
            <FileText size={48} color="var(--color-primary)" opacity={0.9} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Nenhum orçamento criado</h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 360, lineHeight: 1.6 }}>
            Impulsione suas vendas criando orçamentos profissionais, elegantes e detalhados em poucos minutos.
          </p>
          <button 
            className="btn-primary" 
            style={{ borderRadius: 100, padding: '16px 32px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.2)' }}
          >
            <Plus size={20} /> Criar Meu Primeiro Orçamento
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, margin: '0 -20px', paddingLeft: 20, paddingRight: 20, width: '100%', maxWidth: 1040 }} className="hide-scrollbar">
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
                    <div key={quote.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{quote.client}</h4>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', lineHeight: 1.4 }}>{quote.service}</span>
                        </div>
                        <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={16} />
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <DollarSign size={14} color="#10B981" />
                          {quote.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                          {new Date(quote.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
  
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <select 
                          className="input-field" 
                          style={{ padding: '8px 12px', fontSize: 13, height: 'auto', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', fontWeight: 600 }}
                          value={quote.status}
                          onChange={(e) => moveQuote(quote.id, e.target.value as QuoteStatus)}
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  
                  {columnQuotes.length === 0 && (
                    <div style={{ padding: 20, textAlign: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 16, border: '1px dashed var(--border-subtle)' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Nenhum orçamento</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
