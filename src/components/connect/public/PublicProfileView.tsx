import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { PublicProfile, ProfessionalService, PortfolioItem } from '../../../types/connect';
import { MapPin, Star, Phone, Camera as Instagram, MapPin as Globe, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { RequestQuoteModal } from './RequestQuoteModal';

export function PublicProfileView({ uid, theme }: { uid: string, theme: string }) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [services, setServices] = useState<ProfessionalService[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [uid]);

  const fetchProfile = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid, 'public_profile', 'info'));
      if (docSnap.exists()) {
        setProfile(docSnap.data() as PublicProfile);
      }
      
      const srvSnap = await getDocs(collection(db, 'users', uid, 'public_services'));
      setServices(srvSnap.docs.map(d => d.data() as ProfessionalService).filter(s => s.isPublic));

      const portSnap = await getDocs(collection(db, 'users', uid, 'portfolio'));
      setPortfolio(portSnap.docs.map(d => d.data() as PortfolioItem).filter(p => p.isPublic));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: profile?.name || 'Perfil Profissional',
          text: `Conheça o trabalho de ${profile?.name} na CentralObra Connect`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (e) {
      console.error('Error sharing', e);
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}><p>Carregando perfil...</p></div>;
  if (!profile) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}><p>Perfil não encontrado ou não é público.</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 100 }}>
      {/* Header Cover */}
      <div style={{ height: 160, background: 'linear-gradient(135deg, var(--color-primary), #1E3A8A)', position: 'relative' }}>
        <button onClick={handleShare} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(24px)', color: '#FFF', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, border: 'none' }}>
          Compartilhar
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px', marginTop: -60, position: 'relative' }}>
        {/* Profile Info Card */}
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: 'var(--bg-surface)', border: '4px solid var(--bg-base)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: 'var(--text-muted)' }}>{profile.name.charAt(0)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)' }}>{profile.name}</h1>
            {profile.isVerified && <ShieldCheck size={20} color="#10B981" />}
          </div>
          <p style={{ fontSize: 16, color: 'var(--color-primary)', fontWeight: 700, marginBottom: 12 }}>{profile.specialty}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, flexWrap: 'wrap' }}>
            {profile.city && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={16} /> {profile.city}{profile.state ? `/${profile.state}` : ''}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={16} color="#F59E0B" /> {profile.rating > 0 ? profile.rating.toFixed(1) : 'Novo'}</div>
          </div>

          <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 400 }}>
            <button onClick={() => setShowQuoteModal(true)} className="btn-primary" style={{ flex: 1, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16 }}>
              Solicitar Orçamento
            </button>
          </div>
          
          {profile.bio && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border-subtle)', width: '100%', textAlign: 'left' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Sobre</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Services Section */}
        {services.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Serviços Realizados</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {services.map(srv => (
                <div key={srv.id} className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{srv.name}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>{srv.description}</p>
                  {(srv.basePrice || srv.unit) && (
                    <div style={{ display: 'inline-flex', padding: '4px 12px', backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--color-primary)', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                      {srv.basePrice ? `A partir de R$ ${srv.basePrice}` : ''} {srv.unit ? ` por ${srv.unit}` : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Section */}
        {portfolio.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Portfólio de Obras</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {portfolio.map(port => (
                <div key={port.id} onClick={() => window.location.href = `?portfolio=${port.workId}&uid=${uid}`} className="glass-panel" style={{ padding: 20, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>
                  <div style={{ height: 160, backgroundColor: 'var(--bg-surface)', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Sem foto de capa</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{port.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
                    <MapPin size={12} /> {port.city}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Contacts */}
        <div style={{ marginTop: 40, textAlign: 'center', padding: '32px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Entre em contato com {profile.name}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            {profile.phone && <a href={`tel:${profile.phone}`} style={{ padding: 12, backgroundColor: 'var(--bg-surface)', borderRadius: '50%', color: 'var(--text-main)' }}><Phone size={20} /></a>}
            {profile.instagram && <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" style={{ padding: 12, backgroundColor: 'var(--bg-surface)', borderRadius: '50%', color: 'var(--text-main)' }}><Instagram size={20} /></a>}
            {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" style={{ padding: 12, backgroundColor: 'var(--bg-surface)', borderRadius: '50%', color: 'var(--text-main)' }}><Globe size={20} /></a>}
          </div>
        </div>
      </div>

      {showQuoteModal && <RequestQuoteModal uid={uid} profile={profile} onClose={() => setShowQuoteModal(false)} />}
    </div>
  );
}