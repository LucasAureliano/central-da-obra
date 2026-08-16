import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ClipboardList, Plus, User, ArrowLeft, Trash2, X, Save, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { generateTechnicalReportPDF } from '../../utils/TechnicalReportPDF';
import { formatDate } from '../../utils/formatters';

export interface SiteVisit {
  id?: string;
  projectName: string;
  clientName: string;
  date: string;
  time: string;
  responsible: string;
  address?: string;
  weather?: string;
  summary: string;
  conclusions: string;
  checklist?: { item: string; status: 'Conforme' | 'Não Conforme' | 'N/A'; obs?: string }[];
  createdAt?: any;
}

interface SiteVisitsManagerProps {
  onBack?: () => void;
}

export function SiteVisitsManager({ onBack }: SiteVisitsManagerProps) {
  const { user, isGuest } = useAuth();
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<SiteVisit | null>(null);

  // Form states
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [responsible, setResponsible] = useState('');
  const [address, setAddress] = useState('');
  const [summary, setSummary] = useState('');
  const [conclusions, setConclusions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const q = query(collection(db, 'users', user.uid, 'site_visits'));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteVisit));
        data.sort((a, b) => b.date.localeCompare(a.date));
        setVisits(data);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setVisits([]);
        setLoading(false);
      });
      return () => unsub();
    } else {
      try {
        const local = localStorage.getItem('co_site_visits');
        if (local) setVisits(JSON.parse(local));
        else setVisits([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (items: SiteVisit[]) => {
    localStorage.setItem('co_site_visits', JSON.stringify(items));
  };

  const openAddModal = () => {
    setEditingVisit(null);
    setProjectName('');
    setClientName('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('09:00');
    setResponsible(user?.displayName || 'Arquiteto / Engenheiro');
    setAddress('');
    setSummary('');
    setConclusions('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !summary.trim()) {
      toast.error('Preencha o projeto e o resumo da vistoria.');
      return;
    }

    setSubmitting(true);

    const defaultChecklist = [
      { item: 'Fundação e Nivelamento', status: 'Conforme' as const, obs: 'Executado de acordo com projeto estrutural' },
      { item: 'Armação de Pilares e Vigas', status: 'Conforme' as const, obs: 'Cobrimento das armaduras verificado' },
      { item: 'Impermeabilização de Baldrame', status: 'Conforme' as const, obs: 'Aplicação de manta asfáltica concluída' },
      { item: 'Instalações Hidráulicas embutidas', status: 'Conforme' as const, obs: 'Teste de pressão realizado' },
    ];

    const visitData: SiteVisit = {
      projectName,
      clientName: clientName || 'Cliente',
      date,
      time,
      responsible,
      address,
      summary,
      conclusions: conclusions || 'A obra atende aos requisitos técnicos inspecionados nesta visita.',
      checklist: defaultChecklist,
    };

    try {
      if (user && !isGuest) {
        if (editingVisit?.id) {
          const docRef = doc(db, 'users', user.uid, 'site_visits', editingVisit.id);
          await updateDoc(docRef, { ...visitData, updatedAt: serverTimestamp() });
          toast.success('Visita técnica atualizada!');
        } else {
          await addDoc(collection(db, 'users', user.uid, 'site_visits'), {
            ...visitData,
            createdAt: serverTimestamp()
          });
          toast.success('Visita de acompanhamento registrada!');
        }
      } else {
        if (editingVisit?.id) {
          const updated = visits.map(v => v.id === editingVisit.id ? { ...v, ...visitData } : v);
          setVisits(updated);
          saveToLocal(updated);
        } else {
          const newItem = { id: crypto.randomUUID(), ...visitData };
          const updated = [newItem, ...visits];
          setVisits(updated);
          saveToLocal(updated);
        }
        toast.success('Visita salva!');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar visita.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este registro de visita?')) return;
    try {
      if (user && !isGuest) {
        await deleteDoc(doc(db, 'users', user.uid, 'site_visits', id));
      } else {
        const updated = visits.filter(v => v.id !== id);
        setVisits(updated);
        saveToLocal(updated);
      }
      toast.success('Visita removida.');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao remover.');
    }
  };

  const handleExportPDF = (visit: SiteVisit) => {
    try {
      generateTechnicalReportPDF({
        title: 'RELATÓRIO DE ACOMPANHAMENTO DE OBRA',
        reportNumber: `VT-${Math.floor(1000 + Math.random() * 9000)}`,
        date: formatDate(visit.date),
        clientName: visit.clientName,
        projectName: visit.projectName,
        address: visit.address,
        responsibleName: visit.responsible,
        summary: visit.summary,
        checklist: visit.checklist || [],
        conclusions: visit.conclusions,
        signatureName: visit.responsible,
      });
      toast.success('Laudo técnico em PDF gerado!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao gerar PDF.');
    }
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Acompanhamento de Obras</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Registro de visitas técnicas de canteiro e laudos</p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Nova Visita
        </button>
      </div>

      {/* Visits List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 130, borderRadius: 20 }} />
          <div className="skeleton-glass" style={{ height: 130, borderRadius: 20 }} />
        </div>
      ) : visits.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, borderRadius: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardList size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Nenhuma Visita Registrada</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
            Registre as fiscalizações de campo para acompanhar a evolução das suas obras e emitir laudos em PDF.
          </p>
          <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 14, marginTop: 4 }}>
            + Registrar Primeira Visita
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {visits.map(v => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ padding: 18, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 2px' }}>{v.projectName}</h3>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <User size={12} color="#8B5CF6" /> Cliente: {v.clientName}
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.15)', padding: '4px 10px', borderRadius: 8 }}>
                  {formatDate(v.date)} às {v.time}
                </span>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>{v.summary}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Resp: {v.responsible}</span>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleExportPDF(v)} className="btn-primary" style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Download size={13} /> PDF
                  </button>
                  <button onClick={() => v.id && handleDelete(v.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Nova Visita */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="glass-panel" style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '85vh', overflowY: 'auto' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Nova Visita Técnica de Acompanhamento</h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Nome do Projeto / Obra *</label>
                  <input required value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Ex: Residência Alpha" className="input-premium" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Cliente</label>
                    <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ex: Família Souza" className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Responsável Técnico</label>
                    <input value={responsible} onChange={e => setResponsible(e.target.value)} placeholder="Arq. Lucas" className="input-premium" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Data da Visita</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-premium" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Horário</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="input-premium" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Endereço da Obra</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Rua, Número, Bairro" className="input-premium" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Resumo das Atividades Inspecionadas *</label>
                  <textarea required value={summary} onChange={e => setSummary(e.target.value)} placeholder="Ex: Concretagem da laje do 1º pavimento concluída sem patologias observadas..." className="input-premium" style={{ minHeight: 70, resize: 'vertical' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Parecer Técnico & Conclusões</label>
                  <textarea value={conclusions} onChange={e => setConclusions(e.target.value)} placeholder="Ex: Obra liberada para início do assentamento de alvenaria..." className="input-premium" style={{ minHeight: 60, resize: 'vertical' }} />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {submitting ? 'Salvando...' : <><Save size={18} /> Salvar e Gerar Registro</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
