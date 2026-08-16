import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, MapPin, Edit2, FileText, Briefcase, Receipt, Camera, Mail } from 'lucide-react';
import type { Client } from '../../types';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/formatters';

interface ClientDetailsProps {
  client: Client;
  onBack: () => void;
  onEdit: (client: Client) => void;
}

export function ClientDetails({ client, onBack, onEdit }: ClientDetailsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orcamentos' | 'servicos' | 'pagamentos' | 'midia'>('orcamentos');
  
  const [quotes, setQuotes] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !client.id) return;

    const loadClientData = async () => {
      setLoading(true);
      try {
        // Load Quotes
        const qQuotes = query(collection(db, 'quotes'), where('clientId', '==', client.id), where('userId', '==', user.uid));
        const snapQuotes = await getDocs(qQuotes);
        setQuotes(snapQuotes.docs.map(d => ({ id: d.id, ...d.data() })));

        // Load Services
        const qServices = query(collection(db, 'providerServices'), where('clientId', '==', client.id), where('userId', '==', user.uid));
        const snapServices = await getDocs(qServices);
        setServices(snapServices.docs.map(d => ({ id: d.id, ...d.data() })));

        // Load Receipts
        const qReceipts = query(collection(db, 'receipts'), where('clientId', '==', client.id), where('userId', '==', user.uid));
        const snapReceipts = await getDocs(qReceipts);
        setReceipts(snapReceipts.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (e) {
        console.error("Error loading client details data:", e);
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [user, client.id]);

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
  const formatDate = (date: any) => {
    if (!date) return '—';
    const d = date.toDate ? date.toDate() : new Date(date);
    return formatDate(d);
  };

  const tabs = [
    { id: 'orcamentos', label: 'Orçamentos', icon: <FileText size={16} /> },
    { id: 'servicos', label: 'Serviços', icon: <Briefcase size={16} /> },
    { id: 'pagamentos', label: 'Pagamentos', icon: <Receipt size={16} /> },
    { id: 'midia', label: 'Fotos & Docs', icon: <Camera size={16} /> },
  ];

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '20px', paddingBottom: 100, overflowX: 'hidden' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn-icon" onClick={onBack} style={{ width: 40, height: 40 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Perfil do Cliente</h1>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>CRM Profissional</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {client.photoUrl ? (
              <img src={client.photoUrl} alt={client.name} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24 }}>
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-main)' }}>{client.name}</h2>
              <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>{client.totalServices || 0} serviços • {fmt(client.totalValue || 0)} total</span>
            </div>
          </div>
          <button className="btn-icon" onClick={() => onEdit(client)}>
            <Edit2 size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          {client.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-main)' }}>
              <Phone size={16} color="var(--text-muted)" /> {client.phone}
            </div>
          )}
          {client.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-main)' }}>
              <Mail size={16} color="var(--text-muted)" /> {client.email}
            </div>
          )}
          {client.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-main)' }}>
              <MapPin size={16} color="var(--text-muted)" /> {client.address}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 8, marginBottom: 16 }} className="hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--bg-elevated)',
              color: activeTab === tab.id ? '#FFF' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando dados...</div>
        ) : (
          <>
            {activeTab === 'orcamentos' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {quotes.length > 0 ? quotes.map(q => (
                  <div key={q.id} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700 }}>{q.title || 'Orçamento sem título'}</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{fmt(q.totalValue)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>Data: {formatDate(q.createdAt)}</span>
                      <span>Status: {q.status}</span>
                    </div>
                  </div>
                )) : <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Nenhum orçamento encontrado.</div>}
              </div>
            )}

            {activeTab === 'servicos' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {services.length > 0 ? services.map(s => (
                  <div key={s.id} className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700 }}>{s.title}</span>
                      <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: 700 }}>{s.status}</span>
                    </div>
                    <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${s.progress || 0}%`, height: '100%', backgroundColor: '#10B981' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>Progresso: {s.progress || 0}%</span>
                      <span>Valor: {fmt(s.value)}</span>
                    </div>
                  </div>
                )) : <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Nenhum serviço registrado.</div>}
              </div>
            )}

            {activeTab === 'pagamentos' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {receipts.length > 0 ? receipts.map(r => (
                  <div key={r.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, borderLeft: `4px solid ${r.status === 'Recebido' ? '#10B981' : r.status === 'Vencido' ? '#EF4444' : '#F59E0B'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700 }}>{r.title}</span>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{fmt(r.amount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>Vencimento: {formatDate(r.date)}</span>
                      <span>{r.status}</span>
                    </div>
                  </div>
                )) : <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Nenhum pagamento registrado.</div>}
              </div>
            )}

            {activeTab === 'midia' && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                <Camera size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>Nenhuma foto ou documento anexado.</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
