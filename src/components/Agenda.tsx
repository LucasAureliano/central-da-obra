import React, { useState } from 'react';
import { MapPin, ChevronRight, Calendar as CalendarIcon, Clock, User, Briefcase, AlignLeft, Plus, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { TiltCard } from './TiltCard';

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
      setEvents([]);
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

  return (
    <div className="screen-content hide-scrollbar animate-fade-in" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden' }}>
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              <ChevronLeft size={16} /> Voltar
            </button>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>Novo Agendamento</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Título</label>
                <input type="text" className="input-premium" style={{ width: '100%' }} placeholder="Ex: Vistoria da Obra" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Data</label>
                  <div style={{ position: 'relative' }}>
                    <input type="date" className="input-premium" style={{ width: '100%' }} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Horário</label>
                  <div style={{ position: 'relative' }}>
                    <input type="time" className="input-premium" style={{ width: '100%' }} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Cliente</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" className="input-premium" style={{ width: '100%', paddingLeft: 44 }} placeholder="Nome do cliente" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Obra Vinculada</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" className="input-premium" style={{ width: '100%', paddingLeft: 44 }} placeholder="Selecione a obra..." value={formData.work} onChange={e => setFormData({...formData, work: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Localização / Endereço</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" className="input-premium" style={{ width: '100%', paddingLeft: 44 }} placeholder="Endereço do evento" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Observações</label>
                <div style={{ position: 'relative' }}>
                  <AlignLeft size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 16 }} />
                  <textarea className="input-premium" style={{ width: '100%', paddingLeft: 44, minHeight: 100 }} placeholder="Notas adicionais..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave} 
                className="btn-primary" 
                style={{ marginTop: 16, width: '100%', padding: '14px 0', borderRadius: 12, fontSize: 16 }}
              >
                Salvar Agendamento
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>Agenda {isArchitect ? 'Técnica' : 'de Serviços'}</h1>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Compromissos e visitas</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowForm(true)} 
                className="btn-primary" 
                style={{ width: 48, height: 48, borderRadius: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={24} />
              </motion.button>
            </div>

            <div style={{ display: 'flex', backgroundColor: 'var(--bg-elevated)', borderRadius: 16, padding: 4, marginBottom: 24 }}>
              {(['Dia', 'Semana', 'Mês'] as const).map(v => (
                <button 
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none',
                    backgroundColor: view === v ? 'var(--color-primary)' : 'transparent',
                    color: view === v ? '#FFF' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  {v}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }} className="hide-scrollbar">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
                <motion.div 
                  whileHover={{ y: -2 }}
                  key={i} 
                  className={`glass-panel ${i === 3 ? '' : 'text-muted'}`} 
                  style={{ 
                    minWidth: 54, textAlign: 'center', padding: '12px 4px', borderRadius: 16,
                    border: i === 3 ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
                    backgroundColor: i === 3 ? 'var(--color-primary-alpha)' : 'var(--bg-surface)'
                  }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: i === 3 ? 'var(--color-primary)' : 'var(--text-muted)', marginBottom: 4 }}>{day}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: i === 3 ? 'var(--text-main)' : 'var(--text-muted)' }}>{13 + i}</div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Hoje</h3>
                 <span style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 700 }}>{events.length} Eventos</span>
              </div>
              
              {events.length === 0 ? (
                 <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                   <CalendarIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                   <p>Nenhum evento agendado para hoje.</p>
                 </div>
              ) : (
                <AnimatePresence>
                  {events.map((event, index) => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TiltCard style={{ padding: '20px', borderRadius: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>{event.time}</span>
                          <span style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>{event.duration}</span>
                        </div>
                        
                        <div style={{ width: 4, height: 48, backgroundColor: 'var(--color-primary)', borderRadius: 2, flexShrink: 0 }}></div>
                        
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                          <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</h4>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {event.location && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                                <MapPin size={12} color="var(--color-primary)" /> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{event.location}</span>
                              </div>
                            )}
                            {event.client && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                                <User size={12} /> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{event.client}</span>
                              </div>
                            )}
                          </div>
                          {event.location && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`;
                                window.open(mapsUrl, '_blank');
                              }}
                              style={{
                                alignSelf: 'flex-start',
                                marginTop: 8,
                                padding: '6px 12px',
                                borderRadius: 8,
                                fontSize: 11,
                                fontWeight: 700,
                                backgroundColor: 'var(--color-primary-alpha)',
                                color: 'var(--color-primary)',
                                border: '1px solid var(--color-primary-alpha)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              className="hover-scale"
                            >
                              <MapPin size={12} /> Rotas
                            </button>
                          )}
                        </div>
                        
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8 }}>
                          <ChevronRight size={20} />
                        </button>
                      </TiltCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
