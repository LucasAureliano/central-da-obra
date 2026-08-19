import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Briefcase, Image as ImageIcon, Star, Mail, Share2 } from 'lucide-react';

import { ConnectProfileForm } from './ConnectProfileForm';
import { ConnectServicesManager } from './ConnectServicesManager';
import { ConnectPortfolioManager } from './ConnectPortfolioManager';
import { ConnectRequestsManager } from './ConnectRequestsManager';
import { ConnectReviewsManager } from './ConnectReviewsManager';
import { SocialMediaArtGenerator } from './SocialMediaArtGenerator';

import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

export function ProfessionalConnectDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'portfolio' | 'reviews' | 'requests' | 'marketing'>('profile');
  
  const handleShare = async () => {
    const shareUrl = window.location.origin + '/?connect=' + user?.uid;
    const shareText = 'Confira meu perfil profissional no CentralObra Connect!';
    
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: 'Meu Perfil CentralObra',
          text: shareText,
          url: shareUrl,
          dialogTitle: 'Compartilhar Perfil',
        });
      } catch (err) {
        console.error('Erro ao compartilhar nativamente:', err);
      }
    } else {
      // Fallback web (WhatsApp)
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(shareText);
      window.open(`https://api.whatsapp.com/send?text=${encodedText} %0A${encodedUrl}`, '_blank');
    }
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>CentralObra Connect</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sua vitrine profissional pública</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700 }} onClick={() => window.open('?connect=' + user?.uid, '_blank')}>
            <User size={16} /> Ver Perfil
          </button>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', borderColor: 'var(--border-subtle)' }} onClick={handleShare}>
            <Share2 size={16} /> Compartilhar
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 24 }} className="hide-scrollbar">
        {[
          { id: 'profile', icon: <User size={18} />, label: 'Meu Perfil' },
          { id: 'services', icon: <Briefcase size={18} />, label: 'Meus Serviços' },
          { id: 'portfolio', icon: <ImageIcon size={18} />, label: 'Portfólio' },
          { id: 'requests', icon: <Mail size={18} />, label: 'Solicitações' },
          { id: 'reviews', icon: <Star size={18} />, label: 'Avaliações' },
          { id: 'marketing', icon: <Share2 size={18} />, label: 'Divulgação' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            style={{
              padding: '10px 16px',
              borderRadius: 20,
              backgroundColor: activeTab === t.id ? 'var(--color-primary)' : 'var(--bg-glass)',
              color: activeTab === t.id ? '#FFF' : 'var(--text-main)',
              border: '1px solid',
              borderColor: activeTab === t.id ? 'var(--color-primary)' : 'var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        {activeTab === 'profile' && <ConnectProfileForm />}
        {activeTab === 'services' && <ConnectServicesManager />}
        {activeTab === 'portfolio' && <ConnectPortfolioManager />}
        {activeTab === 'requests' && <ConnectRequestsManager />}
        {activeTab === 'reviews' && <ConnectReviewsManager />}
        {activeTab === 'marketing' && profile && <SocialMediaArtGenerator profile={profile as any} />}
      </div>
    </div>
  );
}