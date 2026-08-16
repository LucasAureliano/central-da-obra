import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Search, TrendingUp, Clock, Loader2, Check, X, CheckCircle2 } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatDate } from '../../utils/formatters';

interface Stage {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: any;
}

export function Schedule() {
  const { activeWork } = useWorks();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newStage, setNewStage] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    progress: 0,
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
  });

  useEffect(() => {
    if (!activeWork) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'works', activeWork.id, 'schedule'), orderBy('startDate', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stage));
      setStages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeWork]);

  const handleSave = async () => {
    if (!activeWork || !profile) return;
    if (!newStage.name.trim()) return;

    setSaving(true);
    try {
      await addDoc(collection(db, 'works', activeWork.id, 'schedule'), {
        ...newStage,
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, 'works', activeWork.id, 'timeline'), {
        type: 'schedule',
        date: serverTimestamp(),
        description: `Nova etapa no cronograma: ${newStage.name}`,
        user: profile.name || 'Arquiteto'
      });

      setIsModalOpen(false);
      setNewStage({
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 0,
        status: 'pending',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProgress = async (stageId: string, newProgress: number, currentName: string) => {
    if (!activeWork || !profile) return;
    const status = newProgress === 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'pending';
    
    try {
      await updateDoc(doc(db, 'works', activeWork.id, 'schedule', stageId), {
        progress: newProgress,
        status
      });

      await addDoc(collection(db, 'works', activeWork.id, 'timeline'), {
        type: 'schedule',
        date: serverTimestamp(),
        description: `Avanço atualizado: ${currentName} (${newProgress}%)`,
        user: profile.name || 'Arquiteto'
      });
    } catch (error) {
      console.error(error);
    }
  };

  const filteredStages = stages.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const globalProgress = stages.length > 0 
    ? Math.round(stages.reduce((acc, s) => acc + s.progress, 0) / stages.length) 
    : 0;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#3B82F6';
      default: return '#9CA3AF';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 48 }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="screen-content animate-fade-in" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 100 }}>
      {/* Header */}
      <div className="animate-stagger-1" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, letterSpacing: '-0.5px' }}>
          Cronograma e Medições
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
          Acompanhamento físico-financeiro e cronograma de etapas.
        </p>
      </div>

      {/* Actions */}
      <div className="animate-stagger-2" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
          <input 
            type="text" 
            placeholder="Buscar etapas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: 15 }}
          />
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '14px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}
        >
          <Plus size={20} />
          Nova Etapa
        </button>
      </div>

      {/* Overview Cards */}
      <div className="animate-stagger-3 hide-scrollbar" style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, marginBottom: 16 }}>
        {[
          { icon: <TrendingUp size={24} color="#10B981" />, label: 'Avanço Global', value: `${globalProgress}%` },
          { icon: <Clock size={24} color="#F59E0B" />, label: 'Etapas em Andamento', value: stages.filter(s => s.status === 'in_progress').length.toString() },
          { icon: <CheckCircle2 size={24} color="#3B82F6" />, label: 'Etapas Concluídas', value: stages.filter(s => s.status === 'completed').length.toString() },
        ].map((stat, i) => (
          <div key={i} className="card-premium" style={{ minWidth: 160, flex: 1, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Stages List */}
      <div className="animate-stagger-4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredStages.length > 0 ? (
          filteredStages.map(stage => (
            <div key={stage.id} className="card-premium" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: getStatusColor(stage.status) }} />
                    {stage.name}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                    {formatDate(stage.startDate)} até {formatDate(stage.endDate)}
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: getStatusColor(stage.status) }}>
                  {stage.progress}%
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: 8, backgroundColor: 'var(--bg-base)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ width: `${stage.progress}%`, height: '100%', backgroundColor: getStatusColor(stage.status), transition: 'width 0.3s ease' }} />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => handleUpdateProgress(stage.id, Math.min(100, stage.progress + 10), stage.name)}
                  style={{ flex: 1, padding: '8px', borderRadius: 12, backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Plus size={16} /> +10%
                </button>
                <button 
                  onClick={() => handleUpdateProgress(stage.id, 100, stage.name)}
                  style={{ flex: 1, padding: '8px', borderRadius: 12, backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <CheckCircle2 size={16} color="#10B981" /> Concluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <CalendarDays size={32} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
              Nenhuma etapa configurada
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 300, lineHeight: 1.5 }}>
              Crie o cronograma físico da obra para realizar medições e gerenciar pagamentos atrelados ao avanço.
            </p>
          </div>
        )}
      </div>

      {/* Modal Nova Etapa */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 1000, paddingBottom: 0 }}>
          <div className="animate-slide-up" style={{ width: '100%', backgroundColor: 'var(--bg-surface)', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Nova Etapa do Cronograma</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: 8, backgroundColor: 'var(--bg-base)', borderRadius: 16 }}>
                <X size={20} color="var(--text-main)" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Nome da Etapa</label>
                <input 
                  type="text"
                  placeholder="Ex: Fundação, Alvenaria, Pintura..."
                  value={newStage.name}
                  onChange={(e) => setNewStage({...newStage, name: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Data Início</label>
                  <input 
                    type="date"
                    value={newStage.startDate}
                    onChange={(e) => setNewStage({...newStage, startDate: e.target.value})}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Data Fim</label>
                  <input 
                    type="date"
                    value={newStage.endDate}
                    onChange={(e) => setNewStage({...newStage, endDate: e.target.value})}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15 }}
                  />
                </div>
              </div>

              <button 
                className="btn-primary" 
                onClick={handleSave}
                disabled={saving || !newStage.name.trim()}
                style={{ padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 600, width: '100%', marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                {saving ? 'Salvando...' : 'Adicionar Etapa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
