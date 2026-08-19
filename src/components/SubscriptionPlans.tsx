import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { CheckCircle2, Zap, Building2, Crown, ShieldCheck, X, Sparkles, ChevronRight, FileText, Bot, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PLANS_CONFIG } from '../config/plans';
import { useAuth } from '../contexts/AuthContext';

interface SubscriptionPlansProps {
  onBack?: () => void;
  onSubscribe?: (plan: 'starter' | 'pro' | 'business') => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onBack, onSubscribe }) => {
  const [coupon, setCoupon] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const STRIPE_PRICES = {
    monthly: { starter: 'price_1U5y52Ht1GuKvdoeS6nyP9KJ', pro: 'price_1U5y5VHt1GuKvdoeG7DX2UrR', business: 'price_1U5y5wHt1GuKvdoefGFVgWho' },
    annual: { starter: 'price_1U5yKNHt1GuKvdoelS5v4j5E', pro: 'price_1U5yL4Ht1GuKvdoezJcnlgtc', business: 'price_1U5yMwHt1GuKvdoemZrVbRne' }
  };
  const [showMockCheckout, setShowMockCheckout] = useState<{plan: string, price: number, isAnnual?: boolean} | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const { subscription, usage, limits, plan } = useSubscription();
  const { profile, isGuest, setShowGuestModal, setGuestActionName } = useAuth();
  
  const roleKey = profile?.role || 'owner';
  const rolePlans = PLANS_CONFIG[roleKey];
  
  const starterPriceObj = isAnnual ? { val: 299.90, label: '/ano' } : { val: 29.90, label: '/mês' };
  const proPriceObj = isAnnual ? { val: 499.90, label: '/ano' } : { val: 49.90, label: '/mês' };
  const businessPriceObj = isAnnual ? { val: 799.00, label: '/ano' } : { val: 79.90, label: '/mês' };

  const freePrice = 0;
  const starterPrice = starterPriceObj.val;
  const proPrice = proPriceObj.val;
  const businessPrice = businessPriceObj.val;

  const handleSubscribe = async (selectedPlan: 'starter' | 'pro' | 'business') => {
    if (!profile) return;
    
    if (isGuest) {
      setGuestActionName('assinar um plano');
      setShowGuestModal(true);
      return;
    }

    if (Capacitor.isNativePlatform()) {
      toast.error('Gerencie sua assinatura através da loja de aplicativos (App Store ou Google Play).', {
        duration: 5000,
        icon: '📱'
      });
      return;
    }

    try {
      setLoadingCheckout(true);
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.uid,
          userEmail: profile.email,
          planId: selectedPlan,
          isAnnual: isAnnual,
          priceId: STRIPE_PRICES[isAnnual ? 'annual' : 'monthly'][selectedPlan]
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error && data.error !== 'MOCK_CHECKOUT_TRIGGER') {
        toast.error(data.details || data.error);
        setLoadingCheckout(false);
      } else {
        // Fallback to mock UI
        setShowMockCheckout({
          plan: selectedPlan,
          price: isAnnual ? (selectedPlan === 'pro' ? 499.90 : selectedPlan === 'starter' ? 299.90 : 799.00) : (selectedPlan === 'pro' ? 49.90 : selectedPlan === 'starter' ? 29.90 : 79.90),
          isAnnual
        });
        setLoadingCheckout(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao conectar com o provedor de pagamentos.');
      setLoadingCheckout(false);
    }
  };

  
  const handleMockPayment = async () => {
    if (!showMockCheckout || !profile) return;
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await updateDoc(doc(db, 'users', profile.uid), {
        subscription: {
          planId: showMockCheckout.plan,
          status: 'ACTIVE',
          source: 'sandbox_test',
          autoRenew: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        updatedAt: new Date()
      });
      toast.success('Pagamento simulado com sucesso! Plano ativado.');
      setShowMockCheckout(null);
      setTimeout(() => { window.location.hash = '#/checkout-success'; window.location.reload(); }, 500);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao simular pagamento.');
    }
  };



  return (
    <div className="animate-fade-in" style={{ padding: '20px 20px 100px', position: 'relative' }}>
      
      {/* Header Centralizado */}
      <div style={{ textAlign: 'center', marginBottom: 40, maxWidth: 800, margin: '0 auto 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
          <Sparkles size={16} /> Planos e Assinaturas
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-main)', marginBottom: 12, lineHeight: 1.3, whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {roleKey === 'service' ? 'Cresça seus serviços com a' : 
           roleKey === 'architect' || roleKey === 'engineer' ? 'Gestão avançada para seus' : 
           roleKey === 'builder' ? 'Escale sua Construtora com a' : 
           'Leve sua Gestão para o'} <span style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }}>
             {roleKey === 'service' ? ' CentralObra' : 
              roleKey === 'architect' || roleKey === 'engineer' ? ' Projetos' : 
              roleKey === 'builder' ? ' CentralObra' : 
              ' Próximo Nível'}
           </span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Escolha o plano ideal. O <strong style={{ color: 'var(--color-primary)' }}>Copilot da Obra</strong> com IA e Recursos Premium vão transformar seus resultados.
        </p>
      </div>

      {/* Uso Atual - Meu Plano */}
      <div className="glass-panel" style={{ marginBottom: 48, padding: 24, maxWidth: 800, margin: '0 auto 48px', borderRadius: 24, border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', filter: 'blur(40px)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, position: 'relative', zIndex: 10 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <Activity size={20} color="var(--color-primary)" />
              Seu Uso Atual
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Plano Ativo: <strong style={{ textTransform: 'uppercase', color: 'var(--text-main)' }}>{plan.name}</strong> 
              {subscription.status === 'COMP' && <span style={{ marginLeft: 8, fontSize: 11, backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>CORTESIA</span>}
              {subscription.status === 'TRIAL' && <span style={{ marginLeft: 8, fontSize: 11, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>TRIAL</span>}
              {subscription.expiresAt && <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>Expira: {subscription.expiresAt.toDate ? subscription.expiresAt.toDate().toLocaleDateString() : new Date(subscription.expiresAt).toLocaleDateString()}</span>}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, position: 'relative', zIndex: 10 }}>
          
          {/* Obras / Projetos */}
          {(roleKey === 'owner' || roleKey === 'builder' ? limits.maxWorks : limits.maxProjects) < 9999 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{roleKey === 'owner' || roleKey === 'builder' ? 'Obras Ativas' : 'Projetos'}</span>
                <span style={{ color: 'var(--text-muted)' }}>{roleKey === 'owner' || roleKey === 'builder' ? usage.worksCount : usage.projectsCount} de {roleKey === 'owner' || roleKey === 'builder' ? limits.maxWorks : limits.maxProjects}</span>
              </div>
              <div style={{ height: 8, width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ height: '100%', borderRadius: 4, transition: 'all 0.5s', backgroundColor: '#3B82F6', width: `${Math.min(100, ((roleKey === 'owner' || roleKey === 'builder' ? usage.worksCount : usage.projectsCount) / (roleKey === 'owner' || roleKey === 'builder' ? limits.maxWorks : limits.maxProjects)) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Orçamentos (Service only) */}
          {roleKey === 'service' && limits.maxQuotes < 9999 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Orçamentos (Mês)</span>
                <span style={{ color: 'var(--text-muted)' }}>{usage.quotesCount} de {limits.maxQuotes}</span>
              </div>
              <div style={{ height: 8, width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ height: '100%', borderRadius: 4, transition: 'all 0.5s', backgroundColor: '#F59E0B', width: `${Math.min(100, (usage.quotesCount / limits.maxQuotes) * 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Clientes (Service, Architect, Engineer) */}
          {roleKey !== 'owner' && roleKey !== 'builder' && limits.maxClients < 9999 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Clientes</span>
                <span style={{ color: 'var(--text-muted)' }}>{usage.clientsCount} de {limits.maxClients}</span>
              </div>
              <div style={{ height: 8, width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ height: '100%', borderRadius: 4, transition: 'all 0.5s', backgroundColor: '#A855F7', width: `${Math.min(100, (usage.clientsCount / limits.maxClients) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Equipe (Builder only) */}
          {roleKey === 'builder' && limits.maxTeamMembers < 9999 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Membros da Equipe</span>
                <span style={{ color: 'var(--text-muted)' }}>{usage.teamMembersCount} de {limits.maxTeamMembers}</span>
              </div>
              <div style={{ height: 8, width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ height: '100%', borderRadius: 4, transition: 'all 0.5s', backgroundColor: '#10B981', width: `${Math.min(100, (usage.teamMembersCount / limits.maxTeamMembers) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 32, gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: !isAnnual ? 'var(--text-main)' : 'var(--text-muted)' }}>Mensal</span>
          <div 
            style={{ width: 64, height: 36, borderRadius: 18, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', position: 'relative', cursor: 'pointer' }}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <motion.div 
              animate={{ x: !isAnnual ? 4 : 32 }}
              style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: 'var(--color-primary)', position: 'absolute', top: 4 }}
            />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: isAnnual ? 'var(--text-main)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            Anual <span style={{ fontSize: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 8px', borderRadius: 12 }}>2 meses grátis</span>
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto mt-8">
        
        {/* FREE PLAN */}
        <motion.div 
          whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          className="glass-panel" 
          style={{ padding: 32, borderRadius: 24, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>{rolePlans.free.name}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Para experimentar e gerenciar necessidades básicas.</p>
          </div>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-main)' }}>R$ 0</span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/para sempre</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            {rolePlans.free.features.map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <CheckCircle2 size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 500 }}>{feature}</span>
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ width: '100%', marginTop: 32, padding: 16, borderRadius: 16, fontWeight: 700, fontSize: 16 }} disabled>
            {subscription.planId === 'free' ? 'Plano Atual' : 'Plano Gratuito'}
          </button>
        </motion.div>

        {/* STARTER PLAN */}
        <motion.div 
          whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(59,130,246,0.15)' }}
          className="glass-panel" 
          style={{ padding: 32, borderRadius: 24, border: '1px solid rgba(59,130,246,0.3)', display: 'flex', flexDirection: 'column', position: 'relative' }}
        >
          <div style={{ position: 'absolute', top: -12, left: 24, backgroundColor: '#3B82F6', color: '#FFF', padding: '3px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
            NOVO
          </div>
          <div style={{ marginBottom: 24, marginTop: 8 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>{rolePlans.starter?.name || 'Básico'}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Para quem precisa de mais sem pagar pelo Pro.</p>
          </div>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-main)' }}>R$ {starterPriceObj.val.toFixed(2).replace('.', ',')}</span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{isAnnual ? '/ano' : '/mês'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            {(rolePlans.starter?.features || ['Até 3 obras ativas', `Até 15 orçamentos${isAnnual ? '/ano' : '/mês'}`, 'Até 30 clientes', 'Suporte por email']).map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <CheckCircle2 size={18} color="#3B82F6" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 500 }}>{feature}</span>
              </div>
            ))}
          </div>
          {subscription.planId === 'starter' ? (
            <button className="btn-secondary" style={{ width: '100%', marginTop: 32, padding: 16, borderRadius: 16, fontWeight: 700, fontSize: 16 }} disabled>
              Plano Atual
            </button>
          ) : (
            <button 
              className="btn-secondary"
              style={{ width: '100%', marginTop: 32, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16, color: '#3B82F6', borderColor: 'rgba(59,130,246,0.4)', backgroundColor: 'rgba(59,130,246,0.06)' }} 
              onClick={() => handleSubscribe('starter')}
              disabled={loadingCheckout || ['COMP', 'TESTER'].includes(subscription.status)}
            >
              {loadingCheckout ? 'Processando...' : `Assinar Básico`}
            </button>
          )}
        </motion.div>

        {/* PRO PLAN */}
        <motion.div 
          whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(37,99,235,0.2)' }}
          className="glass-panel" 
          style={{ padding: 32, borderRadius: 24, border: '2px solid var(--color-primary)', position: 'relative', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}
        >
          <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            <Sparkles size={14} /> Mais Popular
          </div>
          <div style={{ marginBottom: 24, marginTop: 8 }}>
            <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {rolePlans.pro.name} <Crown size={20} color="#F59E0B" />
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Para quem precisa de escala e profissionalismo total.</p>
          </div>
          <div style={{ marginBottom: 32 }}>
            {['COMP', 'TESTER'].includes(subscription.status) ? (
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-primary)' }}>Acesso Concedido</span>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Premium via CentralObra</span>
              </div>
            ) : (
              <>
                <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-main)' }}>R$ {proPriceObj.val.toFixed(2).replace('.', ',')}</span>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{isAnnual ? '/ano' : '/mês'}</span>
              </>
            )}
          </div>
          
          <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: 16, borderRadius: 16, marginBottom: 24, border: '1px solid rgba(37, 99, 235, 0.1)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Bot size={16} /> Inclui o Copilot da Obra (IA)
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Interpreta normas, gera cronogramas automaticamente, revisa propostas, e atua como seu assistente especializado 24/7.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            {rolePlans.pro.features.map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 600 }}>{feature}</span>
              </div>
            ))}
          </div>
          {subscription.planId === 'pro' ? (
            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: 32, padding: 16, borderRadius: 16, fontWeight: 700, fontSize: 16 }} 
              disabled
            >
              Plano Atual
            </button>
          ) : (
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: 32, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)' }} 
              onClick={() => handleSubscribe('pro')}
              disabled={loadingCheckout || ['COMP', 'TESTER'].includes(subscription.status)}
            >
              {loadingCheckout ? 'Processando...' : `Assinar PRO`}
            </button>
          )}
        </motion.div>

        {/* BUSINESS PLAN - Só exibe se for builder */}
        {roleKey === 'builder' && rolePlans.business && businessPrice !== null && (
          <motion.div 
            whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(139,92,246,0.2)' }}
            className="glass-panel" 
            style={{ padding: 32, borderRadius: 24, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {rolePlans.business.name} <Building2 size={20} color="#8B5CF6" />
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Para construtoras e grandes operações.</p>
            </div>
            <div style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-main)' }}>R$ {businessPriceObj.val.toFixed(2).replace('.', ',')}</span>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{isAnnual ? '/ano' : '/mês'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              {rolePlans.business.features.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={18} color="#8B5CF6" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 500 }}>{feature}</span>
                </div>
              ))}
            </div>
            <button className="btn-secondary" style={{ width: '100%', marginTop: 32, padding: 16, borderRadius: 16, fontWeight: 700, fontSize: 16, color: '#8B5CF6', borderColor: 'rgba(139, 92, 246, 0.3)', backgroundColor: 'rgba(139, 92, 246, 0.05)' }} onClick={() => handleSubscribe('business')}>
              Assinar Business
            </button>
          </motion.div>
        )}

      </div>

      <div className="glass-panel" style={{ maxWidth: 400, margin: '40px auto 0', padding: '24px', backgroundColor: 'transparent', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
        <h4 className="text-sm font-bold text-[var(--text-main)] mb-2">Possui um Cupom Promocional?</h4>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ex: CENTRAL100" 
            value={coupon}
            onChange={e => setCoupon(e.target.value.toUpperCase())}
            className="flex-1 bg-transparent border border-[var(--border-subtle)] rounded-lg px-3 outline-none text-sm text-[var(--text-main)] focus:border-blue-500"
          />
          <button 
            className="btn-secondary py-2 px-4 rounded-lg text-sm font-bold"
            onClick={() => {
              if(!coupon) return;
              toast.success('Cupom inválido ou expirado.');
            }}
          >
            Aplicar
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <ShieldCheck size={32} color="var(--text-muted)" opacity={0.5} />
        <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 400 }}>
          Pagamento seguro e transparente. Você pode cancelar sua assinatura premium a qualquer momento, sem taxas adicionais.
        </p>
      </div>

      {preferenceId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel hide-scrollbar"
            style={{
              width: '100%',
              maxWidth: 500,
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 24,
              padding: 0,
              backgroundColor: 'var(--bg-panel)',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-panel)', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Finalizar Assinatura</h2>
              <button 
                onClick={() => setPreferenceId(null)}
                style={{
                  background: 'rgba(128,128,128,0.1)',
                  border: 'none',
                  width: 32, height: 32,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-main)', cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24 }}>
              
            </div>
          </motion.div>
        </div>
      )}

      {showMockCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} style={{ width: '100%', maxWidth: 400, background: 'var(--bg-panel)', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '24px 24px 32px', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => setShowMockCheckout(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(128,128,128,0.1)', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} color="var(--text-main)" />
              </button>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Crown size={32} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px' }}>Ambiente de Testes</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>As chaves do Stripe não estão configuradas. Utilize a simulação.</p>
            </div>
            <div style={{ padding: '32px 24px 24px', textAlign: 'center', marginTop: -20, background: 'var(--bg-panel)', borderRadius: '24px 24px 0 0' }}>
              <div style={{ marginBottom: 32 }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 8, fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Plano Selecionado</p>
                <h3 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 8 }}>{showMockCheckout.plan}</h3>
                <p style={{ fontSize: 36, fontWeight: 900, color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.03em' }}>R$ {showMockCheckout.price.toFixed(2).replace('.', ',')}<span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 600 }}>{isAnnual ? '/ano' : '/mês'}</span></p>
              </div>
              <button onClick={handleMockPayment} className="btn-primary" style={{ width: '100%', padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                Simular Pagamento <Sparkles size={18} />
              </button>
              <button onClick={() => setShowMockCheckout(null)} className="btn-secondary" style={{ width: '100%', padding: 16, borderRadius: 16, fontWeight: 700, fontSize: 16, marginTop: 12, background: 'transparent' }}>
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
