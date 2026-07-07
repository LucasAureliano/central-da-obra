import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { CloudRain, Sun, Cloud, Users, Send, MessageSquare } from 'lucide-react';

interface WorkDiaryProps {
  workId: string;
}

type WeatherType = 'sun' | 'cloud' | 'rain';

interface DiaryEntry {
  id: string;
  userId: string;
  userName: string;
  description: string;
  weather: WeatherType;
  workersCount: number;
  createdAt: any;
}

export function WorkDiary({ workId }: WorkDiaryProps) {
  const { user, profile, isGuest } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [description, setDescription] = useState('');
  const [weather, setWeather] = useState<WeatherType>('sun');
  const [workersCount, setWorkersCount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'works', workId, 'diary'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiaryEntry));
      setEntries(data);
    });
    return () => unsubscribe();
  }, [workId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isGuest || !description.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'works', workId, 'diary'), {
        userId: user.uid,
        userName: profile?.name || user.email?.split('@')[0] || 'Usuário',
        userRole: profile?.role || 'owner',
        description: description.trim(),
        weather,
        workersCount: parseInt(workersCount) || 0,
        createdAt: serverTimestamp()
      });
      setDescription('');
      setWorkersCount('');
      setWeather('sun');
    } catch (error) {
      console.error('Error adding diary entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWeatherIcon = (w: WeatherType) => {
    switch(w) {
      case 'sun': return <Sun size={18} color="#F59E0B" />;
      case 'cloud': return <Cloud size={18} color="#9CA3AF" />;
      case 'rain': return <CloudRain size={18} color="#3B82F6" />;
      default: return <Sun size={18} />;
    }
  };

  const getWeatherLabel = (w: WeatherType) => {
    switch(w) {
      case 'sun': return 'Ensolarado';
      case 'cloud': return 'Nublado';
      case 'rain': return 'Chuvoso';
      default: return 'Desconhecido';
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Input Form */}
      {!isGuest && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: 20, borderRadius: 16, marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={18} color="var(--color-primary)" />
            Novo Registro
          </h3>
          
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="O que foi feito na obra hoje?"
            className="input-premium"
            style={{ width: '100%', minHeight: 100, padding: 16, borderRadius: 12, marginBottom: 16, resize: 'vertical' }}
            required
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Condição do Tempo</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['sun', 'cloud', 'rain'] as WeatherType[]).map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeather(w)}
                    style={{ 
                      flex: 1, 
                      padding: '8px 0', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      borderRadius: 8,
                      border: weather === w ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: weather === w ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)',
                      cursor: 'pointer'
                    }}
                  >
                    {getWeatherIcon(w)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Efetivo na Obra</label>
              <div style={{ position: 'relative' }}>
                <Users size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
                <input 
                  type="number" 
                  value={workersCount}
                  onChange={(e) => setWorkersCount(e.target.value)}
                  placeholder="Qtd de pessoas"
                  className="input-premium"
                  style={{ width: '100%', padding: '8px 12px 8px 36px' }}
                />
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !description.trim()}
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          >
            {isSubmitting ? <div style={{width:20,height:20,border:'2px solid #fff',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/> : <Send size={18} />}
            {isSubmitting ? 'Salvando...' : 'Registrar no Diário'}
          </button>
        </form>
      )}

      {/* Timeline Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Histórico da Obra</h3>
        
        {entries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Nenhum registro encontrado no diário.</p>
        ) : (
          <div style={{ position: 'relative', paddingLeft: 20 }}>
            {/* Linha vertical central da timeline */}
            <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, backgroundColor: 'var(--border-subtle)' }} />
            
            {entries.map((entry) => (
              <div key={entry.id} className="animate-fade-in" style={{ position: 'relative', marginBottom: 24 }}>
                {/* Dot */}
                <div style={{ position: 'absolute', left: 0, top: 8, width: 10, height: 10, borderRadius: 5, backgroundColor: 'var(--color-primary)', border: '2px solid var(--bg-main)' }} />
                
                <div className="glass-panel" style={{ marginLeft: 24, padding: 16, borderRadius: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, marginBottom: 2 }}>
                        {entry.createdAt?.toDate ? new Date(entry.createdAt.toDate()).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Hoje'}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        por {entry.userName || 'Usuário'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {entry.workersCount > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                          <Users size={12} /> {entry.workersCount} peão(ões)
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                        {getWeatherIcon(entry.weather)} {getWeatherLabel(entry.weather)}
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
