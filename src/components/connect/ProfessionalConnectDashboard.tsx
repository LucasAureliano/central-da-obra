import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  User, Briefcase, Image as ImageIcon, Star, Mail, Share2, 
  Crown, ShieldCheck, Sparkles, TrendingUp, ExternalLink, ChevronRight,
  Building2, Compass, Wrench, Layers
} from 'lucide-react';

import { ConnectProfileForm } from './ConnectProfileForm';
import { ConnectServicesManager } from './ConnectServicesManager';
import { ConnectPortfolioManager } from './ConnectPortfolioManager';
import { ConnectRequestsManager } from './ConnectRequestsManager';
import { ConnectReviewsManager } from './ConnectReviewsManager';
import { MarketingCenterSuite } from './MarketingCenterSuite';
import type { PublicProfile } from '../../types/connect';

import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { toast } from 'react-hot-toast';

export function ProfessionalConnectDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user, profile } = useAuth();
  const { plan } = useSubscription();
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'portfolio' | 'reviews' | 'requests' | 'marketing'>('profile');
  const [dbProfile, setDbProfile] = useState<PublicProfile | null>(null);

  const role = profile?.role || 'service';
  const isPro = plan.id === 'pro' || plan.id === 'business' || plan.id === 'enterprise';
  const isStarter = plan.id === 'starter';

  useEffect(() => {
    if (!user) return;
    const fetchInfo = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'public_profile', 'info'));
        if (snap.exists()) {
          setDbProfile(snap.data() as PublicProfile);
        }
      } catch (e) {
        console.error('Erro ao buscar perfil público:', e);
      }
    };
    fetchInfo();
  }, [user]);

  const fallbackProfile: PublicProfile = {
    id: user?.uid || '',
    name: dbProfile?.name || profile?.name || 'Profissional CentralObra',
    specialty: dbProfile?.specialty || (role === 'architect' ? 'Arquitetura & Interiores' : role === 'engineer' ? 'Engenharia Civil & Estrutural' : role === 'builder' ? 'Construção & Empreiteira' : 'Prestador de Serviços'),
    role: role,
    city: dbProfile?.city || (profile as any)?.city || '',
    state: dbProfile?.state || '',
    bio: dbProfile?.bio || '',
    phone: dbProfile?.phone || (profile as any)?.phone || '',
    email: dbProfile?.email || profile?.email || '',
    instagram: dbProfile?.instagram || '',
    rating: dbProfile?.rating || 5.0,
    reviewCount: dbProfile?.reviewCount || 0,
    completedWorksCount: dbProfile?.completedWorksCount || 0,
    isVerified: isPro || isStarter || (dbProfile?.isVerified ?? false),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?connect=${user?.uid}`;
    const shareText = `Confira meu perfil profissional no CentralObra Connect: ${fallbackProfile.name} — ${fallbackProfile.specialty}`;
    
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
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(shareText);
      window.open(`https://api.whatsapp.com/send?text=${encodedText} %0A${encodedUrl}`, '_blank');
    }
  };

  // Role customization
  const ROLE_CONFIG = {
    service: {
      title: 'CentralObra Connect — Prestadores',
      subtitle: 'Sua vitrine de serviços, orçamentos e captação de clientes',
      portfolioLabel: 'Antes & Depois',
      servicesLabel: 'Meus Serviços',
      icon: Wrench,
      highlightBadge: 'Prestador Verificado'
    },
    architect: {
      title: 'Studio Connect — Arquitetura',
      subtitle: 'Sua vitrine de projetos conceituais, 3D, reformas e interiores',
      portfolioLabel: 'Projetos 3D & Obras',
      servicesLabel: 'Especialidades & Projetos',
      icon: Compass,
      highlightBadge: 'Arquiteto CAU Verificado'
    },
    engineer: {
      title: 'Engenharia Connect — Laudos & Obras',
      subtitle: 'Sua vitrine técnica de projetos estruturais, perícias e ART',
      portfolioLabel: 'Projetos Estruturais & Obras',
      servicesLabel: 'Serviços de Engenharia & ART',
      icon: Layers,
      highlightBadge: 'Engenheiro CREA Verificado'
    },
    builder: {
      title: 'Construtora Connect — Obras & Empreendimentos',
      subtitle: 'Vitrine corporativa para investidores e clientes residenciais',
      portfolioLabel: 'Obras Entregues',
      servicesLabel: 'Capacidade & Obras',
      icon: Building2,
      highlightBadge: 'Construtora Verificada'
    }
  };

  const currentRoleConfig = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.service;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px' }}>
      
      {/* Header com Ações */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              {currentRoleConfig.title}
            </h1>
            {isPro && (
              <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 8, backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(245,158,11,0.3)' }}>
                <Crown size={12} /> PRO
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            {currentRoleConfig.subtitle}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 16, fontSize: 13, fontWeight: 700 }} 
            onClick={() => window.open(`/?connect=${user?.uid}`, '_blank')}
          >
            <ExternalLink size={15} /> Ver Perfil Público
          </button>
          <button 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 16, fontSize: 13, fontWeight: 800 }} 
            onClick={handleShare}
          >
            <Share2 size={15} /> Compartilhar
          </button>
        </div>
      </div>

      {/* Status de Visibilidade no Connect Baseado no Plano */}
      <div 
        className="glass-panel" 
        style={{
          padding: '16px 20px',
          borderRadius: 20,
          background: isPro 
            ? 'linear-gradient(90deg, rgba(245,158,11,0.12), rgba(59,130,246,0.12))'
            : isStarter 
            ? 'linear-gradient(90deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))'
            : 'var(--bg-surface)',
          border: isPro ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isPro ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.15)', color: isPro ? '#F59E0B' : '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isPro ? <Crown size={20} /> : isStarter ? <ShieldCheck size={20} /> : <TrendingUp size={20} />}
          </div>
          <div>
            <h4 style={{ margin: '0 0 2px 0', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>
              {isPro 
                ? 'Status: Topo do Radar Connect (Destaque Máximo +10x)' 
                : isStarter 
                ? 'Status: Perfil Verificado no Connect (+2x Visualizações)'
                : 'Status: Visibilidade Padrão Local'}
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
              {isPro 
                ? 'Seu perfil é prioridade número 1 nas buscas da sua cidade e é recomendado diretamente para proprietários.' 
                : isStarter 
                ? 'Seu perfil possui selo verificado e prioridade intermediária nas buscas locais.'
                : 'Suba para o Plano PRO para aparecer no topo das buscas e conquistar mais clientes na sua região.'}
            </p>
          </div>
        </div>

        {!isPro && (
          <button
            onClick={() => onNavigate('planos')}
            className="btn-secondary"
            style={{
              padding: '8px 16px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 800,
              color: '#F59E0B',
              borderColor: 'rgba(245,158,11,0.4)',
              backgroundColor: 'rgba(245,158,11,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            Aumentar Visibilidade (+10x) <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Tabs Principais */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, marginBottom: 20 }} className="hide-scrollbar">
        {[
          { id: 'profile', icon: <User size={17} />, label: 'Meu Perfil' },
          { id: 'services', icon: <Briefcase size={17} />, label: currentRoleConfig.servicesLabel },
          { id: 'portfolio', icon: <ImageIcon size={17} />, label: currentRoleConfig.portfolioLabel },
          { id: 'requests', icon: <Mail size={17} />, label: 'Solicitações' },
          { id: 'reviews', icon: <Star size={17} />, label: 'Avaliações' },
          { id: 'marketing', icon: <Sparkles size={17} />, label: 'Central de Marketing' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: 18,
              backgroundColor: activeTab === t.id ? 'var(--color-primary)' : 'var(--bg-glass)',
              color: activeTab === t.id ? '#FFF' : 'var(--text-main)',
              border: '1px solid',
              borderColor: activeTab === t.id ? 'var(--color-primary)' : 'var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        {activeTab === 'profile' && <ConnectProfileForm />}
        {activeTab === 'services' && <ConnectServicesManager />}
        {activeTab === 'portfolio' && <ConnectPortfolioManager />}
        {activeTab === 'requests' && <ConnectRequestsManager />}
        {activeTab === 'reviews' && <ConnectReviewsManager />}
        {activeTab === 'marketing' && (
          <MarketingCenterSuite 
            profile={fallbackProfile} 
            onNavigatePlanos={() => onNavigate('planos')} 
          />
        )}
      </div>
    </div>
  );
}