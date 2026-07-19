import { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, Search, Loader2, Check, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Inspection {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'completed' | 'issues';
  notes: string;
  responsible: string;
  createdAt: any;
}

export function Inspections() {
  const { activeWork } = useWorks();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newInspection, setNewInspection] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as 'pending' | 'completed' | 'issues',
    notes: '',
  });

  useEffect(() => {
    if (!activeWork) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'works', activeWork.id, 'inspections'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inspection));
      setInspections(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeWork]);

  const handleSave = async () => {
    if (!activeWork || !profile) return;
    if (!newInspection.title.trim()) return;

    setSaving(true);
    try {
      await addDoc(collection(db, 'works', activeWork.id, 'inspections'), {
        ...newInspection,
        responsible: profile.name || 'Arquiteto',
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, 'works', activeWork.id, 'timeline'), {
        type: 'inspection',
        date: serverTimestamp(),
        description: `Vistoria: ${newInspection.title} registrada`,
        user: profile.name || 'Arquiteto'
      });

      setIsModalOpen(false);
      setNewInspection({
        title: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        notes: '',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const filteredInspections = inspections.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.date.includes(searchQuery)
  );

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
          Vistorias
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
          Gerencie inspeções técnicas, checklists e inconformidades.
        </p>
      </div>

      {/* Actions */}
      <div className="animate-stagger-2" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
          <input 
            type="text" 
            placeholder="Buscar vistorias..."
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
          Nova Vistoria
        </button>
      </div>

      {/* Overview Cards */}
      <div className="animate-stagger-3 hide-scrollbar" style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, marginBottom: 16 }}>
        {[
          { icon: <ShieldCheck size={24} color="#10B981" />, label: 'Concluídas', value: inspections.filter(i => i.status === 'completed').length },
          { icon: <ClipboardCheck size={24} color="#F59E0B" />, label: 'Pendentes', value: inspections.filter(i => i.status === 'pending').length },
          { icon: <AlertTriangle size={24} color="#EF4444" />, label: 'Com Inconformidades', value: inspections.filter(i => i.status === 'issues').length },
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

      {/* Inspections List */}
      <div className="animate-stagger-4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredInspections.length > 0 ? (
          filteredInspections.map(inspection => (
            <div key={inspection.id} className="card-premium" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                    {inspection.title}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                    Data: {new Date(inspection.date).toLocaleDateString('pt-BR')} • {inspection.responsible}
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 12,
                  backgroundColor: inspection.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 
                                   inspection.status === 'issues' ? 'rgba(239, 68, 68, 0.1)' : 
                                   'rgba(245, 158, 11, 0.1)'
                }}>
                  {inspection.status === 'completed' && <ShieldCheck size={16} color="#10B981" />}
                  {inspection.status === 'issues' && <AlertTriangle size={16} color="#EF4444" />}
                  {inspection.status === 'pending' && <ClipboardCheck size={16} color="#F59E0B" />}
                  <span style={{ 
                    fontSize: 13, fontWeight: 600,
                    color: inspection.status === 'completed' ? '#10B981' : 
                           inspection.status === 'issues' ? '#EF4444' : 
                           '#F59E0B'
                  }}>
                    {inspection.status === 'completed' ? 'Aprovada' : inspection.status === 'issues' ? 'Inconformidade' : 'Pendente'}
                  </span>
                </div>
              </div>

              {inspection.notes && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notas da Vistoria</div>
                  <div style={{ fontSize: 15, color: 'var(--text-main)', lineHeight: 1.5, backgroundColor: 'var(--bg-base)', padding: 12, borderRadius: 12 }}>
                    {inspection.notes}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <ClipboardCheck size={32} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
              Nenhuma vistoria registrada
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 300, lineHeight: 1.5 }}>
              Crie checklists de inspeção para garantir a qualidade de execução em suas obras.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 1000, paddingBottom: 0 }}>
          <div className="animate-slide-up" style={{ width: '100%', backgroundColor: 'var(--bg-surface)', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Nova Vistoria</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: 8, backgroundColor: 'var(--bg-base)', borderRadius: 16 }}>
                <X size={20} color="var(--text-main)" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Título da Vistoria</label>
                <input 
                  type="text"
                  placeholder="Ex: Vistoria de Fundação"
                  value={newInspection.title}
                  onChange={(e) => setNewInspection({...newInspection, title: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Data</label>
                <input 
                  type="date"
                  value={newInspection.date}
                  onChange={(e) => setNewInspection({...newInspection, date: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Status</label>
                <select 
                  value={newInspection.status}
                  onChange={(e) => setNewInspection({...newInspection, status: e.target.value as any})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15 }}
                >
                  <option value="pending">Pendente</option>
                  <option value="completed">Aprovada</option>
                  <option value="issues">Com Inconformidades</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Notas e Observações</label>
                <textarea 
                  placeholder="O que foi verificado? Algum problema encontrado?"
                  value={newInspection.notes}
                  onChange={(e) => setNewInspection({...newInspection, notes: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15, minHeight: 100, resize: 'vertical' }}
                />
              </div>

              <button 
                className="btn-primary" 
                onClick={handleSave}
                disabled={saving || !newInspection.title.trim()}
                style={{ padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 600, width: '100%', marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                {saving ? 'Salvando...' : 'Salvar Vistoria'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
