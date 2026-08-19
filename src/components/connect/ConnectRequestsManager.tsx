import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import type { ConnectQuoteRequest } from '../../types/connect';
import { Mail, CheckCircle2, XCircle, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ConnectRequestsManager() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ConnectQuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'connect_requests'), where('professionalId', '==', user.uid));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => d.data() as ConnectQuoteRequest).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRequests(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = async (req: ConnectQuoteRequest) => {
    if (!user) return;
    try {
      // 1. Add to clients if not exists
      const clientId = 'cli_' + Date.now().toString();
      await setDoc(doc(db, 'users', user.uid, 'clients', clientId), {
        id: clientId,
        name: req.requesterName,
        phone: req.requesterPhone,
        city: req.city,
        source: 'CentralObra Connect',
        createdAt: new Date().toISOString()
      }, { merge: true });

      // 2. Mark request as converted
      await updateDoc(doc(db, 'connect_requests', req.id), { status: 'converted' });
      
      toast.success('Cliente cadastrado! Vá para Orçamentos para continuar.');
      fetchRequests();
    } catch (e) {
      console.error(e);
      toast.error('Erro ao converter solicitação.');
    }
  };

  const handleDecline = async (reqId: string) => {
    if (!window.confirm('Recusar esta solicitação?')) return;
    try {
      await updateDoc(doc(db, 'connect_requests', reqId), { status: 'declined' });
      toast.success('Solicitação recusada.');
      fetchRequests();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Carregando solicitações...</p>;

  if (requests.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-base)', borderRadius: 16 }}>
        <Mail size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>Nenhuma solicitação de orçamento.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Quando clientes visitarem seu perfil público e solicitarem um orçamento, aparecerá aqui.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {requests.map(req => (
        <div key={req.id} style={{ backgroundColor: 'var(--bg-base)', padding: 20, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{req.requesterName}</h4>
              <p style={{ fontSize: 14, color: 'var(--color-primary)', fontWeight: 600, marginTop: 4 }}>Precisa de: {req.serviceNeeded}</p>
            </div>
            <span style={{ 
              fontSize: 12, fontWeight: 700, padding: '4px 8px', borderRadius: 12,
              backgroundColor: req.status === 'pending' ? 'rgba(245,158,11,0.1)' : req.status === 'converted' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: req.status === 'pending' ? '#F59E0B' : req.status === 'converted' ? '#10B981' : '#EF4444'
            }}>
              {req.status === 'pending' ? 'Pendente' : req.status === 'converted' ? 'Convertido' : 'Recusado'}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={14} /> {req.requesterPhone}</div>
            {req.city && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {req.city}</div>}
          </div>

          {req.description && (
            <div style={{ padding: 12, backgroundColor: 'var(--bg-surface)', borderRadius: 8, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--text-main)' }}>"{req.description}"</p>
            </div>
          )}

          {req.status === 'pending' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" onClick={() => handleCreateQuote(req)} style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
                <CheckCircle2 size={16} /> Gerar Orçamento
              </button>
              <button className="btn-secondary" onClick={() => handleDecline(req.id)} style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: '#EF4444' }}>
                <XCircle size={16} /> Recusar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
