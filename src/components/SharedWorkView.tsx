import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Briefcase, MapPin, Calendar, CheckCircle2, Circle, User, Phone, Mail, Image as ImageIcon } from 'lucide-react';
import { CustomLogo } from './CustomLogo';
import { formatDate } from '../utils/formatters';

export function SharedWorkView({ token, theme }: { token: string; theme: 'light' | 'dark' }) {
  const [work, setWork] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [photos, setPhotos] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);

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
        setPermissions(linkData.permissions || []);
        
        if (linkData.workId) {
          const { getDoc, doc } = await import('firebase/firestore');
          try {
            const workSnap = await getDoc(doc(db, 'works', linkData.workId));
            if (workSnap.exists()) {
              setWork({ id: workSnap.id, ...workSnap.data() });
            } else {
              // Try fetching from projects if not found in works
              const projSnap = await getDoc(doc(db, 'projects', linkData.workId));
              if (projSnap.exists()) {
                 setWork({ id: projSnap.id, ...projSnap.data() });
              } else {
                 setErrorMsg('Dados da obra indisponíveis.');
              }
            }
          } catch (e) {
            console.error('Permission denied or error fetching work', e);
            if (linkData.workData) {
              setWork({ id: linkData.workId, ...linkData.workData });
            } else {
              setErrorMsg('Dados da obra protegidos e não cacheados no link.');
            }
          }
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

  // Fetch photos if permitted
  useEffect(() => {
    if (work?.id && permissions.includes('fotos')) {
      const qDocs = query(collection(db, 'works', work.id, 'documents'));
      const unsub = onSnapshot(qDocs, (snap) => {
        const fetchedPhotos: any[] = [];
        snap.forEach(doc => {
          const data = doc.data();
          if (data.type && data.type.startsWith('image/')) {
            fetchedPhotos.push({ id: doc.id, ...data });
          }
        });
        setPhotos(fetchedPhotos);
      }, (err) => {
        console.error("Could not fetch photos due to permissions", err);
      });
      return () => unsub();
    }
  }, [work?.id, permissions]);

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
        <a href="https://centralobra.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', textDecoration: 'none', alignItems: 'center' }}>
          <CustomLogo theme={theme} />
        </a>
        <a href="https://centralobra.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none' }}>
          Acompanhamento de Obra
        </a>
      </header>

      {work.image && (
        <div style={{ width: '100%', height: 240, overflow: 'hidden' }}>
          <img src={work.image} alt={work.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card-premium">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
            {!work.image && (
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={28} />
              </div>
            )}
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
                <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 14 }}>{work.deadline ? formatDate(work.deadline) : 'Não definida'}</span>
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

        {photos.length > 0 && (
          <div className="card-premium" style={{ marginTop: 8 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ImageIcon size={20} color="var(--color-primary)" />
              Galeria de Fotos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
              {photos.map(photo => (
                <a key={photo.id} href={photo.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', aspectRatio: '1', borderRadius: 12, overflow: 'hidden', backgroundColor: 'var(--bg-base)' }}>
                  <img src={photo.url} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </a>
              ))}
            </div>
          </div>
        )}

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
