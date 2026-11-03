import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Download, Share2, Sparkles, Copy, Check, MessageCircle, Star, 
  Crown, ShieldCheck, Phone, Camera as Instagram, MapPin, Eye, TrendingUp,
  Image as ImageIcon, Layers, RefreshCw, ChevronRight, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import type { PublicProfile } from '../../types/connect';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface MarketingCenterSuiteProps {
  profile: PublicProfile;
  onNavigatePlanos?: () => void;
}

type ArtFormat = 'square' | 'story';
type ArtTemplate = 'antes_depois' | 'obra_entregue' | 'tabela_servicos' | 'depoimento' | 'cartao_apresentacao';
type ArtColorTheme = 'blue' | 'gold' | 'dark' | 'emerald';

export function MarketingCenterSuite({ profile, onNavigatePlanos }: MarketingCenterSuiteProps) {
  const { plan } = useSubscription();
  const [activeTab, setActiveTab] = useState<'templates' | 'cartao' | 'scripts' | 'metricas'>('templates');

  // Generator states
  const [format, setFormat] = useState<ArtFormat>('square');
  const [template, setTemplate] = useState<ArtTemplate>('obra_entregue');
  const [colorTheme, setColorTheme] = useState<ArtColorTheme>('blue');
  const [customTitle, setCustomTitle] = useState('Obra Entregue com Sucesso');
  const [customSubtitle, setCustomSubtitle] = useState('Mais um projeto finalizado com rigor técnico e pontualidade.');
  const [service1, setService1] = useState('Projetos & Gerenciamento');
  const [service2, setService2] = useState('Reformas Residenciais');
  const [service3, setService3] = useState('Acabamentos de Alto Padrão');
  const [clientQuote, setClientQuote] = useState('Profissional extremamente pontual e atencioso. A obra terminou antes do prazo!');
  const [clientName, setClientName] = useState('Mariana & Roberto — Casa Jardins');
  const [beforeImg, setBeforeImg] = useState('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80');
  const [afterImg, setAfterImg] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80');
  const [mainPhoto, setMainPhoto] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const profileUrl = `${window.location.origin}/?connect=${profile.id || 'demo'}`;

  const isPro = plan.id === 'pro' || plan.id === 'business' || plan.id === 'enterprise';

  // Theme palettes
  const THEMES = {
    blue: { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', accent: '#60A5FA', text: '#FFFFFF', subtext: '#94A3B8' },
    gold: { bg: '#18181B', card: '#27272A', primary: '#F59E0B', accent: '#FBBF24', text: '#FFFFFF', subtext: '#A1A1AA' },
    dark: { bg: '#0A0A0A', card: '#171717', primary: '#8B5CF6', accent: '#A78BFA', text: '#FFFFFF', subtext: '#737373' },
    emerald: { bg: '#064E3B', card: '#065F46', primary: '#10B981', accent: '#34D399', text: '#FFFFFF', subtext: '#A7F3D0' }
  };

  const currentTheme = THEMES[colorTheme];

  // REAL CANVAS PNG EXPORTER (Zero dependencies, guaranteed PNG download)
  const handleDownloadPNG = async () => {
    setIsExporting(true);
    toast('Gerando arte em alta resolução (PNG)...', { icon: '🎨' });

    try {
      const canvas = document.createElement('canvas');
      const width = 1080;
      const height = format === 'square' ? 1080 : 1920;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Não foi possível obter contexto 2D');

      // 1. Draw Background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, currentTheme.bg);
      gradient.addColorStop(1, currentTheme.card);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Decorative Top Glow
      const glowGrad = ctx.createRadialGradient(width / 2, 0, 50, width / 2, 0, width * 0.7);
      glowGrad.addColorStop(0, `${currentTheme.primary}44`);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height * 0.5);

      // 2. Header: Brand Logo & Verified Tag
      ctx.fillStyle = currentTheme.primary;
      ctx.beginPath();
      ctx.roundRect(60, 60, 260, 48, 24);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('CentralObra Connect', 80, 92);

      if (isPro || profile.isVerified) {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.roundRect(width - 320, 60, 260, 48, 24);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.fillText('⭐ PROFISSIONAL PRO', width - 300, 92);
      }

      // 3. Central Content Area
      const contentY = 160;

      // Draw Main Card Outline
      ctx.fillStyle = `${currentTheme.card}DD`;
      ctx.strokeStyle = `${currentTheme.primary}55`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(60, contentY, width - 120, height - 380, 32);
      ctx.fill();
      ctx.stroke();

      // Title & Subtitle inside card
      ctx.fillStyle = currentTheme.text;
      ctx.font = '900 48px system-ui, -apple-system, sans-serif';
      ctx.fillText(customTitle, 100, contentY + 80);

      ctx.fillStyle = currentTheme.subtext;
      ctx.font = '500 24px system-ui, -apple-system, sans-serif';
      ctx.fillText(customSubtitle, 100, contentY + 124);

      // Template Specific Graphics (fallback rendered text & boxes)
      if (template === 'antes_depois') {
        const boxW = (width - 280) / 2;
        const boxH = format === 'square' ? 360 : 700;

        // Before Box
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.roundRect(100, contentY + 160, boxW, boxH, 20);
        ctx.fill();
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.roundRect(120, contentY + 180, 140, 40, 10);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('ANTES', 155, contentY + 206);

        // After Box
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(100 + boxW + 40, contentY + 160, boxW, boxH, 20);
        ctx.fill();
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.roundRect(100 + boxW + 60, contentY + 180, 140, 40, 10);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('DEPOIS', 100 + boxW + 90, contentY + 206);
      } else if (template === 'tabela_servicos') {
        const services = [service1, service2, service3];
        services.forEach((srv, idx) => {
          const sY = contentY + 180 + (idx * 110);
          ctx.fillStyle = `${currentTheme.primary}22`;
          ctx.beginPath();
          ctx.roundRect(100, sY, width - 200, 80, 16);
          ctx.fill();

          ctx.fillStyle = currentTheme.primary;
          ctx.font = 'bold 36px system-ui';
          ctx.fillText('✓', 130, sY + 52);

          ctx.fillStyle = currentTheme.text;
          ctx.font = 'bold 28px system-ui';
          ctx.fillText(srv, 180, sY + 52);
        });
      } else if (template === 'depoimento') {
        const qY = contentY + 200;
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 36px system-ui';
        ctx.fillText('★★★★★  5.0 / 5.0', 100, qY);

        ctx.fillStyle = currentTheme.text;
        ctx.font = 'italic 500 32px system-ui';
        ctx.fillText(`"${clientQuote}"`, 100, qY + 70);

        ctx.fillStyle = currentTheme.accent;
        ctx.font = 'bold 26px system-ui';
        ctx.fillText(`— ${clientName}`, 100, qY + 140);
      } else {
        // Obra Entregue / Cartao
        ctx.fillStyle = `${currentTheme.primary}15`;
        ctx.beginPath();
        ctx.roundRect(100, contentY + 160, width - 200, format === 'square' ? 360 : 700, 24);
        ctx.fill();

        ctx.fillStyle = currentTheme.text;
        ctx.font = 'bold 34px system-ui';
        ctx.fillText('🏆 Garantia & Padrão de Engenharia', 140, contentY + 260);

        ctx.fillStyle = currentTheme.subtext;
        ctx.font = '24px system-ui';
        ctx.fillText('Orçamento detalhado, cumprimento de cronograma e contrato formal.', 140, contentY + 310);
      }

      // 4. Footer: Professional Info & Contacts
      const footerY = height - 180;
      ctx.fillStyle = currentTheme.text;
      ctx.font = '900 36px system-ui, -apple-system, sans-serif';
      ctx.fillText(profile.name || 'Seu Nome Profissional', 60, footerY);

      ctx.fillStyle = currentTheme.primary;
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${profile.specialty || 'Especialista em Obras'} • ${profile.city || 'Sua Cidade'}`, 60, footerY + 40);

      ctx.fillStyle = currentTheme.subtext;
      ctx.font = '500 22px system-ui, -apple-system, sans-serif';
      ctx.fillText(`📱 WhatsApp: ${profile.phone || '(00) 00000-0000'} | @${profile.instagram ? profile.instagram.replace('@', '') : 'seuinstagram'}`, 60, footerY + 80);

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `CentralObra-Marketing-${template}-${format}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('Arte baixada com sucesso em PNG!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao gerar imagem.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Olá! Conheça meu trabalho profissional na CentralObra Connect:\n\n👤 *${profile.name}*\n🔧 Especialidade: ${profile.specialty}\n📍 Região: ${profile.city || 'Atendimento Regional'}\n\n👉 Acesse meu perfil completo, veja fotos de obras e solicite seu orçamento:\n${profileUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyScript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Script copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }} className="hide-scrollbar">
        {[
          { id: 'templates', label: 'Gerador de Banners & Artes', icon: ImageIcon },
          { id: 'cartao', label: 'Cartão Digital & QR Code', icon: Award },
          { id: 'scripts', label: 'Scripts de WhatsApp', icon: MessageCircle },
          { id: 'metricas', label: 'Alcance & Diagnóstico', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: 16,
              backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: activeTab === tab.id ? '#FFF' : 'var(--text-main)',
              border: '1px solid',
              borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: GERADOR DE ARTES & BANNERS */}
      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Controls Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Gerador de Artes para Redes Sociais
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                Crie posts de alta conversão para o Instagram Feed, Stories e WhatsApp Status em segundos.
              </p>
            </div>

            {/* Format Selection */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>
                Formato da Imagem
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setFormat('square')}
                  style={{
                    padding: '12px',
                    borderRadius: 12,
                    border: '1px solid',
                    borderColor: format === 'square' ? 'var(--color-primary)' : 'var(--border-subtle)',
                    backgroundColor: format === 'square' ? 'rgba(59,130,246,0.1)' : 'var(--bg-surface)',
                    color: format === 'square' ? 'var(--color-primary)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  📐 Feed Quadrado (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('story')}
                  style={{
                    padding: '12px',
                    borderRadius: 12,
                    border: '1px solid',
                    borderColor: format === 'story' ? 'var(--color-primary)' : 'var(--border-subtle)',
                    backgroundColor: format === 'story' ? 'rgba(59,130,246,0.1)' : 'var(--bg-surface)',
                    color: format === 'story' ? 'var(--color-primary)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  📱 Story / Status (9:16)
                </button>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>
                Modelo do Post
              </label>
              <select
                className="input-field"
                value={template}
                onChange={e => {
                  const val = e.target.value as ArtTemplate;
                  setTemplate(val);
                  if (val === 'obra_entregue') {
                    setCustomTitle('Obra Entregue com Sucesso');
                    setCustomSubtitle('Qualidade construtiva e acabamento de alto padrão garantidos.');
                  } else if (val === 'antes_depois') {
                    setCustomTitle('Transformação de Ambientes');
                    setCustomSubtitle('Veja o resultado surpreendente desta reforma completa.');
                  } else if (val === 'tabela_servicos') {
                    setCustomTitle('Serviços Especializados');
                    setCustomSubtitle('Agende uma visita e receba seu orçamento detalhado.');
                  } else if (val === 'depoimento') {
                    setCustomTitle('Avaliação de Cliente Satisfeito');
                    setCustomSubtitle('Recomendação 5 estrelas no CentralObra Connect.');
                  } else {
                    setCustomTitle('Contrate um Profissional Verificado');
                    setCustomSubtitle('Segurança, contrato e garantia em cada etapa da sua obra.');
                  }
                }}
              >
                <option value="obra_entregue">🏆 Obra Entregue / Projeto Finalizado</option>
                <option value="antes_depois">🔄 Antes & Depois da Reforma</option>
                <option value="tabela_servicos">📋 Tabela de Serviços & Orçamento Rápido</option>
                <option value="depoimento">⭐ Depoimento / Avaliação 5 Estrelas</option>
                <option value="cartao_apresentacao">💼 Cartão de Apresentação / Autoridade</option>
              </select>
            </div>

            {/* Color Theme */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>
                Estilo Visual & Cores
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { id: 'blue', label: 'Azul Pro', color: '#3B82F6' },
                  { id: 'gold', label: 'Dourado VIP', color: '#F59E0B' },
                  { id: 'dark', label: 'Black Luxo', color: '#8B5CF6' },
                  { id: 'emerald', label: 'Esmeralda', color: '#10B981' },
                ].map(th => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setColorTheme(th.id as any)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 12,
                      border: '2px solid',
                      borderColor: colorTheme === th.id ? th.color : 'var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: th.color }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-main)' }}>{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Texts */}
            <div className="input-group">
              <label>Título Principal do Post</label>
              <input
                type="text"
                className="input-field"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Subtítulo / Descrição</label>
              <input
                type="text"
                className="input-field"
                value={customSubtitle}
                onChange={e => setCustomSubtitle(e.target.value)}
              />
            </div>

            {template === 'tabela_servicos' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>Serviços em Destaque</label>
                <input className="input-field" value={service1} onChange={e => setService1(e.target.value)} placeholder="Serviço 1" />
                <input className="input-field" value={service2} onChange={e => setService2(e.target.value)} placeholder="Serviço 2" />
                <input className="input-field" value={service3} onChange={e => setService3(e.target.value)} placeholder="Serviço 3" />
              </div>
            )}

            {template === 'depoimento' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>Depoimento do Cliente</label>
                <textarea className="input-field" rows={3} value={clientQuote} onChange={e => setClientQuote(e.target.value)} />
                <input className="input-field" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nome do Cliente" />
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <button
                type="button"
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="btn-primary"
                style={{
                  padding: 16,
                  borderRadius: 16,
                  fontWeight: 800,
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 8px 24px rgba(37,99,235,0.3)'
                }}
              >
                <Download size={18} />
                {isExporting ? 'Renderizando Imagem...' : 'Baixar Imagem em Alta Resolução (PNG)'}
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="btn-secondary"
                style={{
                  padding: 14,
                  borderRadius: 16,
                  fontWeight: 700,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  color: '#10B981',
                  borderColor: 'rgba(16,185,129,0.3)'
                }}
              >
                <Share2 size={16} />
                Compartilhar Perfil no WhatsApp
              </button>
            </div>
          </div>

          {/* Interactive Live Preview Area */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>
              PRÉ-VISUALIZAÇÃO AO VIVO ({format === 'square' ? '1:1 Feed' : '9:16 Stories'})
            </span>

            <div
              style={{
                width: format === 'square' ? 340 : 280,
                height: format === 'square' ? 340 : 498,
                backgroundColor: currentTheme.bg,
                background: `linear-gradient(135deg, ${currentTheme.bg}, ${currentTheme.card})`,
                borderRadius: 24,
                border: `2px solid ${currentTheme.primary}44`,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Header inside preview */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '4px 10px', borderRadius: 12, backgroundColor: currentTheme.primary, color: '#FFF', fontSize: 10, fontWeight: 800 }}>
                  CentralObra Connect
                </div>
                {(isPro || profile.isVerified) && (
                  <div style={{ padding: '4px 10px', borderRadius: 12, backgroundColor: '#F59E0B', color: '#FFF', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Crown size={10} /> PRO
                  </div>
                )}
              </div>

              {/* Main Visual Box */}
              <div style={{ padding: 14, borderRadius: 16, backgroundColor: `${currentTheme.card}CC`, border: `1px solid ${currentTheme.primary}33`, marginTop: 12, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 900, color: currentTheme.text, lineHeight: 1.2 }}>
                  {customTitle}
                </h4>
                <p style={{ margin: '0 0 12px 0', fontSize: 11, color: currentTheme.subtext, lineHeight: 1.3 }}>
                  {customSubtitle}
                </p>

                {template === 'tabela_servicos' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[service1, service2, service3].map((s, i) => (
                      <div key={i} style={{ padding: '6px 8px', borderRadius: 8, backgroundColor: `${currentTheme.primary}22`, fontSize: 11, fontWeight: 700, color: currentTheme.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: currentTheme.primary }}>✓</span> {s}
                      </div>
                    ))}
                  </div>
                ) : template === 'depoimento' ? (
                  <div style={{ padding: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ color: '#F59E0B', fontSize: 12, marginBottom: 4 }}>★★★★★</div>
                    <p style={{ margin: '0 0 6px 0', fontSize: 11, fontStyle: 'italic', color: currentTheme.text }}>"{clientQuote}"</p>
                    <span style={{ fontSize: 10, fontWeight: 700, color: currentTheme.accent }}>— {clientName}</span>
                  </div>
                ) : template === 'antes_depois' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, height: 100 }}>
                    <div style={{ backgroundColor: '#1E293B', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontWeight: 800, fontSize: 11 }}>ANTES</div>
                    <div style={{ backgroundColor: '#0F172A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontWeight: 800, fontSize: 11 }}>DEPOIS</div>
                  </div>
                ) : (
                  <div style={{ padding: 10, borderRadius: 10, backgroundColor: `${currentTheme.primary}15`, textAlign: 'center' }}>
                    <Award size={28} color={currentTheme.primary} style={{ margin: '0 auto 6px' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: currentTheme.text, display: 'block' }}>Garantia & Pontualidade</span>
                    <span style={{ fontSize: 9, color: currentTheme.subtext }}>Orçamento sem compromisso</span>
                  </div>
                )}
              </div>

              {/* Footer inside preview */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12, paddingTop: 10, borderTop: `1px solid ${currentTheme.primary}22` }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: currentTheme.text, display: 'block' }}>{profile.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: currentTheme.primary }}>{profile.specialty}</span>
                  <span style={{ fontSize: 9, color: currentTheme.subtext, display: 'block', marginTop: 2 }}>{profile.city || 'Atendimento Regional'}</span>
                </div>
                <div style={{ width: 44, height: 44, backgroundColor: '#FFF', padding: 3, borderRadius: 6 }}>
                  <QRCodeSVG value={profileUrl} size={38} />
                </div>
              </div>
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
              💡 Ao clicar em baixar, o PNG é gerado em alta resolução nativa (1080px).
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: CARTÃO DE VISITA DIGITAL */}
      {activeTab === 'cartao' && (
        <div style={{ maxWidth: 640, margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              Seu Cartão de Visita Digital Interativo
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Compartilhe no WhatsApp ou adicione o link na bio do seu Instagram para receber novos contatos.
            </p>
          </div>

          {/* Interactive Card */}
          <div
            className="glass-panel"
            style={{
              padding: 28,
              borderRadius: 28,
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              border: '2px solid rgba(59,130,246,0.3)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 24
            }}
          >
            {/* Background Accent */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(59,130,246,0.15)', filter: 'blur(30px)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B82F6', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, boxShadow: '0 8px 16px rgba(59,130,246,0.4)' }}>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: 20, fontWeight: 900, color: '#FFF' }}>
                    {profile.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#60A5FA' }}>{profile.specialty}</span>
                    {(isPro || profile.isVerified) && (
                      <span style={{ fontSize: 11, backgroundColor: 'rgba(245,158,11,0.2)', color: '#F59E0B', padding: '2px 8px', borderRadius: 10, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ShieldCheck size={12} /> PRO
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ padding: 6, backgroundColor: '#FFF', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                <QRCodeSVG value={profileUrl} size={64} />
              </div>
            </div>

            {profile.bio && (
              <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, margin: '0 0 20px 0', position: 'relative', zIndex: 2 }}>
                "{profile.bio}"
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 2 }}>
              {profile.city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#CBD5E1' }}>
                  <MapPin size={14} color="#3B82F6" /> {profile.city} {profile.state ? `/${profile.state}` : ''}
                </div>
              )}
              {profile.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#CBD5E1' }}>
                  <Phone size={14} color="#10B981" /> {profile.phone}
                </div>
              )}
              {profile.instagram && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#CBD5E1' }}>
                  <Instagram size={14} color="#EC4899" /> {profile.instagram}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#F59E0B' }}>
                <Star size={14} fill="currentColor" /> {profile.rating > 0 ? profile.rating.toFixed(1) : '5.0'} no Connect
              </div>
            </div>
          </div>

          {/* Quick Share Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(profileUrl);
                toast.success('Link copiado para a área de transferência!');
              }}
              className="btn-secondary"
              style={{ padding: 14, borderRadius: 14, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Copy size={16} /> Copiar Link da Bio
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="btn-primary"
              style={{ padding: 14, borderRadius: 14, fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Share2 size={16} /> Enviar no WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SCRIPTS DE WHATSAPP */}
      {activeTab === 'scripts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              Modelos de Mensagens para WhatsApp
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              Textos persuasivos prontos para enviar a clientes novos ou pedir avaliações após entregar a obra.
            </p>
          </div>

          {[
            {
              id: 'script-1',
              title: 'Apresentação Profissional para Novo Cliente',
              desc: 'Use quando alguém pedir seu contato ou indicação.',
              text: `Olá! Sou ${profile.name}, especialista em ${profile.specialty || 'obras e reformas'}.\n\nTrabalho com contratos formais, prazos rigorosos e garantia técnica. Você pode conferir minhas obras recentes, avaliações de outros clientes e serviços no meu perfil oficial no CentralObra Connect:\n\n👉 ${profileUrl}\n\nFico à disposição para agendarmos uma visita técnica ou preparar seu orçamento!`
            },
            {
              id: 'script-2',
              title: 'Solicitação de Avaliação 5 Estrelas Pós-Obra',
              desc: 'Envie logo após a entrega da obra para aumentar suas notas públicas.',
              text: `Olá! Foi um enorme prazer realizar este projeto com você. A sua satisfação é a minha maior prioridade!\n\nPoderia me dedicar 1 minuto para deixar uma avaliação sobre o meu trabalho? Isso ajuda muito a destacar meu perfil para novos clientes:\n\n⭐ Avaliar no CentralObra: ${profileUrl}\n\nMuito obrigado pela confiança!`
            },
            {
              id: 'script-3',
              title: 'Aviso de Agenda Aberta para Novos Projetos',
              desc: 'Excelente para disparar no início do mês para arquitetos, engenheiros e construtoras.',
              text: `Olá! Passando para avisar que estamos abrindo novas datas em nossa agenda de ${profile.specialty || 'obras e reformas'} para as próximas semanas.\n\nSe estiver planejando iniciar ou reformar seu imóvel, acesse nosso portfólio completo e garanta seu cronograma:\n\n👉 ${profileUrl}\n\nAtenciosamente, ${profile.name}.`
            }
          ].map(sc => (
            <div key={sc.id} className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>{sc.title}</h4>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{sc.desc}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => copyScript(sc.text, sc.id)}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {copiedId === sc.id ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                    {copiedId === sc.id ? 'Copiado!' : 'Copiar'}
                  </button>
                  <button
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(sc.text)}`, '_blank')}
                    className="btn-primary"
                    style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <MessageCircle size={14} /> Abrir no Whats
                  </button>
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 12, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', whiteSpace: 'pre-line', fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5 }}>
                {sc.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ALCANCE & MÉTRICAS */}
      {activeTab === 'metricas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Plan Multiplier Banner */}
          <div
            className="glass-panel"
            style={{
              padding: 24,
              borderRadius: 24,
              background: isPro
                ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(59,130,246,0.15))'
                : 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
              border: isPro ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 12, backgroundColor: isPro ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.15)', color: isPro ? '#F59E0B' : '#3B82F6', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                {isPro ? <Crown size={14} /> : <ShieldCheck size={14} />}
                {isPro ? 'PLANO PRO ATIVO: TOPO DO RADAR' : 'PLANO ATUAL: VISIBILIDADE BÁSICA'}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                {isPro ? 'Seu Perfil tem Alcance Prioritário Máximo' : 'Multiplique seu Alcance por até 10x'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, maxWidth: 500 }}>
                {isPro
                  ? 'Você aparece no topo das buscas na sua região quando proprietários procuram por orçamentos de obras e reformas.'
                  : 'No Plano PRO você sobe para o topo das buscas, recebe o Selo PRO Dourado e atrai muito mais proprietários.'}
              </p>
            </div>

            {!isPro && onNavigatePlanos && (
              <button
                onClick={onNavigatePlanos}
                className="btn-primary"
                style={{ padding: '14px 22px', borderRadius: 16, fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                Ativar Plano PRO <ChevronRight size={16} />
              </button>
            )}
          </div>

          {/* Performance Numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div className="glass-panel" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#3B82F6' }}>
                {isPro ? '284' : '42'}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginTop: 4, fontWeight: 600 }}>
                Visualizações do Perfil (30 dias)
              </span>
            </div>

            <div className="glass-panel" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#10B981' }}>
                {isPro ? '18' : '3'}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginTop: 4, fontWeight: 600 }}>
                Solicitações de Orçamento
              </span>
            </div>

            <div className="glass-panel" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#F59E0B' }}>
                {isPro ? '94%' : '48%'}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginTop: 4, fontWeight: 600 }}>
                Índice de Conversão Estimado
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
