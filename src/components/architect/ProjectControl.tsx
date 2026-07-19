import React, { useState, useEffect } from 'react';
import { Layers, Search, Plus, CheckCircle2, Circle, ChevronRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { toast } from 'react-hot-toast';

interface ProjectPhase {
  id: string;
  name: string;
  completed: boolean;
}

interface ArchitecturalProject {
  id: string;
  client: string;
  name: string;
  type: string; // 'Residencial', 'Comercial', 'Interiores'
  progress: number;
  phases: ProjectPhase[];
  deadline: string;
}

const DEFAULT_PHASES = [
  { id: 'p1', name: 'Levantamento e Briefing', completed: false },
  { id: 'p2', name: 'Estudo Preliminar', completed: false },
  { id: 'p3', name: 'Anteprojeto', completed: false },
  { id: 'p4', name: 'Projeto Legal (Aprova��o)', completed: false },
  { id: 'p5', name: 'Projeto Executivo', completed: false },
  { id: 'p6', name: 'Detalhamento de Interiores', completed: false },
];

export const ProjectControl: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { triggerGuestAlert } = useAuthModal();

  const [projects, setProjects] = useState<ArchitecturalProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', client: '', type: 'Residencial', deadline: '' });

  useEffect(() => {
    if (user && !isGuest) {
      loadProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user, isGuest]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'projects'), where('userId', '==', user?.uid));
      const querySnapshot = await getDocs(q);
      const loaded: ArchitecturalProject[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          name: data.name || '',
          client: data.client || '',
          type: data.type || 'Residencial',
          progress: data.progress || 0,
          phases: data.phases || [],
          deadline: data.deadline || ''
        });
      });
      setProjects(loaded);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Erro ao carregar projetos");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (phases: ProjectPhase[]) => {
    if (phases.length === 0) return 0;
    const completed = phases.filter(p => p.completed).length;
    return Math.round((completed / phases.length) * 100);
  };

  const togglePhase = async (project: ArchitecturalProject, phaseId: string) => {
    if (isGuest) {
      triggerGuestAlert();
      return;
    }
    const updatedPhases = project.phases.map(p => p.id === phaseId ? { ...p, completed: !p.completed } : p);
    const newProgress = calculateProgress(updatedPhases);

    // Optimistic update
    setProjects(projects.map(p => p.id === project.id ? { ...p, phases: updatedPhases, progress: newProgress } : p));

    try {
      const docRef = doc(db, 'projects', project.id);
      await updateDoc(docRef, {
        phases: updatedPhases,
        progress: newProgress,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating phase:", error);
      toast.error("Erro ao atualizar fase");
      loadProjects(); // Revert on error
    }
  };

  const saveProject = async () => {
    if (!formData.name || !formData.client) {
      toast.error("Nome e cliente s�o obrigat�rios");
      return;
    }
    if (!user) return;

    try {
      await addDoc(collection(db, 'projects'), {
        userId: user.uid,
        name: formData.name,
        client: formData.client,
        type: formData.type,
        deadline: formData.deadline,
        progress: 0,
        phases: DEFAULT_PHASES,
        createdAt: serverTimestamp()
      });
      toast.success("Projeto criado com sucesso!");
      setIsModalOpen(false);
      setFormData({ name: '', client: '', type: 'Residencial', deadline: '' });
      loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Erro ao criar projeto");
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.client.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Controle de Projetos</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Acompanhe as fases dos seus projetos</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => isGuest ? triggerGuestAlert() : setIsModalOpen(true)} 
          style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="input-icon-wrapper" style={{ marginBottom: 24 }}>
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Buscar projeto..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field"
        />
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando projetos...
        </div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <Layers size={40} color="var(--color-primary)" opacity={0.8} style={{ marginBottom: 24 }} />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Nenhum projeto</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32 }}>Crie seu primeiro projeto para gerenciar fases.</p>
          <button className="btn-primary" onClick={() => isGuest ? triggerGuestAlert() : setIsModalOpen(true)} style={{ padding: '12px 24px', borderRadius: 16 }}>
            Novo Projeto
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredProjects.map(project => (
            <div key={project.id} className="glass-panel" style={{ borderRadius: 16, overflow: 'hidden' }}>
              <div 
                style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{project.name}</h3>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{project.client} � {project.type}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)' }}>{project.progress}%</span>
                    <div style={{ width: 60, height: 4, backgroundColor: 'var(--border-light)', borderRadius: 2, marginTop: 4 }}>
                      <div style={{ width: `${project.progress}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 2 }}></div>
                    </div>
                  </div>
                  <ChevronRight 
                    size={20} 
                    color="var(--text-muted)" 
                    style={{ transform: expandedProject === project.id ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} 
                  />
                </div>
              </div>

              <AnimatePresence>
                {expandedProject === project.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>FASES DO PROJETO</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Prazo: <strong style={{ color: 'var(--text-main)' }}>{project.deadline || '-'}</strong></span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {project.phases.map((phase, index) => (
                          <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button onClick={() => togglePhase(project, phase.id)} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: phase.completed ? '#10B981' : 'var(--text-muted)', cursor: 'pointer' }}>
                              {phase.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </button>
                            <span style={{ fontSize: 14, color: phase.completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: phase.completed ? 'line-through' : 'none', flex: 1 }}>
                              {index + 1}. {phase.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel" style={{ width: '100%', maxWidth: 400, borderRadius: 24, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Novo Projeto</h2>
                <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="input-group">
                  <label>Nome do Projeto *</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Resid�ncia Alpha" />
                </div>
                <div className="input-group">
                  <label>Cliente *</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px' }} value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="Ex: Fam�lia Souza" />
                </div>
                <div className="input-group">
                  <label>Tipo</label>
                  <select className="select-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Interiores">Interiores</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Prazo</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px' }} value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} placeholder="DD/MM/AAAA" />
                </div>
              </div>

              <button className="btn-primary" onClick={saveProject} style={{ width: '100%', padding: 16, borderRadius: 16, marginTop: 24, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Check size={20} /> Salvar Projeto
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
