import React, { useState, useEffect } from 'react';
import { Layers, Search, Plus, ChevronRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { toast } from 'react-hot-toast';
import { ArchitectProjectDetails } from './ArchitectProjectDetails';

interface ProjectPhase {
  id: string;
  name: string;
  completed: boolean;
}

interface ArchitecturalProject {
  id: string;
  client: string;
  name: string;
  type: string; // 'Residencial', 'Comercial', 'Interiores', 'Corporativo'
  progress: number;
  phases: ProjectPhase[];
  deadline: string;
  builtArea?: number;
  coverUrl?: string;
  status?: string;
}

const DEFAULT_PHASES = [
  { id: 'p1', name: 'Levantamento e Briefing', completed: false },
  { id: 'p2', name: 'Estudo Preliminar', completed: false },
  { id: 'p3', name: 'Anteprojeto', completed: false },
  { id: 'p4', name: 'Projeto Legal (Aprovação)', completed: false },
  { id: 'p5', name: 'Projeto Executivo', completed: false },
  { id: 'p6', name: 'Detalhamento de Interiores', completed: false },
];

export const ProjectControl: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { triggerGuestAlert } = useAuthModal();

  const [projects, setProjects] = useState<ArchitecturalProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', client: '', type: 'Residencial', deadline: '', builtArea: '' });

  useEffect(() => {
    if (user && !isGuest) {
      loadProjects();
    } else {
      // Guest fallback
      try {
        const stored = localStorage.getItem('co_architect_projects');
        if (stored) setProjects(JSON.parse(stored));
        else setProjects([]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  }, [user, isGuest]);

  const saveToLocal = (items: ArchitecturalProject[]) => {
    localStorage.setItem('co_architect_projects', JSON.stringify(items));
  };

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
          phases: data.phases || DEFAULT_PHASES,
          deadline: data.deadline || '',
          builtArea: data.builtArea || 0,
          status: data.status || 'Em Estudo',
          coverUrl: data.coverUrl || '',
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

  const saveProject = async () => {
    if (!formData.name) {
      toast.error("O nome do projeto é obrigatório");
      return;
    }

    try {
      const newProj = {
        userId: user?.uid || 'guest',
        name: formData.name,
        client: formData.client,
        type: formData.type,
        progress: 0,
        phases: DEFAULT_PHASES,
        deadline: formData.deadline,
        builtArea: parseFloat(formData.builtArea) || 0,
        status: 'Em Estudo',
        createdAt: new Date().toISOString()
      };

      if (user && !isGuest) {
        await addDoc(collection(db, 'projects'), newProj);
        toast.success("Projeto criado com sucesso!");
        loadProjects();
      } else {
        const newItem = { id: crypto.randomUUID(), ...newProj };
        const updated = [newItem, ...projects];
        setProjects(updated);
        saveToLocal(updated);
        toast.success("Projeto salvo localmente!");
      }
      setIsModalOpen(false);
      setFormData({ name: '', client: '', type: 'Residencial', deadline: '', builtArea: '' });
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Erro ao criar projeto");
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.client.toLowerCase().includes(filter.toLowerCase())
  );

  if (selectedProjectId) {
    return <ArchitectProjectDetails projectId={selectedProjectId} onBack={() => setSelectedProjectId(null)} />;
  }

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Projetos de Arquitetura</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Gestão técnica, pranchas e compatibilização</p>
        </div>
        <button className="btn-primary" onClick={() => isGuest ? triggerGuestAlert() : setIsModalOpen(true)} style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </button>
      </div>

      {/* Filter */}
      <div className="input-icon-wrapper" style={{ marginBottom: 20 }}>
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Buscar projeto por nome ou cliente..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field"
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 20 }} />
          <div className="skeleton-glass" style={{ height: 120, borderRadius: 20 }} />
        </div>
      ) : projects.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
          <Layers size={40} color="var(--color-primary)" opacity={0.8} style={{ marginBottom: 24 }} />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Nenhum projeto cadastrado</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32 }}>Crie seu primeiro projeto técnico para gerenciar etapas e pranchas.</p>
          <button className="btn-primary" onClick={() => isGuest ? triggerGuestAlert() : setIsModalOpen(true)} style={{ padding: '12px 24px', borderRadius: 16 }}>
            + Criar Novo Projeto
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredProjects.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedProjectId(project.id)}
              className="glass-panel card-premium-interactive"
              style={{ padding: 18, borderRadius: 20, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{project.name}</h3>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{project.client || 'Cliente'} • {project.type}</span>
                  </div>
                </div>

                <span className="status-chip" style={{ backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)' }}>
                  {project.status || 'Em Estudo'}
                </span>
              </div>

              {/* Progress & Actions */}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, marginRight: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>Progresso das Etapas</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${project.progress}%`, height: '100%', backgroundColor: '#8B5CF6', borderRadius: 3 }} />
                  </div>
                </div>

                <button style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                  Ver Projeto <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL NOVO PROJETO */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel" style={{ width: '100%', maxWidth: 450, borderRadius: 24, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Novo Projeto de Arquitetura</h2>
                <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-group">
                  <label>Nome do Projeto *</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Residência Alpha" />
                </div>
                <div className="input-group">
                  <label>Cliente *</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px' }} value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="Ex: Família Souza" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="input-group">
                    <label>Categoria</label>
                    <select className="select-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="Residencial">Residencial</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Interiores">Interiores</option>
                      <option value="Corporativo">Corporativo</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Área (m²)</label>
                    <input type="number" className="input-field" style={{ padding: '0 16px' }} value={formData.builtArea} onChange={e => setFormData({...formData, builtArea: e.target.value})} placeholder="Ex: 250" />
                  </div>
                </div>
                <div className="input-group">
                  <label>Previsão de Entrega</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px' }} value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} placeholder="Ex: Dezembro/2026" />
                </div>
              </div>

              <button className="btn-primary" onClick={saveProject} style={{ width: '100%', padding: 16, borderRadius: 16, marginTop: 20, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Check size={20} /> Salvar Projeto
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
