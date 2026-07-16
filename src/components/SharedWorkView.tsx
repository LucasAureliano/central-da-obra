import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Briefcase, MapPin, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { CustomLogo } from './CustomLogo';

export function SharedWorkView({ workId, theme }: { workId: string; theme: 'light' | 'dark' }) {
  const [work, setWork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWork() {
      try {
        const docRef = doc(db, 'works', workId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWork({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWork();
  }, [workId]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ color: 'var(--color-primary)' }}>Carregando obra...</div>
      </div>
    );
  }

  if (!work) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-main)' }}>
        Obra não encontrada ou link inválido.
      </div>
    );
  }

  const progress = work.progress || 0;
  const getPhase = (p: number) => {
    if (p === 0) return 'Planejamento';
    if (p <= 25) return 'Fundação';
    if (p <= 60) return 'Estrutura';
    if (p < 100) return 'Acabamento';
    return 'Concluída';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 40 }}>
      <header className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <CustomLogo theme={theme} />
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>
          Acompanhamento de Obra
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card-premium">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
                {work.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
                <MapPin size={16} />
                {work.address || 'Endereço não informado'}
              </div>
            </div>
          </div>

          <div style={{ padding: '20px', backgroundColor: 'var(--bg-elevated)', borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 12 }}>
              <span>Fase Atual: {getPhase(progress)}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ display: 'flex', gap: 4, height: 8 }}>
              {/* Foundation block (0-25%) */}
              <div style={{ flex: 25, backgroundColor: 'var(--bg-base)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, Math.max(0, (progress / 25) * 100))}%`, height: '100%', backgroundColor: '#8B5CF6' }} />
              </div>
              {/* Structure block (25-60%) */}
              <div style={{ flex: 35, backgroundColor: 'var(--bg-base)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, Math.max(0, ((progress - 25) / 35) * 100))}%`, height: '100%', backgroundColor: '#3B82F6' }} />
              </div>
              {/* Finishing block (60-99%) */}
              <div style={{ flex: 39, backgroundColor: 'var(--bg-base)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, Math.max(0, ((progress - 60) / 39) * 100))}%`, height: '100%', backgroundColor: '#F59E0B' }} />
              </div>
              {/* Final block (100%) */}
              <div style={{ flex: 1, backgroundColor: 'var(--bg-base)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: progress === 100 ? '100%' : '0%', height: '100%', backgroundColor: '#10B981' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <div className="card-premium">
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} /> Resumo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Status</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 14 }}>{work.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Previsão de Entrega</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 14 }}>{work.deadline ? new Date(work.deadline).toLocaleDateString('pt-BR') : 'Não definida'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cliente</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 14 }}>{work.client || 'Não informado'}</span>
              </div>
            </div>
          </div>

          <div className="card-premium">
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} /> Etapas Recentes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Planejamento e Projetos', done: progress > 0 },
                { label: 'Fundação e Baldrame', done: progress >= 25 },
                { label: 'Alvenaria e Estrutura', done: progress >= 60 },
                { label: 'Acabamentos e Pintura', done: progress >= 90 },
                { label: 'Entrega das Chaves', done: progress === 100 },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', color: step.done ? 'var(--text-main)' : 'var(--text-muted)', opacity: step.done ? 1 : 0.5 }}>
                  {step.done ? <CheckCircle2 size={18} color="var(--color-success)" /> : <Circle size={18} />}
                  <span style={{ fontSize: 14, fontWeight: step.done ? 600 : 400 }}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
