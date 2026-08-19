import { useState, useEffect } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useWorks } from '../../contexts/WorksContext';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { 
  CheckCircle2, Circle, Plus, Calendar, User, Trash2, Sparkles, Layers, ArrowLeft, Settings, GripVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export interface ScheduleStage {
  id?: string;
  title: string;
  category: string;
  completed: boolean;
  startDate?: string;
  endDate?: string;
  responsible?: string;
  notes?: string;
  order: number;
}

const getTemplates = (specialty?: string): Record<string, { name: string; stages: string[] }> => {
  return {
    eletrica_basica: {
      name: 'Instalação Elétrica Básica',
      stages: ['Marcação de Pontos', 'Corte de Paredes e Chumbamento de Caixas', 'Passagem de Eletrodutos', 'Passagem de Fiação', 'Instalação de Tomadas e Interruptores', 'Montagem do Quadro de Distribuição', 'Teste de Isolamento e Tensão']
    },
    troca_fiacao: {
      name: 'Troca de Fiação',
      stages: ['Desligamento Geral e Retirada da Fiação Antiga', 'Inspeção de Eletrodutos', 'Passagem da Nova Fiação', 'Substituição de Disjuntores', 'Testes e Energização']
    },
    hidraulica_basica: {
      name: 'Instalação Hidráulica',
      stages: ['Marcação de Pontos de Água e Esgoto', 'Cortes em Alvenaria', 'Instalação de Tubulação de Esgoto', 'Instalação de Tubulação de Água Fria/Quente', 'Teste de Estanqueidade (Pressurização)', 'Chumbamento da Tubulação', 'Instalação de Louças e Metais']
    },
    alvenaria: {
      name: 'Alvenaria e Reboco',
      stages: ['Gabarito e Marcação', 'Elevação de Alvenaria', 'Cintas e Vergas', 'Chapisco', 'Emboço/Reboco', 'Cura']
    },
    piso: {
      name: 'Contrapiso e Porcelanato',
      stages: ['Limpeza e Nivelamento', 'Execução do Contrapiso', 'Impermeabilização', 'Assentamento de Porcelanato', 'Rejuntamento', 'Limpeza Final']
    },
    pintura_completa: {
      name: 'Pintura Interna Completa',
      stages: ['Proteção de Pisos e Móveis', 'Lixamento e Preparação de Superfície', 'Aplicação de Massa Corrida', 'Lixamento da Massa', 'Aplicação de Selador', 'Pintura (2 a 3 demãos)', 'Retoques Finos e Limpeza']
    },
    casa_nova: {
    name: 'Casa Nova (Completa)',
    stages: [
      'Projeto Arquitetônico e Aprovação na Prefeitura',
      'Serviços Preliminares e Gabarito',
      'Fundação (Escavação, Sapatas e Baldrame)',
      'Alvenaria e Estrutura de Concreto',
      'Laje e Cobertura (Telhado/Manta)',
      'Instalações Hidráulicas e Sanitárias',
      'Instalações Elétricas e Passagem de Fiação',
      'Reboco, Contrapiso e Impermeabilização',
      'Revestimentos e Pisos (Porcelanatos)',
      'Esquadrias de Alumínio/Madeira e Vidros',
      'Pintura Interna e Externa',
      'Instalação de Louças, Metais e Luminárias',
      'Limpeza Pós-Obra e Vistoria Final'
    ]
  },
  reforma: {
    name: 'Reforma Residencial',
    stages: [
      'Demolição e Remoção de Entulho',
      'Adequação de Infraestrutura Elétrica e Hidráulica',
      'Regularização de Paredes e Contrapiso',
      'Impermeabilização de Áreas Molhadas',
      'Assentamento de Revestimentos e Porcelanatos',
      'Forro de Gesso e Pintura',
      'Montagem de Marcenaria e Louças',
      'Limpeza Fina'
    ]
  },
  ampliacao: {
    name: 'Ampliação de Cômodo/Edícula',
    stages: [
      'Escavação e Baldrame',
      'Elevação de Paredes de Bloco',
      'Viga de Amarra e Laje',
      'Cobertura e Calhas',
      'Instalações de Pontos Elétricos',
      'Chapisco, Reboco e Pintura'
    ]
  },
  muro: {
    name: 'Muro de Fechamento/Divisa',
    stages: [
      'Escavação de Brocas e Baldrame',
      'Assentamento de Blocos com Pilarinhos',
      'Cinta Superior de Concreto',
      'Chapisco, Reboco e Textura Externa'
    ]
  },
  piscina: {
    name: 'Piscina de Alvenaria/Pedra',
    stages: [
      'Escavação do Terreno',
      'Armação de Aço e Concretagem',
      'Impermeabilização Dupla',
      'Assentamento de Pedra Hijau/Pastilha',
      'Instalação da Casa de Máquinas e Filtro',
      'Deck de Madeira/Porcelanato em Volta'
    ]
  },
  cobertura: {
    name: 'Cobertura e Telhado',
    stages: [
      'Montagem da Estrutura de Madeira/Aço',
      'Instalação de Manta Térmica e Subtelhado',
      'Assentamento de Telhas',
      'Instalação de Calhas, Rufos e Pingadeiras'
    ]
  },
  area_gourmet: {
    name: 'Área Gourmet e Churrasqueira',
    stages: [
      'Pontos de Água, Esgoto e Gás',
      'Construção da Base da Churrasqueira e Bancada',
      'Revestimento das Bancadas e Paredes',
      'Iluminação Decorativa e Pendentes',
      'Instalação de Chopeira/Pia e Marcenaria'
    ]
  },
  pintura: {
    name: 'Pintura Interna e Externa',
    stages: [
      'Proteção de Pisos e Esquadrias com Lona',
      'Lixamento e Lavagem de Paredes',
      'Aplicação de Selador e Massa Corrida',
      '1ª Demão de Tinta',
      '2ª Demão de Tinta e Retoques',
      'Retirada de Fitas e Limpeza'
    ]
  },
  banheiro: {
    name: 'Reforma de Banheiro',
    stages: [
      'Retirada de Revestimentos e Louças Antigas',
      'Troca de Encanamento e Ralo Oculto',
      'Impermeabilização do Box e Piso',
      'Revestimento de Parede e Niicho',
      'Instalação de Box, Bacia e Bancada de Mármore'
    ]
  },
  eletrica: {
    name: 'Instalação Elétrica',
    stages: [
      'Chumbamento de Caixas e Conduítes',
      'Enfiamento de Fios por Circuito',
      'Montagem do Quadro de Distribuição (QDL)',
      'Instalação de Tomadas, Interruptores e Fita LED',
      'Teste de Carga e Disjuntores'
    ]
  },
  hidraulica: {
    name: 'Instalação Hidráulica',
    stages: [
      'Abertura de Rasgos em Alvenaria',
      'Tubulação de Água Fria e Água Quente (PPR/PEX)',
      'Rede de Esgoto e Caixas de Gordura',
      'Teste de Pressão e Estanqueidade',
      'Conexão de Válvulas e Torneiras'
    ]
  }
};
};

function StageItem({ stage, idx, handleToggleStage, openEditModal, handleDeleteStage }: { stage: ScheduleStage, idx: number, handleToggleStage: (s: ScheduleStage) => void, openEditModal: (s: ScheduleStage) => void, handleDeleteStage: (id: string) => void }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={stage}
      dragListener={false}
      dragControls={controls}
      className="glass-panel"
      style={{
        padding: 16, borderRadius: 20, border: '1px solid var(--border-subtle)',
        backgroundColor: stage.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
      }}
    >
      <div
        className="drag-handle"
        onPointerDown={(e) => controls.start(e)}
        style={{ cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4, color: 'var(--text-muted)' }}
      >
        <GripVertical size={20} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
        <button
          onClick={() => handleToggleStage(stage)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2 }}
        >
          {stage.completed ? (
            <CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="var(--text-muted)" />
          )}
        </button>

        <div style={{ flex: 1 }}>
          <h4 style={{
            fontSize: 15, fontWeight: 700, color: stage.completed ? 'var(--text-muted)' : 'var(--text-main)',
            textDecoration: stage.completed ? 'line-through' : 'none', margin: '0 0 4px'
          }}>
            {idx + 1}. {stage.title}
          </h4>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            {stage.startDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} /> {stage.startDate}
              </span>
            )}
            {stage.responsible && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', fontWeight: 600 }}>
                <User size={12} /> Resp: {stage.responsible}
              </span>
            )}
          </div>

          {stage.notes && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic', backgroundColor: 'var(--bg-elevated)', padding: '6px 10px', borderRadius: 8 }}>
              {stage.notes}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button
          onClick={() => openEditModal(stage)}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 4 }}
        >
          <Settings size={16} />
        </button>
        <button
          onClick={() => stage.id && handleDeleteStage(stage.id)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
}

