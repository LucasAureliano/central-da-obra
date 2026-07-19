import { useState, useEffect } from 'react';
import { Camera, Sun, Plus, FileText, Calendar, Search, X, Loader2, CloudRain, Cloud, Check } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface JournalEntry {
  id: string;
  date: string;
  observations: string;
  materials: string;
  climate: string;
  photos: string[];
  responsible: string;
  createdAt: any;
}

export function TechnicalJournal() {
  const { activeWork } = useWorks();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    climate: 'Ensolarado',
    observations: '',
    materials: '',
  });

  useEffect(() => {
    if (!activeWork) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'works', activeWork.id, 'journal'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
      setEntries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeWork]);

  const handleSave = async () => {
    if (!activeWork || !profile) return;
    if (!newEntry.observations.trim()) return;
    
    setSaving(true);
    try {
      await addDoc(collection(db, 'works', activeWork.id, 'journal'), {
        ...newEntry,
        responsible: profile.name || 'Arquiteto',
        photos: [], // Mocked for now
        createdAt: serverTimestamp()
      });
      
      await addDoc(collection(db, 'works', activeWork.id, 'timeline'), {
        type: 'journal',
        date: serverTimestamp(),
        description: 'Diário de Obra registrado',
        user: profile.name || 'Arquiteto'
      });
      
      setIsModalOpen(false);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        climate: 'Ensolarado',
        observations: '',
        materials: '',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const filteredEntries = entries.filter(e => e.observations?.toLowerCase().includes(searchQuery.toLowerCase()) || e.date?.includes(searchQuery));

  const climateOptions = [
    { label: 'Ensolarado', icon: <Sun size={20} color="#F59E0B" /> },
    { label: 'Nublado', icon: <Cloud size={20} color="#9CA3AF" /> },
    { label: 'Chuvoso', icon: <CloudRain size={20} color="#3B82F6" /> },
  ];

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
          Diário Técnico
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
          Acompanhamento de campo, clima e andamento das obras.
        </p>
      </div>

      {/* Actions & Filters */}
      <div className="animate-stagger-2" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
          <input 
            type="text" 
            placeholder="Buscar registros..."
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
          Novo Registro
        </button>
      </div>

      {/* Stats/Weather Cards */}
      <div className="animate-stagger-3 hide-scrollbar" style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, marginBottom: 16 }}>
        {[
          { icon: <Sun size={24} color="#F59E0B" />, label: 'Clima Hoje', value: entries[0]?.climate || 'N/A', sub: entries[0]?.date || '' },
          { icon: <Camera size={24} color="#3B82F6" />, label: 'Fotos Registradas', value: entries.reduce((acc, e) => acc + (e.photos?.length || 0), 0), sub: 'Total' },
          { icon: <FileText size={24} color="#10B981" />, label: 'Registros', value: entries.length, sub: 'Até o momento' },
        ].map((stat, i) => (
          <div key={i} className="card-premium" style={{ minWidth: 160, flex: 1, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)' }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Entries List */}
      <div className="animate-stagger-4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredEntries.length > 0 ? (
          filteredEntries.map(entry => (
            <div key={entry.id} className="card-premium" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                    Responsável: {entry.responsible}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: 'var(--bg-base)', borderRadius: 12 }}>
                  {entry.climate === 'Ensolarado' && <Sun size={16} color="#F59E0B" />}
                  {entry.climate === 'Nublado' && <Cloud size={16} color="#9CA3AF" />}
                  {entry.climate === 'Chuvoso' && <CloudRain size={16} color="#3B82F6" />}
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{entry.climate}</span>
                </div>
              </div>

              {entry.observations && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Observações</div>
                  <div style={{ fontSize: 15, color: 'var(--text-main)', lineHeight: 1.5 }}>{entry.observations}</div>
                </div>
              )}

              {entry.materials && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Materiais / Equipamentos</div>
                  <div style={{ fontSize: 15, color: 'var(--text-main)', lineHeight: 1.5 }}>{entry.materials}</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Calendar size={32} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
              Nenhum registro ainda
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 300, lineHeight: 1.5 }}>
              Comece documentando o andamento da obra, condições climáticas e ocorrências diárias.
            </p>
          </div>
        )}
      </div>

      {/* Modal Novo Registro */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 1000, paddingBottom: 0 }}>
          <div className="animate-slide-up" style={{ width: '100%', backgroundColor: 'var(--bg-surface)', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Novo Diário de Obra</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: 8, backgroundColor: 'var(--bg-base)', borderRadius: 16 }}>
                <X size={20} color="var(--text-main)" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Data</label>
                <input 
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Clima</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {climateOptions.map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => setNewEntry({...newEntry, climate: opt.label})}
                      style={{ 
                        flex: 1, padding: '12px', borderRadius: 16, border: '1px solid',
                        borderColor: newEntry.climate === opt.label ? 'var(--primary)' : 'var(--border-subtle)',
                        backgroundColor: newEntry.climate === opt.label ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--bg-base)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
                      }}
                    >
                      {opt.icon}
                      <span style={{ fontSize: 13, fontWeight: 500, color: newEntry.climate === opt.label ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Observações do Dia</label>
                <textarea 
                  placeholder="O que aconteceu na obra hoje?"
                  value={newEntry.observations}
                  onChange={(e) => setNewEntry({...newEntry, observations: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15, minHeight: 120, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Materiais e Equipamentos (Opcional)</label>
                <textarea 
                  placeholder="Chegou material? Usou maquinário específico?"
                  value={newEntry.materials}
                  onChange={(e) => setNewEntry({...newEntry, materials: e.target.value})}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontSize: 15, minHeight: 80, resize: 'vertical' }}
                />
              </div>

              <button 
                className="btn-primary" 
                onClick={handleSave}
                disabled={saving || !newEntry.observations.trim()}
                style={{ padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 600, width: '100%', marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                {saving ? 'Salvando...' : 'Salvar Diário'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
