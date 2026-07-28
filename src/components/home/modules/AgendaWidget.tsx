import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Clock, PlusCircle } from 'lucide-react';

export function AgendaWidget({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [todayEvents, setTodayEvents] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('co_agenda_events');
      if (stored) {
        const parsed: any[] = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        setTodayEvents(parsed.filter((e: any) => e.date === today));
      }
    } catch {
      setTodayEvents([]);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-panel"
      style={{ padding: 20, borderRadius: 24, marginBottom: 24 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Calendar size={18} color="#3B82F6" />
          Agenda Hoje
        </h3>
        <button
          onClick={() => onNavigate('agenda-completa')}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          Agenda <ChevronRight size={14} />
        </button>
      </div>

      {todayEvents.length === 0 ? (
        /* ── Zero State Premium ── */
        <div style={{
          padding: '28px 16px',
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: 16,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <Calendar size={32} color="#3B82F6" strokeWidth={1.5} />
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Nenhum compromisso hoje
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
            Sua agenda está livre!
          </p>
          <button
            onClick={() => onNavigate('agenda-completa')}
            className="btn-primary"
            style={{
              marginTop: 8,
              padding: '9px 20px',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <PlusCircle size={14} /> Adicionar Compromisso
          </button>
        </div>
      ) : (
        /* ── Lista de eventos ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {todayEvents.map((ev: any, idx: number) => (
            <div
              key={ev.id ?? idx}
              style={{
                padding: 12,
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 12,
                borderLeft: '3px solid #3B82F6',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                  {ev.title ?? ev.client ?? 'Compromisso'}
                </span>
                {ev.time && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {ev.time}
                  </span>
                )}
              </div>
              {ev.type && (
                <span style={{ fontSize: 11, padding: '2px 8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderRadius: 8, display: 'inline-block' }}>
                  {ev.type}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
