import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Briefcase, UserPlus, Calendar, Home, DollarSign, ArrowRight, X } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface PostApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteData: {
    id?: string;
    clientName: string;
    clientPhone?: string;
    clientEmail?: string;
    workName?: string;
    workAddress?: string;
    grandTotal: number;
    serviceType?: string;
    services?: any[];
  };
  onNavigate?: (tab: string) => void;
}

export function PostApprovalModal({ isOpen, onClose, quoteData, onNavigate }: PostApprovalModalProps) {
  const { user, isGuest } = useAuth();
  const [createdService, setCreatedService] = useState(false);
  const [createdClient, setCreatedClient] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(false);
  const [createdWork, setCreatedWork] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreateService = async () => {
    if (!user || isGuest) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'services'), {
        title: quoteData.serviceType || quoteData.workName || 'Serviço Contratado',
        clientName: quoteData.clientName,
        address: quoteData.workAddress || '',
        totalAmount: quoteData.grandTotal,
        progress: 0,
        status: 'Em andamento',
        createdAt: serverTimestamp(),
      });
      setCreatedService(true);
      toast.success('Serviço criado em "Meus Serviços"!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao criar serviço.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async () => {
    if (!user || isGuest) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'clients'), {
        name: quoteData.clientName,
        phone: quoteData.clientPhone || '',
        email: quoteData.clientEmail || '',
        address: quoteData.workAddress || '',
        totalValue: quoteData.grandTotal,
        totalServices: 1,
        lastService: new Date().toLocaleDateString('pt-BR'),
        createdAt: serverTimestamp(),
      });
      setCreatedClient(true);
      toast.success('Cliente registrado no CRM!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao cadastrar cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgendaEvent = async () => {
    if (!user || isGuest) return;
    setLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await addDoc(collection(db, 'users', user.uid, 'calendar'), {
        title: `Início: ${quoteData.serviceType || quoteData.workName || 'Serviço'}`,
        client: quoteData.clientName,
        location: quoteData.workAddress || '',
        date: todayStr,
        time: '08:00',
        duration: '8h',
        type: 'Serviço',
        status: 'Agendado',
        createdAt: serverTimestamp(),
      });
      setCreatedEvent(true);
      toast.success('Evento adicionado à Agenda!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao agendar.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWork = async () => {
    if (!user || isGuest) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'works'), {
        userId: user.uid,
        name: quoteData.workName || `Obra - ${quoteData.clientName}`,
        client: quoteData.clientName,
        address: quoteData.workAddress || '',
        budget: quoteData.grandTotal,
        status: 'Em andamento',
        progress: 0,
        roles: {},
        createdAt: serverTimestamp(),
      });
      setCreatedWork(true);
      toast.success('Obra criada!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao criar obra.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReceipt = async () => {
    if (!user || isGuest) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'receipts'), {
        clientName: quoteData.clientName,
        description: `Orçamento: ${quoteData.serviceType || quoteData.workName || 'Serviço'}`,
        amount: quoteData.grandTotal,
        method: 'PIX',
        status: 'Pendente',
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      });
      setCreatedReceipt(true);
      toast.success('Recebimento pendente registrado!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao registrar recebimento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="glass-panel"
          style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '28px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '88vh', overflowY: 'auto' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 34, height: 34, borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>

          {/* Header Icon & Title */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>Orçamento Aprovado!</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>O que deseja criar automaticamente no seu sistema?</p>
          </div>

          {/* Action Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            
            {/* 1. Criar Serviço */}
            <div className="glass-panel" style={{ padding: 14, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: createdService ? '1.5px solid #10B981' : '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Criar Serviço em Andamento</h4>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Cadastra em Meus Serviços</span>
                </div>
              </div>
              <button disabled={createdService || loading} onClick={handleCreateService} className={createdService ? 'btn-secondary' : 'btn-primary'} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12 }}>
                {createdService ? '✅ Criado' : 'Criar'}
              </button>
            </div>

            {/* 2. Cadastrar Cliente */}
            <div className="glass-panel" style={{ padding: 14, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: createdClient ? '1.5px solid #10B981' : '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Cadastrar Cliente no CRM</h4>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{quoteData.clientName}</span>
                </div>
              </div>
              <button disabled={createdClient || loading} onClick={handleCreateClient} className={createdClient ? 'btn-secondary' : 'btn-primary'} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12 }}>
                {createdClient ? '✅ Criado' : 'Criar'}
              </button>
            </div>

            {/* 3. Agendar Data */}
            <div className="glass-panel" style={{ padding: 14, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: createdEvent ? '1.5px solid #10B981' : '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Agendar na Agenda</h4>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Agenda início do trabalho</span>
                </div>
              </div>
              <button disabled={createdEvent || loading} onClick={handleCreateAgendaEvent} className={createdEvent ? 'btn-secondary' : 'btn-primary'} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12 }}>
                {createdEvent ? '✅ Agendado' : 'Agendar'}
              </button>
            </div>

            {/* 4. Registrar Recebimento */}
            <div className="glass-panel" style={{ padding: 14, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: createdReceipt ? '1.5px solid #10B981' : '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Registrar Recebimento Futuro</h4>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lança parcela em Recebimentos</span>
                </div>
              </div>
              <button disabled={createdReceipt || loading} onClick={handleCreateReceipt} className={createdReceipt ? 'btn-secondary' : 'btn-primary'} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12 }}>
                {createdReceipt ? '✅ Registrado' : 'Registrar'}
              </button>
            </div>

            {/* 5. Criar Obra */}
            <div className="glass-panel" style={{ padding: 14, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: createdWork ? '1.5px solid #10B981' : '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Criar Obra de Acompanhamento</h4>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Cria projeto no módulo Obras</span>
                </div>
              </div>
              <button disabled={createdWork || loading} onClick={handleCreateWork} className={createdWork ? 'btn-secondary' : 'btn-primary'} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12 }}>
                {createdWork ? '✅ Criada' : 'Criar'}
              </button>
            </div>

          </div>

          <button
            onClick={() => {
              onClose();
              if (onNavigate) onNavigate('meus-servicos');
            }}
            className="btn-primary"
            style={{ width: '100%', padding: 14, borderRadius: 14, fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          >
            Concluir & Ir para Meus Serviços <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
