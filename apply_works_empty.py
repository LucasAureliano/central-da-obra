import os

works_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Works.tsx"
content = open(works_path, encoding='utf-8').read()

# I will replace the works array with a state to allow clearing it.
old_works = """  const works = [
    {
      id: 'work-1',"""
new_works = """  import { useState } from 'react';
  import { EmptyState } from './EmptyState';
  
  // inside component:
  const [works, setWorks] = useState([
    {
      id: 'work-1',"""

# Oh, wait. I will just rewrite Works.tsx completely using a script.
new_content = """import { useState } from 'react';
import { 
  MapPin, 
  Plus,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface WorksProps {
  onWorkSelect: (id: string | null) => void;
}

export function Works({ onWorkSelect }: WorksProps) {
  
  const [works, setWorks] = useState([
    {
      id: 'work-1',
      name: 'Residencial Alpha',
      address: 'Av. das Acácias, 1000 - Centro',
      status: 'Em andamento',
      progress: 35,
      budget: 'R$ 850.000,00',
      deadline: 'Dez 2024',
      image: 'https://images.unsplash.com/photo-1541888081622-19e5d424b94a?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'work-2',
      name: 'Galpão Logístico',
      address: 'Rodovia BR-101, Km 45',
      status: 'Atrasada',
      progress: 72,
      budget: 'R$ 2.400.000,00',
      deadline: 'Out 2024',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop'
    }
  ]);

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, gap: 24 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)' }}>Obras</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-icon" onClick={() => setWorks([])} style={{ height: 40, width: 40 }} title="Test Empty State">
            <Trash2 size={18} color="var(--color-danger)" />
          </button>
          <button className="btn-primary" style={{ padding: '0 16px', height: 40, borderRadius: 12 }}>
            <Plus size={20} />
            <span>Nova</span>
          </button>
        </div>
      </div>

      {works.length === 0 ? (
        <div style={{ marginTop: 32, height: '60vh' }}>
          <EmptyState 
            imageSrc="/assets/empty_works.jpg"
            title="Nenhuma obra iniciada"
            description="Você ainda não possui obras cadastradas. Adicione seu primeiro projeto para começar a gerenciar."
            actionLabel="Criar Primeira Obra"
            onAction={() => alert('Nova obra')}
          />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: 4 }}>
              Todas ({works.length})
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>
              Em Andamento
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>
              Concluídas
            </div>
          </div>

          {/* List of Works */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {works.map((work, index) => (
              <div key={work.id} className={`card-premium card-premium-interactive animate-stagger-${Math.min((index + 1), 5)}`} style={{ padding: 0, overflow: 'hidden' }} onClick={() => onWorkSelect(work.id)}>
                
                {/* Image Thumbnail Header */}
                <div style={{ height: 120, position: 'relative' }}>
                  <img src={work.image} alt={work.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {/* Dark Gradient Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
                  
                  <div style={{ position: 'absolute', top: 16, right: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                      <MoreVertical size={20} color="#FFF" />
                    </div>
                  </div>
                  
                  <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFF' }}>{work.name}</h3>
                    <span className={`status-chip ${work.progress === 100 ? 'status-active' : work.progress > 50 ? 'status-warning' : 'status-danger'}`} style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#FFF' }}>
                      {work.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: 20 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                    <MapPin size={14} />
                    {work.address}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Orçamento</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{work.budget}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Prazo Final</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{work.deadline}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>
                      <span>Progresso</span>
                      <span>{work.progress}%</span>
                    </div>
                    <div style={{ height: 6, backgroundColor: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${work.progress}%`, height: '100%', backgroundColor: work.progress === 100 ? 'var(--color-success)' : 'var(--color-primary)', borderRadius: 3, transition: 'width 1s ease-out' }} />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
"""
open(works_path, 'w', encoding='utf-8').write(new_content)
print("Works updated")
