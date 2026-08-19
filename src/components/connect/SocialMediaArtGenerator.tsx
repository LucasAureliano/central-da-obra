import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Camera as Instagram, Camera } from 'lucide-react';
import type { PublicProfile } from '../../types/connect';

export function SocialMediaArtGenerator({ profile, workId, beforeImage, afterImage }: { profile: PublicProfile, workId?: string, beforeImage?: string, afterImage?: string }) {
  const artRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = async () => {
    alert('Função de download usando html2canvas será ativada na versão final.');
  };

  const profileUrl = `${window.location.origin}${window.location.pathname}?connect=${profile.id}`;

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', padding: 20, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Gerador de Arte para Redes Sociais</h3>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Crie um post profissional para o Instagram e divulgue seu perfil com um QR Code direto.</p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Preview Area */}
        <div 
          ref={artRef}
          style={{ 
            width: 320, 
            height: 320, 
            backgroundColor: 'var(--color-primary)', 
            position: 'relative', 
            borderRadius: 16, 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Top Half / Images */}
          <div style={{ flex: 1, backgroundColor: '#1E293B', display: 'flex', position: 'relative' }}>
            {beforeImage && afterImage ? (
              <>
                <div style={{ flex: 1, backgroundImage: `url(${beforeImage})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRight: '2px solid #FFF' }} />
                <div style={{ flex: 1, backgroundImage: `url(${afterImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>ANTES</div>
                <div style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(16,185,129,0.8)', color: '#FFF', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>DEPOIS</div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'rgba(255,255,255,0.5)' }}>
                <Camera size={32} />
                <span style={{ fontSize: 12 }}>Adicione fotos da obra</span>
              </div>
            )}
          </div>
          
          {/* Bottom Half / Info */}
          <div style={{ height: 100, backgroundColor: '#FFF', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 16, fontWeight: 900, color: '#1E293B', margin: 0, lineHeight: 1.2 }}>{profile.name}</h4>
              <p style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 700, margin: '4px 0 0 0' }}>{profile.specialty}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                <Instagram size={12} color="#64748B" />
                <span style={{ fontSize: 10, color: '#64748B' }}>{profile.instagram || '@seuinstagram'}</span>
              </div>
            </div>
            <div style={{ width: 64, height: 64, backgroundColor: '#F8FAFC', padding: 4, borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <QRCodeSVG value={profileUrl} size={54} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Formato</label>
            <select className="input-field">
              <option value="square">Feed (Quadrado - 1:1)</option>
              <option value="story" disabled>Story (Vertical - 9:16) em breve</option>
            </select>
          </div>
          
          <button onClick={handleDownload} className="btn-primary" style={{ padding: 16, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 'auto' }}>
            <Download size={18} /> Baixar Imagem
          </button>
        </div>
      </div>
    </div>
  );
}