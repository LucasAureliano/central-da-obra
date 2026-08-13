import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Briefcase, MapPin, Calendar, CheckCircle2, Circle, User, Phone, Mail } from 'lucide-react';
import { CustomLogo } from './CustomLogo';

export function SharedWorkView({ token, theme }: { token: string; theme: 'light' | 'dark' }) {
  const [work, setWork] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchWork() {
      try {
        const q = query(collection(db, 'shared_links'), where('token', '==', token));
        const snap = await getDocs(q);
        if (snap.empty) {
          setErrorMsg('Link de compartilhamento inválido ou expirado.');
          return;
        }
        
        const linkData = snap.docs[0].data();
        
        if (linkData.workData) {
          setWork({ id: linkData.workId, ...linkData.workData });
        } else {
          setErrorMsg('Dados da obra indisponíveis.');
        }

        if (linkData.providerProfile) {
          setProviderProfile(linkData.providerProfile);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    }
    fetchWork();
  }, [token]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ color: 'var(--color-primary)' }}>Carregando obra...</div>
      </div>
    );
  }

  if (errorMsg || !work) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-main)' }}>
        {errorMsg || 'Obra não encontrada.'}
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

        {providerProfile && (
          <div className="card-premium" style={{ marginTop: 24, padding: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {providerProfile.companyName || providerProfile.legalName || 'Profissional / Empresa'}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Responsável pela execução/serviços</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {providerProfile.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-main)' }}>
                  <Phone size={16} color="var(--text-muted)" /> {providerProfile.phone}
                </div>
              )}
              {providerProfile.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-main)' }}>
                  <Mail size={16} color="var(--text-muted)" /> {providerProfile.email}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
