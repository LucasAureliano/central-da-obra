import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, MapPin, Calendar, DollarSign, Activity, Share2, LayoutDashboard, CalendarDays, Wallet, Package, Calculator, FolderOpen, Users } from 'lucide-react';
import { DocumentsView } from './works/DocumentsView';
import { BudgetList } from './works/BudgetList';
import { ShareWorkView } from './works/ShareWorkView';
import { InteractiveSchedule } from './owner/InteractiveSchedule';
import { Finance } from './Finance';
import { Shopping } from './Shopping';
import { X, Save, Lightbulb, Briefcase, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { addDoc, serverTimestamp } from 'firebase/firestore';

import { useAuth } from '../contexts/AuthContext';

import { AutomationDesignStudio } from './architect/AutomationDesignStudio';
import { ElectricalDesignStudio } from './architect/ElectricalDesignStudio';
import { PlumbingDesignStudio } from './architect/PlumbingDesignStudio';
import { LightingDesignEngine } from './architect/LightingDesignEngine';

interface WorkDetailsProps {
  workId: string;
  onBack: () => void;
}

export function WorkDetails({ workId, onBack }: WorkDetailsProps) {
  const { profile, user } = useAuth();
  const [work, setWork] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'resumo' | 'cronograma' | 'financas' | 'compras' | 'orcamento' | 'diario' | 'documentos' | 'compartilhamento' | 'projetos'>('resumo');
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [calculations, setCalculations] = useState<any[]>([]);
  
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;
    
    setIsSubmitting(true);
    try {
      const amount = parseFloat(expenseAmount.replace(/\D/g, '')) / 100;
      await addDoc(collection(db, `works/${workId}/calculations`), {
        calcType: expenseTitle,
        totalCost: amount,
        savedAt: serverTimestamp(),
        resultData: { materials: [] }
      });
      toast.success('Despesa adicionada com sucesso!');
      setIsExpenseModalOpen(false);
      setExpenseTitle('');
      setExpenseAmount('');
    } catch (_err) {
      toast.error('Erro ao adicionar despesa');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const docRef = doc(db, 'works', workId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setWork({ id: snap.id, ...snap.data() });
      }
    });

    const calcsQuery = collection(db, 'works', workId, 'calculations');
    const unsubscribeCalcs = onSnapshot(calcsQuery, (snap) => {
      const calcs: any[] = [];
      let spent = 0;
      snap.forEach(c => {
        const data = c.data();
        calcs.push({ id: c.id, ...data });
        if (data.totalCost) {
          spent += data.totalCost;
        }
      });
      // Sort by date descending
      calcs.sort((a, b) => {
        const dateA = a.savedAt?.toDate ? a.savedAt.toDate() : new Date();
        const dateB = b.savedAt?.toDate ? b.savedAt.toDate() : new Date();
        return dateB.getTime() - dateA.getTime();
      });
      setCalculations(calcs);
    });

    return () => {
      unsubscribe();
      unsubscribeCalcs();
    };
  }, [workId]);

  if (!work) {
    return (
      <div className="screen-content animate-fade-in" style={{ padding: 20, textAlign: 'center' }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: 100 }}>
      {/* Header Imagem */}
      <div style={{ height: 200, position: 'relative' }}>
        <img 
          src={work.image || 'https://images.unsplash.com/photo-1541888081622-19e5d424b94a?q=80&w=600&auto=format&fit=crop'} 
          alt={work.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
        
        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: 'max(24px, env(safe-area-inset-top))', left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={20} />
        </button>

        <button 
          onClick={async () => {
            try {
              const token = crypto.randomUUID();
              await addDoc(collection(db, 'shared_links'), {
                token: token,
                workId: workId,
                role: 'viewer',
                createdAt: new Date().toISOString()
              });
              const link = `${window.location.origin}/?shared=${token}`;
              navigator.clipboard.writeText(link);
              alert('Link seguro copiado para a área de transferência! Acesso de Apenas Leitura.');
            } catch(e) {
              console.error(e);
              alert('Erro ao gerar link.');
            }
          }}
          style={{ position: 'absolute', top: 'max(24px, env(safe-area-inset-top))', right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', border: 'none', cursor: 'pointer' }}
          title="Compartilhar Obra"
        >
          <Share2 size={20} />
        </button>

        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          <span className={`status-chip ${work.progress === 100 ? 'status-active' : work.progress > 50 ? 'status-warning' : 'status-danger'}`} style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#FFF', marginBottom: 8, display: 'inline-block' }}>
            {work.status || 'Em Andamento'}
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#FFF', marginBottom: 4 }}>{work.name}</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} />
            {work.address || 'Endereço não informado'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
        {[
          { id: 'resumo', label: 'Resumo', icon: <LayoutDashboard size={14} /> },
          { id: 'cronograma', label: 'Cronograma', icon: <CalendarDays size={14} /> },
          { id: 'financas', label: 'Finanças', icon: <Wallet size={14} /> },
          { id: 'compras', label: 'Materiais', icon: <Package size={14} /> },
          { id: 'orcamento', label: 'Orçamentos', icon: <Calculator size={14} /> },
          { id: 'projetos', label: 'Projetos', icon: <Briefcase size={14} /> },
          { id: 'documentos', label: 'Documentos', icon: <FolderOpen size={14} /> },
          { id: 'compartilhamento', label: 'Compartilhamento', icon: <Users size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 14px', borderRadius: 10, whiteSpace: 'nowrap',
              border: activeTab === tab.id ? '1.5px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === tab.id ? 'var(--color-primary-alpha)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'resumo' && (
        <div style={{ padding: '20px 20px 100px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {profile?.role !== 'owner' && (
              <div className="glass-panel" style={{ padding: 16, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <DollarSign size={16} /> <span style={{ fontSize: 12, fontWeight: 600 }}>Orçamento</span>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                  {typeof work.budget === 'number' 
                    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(work.budget) 
                    : (work.budget || 'N/A')}
                </p>
              </div>
            )}
            
            <div className="glass-panel" style={{ padding: 16, borderRadius: 16, gridColumn: profile?.role === 'owner' ? 'span 1' : 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-danger)', marginBottom: 8 }}>
                <Wallet size={16} /> <span style={{ fontSize: 12, fontWeight: 600 }}>Custo Atual</span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(work.actualCost || 0)}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: 16, borderRadius: 16, gridColumn: profile?.role === 'owner' ? 'span 1' : 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 8 }}>
                <Calendar size={16} /> <span style={{ fontSize: 12, fontWeight: 600 }}>Prazo</span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{work.deadline || 'N/A'}</p>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={18} color="var(--color-primary)" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>Progresso Geral</h3>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary)' }}>{work.progress || 0}%</span>
            </div>
            <div style={{ height: 8, backgroundColor: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${work.progress || 0}%`, height: '100%', backgroundColor: work.progress === 100 ? 'var(--color-success)' : 'var(--color-primary)', borderRadius: 4, transition: 'width 1s ease-out' }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
              Baseado nas tarefas concluídas no Cronograma.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'cronograma' && (
        <div style={{ padding: '20px' }}>
          <InteractiveSchedule workId={workId} embedded />
        </div>
      )}

      {activeTab === 'orcamento' && (
        <BudgetList workId={workId} calculations={calculations} work={work} user={user} profile={profile} />
      )}

      {activeTab === 'financas' && (
        <div style={{ padding: 20 }}>
          <Finance workId={workId} embedded />
        </div>
      )}

      {activeTab === 'compras' && (
        <div style={{ padding: 20 }}>
          <Shopping workId={workId} embedded />
        </div>
      )}

      {activeTab === 'documentos' && (
        <div className="animate-fade-in" style={{ padding: '0 0 100px 0' }}>
          <DocumentsView workId={work.id} />
        </div>
      )}

      {activeTab === 'projetos' && (
        <div className="animate-fade-in" style={{ padding: 20, overflowX: 'hidden' }}>
          {!activeProject ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
              <button onClick={() => setActiveProject('eletrico')} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
                  <Lightbulb size={24} color="#EAB308" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Projeto Elétrico</h3>
              </button>
              
              <button onClick={() => setActiveProject('hidraulico')} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(14, 165, 233, 0.1)' }}>
                  <Briefcase size={24} color="#0EA5E9" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Projeto Hidráulico</h3>
              </button>
              
              <button onClick={() => setActiveProject('luminotecnico')} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <Lightbulb size={24} color="#F59E0B" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Luminotécnico</h3>
              </button>
              
              <button onClick={() => setActiveProject('automacao')} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <Wrench size={24} color="#10B981" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Automação</h3>
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', marginTop: -20, marginLeft: -20, marginRight: -20 }}>
              {activeProject === 'eletrico' && <ElectricalDesignStudio onBack={() => setActiveProject(null)} />}
              {activeProject === 'hidraulico' && <PlumbingDesignStudio onBack={() => setActiveProject(null)} />}
              {activeProject === 'luminotecnico' && <LightingDesignEngine onBack={() => setActiveProject(null)} />}
              {activeProject === 'automacao' && <AutomationDesignStudio onBack={() => setActiveProject(null)} />}
            </div>
          )}
        </div>
      )}

      {activeTab === 'compartilhamento' && (
        <div className="animate-fade-in" style={{ padding: '0 0 100px 0' }}>
          <ShareWorkView workId={work.id} />
        </div>
      )}

      <AnimatePresence>
        {isExpenseModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
              onClick={() => setIsExpenseModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel" 
              style={{ width: '100%', maxWidth: 500, borderRadius: 24, padding: '32px 24px', position: 'relative', zIndex: 1 }}
            >
              <button 
                onClick={() => setIsExpenseModalOpen(false)}
                style={{ position: 'absolute', top: 24, right: 24, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Nova Despesa</h2>

              <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Descrição da Despesa *</label>
                  <input 
                    required 
                    value={expenseTitle} 
                    onChange={e => setExpenseTitle(e.target.value)} 
                    placeholder="Ex: Compra de cimento" 
                    className="input-premium"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Valor (R$) *</label>
                  <input 
                    required 
                    value={expenseAmount} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (!val) setExpenseAmount('');
                      else setExpenseAmount(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(val) / 100));
                    }} 
                    placeholder="R$ 0,00" 
                    className="input-premium"
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {isSubmitting ? (
                    <div style={{ width: 20, height: 20, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <><Save size={20} /> Salvar Despesa</>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
