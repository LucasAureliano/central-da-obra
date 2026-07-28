import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, ChevronRight } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';

export function MinhaEmpresaWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user, isGuest } = useAuth();
  const [stats, setStats] = useState({
    activeServicesCount: 0,
    monthQuotesTotal: 0,
    expectedRevenue: 0,
    receivedRevenue: 0,
    activeClientsCount: 0,
    nextAppointmentsCount: 0,
    approvedRate: 0,
  });

  useEffect(() => {
    if (!user || isGuest) return;

    // Listen to services
    const qServices = query(collection(db, 'users', user.uid, 'services'));
    const unsubServices = onSnapshot(qServices, (snap) => {
      let active = 0;
      snap.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'Concluído' && data.status !== 'Cancelado') active++;
      });
      setStats(prev => ({ ...prev, activeServicesCount: active }));
    }, console.error);

    // Listen to clients
    const qClients = query(collection(db, 'users', user.uid, 'clients'));
    const unsubClients = onSnapshot(qClients, (snap) => {
      setStats(prev => ({ ...prev, activeClientsCount: snap.size }));
    }, console.error);

    // Listen to quotes
    const qQuotes = query(collection(db, 'users', user.uid, 'quotes'));
    const unsubQuotes = onSnapshot(qQuotes, (snap) => {
      let totalQuotes = 0;
      let approvedQuotes = 0;
      let monthTotal = 0;
      let expected = 0;

      snap.forEach(doc => {
        const data = doc.data();
        totalQuotes++;
        const amt = data.grandTotal || data.amount || data.totals?.grandTotal || 0;
        monthTotal += amt;
        if (data.status === 'Aprovado' || data.status === 'aceita') {
          approvedQuotes++;
          expected += amt;
        }
      });

      const rate = totalQuotes > 0 ? Math.round((approvedQuotes / totalQuotes) * 100) : 0;
      setStats(prev => ({
        ...prev,
        monthQuotesTotal: monthTotal,
        approvedRate: rate,
        expectedRevenue: expected,
      }));
    }, console.error);

    // Listen to receipts
    const qReceipts = query(collection(db, 'users', user.uid, 'receipts'));
    const unsubReceipts = onSnapshot(qReceipts, (snap) => {
      let received = 0;
      snap.forEach(doc => {
        const data = doc.data();
        if (data.status === 'Pago' || data.status === 'Recebido') {
          received += (data.amount || 0);
        }
      });
      setStats(prev => ({ ...prev, receivedRevenue: received }));
    }, console.error);

    // Listen to calendar next appointments
    const qCal = query(collection(db, 'users', user.uid, 'calendar'));
    const unsubCal = onSnapshot(qCal, (snap) => {
      const todayStr = new Date().toISOString().split('T')[0];
      let upcoming = 0;
      snap.forEach(doc => {
        const data = doc.data();
        if (data.date >= todayStr) upcoming++;
      });
      setStats(prev => ({ ...prev, nextAppointmentsCount: upcoming }));
    }, console.error);

    return () => {
      unsubServices();
      unsubClients();
      unsubQuotes();
      unsubReceipts();
      unsubCal();
    };
  }, [user, isGuest]);

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="card-mesh-gradient"
      style={{ padding: 24, borderRadius: 24, marginBottom: 24 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <Building2 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', margin: 0 }}>Minha Empresa</h3>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Gestão Comercial e Operacional</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('perfil')}
          style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', opacity: 0.9 }}
        >
          Perfil <ChevronRight size={14} />
        </button>
      </div>

      {/* Grid de Estatísticas Comerciais */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 4 }}>Serviços Ativos</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#FFF' }}>{stats.activeServicesCount}</span>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 4 }}>Taxa de Aprovação</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#4ADE80' }}>{stats.approvedRate}%</span>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 4 }}>Faturamento Previsto</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#FFF' }}>{fmt(stats.expectedRevenue)}</span>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 4 }}>Faturamento Recebido</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#4ADE80' }}>{fmt(stats.receivedRevenue)}</span>
        </div>
      </div>

      {/* Footer Quick Access Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          onClick={() => onNavigate('novo-orcamento')}
          style={{ padding: '12px 8px', background: '#FFF', color: 'var(--color-primary)', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', textAlign: 'center' }}
        >
          + Orçamento
        </button>
        <button
          onClick={() => onNavigate('obras')}
          style={{ padding: '12px 8px', background: '#FFF', color: 'var(--color-primary)', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', textAlign: 'center' }}
        >
          Minhas Obras
        </button>
        <button
          onClick={() => onNavigate('meus-servicos')}
          style={{ padding: '12px 8px', background: 'rgba(255,255,255,0.15)', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}
        >
          Serviços ({stats.activeServicesCount})
        </button>
        <button
          onClick={() => onNavigate('catalogo-servicos')}
          style={{ padding: '12px 8px', background: 'rgba(255,255,255,0.15)', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}
        >
          Catálogo
        </button>
      </div>
    </motion.div>
  );
}
