import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, writeBatch, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { generateDefaultStages } from '../../lib/ChecklistGenerator';
import type { Stage } from '../../lib/ChecklistGenerator';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Rocket, Plus, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export function TimelineView({ workId }: { workId: string }) {
  const { profile } = useAuth();
  const isOwner = profile?.role === 'owner';
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedStageId, setSelectedStageId] = useState<string>('');

  useEffect(() => {
    const q = query(collection(db, `works/${workId}/stages`), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Stage));
      setStages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [workId]);

  const handleGenerateDefault = async () => {
    setGenerating(true);
    const defaultStages = generateDefaultStages();
    const batch = writeBatch(db);
    
    defaultStages.forEach(stage => {
      const stageRef = doc(collection(db, `works/${workId}/stages`));
      batch.set(stageRef, stage);
    });

    await batch.commit();
    setGenerating(false);
  };

  const toggleTask = async (stage: Stage, taskId: string, isCompleted: boolean) => {
    if (isOwner) return;
    
    const updatedTasks = stage.tasks.map(t => 
      t.id === taskId ? { ...t, isCompleted: !isCompleted } : t
    );
    
    const stageRef = doc(db, `works/${workId}/stages`, stage.id);
    await updateDoc(stageRef, { tasks: updatedTasks });
    
    // Log history event if checking as done
    if (!isCompleted) {
      const taskObj = stage.tasks.find(t => t.id === taskId);
      if (taskObj) {
        const historyRef = doc(collection(db, `works/${workId}/history`));
        await writeBatch(db).set(historyRef, {
          title: `Tarefa concluída: ${taskObj.title}`,
          type: 'task_completed',
          date: new Date(),
        }).commit();
      }
    }
    
    // Auto calculate progress
    calculateAndUpdateProgress(stages.map(s => s.id === stage.id ? { ...s, tasks: updatedTasks } : s));
  };

  const calculateAndUpdateProgress = async (allStages: Stage[]) => {
    let total = 0;
    let completed = 0;
    
    allStages.forEach(s => {
      s.tasks.forEach(t => {
        total++;
        if (t.isCompleted) completed++;
      });
    });

    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    const workRef = doc(db, 'works', workId);
    await updateDoc(workRef, { progress });
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStageId || !newTaskTitle) return;
    
    const stage = stages.find(s => s.id === selectedStageId);
    if (!stage) return;

    const newTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle,
      isCompleted: false
    };

    const updatedTasks = [...stage.tasks, newTask];
    const stageRef = doc(db, `works/${workId}/stages`, stage.id);
    
    await updateDoc(stageRef, { tasks: updatedTasks });
    toast.success('Tarefa adicionada com sucesso!');
    setIsTaskModalOpen(false);
    setNewTaskTitle('');
  };

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Carregando cronograma...</div>;
  }

  if (stages.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', marginTop: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255, 107, 0, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Rocket size={32} color="var(--color-primary)" />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Cronograma Vazio</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>Esta obra ainda não possui etapas definidas.</p>
        {!isOwner && (
          <button 
            className="btn-primary" 
            onClick={handleGenerateDefault} 
            disabled={generating}
            style={{ padding: '12px 24px', borderRadius: 12, fontWeight: 600 }}
          >
            {generating ? 'Gerando...' : 'Carregar Modelo Padrão'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 20px', paddingBottom: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Linha do Tempo</h3>
        {!isOwner && (
          <button 
            onClick={() => {
              if (stages.length > 0) setSelectedStageId(stages[0].id);
              setIsTaskModalOpen(true);
            }} 
            className="btn-primary" 
            style={{ padding: '8px 16px', borderRadius: 12, display: 'flex', gap: 8, fontSize: 13 }}
          >
            <Plus size={16} /> Nova Tarefa
          </button>
        )}
      </div>
      
      <div style={{ position: 'relative' }}>
        {/* Vertical Line */}
        <div style={{ position: 'absolute', left: 24, top: 20, bottom: 20, width: 2, backgroundColor: 'var(--border-subtle)', zIndex: 0 }} />

        {stages.map((stage) => {
          const isExpanded = expandedStageId === stage.id;
          const completedTasks = stage.tasks.filter(t => t.isCompleted).length;
          const totalTasks = stage.tasks.length;
          const isStageDone = completedTasks === totalTasks && totalTasks > 0;

          return (
            <div key={stage.id} style={{ position: 'relative', zIndex: 1, marginBottom: 16 }}>
              {/* Stage Header */}
              <div 
                className="glass-panel card-premium-interactive"
                onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 16, 
                  border: isStageDone ? '1px solid var(--color-success)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: isStageDone ? 'var(--color-success)' : 'var(--bg-elevated)', border: `2px solid ${isStageDone ? 'var(--color-success)' : 'var(--text-muted)'}`, zIndex: 2, marginLeft: 2 }} />
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{stage.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{completedTasks} de {totalTasks} tarefas concluídas</p>
                </div>
                
                {isExpanded ? <ChevronDown size={20} color="var(--text-muted)" /> : <ChevronRight size={20} color="var(--text-muted)" />}
              </div>

              {/* Tasks List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', paddingLeft: 48, marginTop: 12 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {stage.tasks.map(task => (
                        <div 
                          key={task.id}
                          onClick={() => toggleTask(stage, task.id, task.isCompleted)}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', 
                            backgroundColor: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-subtle)',
                            cursor: isOwner ? 'default' : 'pointer',
                            opacity: isOwner && !task.isCompleted ? 0.6 : 1
                          }}
                        >
                          {task.isCompleted ? (
                            <CheckCircle2 size={20} color="var(--color-success)" />
                          ) : (
                            <Circle size={20} color="var(--text-muted)" />
                          )}
                          <span style={{ fontSize: 14, color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.isCompleted ? 'line-through' : 'none', fontWeight: 500 }}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {isTaskModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
              onClick={() => setIsTaskModalOpen(false)}
            />
            
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel" 
              style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '32px 24px', position: 'relative', zIndex: 1 }}
            >
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                style={{ position: 'absolute', top: 24, right: 24, background: 'var(--bg-elevated)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Nova Tarefa</h2>

              <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Etapa *</label>
                  <select 
                    required 
                    value={selectedStageId} 
                    onChange={e => setSelectedStageId(e.target.value)} 
                    className="input-premium"
                  >
                    {stages.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Título da Tarefa *</label>
                  <input 
                    required 
                    value={newTaskTitle} 
                    onChange={e => setNewTaskTitle(e.target.value)} 
                    placeholder="Ex: Instalar tomadas" 
                    className="input-premium"
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <Save size={20} /> Adicionar
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
