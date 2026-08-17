import { useState, useEffect } from 'react';
import { ArrowLeft, Layers, Calendar, User, DollarSign, FileText, ClipboardList, BookOpen, Camera, Package, Puzzle, FileSpreadsheet, Share2 } from 'lucide-react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ClientPortalConnectModal } from './ClientPortalConnectModal';
import { ProjectTechnicalJournal } from './ProjectTechnicalJournal';
import { ProjectInspections } from './ProjectInspections';
import { InteractiveSchedule } from '../owner/InteractiveSchedule';
import { Finance } from '../Finance';
import { DocumentsView } from '../works/DocumentsView';
import { Shopping } from '../Shopping';
import { ProjectPhotoGallery } from './ProjectPhotoGallery';
import { BimCompatibilityView } from './BimCompatibilityView';
import { ProjectReportsView } from './ProjectReportsView';

interface ArchitectProjectDetailsProps {
  projectId: string;
  onBack: () => void;
}

export function ArchitectProjectDetails({ projectId, onBack }: ArchitectProjectDetailsProps) {
  const { user, profile, isGuest } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resumo' | 'cronograma' | 'cliente' | 'financeiro' | 'documentos' | 'vistorias' | 'diario' | 'fotos' | 'materiais' | 'compatibilizacao' | 'relatorios'>('resumo');
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      const docRef = doc(db, 'works', projectId);
      getDoc(docRef).then(snap => {
        if (snap.exists()) {
          setProject({ id: snap.id, ...snap.data() });
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    } else {
      // Guest local storage fallback
      try {
        const stored = localStorage.getItem('co_architect_projects');
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find((p: any) => p.id === projectId);
          if (found) setProject(found);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [projectId, user, isGuest]);

  if (loading) {
    return (
      <div className="screen-content" style={{ padding: 24 }}>
        <div className="skeleton-glass" style={{ height: 200, borderRadius: 24, marginBottom: 20 }} />
        <div className="skeleton-glass" style={{ height: 300, borderRadius: 24 }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="screen-content" style={{ padding: 24, textAlign: 'center' }}>
        <button onClick={onBack} className="btn-secondary" style={{ marginBottom: 16 }}>
          <ArrowLeft size={16} /> Voltar aos Projetos
        </button>
        <p style={{ color: 'var(--text-muted)' }}>Projeto não encontrado.</p>
      </div>
    );
  }

  const TABS = [
    { id: 'resumo', label: 'Resumo', icon: Layers },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar },
    { id: 'cliente', label: 'Cliente', icon: User },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'vistorias', label: 'Vistorias', icon: ClipboardList },
    { id: 'diario', label: 'Diário', icon: BookOpen },
    { id: 'fotos', label: 'Fotos', icon: Camera },
    { id: 'materiais', label: 'Materiais', icon: Package },
    { id: 'compatibilizacao', label: 'Compatibilização', icon: Puzzle },
    { id: 'relatorios', label: 'Relatórios', icon: FileSpreadsheet },
  ];

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
          <ArrowLeft size={18} /> Projetos
        </button>

        <button
          onClick={() => setShowConnectModal(true)}
          className="btn-primary"
          style={{ padding: '8px 14px', borderRadius: 12, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
        >
          <Share2 size={15} /> CentralObra Connect
        </button>
      </div>

      {/* Project Cover & Card Banner */}
      <div
        className="glass-panel"
        style={{
          padding: 24,
          borderRadius: 24,
          marginBottom: 20,
          backgroundImage: project.coverUrl ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${project.coverUrl})` : 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFF'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.2)', padding: '4px 10px', borderRadius: 8 }}>
              {project.category || 'Residencial'}
            </span>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: '8px 0 4px', color: '#FFF' }}>{project.name}</h1>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <User size={13} color="#FFF" /> Cliente: {project.client || 'Não informado'}
            </span>
          </div>

          <span className="status-chip" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFF', border: '1px solid rgba(255,255,255,0.3)' }}>
            {project.status || 'Em Estudo'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: 12 }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Área Construída:</span>
            <strong>{project.builtArea ? `${project.builtArea} m²` : '—'}</strong>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Previsão:</span>
            <strong>{project.deadline || '—'}</strong>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Progresso:</span>
            <strong style={{ color: '#4ADE80' }}>{project.progress || 0}%</strong>
          </div>
        </div>
      </div>

      {/* 11 Navigation Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: 20 }} className="hide-scrollbar">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 6,
                border: isActive ? '1.5px solid #8B5CF6' : '1px solid var(--border-subtle)',
                backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-elevated)',
                color: isActive ? '#8B5CF6' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="glass-panel" style={{ padding: 20, borderRadius: 24, minHeight: 300 }}>
        {activeTab === 'resumo' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Resumo Técnico do Projeto</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {project.notes || 'Nenhuma observação geral cadastrada para este projeto.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
              <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 14, borderRadius: 16 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Responsável Técnico</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{project.responsible || 'Arquiteto Responsável'}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-elevated)', padding: 14, borderRadius: 16 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Data de Início</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{project.startDate || '—'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cronograma' && (
          <div style={{ marginLeft: -16, marginRight: -16 }}>
            <InteractiveSchedule projectId={projectId} embedded={true} />
          </div>
        )}

        {activeTab === 'cliente' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>Ficha do Cliente</h3>
            <p style={{ fontSize: 13, color: 'var(--text-main)' }}><strong>Nome:</strong> {project.client}</p>
            <button onClick={() => setShowConnectModal(true)} className="btn-primary" style={{ marginTop: 12, padding: '10px 18px', borderRadius: 12, fontSize: 13 }}>
              Configurar Acesso no CentralObra Connect
            </button>
          </div>
        )}

        {activeTab === 'financeiro' && (
          <div style={{ marginLeft: -16, marginRight: -16 }}>
            <Finance workId={project.id} embedded parentCollection="projects" />
          </div>
        )}

        {activeTab === 'documentos' && (
          <DocumentsView workId={project.id} parentCollection="projects" />
        )}

        {activeTab === 'vistorias' && (
          <ProjectInspections projectId={project.id} />
        )}

        {activeTab === 'diario' && (
          <ProjectTechnicalJournal projectId={project.id} />
        )}

        {activeTab === 'fotos' && (
          <ProjectPhotoGallery projectId={project.id} />
        )}

        {activeTab === 'materiais' && (
          <div style={{ marginLeft: -16, marginRight: -16 }}>
            <Shopping workId={project.id} embedded parentCollection="projects" />
          </div>
        )}

        {activeTab === 'compatibilizacao' && (
          <BimCompatibilityView projectId={project.id} />
        )}

        {activeTab === 'relatorios' && (
          <ProjectReportsView projectId={project.id} />
        )}
      </div>

      {/* CentralObra Connect Modal */}
      <ClientPortalConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        project={project}
        providerProfile={profile}
      />
    </div>
  );
}
