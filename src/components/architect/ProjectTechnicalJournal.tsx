import { useState, useEffect } from 'react';
import { BookOpen, Plus, Calendar, Sun, CloudRain, Cloud, Users, Check, X } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface TechnicalJournalProps {
  projectId: string;
}

interface JournalEntry {
  id: string;
  date: string;
  weatherMorning: 'Ensolarado' | 'Chuvoso' | 'Nublado';
  weatherAfternoon: 'Ensolarado' | 'Chuvoso' | 'Nublado';
  team: { role: string; count: number }[];
  activities: string;
  incidents: string;
  photos: string[];
  createdAt: any;
}

export function ProjectTechnicalJournal({ projectId }: TechnicalJournalProps) {
  const { user, isGuest } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weatherMorning: 'Ensolarado' as 'Ensolarado' | 'Chuvoso' | 'Nublado',
    weatherAfternoon: 'Ensolarado' as 'Ensolarado' | 'Chuvoso' | 'Nublado',
    activities: '',
    incidents: '',
  });
  const [teamItems, setTeamItems] = useState([{ role: 'Pedreiro', count: 2 }, { role: 'Servente', count: 2 }]);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (user && !isGuest) {
      loadEntries();
    } else {
      try {
        const local = localStorage.getItem(`co_journal_${projectId}`);
        if (local) setEntries(JSON.parse(local));
        else setEntries([]);
      } catch (e) {
        setEntries([]);
      }
      setLoading(false);
    }
  }, [projectId, user, isGuest]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'works', projectId, 'journal'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const data: JournalEntry[] = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      setEntries(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar diário técnico.');
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!formData.activities) {
      toast.error('Descreva as atividades do dia.');
      return;
    }

    try {
      const newEntry = {
        ...formData,
        team: teamItems,
        photos,
        createdAt: serverTimestamp()
      };

      if (user && !isGuest) {
        await addDoc(collection(db, 'works', projectId, 'journal'), newEntry);
        loadEntries();
        toast.success('Registro adicionado com sucesso!');
      } else {
        const updated = [{ id: crypto.randomUUID(), ...newEntry } as any, ...entries];
        setEntries(updated);
        localStorage.setItem(`co_journal_${projectId}`, JSON.stringify(updated));
        toast.success('Salvo localmente (Visitante).');
      }
      setIsModalOpen(false);
      setFormData({ date: new Date().toISOString().split('T')[0], weatherMorning: 'Ensolarado', weatherAfternoon: 'Ensolarado', activities: '', incidents: '' });
      setTeamItems([{ role: 'Pedreiro', count: 2 }, { role: 'Servente', count: 2 }]);
      setPhotos([]);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar registro.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>Diário de Obra Técnico</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Acompanhamento diário com registros climáticos e de equipe.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '8px 14px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Novo Registro
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : entries.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 16 }}>
          <BookOpen size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Nenhum registro no diário ainda.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entries.map(entry => (
            <div key={entry.id} style={{ backgroundColor: 'var(--bg-elevated)', padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', fontWeight: 700, fontSize: 14 }}>
                    <Calendar size={16} /> {entry.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12, backgroundColor: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: 8 }}>
                    Manhã: 
                    {entry.weatherMorning === 'Ensolarado' && <Sun size={14} color="#F59E0B" />}
                    {entry.weatherMorning === 'Chuvoso' && <CloudRain size={14} color="#3B82F6" />}
                    {entry.weatherMorning === 'Nublado' && <Cloud size={14} color="#9CA3AF" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12, backgroundColor: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: 8 }}>
                    Tarde:
                    {entry.weatherAfternoon === 'Ensolarado' && <Sun size={14} color="#F59E0B" />}
                    {entry.weatherAfternoon === 'Chuvoso' && <CloudRain size={14} color="#3B82F6" />}
                    {entry.weatherAfternoon === 'Nublado' && <Cloud size={14} color="#9CA3AF" />}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
                  <Users size={14} /> Efetivo: {entry.team.reduce((acc, curr) => acc + curr.count, 0)}
                </div>
              </div>
              
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Atividades Realizadas</span>
                <p style={{ fontSize: 13, color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>{entry.activities}</p>
              </div>
              
              {entry.incidents && (
                <div style={{ marginTop: 8, padding: 10, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 8, borderLeft: '3px solid #EF4444' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', display: 'block', marginBottom: 2 }}>Ocorrências / Atrasos</span>
                  <p style={{ fontSize: 13, color: 'var(--text-main)', margin: 0 }}>{entry.incidents}</p>
                </div>
              )}

              {/* Equipe Detalhada */}
              <div style={{ marginTop: 12, padding: 12, backgroundColor: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Efetivo na Obra</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {entry.team.map((t, i) => (
                    <span key={i} style={{ fontSize: 12, color: 'var(--text-main)', backgroundColor: 'var(--bg-elevated)', padding: '4px 10px', borderRadius: 12 }}>
                      {t.count}x {t.role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fotos */}
              {entry.photos && entry.photos.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                  {entry.photos.map((p, i) => (
                    <div key={i} style={{ width: 80, height: 80, borderRadius: 8, backgroundImage: `url(${p})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: 20 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: 500, borderRadius: 24, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Novo Registro Diário</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="input-group">
                  <label>Data</label>
                  <input type="date" className="input-field" style={{ padding: '0 16px' }} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Clima (Manhã)</label>
                  <select className="select-field" value={formData.weatherMorning} onChange={e => setFormData({...formData, weatherMorning: e.target.value as any})}>
                    <option value="Ensolarado">Ensolarado â˜€ï¸</option>
                    <option value="Nublado">Nublado â˜ï¸</option>
                    <option value="Chuvoso">Chuvoso ðŸŒ§ï¸</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="input-group" style={{ gridColumn: '2' }}>
                  <label>Clima (Tarde)</label>
                  <select className="select-field" value={formData.weatherAfternoon} onChange={e => setFormData({...formData, weatherAfternoon: e.target.value as any})}>
                    <option value="Ensolarado">Ensolarado â˜€ï¸</option>
                    <option value="Nublado">Nublado â˜ï¸</option>
                    <option value="Chuvoso">Chuvoso ðŸŒ§ï¸</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Efetivo na Obra</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {teamItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8 }}>
                      <input type="text" className="input-field" style={{ flex: 1, padding: '0 12px' }} placeholder="Cargo (ex: Pedreiro)" value={item.role} onChange={e => {
                        const newTeam = [...teamItems];
                        newTeam[idx].role = e.target.value;
                        setTeamItems(newTeam);
                      }} />
                      <input type="number" className="input-field" style={{ width: 80, padding: '0 12px' }} placeholder="Qtd" value={item.count} onChange={e => {
                        const newTeam = [...teamItems];
                        newTeam[idx].count = parseInt(e.target.value) || 0;
                        setTeamItems(newTeam);
                      }} />
                      <button className="btn-icon" onClick={() => setTeamItems(teamItems.filter((_, i) => i !== idx))}><X size={16} /></button>
                    </div>
                  ))}
                  <button onClick={() => setTeamItems([...teamItems, { role: '', count: 1 }])} style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: 13, fontWeight: 700, textAlign: 'left', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                    <Plus size={14} /> Adicionar Profissional
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>Atividades Realizadas</label>
                <textarea className="input-field" style={{ padding: '12px 16px', minHeight: 80 }} value={formData.activities} onChange={e => setFormData({...formData, activities: e.target.value})} placeholder="Descreva o que foi feito hoje..." />
              </div>

              <div className="input-group">
                <label>Ocorrências (Opcional)</label>
                <textarea className="input-field" style={{ padding: '12px 16px', minHeight: 60 }} value={formData.incidents} onChange={e => setFormData({...formData, incidents: e.target.value})} placeholder="Houve algum problema ou atraso?" />
              </div>
            </div>

            <button className="btn-primary" onClick={saveEntry} style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 20, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Check size={18} /> Salvar Registro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