export function InteractiveSchedule({ onBack, workId, projectId, embedded = false }: { onBack?: () => void; workId?: string; projectId?: string; embedded?: boolean }) {
  const { user, profile, isGuest } = useAuth();
  const { works, activeWork } = useWorks();
  const currentWork = workId ? works.find(w => w.id === workId) : (activeWork || (works.length > 0 ? works[0] : null));

  const [stages, setStages] = useState<ScheduleStage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Form
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [stageTitle, setStageTitle] = useState('');
  const [stageStartDate, setStageStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [stageEndDate, setStageEndDate] = useState('');
  const [stageResponsible, setStageResponsible] = useState('');
  const [stageNotes, setStageNotes] = useState('');
  const [stageCompleted, setStageCompleted] = useState(false);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('casa_nova');
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const currentWorkId = projectId || currentWork?.id;
  const collectionPath = projectId ? `projects/${projectId}/schedule_stages` : `works/${currentWorkId}/schedule_stages`;

  useEffect(() => {
    if (!user || !currentWorkId) {
      setStages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const qStages = query(
      collection(db, collectionPath),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(qStages, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleStage));
      setStages(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, currentWorkId, collectionPath]);

  // Recalculate Work Progress % when stages change
  const updateWorkProgress = async (newStages: ScheduleStage[]) => {
    if (!currentWork) return;
    const completedCount = newStages.filter(s => s.completed).length;
    const totalCount = newStages.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    try {
      const workRef = doc(db, 'works', currentWork.id);
      await updateDoc(workRef, { progress: progressPercent });
    } catch (err) {
      console.error("Error updating work progress", err);
    }
  };

  const TEMPLATE_MODELS = getTemplates(currentWork?.providerServiceType || profile?.specialty);

  const handleToggleStage = async (stage: ScheduleStage) => {
    if (!currentWork) return;
    const updatedStatus = !stage.completed;
    
    if (stage.id) {
      await updateDoc(doc(db, `works/${currentWork.id}/schedule_stages`, stage.id), {
        completed: updatedStatus
      });
    }

    const updatedList = stages.map(s => s.id === stage.id ? { ...s, completed: updatedStatus } : s);
    setStages(updatedList);
    await updateWorkProgress(updatedList);
    toast.success(updatedStatus ? 'Etapa concluída!' : 'Etapa reaberta.');
  };

  const resetForm = () => {
    setStageTitle('');
    setStageStartDate(new Date().toISOString().split('T')[0]);
    setStageEndDate('');
    setStageResponsible('');
    setStageNotes('');
    setStageCompleted(false);
  };

  const handleAddStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageTitle.trim() || !currentWorkId) return;

    try {
      const newStage: Omit<ScheduleStage, 'id'> = {
        title: stageTitle,
        category: 'Etapa Geral',
        completed: stageCompleted,
        startDate: stageStartDate,
        endDate: stageEndDate,
        responsible: stageResponsible,
        notes: stageNotes,
        order: stages.length + 1
      };

      const updatedList = [...stages, { ...newStage, id: `temp-${Date.now()}` } as ScheduleStage];
      setStages(updatedList);
      
      addDoc(collection(db, collectionPath), newStage).catch(err => console.error(err));
      updateWorkProgress(updatedList);
      
      toast.success('Etapa adicionada ao cronograma!');
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao adicionar etapa');
    }
  };

  const [editStageId, setEditStageId] = useState<string | null>(null);

  const handleEditStage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editStageId || !stageTitle.trim() || !currentWorkId || isGuest) return;

    try {
      await updateDoc(doc(db, collectionPath, editStageId), {
        title: stageTitle,
        completed: stageCompleted,
        startDate: stageStartDate,
        endDate: stageEndDate,
        responsible: stageResponsible,
        notes: stageNotes,
      });

      const updatedList = stages.map(s => s.id === editStageId ? {
        ...s,
        title: stageTitle,
        completed: stageCompleted,
        startDate: stageStartDate,
        endDate: stageEndDate,
        responsible: stageResponsible,
        notes: stageNotes,
      } : s);
      setStages(updatedList);
      updateWorkProgress(updatedList);

      toast.success('Etapa atualizada!');
      setEditStageId(null);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao editar etapa');
    }
  };

  const openEditModal = (stage: ScheduleStage) => {
    setEditStageId(stage.id || null);
    setStageTitle(stage.title || '');
    setStageStartDate(stage.startDate || new Date().toISOString().split('T')[0]);
    setStageEndDate(stage.endDate || '');
    setStageResponsible(stage.responsible || '');
    setStageNotes(stage.notes || '');
    setStageCompleted(!!stage.completed);
  };

  const handleDeleteStage = async (stageId: string) => {
    if (!currentWorkId) return;
    if (!confirm('Deseja excluir esta etapa do cronograma?')) return;

    try {
      await deleteDoc(doc(db, collectionPath, stageId));
      const remaining = stages.filter(s => s.id !== stageId);
      setStages(remaining);
      await updateWorkProgress(remaining);
      toast.success('Etapa removida');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir etapa');
    }
  };

  const handleReorder = async (newOrder: ScheduleStage[]) => {
    if (!currentWorkId || isGuest) return;
    setStages(newOrder); // Optimistic UI
    try {
      const promises = newOrder.map((stage, idx) => {
        if (stage.id && stage.order !== idx + 1) {
          return updateDoc(doc(db, collectionPath, stage.id), {
            order: idx + 1
          });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar nova ordem');
    }
  };

  const handleLoadTemplate = async () => {
    if (!user || !currentWorkId) return;
    const template = TEMPLATE_MODELS[selectedTemplateKey];
    if (!template) return;

    if (stages.length > 0 && !confirm(`Carregar modelo "${template.name}" irá adicionar as etapas padrão ao cronograma atual. Continuar?`)) return;

    setLoadingTemplate(true);
    try {
      const newStagesList: ScheduleStage[] = [];
      const startOrder = stages.length;
      for (let i = 0; i < template.stages.length; i++) {
        const s = {
          title: template.stages[i],
          category: template.name,
          completed: false,
          startDate: new Date().toISOString().split('T')[0],
          order: startOrder + i + 1
        };
        const docRef = await addDoc(collection(db, collectionPath), s);
        newStagesList.push({ ...s, id: docRef.id } as ScheduleStage);
      }
      
      const updatedList = [...stages, ...newStagesList];
      setStages(updatedList);
      updateWorkProgress(updatedList);
      
      toast.success(`Modelo "${template.name}" carregado com sucesso!`);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar modelo');
    } finally {
      setLoadingTemplate(false);
    }
  };

  const completedCount = stages.filter(s => s.completed).length;
  const totalCount = stages.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : (currentWork?.progress || 0);

  return (
    <div className={embedded ? "animate-fade-in" : "screen-content animate-fade-in"} style={{ padding: embedded ? '0' : '24px 20px 100px 20px' }}>
      
      {/* Header */}
      {!embedded && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} className="btn-secondary" style={{ width: 40, height: 40, borderRadius: 20, padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Cronograma Interativo</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{currentWork?.name || 'Sua Obra Principal'}</p>
          </div>
        </div>
      </div>
      )}
      
      {/* Botão de Adicionar - Destacado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Cronograma da Obra</h3>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Gerencie as etapas deste projeto</p>
        </div>
        <button className="btn-primary" style={{ padding: '0 20px', height: 48, borderRadius: 14, fontSize: 14, fontWeight: 700 }} onClick={() => setShowAddModal(true)}>
          <Plus size={20} style={{ marginRight: 8 }} /> Adicionar Etapa
        </button>
      </div>

      {/* Progress Dashboard Banner */}
      <div className="glass-panel" style={{ padding: 20, borderRadius: 24, marginBottom: 24, borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Progresso Real da Obra</span>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0' }}>{completedCount} de {totalCount} Etapas Concluídas</h3>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-primary)' }}>{progressPercent}%</span>
        </div>

        <div style={{ height: 8, backgroundColor: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 4, transition: 'width 0.8s ease' }} />
        </div>
      </div>

      {/* Preset Model Loader */}
      <div className="glass-panel" style={{ padding: 18, borderRadius: 20, marginBottom: 24 }}>
        <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
          CARREGAR MODELO DE CRONOGRAMA PRONTO (11 OPÇÕES)
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <select
            value={selectedTemplateKey}
            onChange={e => setSelectedTemplateKey(e.target.value)}
            style={{ flex: 1, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 12px', height: 44, fontSize: 13, color: 'var(--text-main)' }}
          >
            {Object.entries(TEMPLATE_MODELS).map(([key, model]) => (
              <option key={key} value={key}>{model.name}</option>
            ))}
          </select>
          <button
            onClick={handleLoadTemplate}
            disabled={loadingTemplate}
            className="btn-primary"
            style={{ padding: '0 16px', height: 44, borderRadius: 12, fontSize: 13 }}
          >
            <Sparkles size={16} />
            {loadingTemplate ? 'Carregando...' : 'Aplicar'}
          </button>
        </div>
      </div>

      {/* Stages List */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Carregando cronograma...</p>
      ) : stages.length === 0 ? (
        <div className="glass-panel" style={{ padding: 32, borderRadius: 24, textAlign: 'center' }}>
          <Layers size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Nenhuma etapa adicionada</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 300, margin: '0 auto 20px' }}>
            Selecione um dos 11 modelos prontos acima ou adicione etapas personalizadas para sua obra.
          </p>
          <button onClick={handleLoadTemplate} className="btn-primary" style={{ padding: '0 20px', height: 44, borderRadius: 14 }}>
            Carregar Modelo "{TEMPLATE_MODELS[selectedTemplateKey]?.name}"
          </button>
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={stages} 
          onReorder={handleReorder} 
          style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0, listStyle: 'none' }}
        >
          {stages.map((stage, idx) => (
            <StageItem 
              key={stage.id || String(idx)} 
              stage={stage} 
              idx={idx} 
              handleToggleStage={handleToggleStage}
              openEditModal={openEditModal}
              handleDeleteStage={handleDeleteStage}
            />
          ))}
        </Reorder.Group>
      )}

      {/* Add Stage Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: 440, maxHeight: '90dvh', overflowY: 'auto', borderRadius: 28, padding: 24, position: 'relative' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Nova Etapa do Cronograma</h2>

            <form onSubmit={handleAddStage} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Nome da Etapa</label>
                <input type="text" required placeholder="Ex: Concretagem da Laje" value={stageTitle} onChange={e => setStageTitle(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Responsável / Empreiteiro</label>
                <input type="text" placeholder="Ex: Engenheiro Carlos / Mestre Pedro" value={stageResponsible} onChange={e => setStageResponsible(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Data Prevista</label>
                  <input type="date" value={stageStartDate} onChange={e => setStageStartDate(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Data Limite</label>
                  <input type="date" value={stageEndDate} onChange={e => setStageEndDate(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Observações / Instruções</label>
                <textarea placeholder="Especificações técnicas, traço do concreto, etc." value={stageNotes} onChange={e => setStageNotes(e.target.value)} className="input-field" style={{ height: 80, paddingTop: 10, borderRadius: 12, fontSize: 13, resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input 
                  type="checkbox" 
                  id="stageCompletedAdd" 
                  checked={stageCompleted} 
                  onChange={e => setStageCompleted(e.target.checked)} 
                  style={{ width: 18, height: 18, accentColor: '#10B981', cursor: 'pointer' }}
                />
                <label htmlFor="stageCompletedAdd" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                  Marcar etapa como concluída
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ flex: 1, padding: 12, borderRadius: 14 }}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: 12, borderRadius: 14 }}>Adicionar Etapa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stage Modal */}
      {editStageId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: 440, maxHeight: '90dvh', overflowY: 'auto', borderRadius: 28, padding: 24, position: 'relative' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Editar Etapa</h2>

            <form onSubmit={handleEditStage} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Nome da Etapa</label>
                <input type="text" required placeholder="Ex: Concretagem da Laje" value={stageTitle} onChange={e => setStageTitle(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Responsável / Empreiteiro</label>
                <input type="text" placeholder="Ex: Engenheiro Carlos / Mestre Pedro" value={stageResponsible} onChange={e => setStageResponsible(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Data Prevista</label>
                  <input type="date" value={stageStartDate} onChange={e => setStageStartDate(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Data Limite</label>
                  <input type="date" value={stageEndDate} onChange={e => setStageEndDate(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Observações / Instruções</label>
                <textarea placeholder="Especificações técnicas, traço do concreto, etc." value={stageNotes} onChange={e => setStageNotes(e.target.value)} className="input-field" style={{ height: 80, paddingTop: 10, borderRadius: 12, fontSize: 13, resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input 
                  type="checkbox" 
                  id="stageCompletedEdit" 
                  checked={stageCompleted} 
                  onChange={e => setStageCompleted(e.target.checked)} 
                  style={{ width: 18, height: 18, accentColor: '#10B981', cursor: 'pointer' }}
                />
                <label htmlFor="stageCompletedEdit" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                  Marcar etapa como concluída
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => { setEditStageId(null); resetForm(); }} className="btn-secondary" style={{ flex: 1, padding: 12, borderRadius: 14 }}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: 12, borderRadius: 14 }}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
