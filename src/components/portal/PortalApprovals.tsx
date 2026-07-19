import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CheckCircle2, AlertCircle, Clock, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortalApprovalsProps {
  workId: string;
}

interface PortalApproval {
  id: string;
  title: string;
  description: string;
  status: 'pendente' | 'Aprovado' | 'rejeitado';
  amount?: number;
  date: string;
  requiresApproval: boolean;
}

export default function PortalApprovals({ workId }: PortalApprovalsProps) {
  const [approvals, setApprovals] = useState<PortalApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const q = query(
          collection(db, 'works', workId, 'pendencies'), 
          where('requiresApproval', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortalApproval));
        
        // Sort in memory if composite index is not created
        fetched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (fetched.length === 0) {
          setApprovals([
            { id: '1', title: 'Aprovação de Orçamento Extra', description: 'Compra de revestimentos premium para a sala de estar, conforme solicitado na última reunião.', status: 'pendente', amount: 15400.50, date: new Date().toISOString(), requiresApproval: true },
            { id: '2', title: 'Aditivo de Prazo', description: 'Adição de 15 dias no cronograma devido a atrasos na entrega de esquadrias por parte do fornecedor.', status: 'Aprovado', date: new Date(Date.now() - 5 * 86400000).toISOString(), requiresApproval: true },
          ]);
        } else {
          setApprovals(fetched);
        }
      } catch (error) {
        console.error("Error fetching approvals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovals();
  }, [workId]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      // If we are using mock data, we just update local state
      if (approvals.find(a => a.id === id)?.id === '1' && id.length === 1) {
        setTimeout(() => {
          setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Aprovado' } : a));
          setProcessingId(null);
        }, 800);
        return;
      }

      await updateDoc(doc(db, 'works', workId, 'pendencies', id), { 
        status: 'Aprovado' 
      });
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Aprovado' } : a));
    } catch (error) {
      console.error("Error approving document:", error);
      alert("Ocorreu um erro ao aprovar. Tente novamente.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      if (approvals.find(a => a.id === id)?.id === '1' && id.length === 1) {
        setTimeout(() => {
          setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejeitado' } : a));
          setProcessingId(null);
        }, 800);
        return;
      }

      await updateDoc(doc(db, 'works', workId, 'pendencies', id), { 
        status: 'rejeitado' 
      });
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejeitado' } : a));
    } catch (error) {
      console.error("Error rejecting document:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return (
          <span className="status-chip status-active">
            <CheckCircle2 size={14} />
            Aprovado
          </span>
        );
      case 'rejeitado':
        return (
          <span className="status-chip status-danger">
            <X size={14} />
            Rejeitado
          </span>
        );
      default:
        return (
          <span className="status-chip status-warning">
            <Clock size={14} />
            Aguardando
          </span>
        );
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return null;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2].map(i => (
          <div key={i} className="skeleton-glass" style={{ height: '160px', width: '100%' }} />
        ))}
      </div>
    );
  }

  const pendingCount = approvals.filter(a => a.status === 'pendente').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {pendingCount > 0 && (
        <div style={{ 
          backgroundColor: 'var(--color-warning-bg)', 
          border: '1px solid var(--color-warning)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          color: 'var(--color-warning)'
        }}>
          <AlertCircle size={24} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>Atenção Necessária</h4>
            <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9 }}>
              Você possui {pendingCount} {pendingCount === 1 ? 'item aguardando' : 'itens aguardando'} sua aprovação para continuidade da obra.
            </p>
          </div>
        </div>
      )}

      {approvals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
          <CheckCircle2 size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Tudo Certo!</h3>
          <p>Não há pendências aguardando sua aprovação.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AnimatePresence>
            {approvals.map((approval, idx) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="card-premium"
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>
                      {approval.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {approval.description}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {getStatusBadge(approval.status)}
                  </div>
                </div>

                {approval.amount !== undefined && (
                  <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', display: 'inline-flex', alignSelf: 'flex-start' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginRight: '8px' }}>Valor:</span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {formatCurrency(approval.amount)}
                    </span>
                  </div>
                )}

                {approval.status === 'pendente' && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleApprove(approval.id)}
                      disabled={processingId === approval.id}
                      className="btn-primary"
                      style={{ flex: '1', minWidth: '140px', backgroundColor: 'var(--color-success)', boxShadow: 'none' }}
                    >
                      <Check size={20} />
                      {processingId === approval.id ? 'Aprovando...' : 'Aprovar'}
                    </button>
                    <button 
                      onClick={() => handleReject(approval.id)}
                      disabled={processingId === approval.id}
                      className="btn-secondary"
                      style={{ flex: '1', minWidth: '140px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                    >
                      <X size={20} />
                      Rejeitar
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
