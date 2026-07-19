import React, { useState } from 'react';
import { MapPin, ChevronRight, Calendar as CalendarIcon, Clock, User, Briefcase, AlignLeft, Plus, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

type EventStatus = 'Agendado' | 'Em andamento' | 'Finalizado' | 'Cancelado';

interface AgendaEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  type: string;
  client: string;
  work: string;
  notes: string;
  status: EventStatus;
}

export function Agenda() {
  const { user, isGuest } = useAuth();
  const { profile } = useAuth();
  const isArchitect = profile?.role === 'architect';
  
  const [view, setView] = useState<'Dia' | 'Semana' | 'Mês'>('Dia');
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [formData, setFormData] = useState({ title: '', date: '', time: '', client: '', work: '', location: '', notes: '' });

  React.useEffect(() => {
    if (user && !isGuest) {
      loadEvents();
    } else {
      setEvents([
        { id: '1', title: isArchitect ? 'Vistoria da Fundação' : 'Pintura Externa', date: '2026-07-16', time: '09:00', duration: '2h', location: 'Edifício Horizon', type: isArchitect ? 'Vistoria' : 'Serviço', client: 'João Silva', work: 'Obra Horizon', notes: 'Verificar alinhamento e documentação', status: 'Agendado' },
        { id: '2', title: isArchitect ? 'Reunião de Compatibilização' : 'Manutenção Elétrica', date: '2026-07-16', time: '14:30', duration: '1h', location: 'Escritório Central', type: 'Reunião', client: 'Condomínio Alpha', work: 'Reforma', notes: 'Trazer planta revisada', status: 'Agendado' }
      ]);
    }
  }, [user, isGuest]);

  const loadEvents = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'users', user.uid, 'calendar'));
      const snap = await getDocs(q);
      const evs = snap.docs.map(d => ({ id: d.id, ...d.data() } as AgendaEvent));
      evs.sort((a, b) => a.time.localeCompare(b.time));
      setEvents(evs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (isGuest) {
      alert("Visitantes não podem salvar.");
      return;
    }
    if (!user || !formData.title || !formData.date || !formData.time) {
      alert("Preencha título, data e hora.");
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'calendar'), {
        ...formData,
        duration: '1h',
        type: 'Geral',
        status: 'Agendado',
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setFormData({ title: '', date: '', time: '', client: '', work: '', location: '', notes: '' });
      loadEvents();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar.");
    }
  };

  if (showForm) {
    return (
      <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24, fontSize: 14, fontWeight: 600 }}>
          <ChevronLeft size={16} /> Voltar
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>Novo Agendamento</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label className="input-label">Título</label>
            <input type="text" className="input-field" placeholder="Ex: Vistoria da Obra" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Data</label>
              <div style={{ position: 'relative' }}>
                <CalendarIcon size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 16 }} />
                <input type="date" className="input-field" style={{ paddingLeft: 44 }} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Horário</label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 16 }} />
                <input type="time" className="input-field" style={{ paddingLeft: 44 }} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Cliente</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 16 }} />
              <input type="text" className="input-field" style={{ paddingLeft: 44 }} placeholder="Nome do cliente" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Obra Vinculada</label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 16 }} />
              <input type="text" className="input-field" style={{ paddingLeft: 44 }} placeholder="Selecione a obra..." value={formData.work} onChange={e => setFormData({...formData, work: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Localização / Endereço</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 16 }} />
              <input type="text" className="input-field" style={{ paddingLeft: 44 }} placeholder="Endereço do evento" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Observações</label>
            <div style={{ position: 'relative' }}>
              <AlignLeft size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 16 }} />
              <textarea className="input-field" style={{ paddingLeft: 44, minHeight: 100 }} placeholder="Notas adicionais..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
            </div>
          </div>
          <button onClick={handleSave} className="btn-primary" style={{ marginTop: 16, width: '100%', padding: '14px 0', borderRadius: 12, fontSize: 16 }}>
            Salvar Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Agenda {isArchitect ? 'Técnica' : 'de Serviços'}</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Compromissos e visitas técnicas</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary" style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', backgroundColor: 'var(--bg-elevated)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
        {(['Dia', 'Semana', 'Mês'] as const).map(v => (
          <button 
            key={v}
            onClick={() => setView(v)}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none',
              backgroundColor: view === v ? 'var(--color-primary)' : 'transparent',
              color: view === v ? '#FFF' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            {v}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }} className="hide-scrollbar">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
          <div key={i} className={`card-premium ${i === 3 ? '' : 'text-muted'}`} style={{ 
            minWidth: 50, textAlign: 'center', padding: '10px 4px', 
            borderColor: i === 3 ? 'var(--color-primary)' : 'var(--border-light)',
            backgroundColor: i === 3 ? 'var(--color-primary-light)' : 'var(--bg-surface)'
          }}>
            <div className="text-xs">{day}</div>
            <div className={`text-base font-bold ${i === 3 ? 'text-primary' : ''}`}>{13 + i}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
        <h3 className="text-sm font-bold text-muted">Hoje</h3>
        {events.map(event => (
          <div key={event.id} className="glass-panel flex-row-center" style={{ gap: 16, padding: '16px', borderRadius: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 45 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{event.time}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{event.duration}</span>
            </div>
            
            <div style={{ width: 3, height: 48, backgroundColor: 'var(--color-primary)', borderRadius: 2 }}></div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{event.title}</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                  <MapPin size={12} /> {event.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                  <User size={12} /> {event.client}
                </div>
              </div>
            </div>
            
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
              <ChevronRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
