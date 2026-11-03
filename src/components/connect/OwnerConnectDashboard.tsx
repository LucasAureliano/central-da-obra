import React, { useState } from 'react';
import { 
  Search, MapPin, Star, ShieldCheck, Crown, Phone, MessageCircle, 
  ChevronRight, Filter, Sparkles, Building2, Compass, Wrench, 
  Layers, CheckCircle2, User, ExternalLink, Calendar, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { RequestQuoteModal } from './public/RequestQuoteModal';
import type { PublicProfile } from '../../types/connect';

export function OwnerConnectDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [activeTab, setActiveTab] = useState<'profissionais' | 'solicitacoes'>('profissionais');
  const [selectedProForQuote, setSelectedProForQuote] = useState<PublicProfile | null>(null);

  const CATEGORIES = [
    { id: 'Todos', label: 'Todos' },
    { id: 'Arquitetura', label: '📐 Arquitetura & Interiores' },
    { id: 'Engenharia', label: '🏗️ Engenharia & Laudos' },
    { id: 'Construtora', label: '🏢 Construtoras & Empreiteiras' },
    { id: 'Pedreiro', label: '🧱 Pedreiros & Alvenaria' },
    { id: 'Pintor', label: '🎨 Pintura & Texturas' },
    { id: 'Eletricista', label: '⚡ Eletricistas' },
    { id: 'Encanador', label: '💧 Hidráulica & Encanadores' },
    { id: 'Gesso', label: '🏠 Gesso & Drywall' },
    { id: 'Marcenaria', label: '🪵 Marcenaria & Planejados' }
  ];

  const CITIES = [
    'Todas',
    'São Paulo, SP',
    'Rio de Janeiro, RJ',
    'Belo Horizonte, MG',
    'Curitiba, PR',
    'Porto Alegre, RS',
    'Brasília, DF',
    'Salvador, BA',
    'Campinas, SP',
    'Goiânia, GO'
  ];

  // Comprehensive verified professionals directory with real-world Brazilian standards
  const PROS_DB: (PublicProfile & { 
    isProPlan?: boolean; 
    avatar?: string; 
    badgeText?: string; 
    priceRange?: string;
    skills?: string[];
  })[] = [
    {
      id: 'pro-1',
      name: 'Studio Vértice Arquitetura',
      specialty: 'Arquitetura Residencial de Alto Padrão & 3D',
      role: 'architect',
      city: 'São Paulo',
      state: 'SP',
      bio: 'Especialistas em projetos residenciais contemporâneos, reformas completas de apartamentos e compatibilização BIM. CAU/SP ativo com mais de 80 obras entregues.',
      rating: 5.0,
      reviewCount: 42,
      completedWorksCount: 86,
      isVerified: true,
      isProPlan: true,
      badgeText: '⭐ TOP 1 ARQUITETURA SP',
      priceRange: 'A partir de R$ 90/m²',
      skills: ['Projetos 3D', 'Interiores', 'CASACOR 2024', 'Revit BIM'],
      phone: '(11) 98765-4321',
      instagram: '@vertice.arq',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pro-2',
      name: 'Eng. Roberto Albuquerque',
      specialty: 'Engenharia Civil, Laudos Técnicos & Estrutural',
      role: 'engineer',
      city: 'São Paulo',
      state: 'SP',
      bio: 'Engenheiro Calculista com 18 anos de experiência. Projetos em concreto armado, reforço estrutural, emissão de ART para reformas e vistorias cautelares de vizinhança.',
      rating: 4.9,
      reviewCount: 68,
      completedWorksCount: 140,
      isVerified: true,
      isProPlan: true,
      badgeText: '🏆 ENGENHEIRO VERIFICADO CREA',
      priceRange: 'Sob Consulta / ART Express',
      skills: ['Cálculo Estrutural', 'ART Reforma NBR 16280', 'Laudo Cautelar'],
      phone: '(11) 97654-3210',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pro-3',
      name: 'Construtora & Reformas Aliança',
      specialty: 'Construção Residencial, Comercial e Reformas Globais',
      role: 'builder',
      city: 'Curitiba',
      state: 'PR',
      bio: 'Execução de obras do alicerce à pintura final com contrato com cronograma vinculado a pagamento. Equipe própria completa de pedreiros, eletricistas e encanadores.',
      rating: 4.9,
      reviewCount: 54,
      completedWorksCount: 95,
      isVerified: true,
      isProPlan: true,
      badgeText: '🏢 CONSTRUTORA DESTAQUE',
      priceRange: 'Contrato Turnkey / Obra Fechada',
      skills: ['Obra Completa', 'Garantia 5 Anos', 'Cronograma Físico-Financeiro'],
      phone: '(41) 98888-2233',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pro-4',
      name: 'Mestre Carlos Silva & Equipe',
      specialty: 'Pedreiro de Alto Padrão & Assentamento de Porcelanato',
      role: 'service',
      city: 'São Paulo',
      state: 'SP',
      bio: 'Especialista em porcelanatos de grandes formatos (120x120 e lastras), nivelamento a laser, alvenaria estrutural e acabamento fino de banheiros com box até o teto.',
      rating: 5.0,
      reviewCount: 112,
      completedWorksCount: 230,
      isVerified: true,
      isProPlan: true,
      badgeText: '⭐ TOP RECOMENDADO CONNECT',
      priceRange: 'R$ 75 - R$ 130/m²',
      skills: ['Lastras 120x270', 'Nivelamento a Laser', 'Corte em Meia Esquadria 45°'],
      phone: '(11) 99123-4567',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pro-5',
      name: 'Lumina Elétrica & Automação Residencial',
      specialty: 'Instalações Elétricas, Padrão Enel & Iluminação LED',
      role: 'service',
      city: 'Rio de Janeiro',
      state: 'RJ',
      bio: 'Eletricistas certificados NR-10. Instalação de quadros de disjuntores modernos, fitas LED COB 2700K sem pontos, aterramento NBR 5410 e infraestrutura para carros elétricos.',
      rating: 4.8,
      reviewCount: 78,
      completedWorksCount: 165,
      isVerified: true,
      isProPlan: true,
      badgeText: '⚡ ELETRICISTA PRO',
      priceRange: 'Ponto a partir de R$ 55',
      skills: ['Quadro de Disjuntores', 'Fitas LED COB', 'Wallbox Carro Elétrico'],
      phone: '(21) 98765-1122',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pro-6',
      name: 'Renova Pinturas & Efeito Cimento Queimado',
      specialty: 'Pintura Fina, Cimento Queimado Suvinil & Airless',
      role: 'service',
      city: 'Belo Horizonte',
      state: 'MG',
      bio: 'Pintura mecanizada Airless para obras rápidas e limpas. Aplicação profissional de cimento queimado rústico e aveludado, verniz PU e restauração de fachadas prediais.',
      rating: 4.9,
      reviewCount: 63,
      completedWorksCount: 120,
      isVerified: true,
      isProPlan: false,
      priceRange: 'R$ 22 - R$ 45/m²',
      skills: ['Cimento Queimado', 'Pintura Airless', 'Massa Corrida com Lixadeira Aspirada'],
      phone: '(31) 98456-7890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pro-7',
      name: 'Drywall & Gesso Arte Contemporânea',
      specialty: 'Forros de Gesso com Tabica, Sancas & Cortineiros Iluminados',
      role: 'service',
      city: 'Curitiba',
      state: 'PR',
      bio: 'Projetos acústicos e decorativos em gesso acartonado Knauf/Placo. Execução de rasgos de luz contínuos, cortineiros embutidos e isolamento termoacústico com lã de rocha.',
      rating: 4.8,
      reviewCount: 39,
      completedWorksCount: 88,
      isVerified: true,
      isProPlan: false,
      priceRange: 'R$ 65 - R$ 110/m²',
      skills: ['Forro com Tabica', 'Rasgo de Luz', 'Paredes Acústicas Drywall'],
      phone: '(41) 99876-5432',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pro-8',
      name: 'Marcenaria & Design Sob Medida',
      specialty: 'Móveis Planejados 100% MDF, Cozinhas & Painéis Ripados',
      role: 'service',
      city: 'São Paulo',
      state: 'SP',
      bio: 'Marcenaria fina com ferragens amortecidas Blum e Hafele. Projetos 3D integrados, fita de borda PUR resistente à água e acabamentos em lâmina natural de madeira e laca.',
      rating: 5.0,
      reviewCount: 52,
      completedWorksCount: 104,
      isVerified: true,
      isProPlan: true,
      badgeText: '🪵 MARCENARIA DE ALTO PADRÃO',
      priceRange: 'Projetos Sob Medida',
      skills: ['MDF Naval 18mm', 'Ferragens Blum', 'Painéis Ripados'],
      phone: '(11) 97111-2222',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // Mock list of user sent requests
  const MOCK_USER_REQUESTS = [
    {
      id: 'req-1',
      proName: 'Studio Vértice Arquitetura',
      service: 'Projeto de Reforma de Apartamento 110m²',
      status: 'Respondido',
      statusColor: '#10B981',
      date: 'Hoje, 10:20',
      phone: '(11) 98765-4321'
    },
    {
      id: 'req-2',
      proName: 'Mestre Carlos Silva & Equipe',
      service: 'Assentamento de 85m² de Porcelanato 120x120',
      status: 'Em Análise',
      statusColor: '#F59E0B',
      date: 'Ontem',
      phone: '(11) 99123-4567'
    }
  ];

  // Filtering
  const filteredPros = PROS_DB.filter(pro => {
    const matchesSearch = 
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pro.skills && pro.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCity = selectedCity === 'Todas' || pro.city.toLowerCase() === selectedCity.split(',')[0].toLowerCase();

    let matchesCategory = true;
    if (selectedCategory !== 'Todos') {
      if (selectedCategory === 'Arquitetura') matchesCategory = pro.role === 'architect';
      else if (selectedCategory === 'Engenharia') matchesCategory = pro.role === 'engineer';
      else if (selectedCategory === 'Construtora') matchesCategory = pro.role === 'builder';
      else matchesCategory = pro.specialty.toLowerCase().includes(selectedCategory.toLowerCase());
    }

    return matchesSearch && matchesCity && matchesCategory;
  });

  // Sort: PRO plans first
  filteredPros.sort((a, b) => {
    if (a.isProPlan && !b.isProPlan) return -1;
    if (!a.isProPlan && b.isProPlan) return 1;
    return b.rating - a.rating;
  });

  const handleOpenWhatsApp = (pro: typeof PROS_DB[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = pro.phone?.replace(/\D/g, '') || '';
    const message = `Olá ${pro.name}! Encontrei seu perfil no CentralObra Connect e gostaria de solicitar um orçamento para uma obra/reforma.`;
    window.open(`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px', minHeight: '100%' }}>
      
      {/* Header Centralizado */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 16, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
          <Sparkles size={16} /> Radar de Profissionais da Construção
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px 0', lineHeight: 1.2 }}>
          CentralObra <span style={{ color: '#3B82F6' }}>Connect</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
          Encontre arquitetos, engenheiros, construtoras e prestadores verificados com portfólio comprovado e avaliação 5 estrelas na sua região.
        </p>
      </div>

      {/* Main Tabs: Encontrar Profissionais vs Minhas Solicitações */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('profissionais')}
          style={{
            padding: '10px 20px',
            borderRadius: 16,
            fontWeight: 800,
            fontSize: 14,
            backgroundColor: activeTab === 'profissionais' ? 'var(--color-primary)' : 'var(--bg-surface)',
            color: activeTab === 'profissionais' ? '#FFF' : 'var(--text-main)',
            border: '1px solid',
            borderColor: activeTab === 'profissionais' ? 'var(--color-primary)' : 'var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          🔍 Buscar Profissionais ({filteredPros.length})
        </button>
        <button
          onClick={() => setActiveTab('solicitacoes')}
          style={{
            padding: '10px 20px',
            borderRadius: 16,
            fontWeight: 800,
            fontSize: 14,
            backgroundColor: activeTab === 'solicitacoes' ? 'var(--color-primary)' : 'var(--bg-surface)',
            color: activeTab === 'solicitacoes' ? '#FFF' : 'var(--text-main)',
            border: '1px solid',
            borderColor: activeTab === 'solicitacoes' ? 'var(--color-primary)' : 'var(--border-subtle)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          📨 Minhas Solicitações <span style={{ padding: '2px 8px', borderRadius: 10, backgroundColor: 'rgba(59,130,246,0.2)', color: '#3B82F6', fontSize: 11 }}>2</span>
        </button>
      </div>

      {activeTab === 'profissionais' ? (
        <>
          {/* Search & Location Filter Bar */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Busque por nome, especialidade (ex: Porcelanato, Elétrica, Projetos)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: 46, borderRadius: 16, height: 48 }}
              />
            </div>

            {/* City Filter */}
            <div style={{ minWidth: 200 }}>
              <select
                className="input-field"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                style={{ height: 48, borderRadius: 16 }}
              >
                {CITIES.map(c => (
                  <option key={c} value={c}>
                    📍 {c === 'Todas' ? 'Todas as Cidades' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, marginBottom: 24 }} className="hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  border: '1px solid',
                  backgroundColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--bg-surface)',
                  color: selectedCategory === cat.id ? '#FFF' : 'var(--text-main)',
                  borderColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Directory Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filteredPros.map(pro => (
              <motion.div
                key={pro.id}
                whileHover={{ y: -4, boxShadow: '0 20px 30px -10px rgba(0,0,0,0.15)' }}
                className="glass-panel"
                style={{
                  borderRadius: 24,
                  border: pro.isProPlan ? '2px solid rgba(245,158,11,0.4)' : '1px solid var(--border-subtle)',
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-panel)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* PRO Golden Badge Flag */}
                {pro.isProPlan && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'rgba(245,158,11,0.18)',
                    color: '#F59E0B',
                    padding: '6px 14px',
                    borderBottomLeftRadius: 16,
                    fontSize: 11,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    borderLeft: '1px solid rgba(245,158,11,0.3)',
                    borderBottom: '1px solid rgba(245,158,11,0.3)'
                  }}>
                    <Crown size={13} /> {pro.badgeText || 'DESTAQUE PRO'}
                  </div>
                )}

                <div>
                  {/* Top info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{
                      width: 58,
                      height: 58,
                      borderRadius: 18,
                      backgroundImage: `url(${pro.photoUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: 'var(--bg-surface)',
                      border: '2px solid var(--border-subtle)',
                      flexShrink: 0
                    }} />

                    <div style={{ flex: 1, minWidth: 0, paddingRight: pro.isProPlan ? 90 : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pro.name}
                        </h3>
                        {pro.isVerified && <ShieldCheck size={16} color="#3B82F6" style={{ flexShrink: 0 }} />}
                      </div>

                      <p style={{ margin: '2px 0 0 0', fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pro.specialty}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#F59E0B', fontWeight: 800 }}>
                          <Star size={12} fill="currentColor" /> {pro.rating.toFixed(1)} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({pro.reviewCount})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <MapPin size={12} /> {pro.city}, {pro.state}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 14px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {pro.bio}
                  </p>

                  {/* Skills badges */}
                  {pro.skills && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      {pro.skills.map((sk, idx) => (
                        <span key={idx} style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 8, backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div style={{ paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block' }}>Estimativa</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)' }}>{pro.priceRange || 'Sob Consulta'}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={(e) => handleOpenWhatsApp(pro, e)}
                      className="btn-secondary"
                      style={{
                        padding: '8px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#10B981',
                        borderColor: 'rgba(16,185,129,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle size={15} /> WhatsApp
                    </button>

                    <button
                      onClick={() => setSelectedProForQuote(pro)}
                      className="btn-primary"
                      style={{
                        padding: '8px 14px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      Pedir Orçamento
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPros.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Search size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>Nenhum profissional encontrado</h3>
              <p style={{ fontSize: 14, margin: 0 }}>Tente buscar com outros termos ou selecione "Todas as Cidades".</p>
            </div>
          )}
        </>
      ) : (
        /* TAB 2: MINHAS SOLICITAÇÕES */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Histórico de Orçamentos Solicitados
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              Acompanhe as propostas e respostas enviadas pelos profissionais contratados no CentralObra Connect.
            </p>
          </div>

          {MOCK_USER_REQUESTS.map(req => (
            <div key={req.id} className="glass-panel" style={{ padding: 20, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{req.proName}</h4>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 8, backgroundColor: `${req.statusColor}22`, color: req.statusColor }}>
                    {req.status}
                  </span>
                </div>
                <p style={{ margin: '0 0 6px 0', fontSize: 13, color: 'var(--text-muted)' }}>{req.service}</p>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Enviado em {req.date}</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => {
                    const clean = req.phone.replace(/\D/g, '');
                    window.open(`https://api.whatsapp.com/send?phone=55${clean}&text=Olá! Sobre a solicitação do serviço "${req.service}" no CentralObra Connect...`, '_blank');
                  }}
                  className="btn-primary"
                  style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <MessageCircle size={15} /> Conversar no WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Request Modal */}
      {selectedProForQuote && (
        <RequestQuoteModal
          uid={selectedProForQuote.id}
          profile={selectedProForQuote}
          onClose={() => setSelectedProForQuote(null)}
        />
      )}
    </div>
  );
}