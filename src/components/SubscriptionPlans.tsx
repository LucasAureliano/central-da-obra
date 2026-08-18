import React, { useState } from 'react';
import { CheckCircle2, Zap, Building2, Crown, ShieldCheck, X, Sparkles, ChevronRight, FileText, Bot, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PLANS_CONFIG } from '../config/plans';
import { useAuth } from '../contexts/AuthContext';
import { CheckoutBrick } from './shared/CheckoutBrick';

interface SubscriptionPlansProps {
  onBack?: () => void;
  onSubscribe?: (plan: 'starter' | 'pro' | 'business') => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onBack, onSubscribe }) => {
  const [coupon, setCoupon] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const { subscription, usage, limits, plan } = useSubscription();
  const { profile } = useAuth();
  
  const roleKey = profile?.role || 'owner';
  const rolePlans = PLANS_CONFIG[roleKey];
  
  const freePrice = 0;
  const starterPrice = 29.99;
  const proPrice = 49.99;
  const businessPrice = 99.99;

  const handleSubscribe = async (selectedPlan: 'starter' | 'pro' | 'business') => {
    if (!profile) return;
    try {
      setLoadingCheckout(true);
      const price = selectedPlan === 'pro' ? proPrice : selectedPlan === 'starter' ? starterPrice : businessPrice;
      const res = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.uid,
          userEmail: profile.email,
          planId: selectedPlan,
          price: price,
          title: `CentralObra ${selectedPlan.toUpperCase()} (Mensal)`
        })
      });
      const data = await res.json();
      if (data.id) {
        setPreferenceId(data.id);
      } else {
        toast.error('Erro ao gerar pagamento.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao conectar com o gateway.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  // If we have a preferenceId, show ONLY the checkout brick
  if (preferenceId) {
    return (
      <div className="screen-content flex flex-col items-center justify-center p-8 bg-transparent hide-scrollbar pb-32">
        <h2 className="text-2xl font-black text-[var(--text-main)] mb-2">Finalizar Assinatura</h2>
        <p className="text-[var(--text-muted)] mb-8">Escolha sua forma de pagamento preferida.</p>
        
        <CheckoutBrick 
          preferenceId={preferenceId} 
          onSuccess={() => {
            toast.success('Pagamento processado com sucesso! Validando...', { icon: '🎉' });
            setPreferenceId(null);
            if (onBack) onBack();
          }}
          onError={() => toast.error('Houve um erro no processamento.')}
        />
        
        <button 
          onClick={() => setPreferenceId(null)}
          className="mt-6 text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold"
        >
          Cancelar e Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '24px 20px 100px 20px', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-main)', marginBottom: 12, lineHeight: 1.2 }}>
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
      <div className="glass-panel mb-12 p-6 max-w-[800px] mx-auto rounded-2xl border border-[var(--border-subtle)] bg-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Orçamentos */}
          {limits.maxQuotes < 9999 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-main)] font-medium">Orçamentos Mês</span>
                <span className="text-[var(--text-muted)]">{usage.quotesCount} de {limits.maxQuotes} utilizados</span>
              </div>
              <div className="h-2 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${usage.quotesCount >= limits.maxQuotes ? 'bg-red-500' : usage.quotesCount / limits.maxQuotes > 0.8 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                  style={{ width: `${Math.min(100, (usage.quotesCount / limits.maxQuotes) * 100)}%` }}
                />
              </div>
              {usage.quotesCount > 0 && usage.quotesCount < limits.maxQuotes && (usage.quotesCount / limits.maxQuotes > 0.8) && (
                <p className="text-xs text-amber-500 mt-2">Você está próximo do limite gratuito.</p>
              )}
            </div>
          )}
          
          {/* Obras */}
          {limits.maxWorks < 9999 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-main)] font-medium">Obras Ativas</span>
                <span className="text-[var(--text-muted)]">{usage.worksCount} de {limits.maxWorks} utilizadas</span>
              </div>
              <div className="h-2 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${usage.worksCount >= limits.maxWorks ? 'bg-red-500' : usage.worksCount / limits.maxWorks >= 0.8 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(100, (usage.worksCount / limits.maxWorks) * 100)}%` }}
                />
              </div>
              {usage.worksCount > 0 && usage.worksCount < limits.maxWorks && (usage.worksCount / limits.maxWorks >= 0.8) && (
                <p className="text-xs text-amber-500 mt-2">Você está próximo do limite gratuito.</p>
              )}
            </div>
          )}

          {/* Clientes */}
          {limits.maxClients < 9999 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-main)] font-medium">Clientes</span>
                <span className="text-[var(--text-muted)]">{usage.clientsCount} de {limits.maxClients} utilizados</span>
              </div>
              <div className="h-2 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${usage.clientsCount >= limits.maxClients ? 'bg-red-500' : usage.clientsCount / limits.maxClients > 0.8 ? 'bg-amber-500' : 'bg-purple-500'}`} 
                  style={{ width: `${Math.min(100, (usage.clientsCount / limits.maxClients) * 100)}%` }}
                />
              </div>
              {usage.clientsCount > 0 && usage.clientsCount < limits.maxClients && (usage.clientsCount / limits.maxClients > 0.8) && (
                <p className="text-xs text-amber-500 mt-2">Você está próximo do limite gratuito.</p>
              )}
            </div>
          )}
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
            <span style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-main)' }}>R$ {starterPrice.toFixed(2).replace('.', ',')}</span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/mês</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            {(rolePlans.starter?.features || ['Até 3 obras ativas', 'Até 15 orçamentos/mês', 'Até 30 clientes', 'Suporte por email']).map((feature, i) => (
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
                <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-main)' }}>R$ {proPrice.toFixed(2).replace('.', ',')}</span>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/mês</span>
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
              <span style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-main)' }}>R$ {businessPrice.toFixed(2).replace('.', ',')}</span>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/mês</span>
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

    </div>
  );
};
