import React, { useState } from 'react';
import { Layers, Search, Plus, CheckCircle2, Circle, ChevronRight } from 'lucide-react';

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

export const ProjectControl: React.FC = () => {
  const [projects] = useState<ArchitecturalProject[]>([
    {
      id: '1',
      client: 'Família Souza',
      name: 'Residência Alpha',
      type: 'Residencial',
      progress: 60,
      deadline: '15/08/2026',
      phases: [
        { id: 'p1', name: 'Levantamento e Briefing', completed: true },
        { id: 'p2', name: 'Estudo Preliminar', completed: true },
        { id: 'p3', name: 'Anteprojeto', completed: true },
        { id: 'p4', name: 'Projeto Legal (Aprovação)', completed: false },
        { id: 'p5', name: 'Projeto Executivo', completed: false },
        { id: 'p6', name: 'Detalhamento de Interiores', completed: false },
      ]
    },
    {
      id: '2',
      client: 'Tech Solutions',
      name: 'Escritório Sede',
      type: 'Comercial',
      progress: 25,
      deadline: '30/09/2026',
      phases: [
        { id: 'p1', name: 'Levantamento e Briefing', completed: true },
        { id: 'p2', name: 'Estudo Preliminar', completed: false },
        { id: 'p3', name: 'Anteprojeto', completed: false },
        { id: 'p4', name: 'Projeto Executivo', completed: false },
      ]
    }
  ]);

  const [filter, setFilter] = useState('');
  const [expandedProject, setExpandedProject] = useState<string | null>('1');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.client.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Controle de Projetos</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Acompanhe as fases dos seus projetos arquitetônicos</p>
        </div>
        <button className="btn-primary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
        <input 
          type="text" 
          placeholder="Buscar por cliente ou projeto..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '14px 16px 14px 48px', 
            borderRadius: 16, 
            border: '1px solid var(--border-light)', 
            backgroundColor: 'var(--bg-elevated)', 
            color: 'var(--text-main)',
            fontSize: 15
          }} 
        />
      </div>

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
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{project.client} • {project.type}</span>
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

            {expandedProject === project.id && (
              <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>FASES DO PROJETO</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Prazo: <strong style={{ color: 'var(--text-main)' }}>{project.deadline}</strong></span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {project.phases.map((phase, index) => (
                    <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: phase.completed ? '#10B981' : 'var(--text-muted)' }}>
                        {phase.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </button>
                      <span style={{ fontSize: 14, color: phase.completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: phase.completed ? 'line-through' : 'none', flex: 1 }}>
                        {index + 1}. {phase.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                <button className="btn-secondary" style={{ width: '100%', marginTop: 20, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
                  Adicionar Nova Fase
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
