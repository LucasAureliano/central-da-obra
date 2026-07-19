import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Camera, FileText, CheckCircle, Info } from 'lucide-react';

export function PortalTimeline({ workId }: { workId: string }) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const q = query(
          collection(db, `works/${workId}/timeline`),
          orderBy('date', 'desc')
        );
        const snap = await getDocs(q);
        
        const events = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTimeline(events);
      } catch (err) {
        console.error('Error fetching timeline:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTimeline();
  }, [workId]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera size={16} />;
      case 'document': return <FileText size={16} />;
      case 'milestone': return <CheckCircle size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'photo': return 'var(--color-primary)';
      case 'document': return '#3B82F6';
      case 'milestone': return '#10B981';
      default: return 'var(--text-muted)';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        Carregando linha do tempo...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Linha do Tempo</h2>
      
      {timeline.length === 0 ? (
        <div className="card-premium" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
            <Camera size={24} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Nenhuma atualização ainda</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>As fotos, relatórios e marcos da sua obra aparecerão aqui.</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          {/* Timeline Line */}
          <div style={{ position: 'absolute', left: 11, top: 20, bottom: 0, width: 2, backgroundColor: 'var(--border-subtle)' }} />
          
          {timeline.map((event, index) => (
            <div key={event.id} style={{ position: 'relative', marginBottom: index === timeline.length - 1 ? 0 : 32 }}>
              {/* Timeline Dot */}
              <div style={{ 
                position: 'absolute', 
                left: -33, 
                top: 0, 
                width: 24, 
                height: 24, 
                borderRadius: 12, 
                backgroundColor: 'var(--bg-base)', 
                border: `2px solid ${getEventColor(event.type)}`,
                color: getEventColor(event.type),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="card-premium" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)' }}>{event.title}</h3>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                    {event.date ? new Date(event.date).toLocaleDateString('pt-BR') : ''}
                  </span>
                </div>
                
                {event.description && (
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                    {event.description}
                  </p>
                )}
                
                {event.imageUrl && (
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
