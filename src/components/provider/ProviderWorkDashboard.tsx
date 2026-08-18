import { useState } from 'react';
import { useWorks } from '../../contexts/WorksContext';
import { ArrowLeft, MapPin, HardHat, CheckCircle2, LayoutDashboard, CalendarDays, Wallet, Truck, FileText, Image as ImageIcon, Users } from 'lucide-react';
import { InteractiveSchedule } from '../owner/InteractiveSchedule';
import { ProviderWorkFinance } from './ProviderWorkFinance';
import { DocumentsView } from '../works/DocumentsView';
import { ShareWorkView } from '../works/ShareWorkView';
import { WorkDiary } from '../works/WorkDiary';
import { SuppliersManager } from '../builder/SuppliersManager';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface ProviderWorkDashboardProps {
  workId: string;
  onBack: () => void;
}

export function ProviderWorkDashboard({ workId, onBack }: ProviderWorkDashboardProps) {
  const [activeTab, setActiveTab] = useState<'resumo' | 'cronograma' | 'financeiro' | 'fornecedores' | 'fotos' | 'connect' | 'anotacoes'>('resumo');
  const { works } = useWorks();
  const work = works.find(w => w.id === workId);
  const [serviceType, setServiceType] = useState(work?.providerServiceType || '');
  const [isEditingService, setIsEditingService] = useState(false);

  const saveServiceType = async () => {
    if (!work) return;
    try {
      await updateDoc(doc(db, 'works', work.id), { providerServiceType: serviceType });
      toast.success('Serviço atualizado!');
      setIsEditingService(false);
    } catch (e) {
      toast.error('Erro ao salvar serviço');
    }
  };

  if (!work) return null;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 24px 20px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>

      {/* Project Cover & Card Banner */}
      <div
        className="glass-panel"
        style={{
          padding: 24,
          borderRadius: 24,
          marginBottom: 20,
          backgroundImage: work.coverUrl || work.photoUrl ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${work.coverUrl || work.photoUrl})` : 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFF'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#60A5FA', backgroundColor: 'rgba(96, 165, 250, 0.2)', padding: '4px 10px', borderRadius: 8 }}>
              {work.providerServiceType || 'Obra'}
            </span>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: '8px 0 4px', color: '#FFF' }}>{work.name}</h1>
            {work.client && (
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <Users size={13} color="#FFF" /> Cliente: {work.client}
              </span>
            )}
            {work.address && (
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} color="#FFF" /> {work.address}
              </span>
            )}
          </div>

          <span className="status-chip" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFF', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
            {work.status || 'Em Andamento'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto', marginBottom: 24 }}>
        {[
          { id: 'resumo', label: 'Resumo', icon: <LayoutDashboard size={14} /> },
          { id: 'cronograma', label: 'Cronograma', icon: <CalendarDays size={14} /> },
          { id: 'financeiro', label: 'Financeiro', icon: <Wallet size={14} /> },
          { id: 'fornecedores', label: 'Fornecedores', icon: <Truck size={14} /> },
          { id: 'anotacoes', label: 'Anotações', icon: <FileText size={14} /> },
          { id: 'fotos', label: 'Galeria', icon: <ImageIcon size={14} /> },
          { id: 'connect', label: 'Connect', icon: <Users size={14} /> }
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

      {/* Tab Content */}
      <div style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'resumo' && (
            <motion.div key="resumo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Serviço Prestado</h3>
                    {isEditingService ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input 
                          type="text" 
                          value={serviceType} 
                          onChange={e => setServiceType(e.target.value)} 
                          className="input-field" 
                          placeholder="Ex: Instalação Elétrica"
                          style={{ height: 36, padding: '0 12px', borderRadius: 8, fontSize: 14 }}
                        />
                        <button onClick={saveServiceType} className="btn-primary" style={{ padding: '0 12px', height: 36, borderRadius: 8 }}>Salvar</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{work.providerServiceType || 'Não especificado'}</p>
                        <button onClick={() => setIsEditingService(true)} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Editar</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Status de Execução</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Progresso Geral</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-primary)' }}>{work.progress || 0}%</span>
                </div>
                <div style={{ height: 8, backgroundColor: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${work.progress || 0}%`, height: '100%', backgroundColor: (work.progress || 0) === 100 ? '#10B981' : 'var(--color-primary)', borderRadius: 4, transition: 'width 1s ease-out' }} />
                </div>
              </div>

              {typeof work.budget === 'number' && work.budget > 0 && (
                <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Orçamento Aprovado</h3>
                    <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(work.budget)}
                    </p>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'cronograma' && (
            <motion.div key="cronograma" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <InteractiveSchedule workId={workId} embedded />
            </motion.div>
          )}

          {activeTab === 'financeiro' && (
            <motion.div key="financeiro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ProviderWorkFinance workId={workId} />
            </motion.div>
          )}

          {activeTab === 'fornecedores' && (
            <motion.div key="fornecedores" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SuppliersManager onBack={() => setActiveTab('resumo')} />
            </motion.div>
          )}

          {activeTab === 'anotacoes' && (
            <motion.div key="anotacoes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <WorkDiary workId={workId} />
            </motion.div>
          )}

          {activeTab === 'fotos' && (
            <motion.div key="fotos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <DocumentsView workId={workId} />
            </motion.div>
          )}

          {activeTab === 'connect' && (
            <motion.div key="connect" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ShareWorkView workId={workId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function tabStyle(active: boolean) {
  return {
    background: 'none',
    border: 'none',
    fontSize: 15,
    fontWeight: active ? 700 : 600,
    color: active ? 'var(--color-primary)' : 'var(--text-muted)',
    position: 'relative' as const,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    padding: '0 0 12px 0'
  };
}
