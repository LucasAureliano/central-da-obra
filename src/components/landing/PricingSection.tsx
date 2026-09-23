import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Crown, Sparkles, Building2, Bot } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PLANS_CONFIG } from '../../config/plans';

interface PricingSectionProps {
  onSubscribe: () => void;
  billingCycle: 'mensal' | 'anual';
  setBillingCycle: (cycle: 'mensal' | 'anual') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSubscribe, billingCycle, setBillingCycle }) => {
  const { profile } = useAuth();
  const role = profile?.role || 'owner';
  
  const rolePlans = PLANS_CONFIG[role];
  const isAnnual = billingCycle === 'anual';

  const getPrice = (plan: any) => {
    if (!plan) return 0;
    return isAnnual ? plan.yearlyPrice / 12 : plan.monthlyPrice; // Displaying equivalent monthly price for annual
  };

  const starterMonthly = rolePlans.starter ? rolePlans.starter.monthlyPrice : 29.90;
  const starterYearly = rolePlans.starter ? rolePlans.starter.yearlyPrice / 12 : 24.90;
  
  const proMonthly = rolePlans.pro ? rolePlans.pro.monthlyPrice : 49.90;
  const proYearly = rolePlans.pro ? rolePlans.pro.yearlyPrice / 12 : 39.90;

  const businessMonthly = rolePlans.business ? rolePlans.business.monthlyPrice : 99.90;
  const businessYearly = rolePlans.business ? rolePlans.business.yearlyPrice / 12 : 79.90;

  return (
    <section className="pricing-section" id="planos">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: 800, fontSize: 13, marginBottom: 24, letterSpacing: 1, textTransform: 'uppercase' }}>
            <Crown size={16} /> Planos Flexíveis
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 24, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            O Poder do Digital <br />
            <span style={{ color: 'var(--color-primary)' }}>ao seu Alcance</span>
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Escolha o plano ideal para o tamanho da sua operação e comece a escalar seus resultados hoje mesmo.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-panel)', padding: 6, borderRadius: 24, border: '1px solid var(--border-subtle)', position: 'relative' }}>
              <button 
                onClick={() => setBillingCycle('mensal')}
                style={{ padding: '12px 24px', borderRadius: 20, fontSize: 15, fontWeight: 700, backgroundColor: billingCycle === 'mensal' ? 'var(--color-primary)' : 'transparent', color: billingCycle === 'mensal' ? '#FFF' : 'var(--text-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 1 }}
              >
                Mensal
              </button>
              <button 
                onClick={() => setBillingCycle('anual')}
                style={{ padding: '12px 24px', borderRadius: 20, fontSize: 15, fontWeight: 700, backgroundColor: billingCycle === 'anual' ? 'var(--color-primary)' : 'transparent', color: billingCycle === 'anual' ? '#FFF' : 'var(--text-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                Anual <span style={{ backgroundColor: billingCycle === 'anual' ? 'rgba(255,255,255,0.2)' : 'rgba(59,130,246,0.1)', color: billingCycle === 'anual' ? '#FFF' : '#3B82F6', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 800 }}>-20%</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'stretch' }}>
          
          {/* FREE PLAN */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
            className="glass-panel" 
            style={{ padding: 40, borderRadius: 24, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>Gratuito</h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8 }}>O essencial para dar os primeiros passos digitais.</p>
            </div>
            <div style={{ marginBottom: 40 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-main)' }}>R$ 0</span>
              <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/mês</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              {['Até 1 Obra Ativa', 'Calculadoras Básicas', 'Controle Financeiro Simples', 'Geração de PDF (Com Logo)'].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2, opacity: 0.5 }} />
                  <span style={{ fontSize: 15, color: 'var(--text-main)', fontWeight: 500, opacity: 0.8 }}>{feature}</span>
                </div>
              ))}
            </div>
            <button className="btn-secondary" style={{ width: '100%', marginTop: 40, padding: 18, borderRadius: 16, fontWeight: 700, fontSize: 16 }} onClick={onSubscribe}>
              Começar Grátis
            </button>
          </motion.div>

          {/* BASIC PLAN */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(59,130,246,0.15)' }}
            className="glass-panel" 
            style={{ padding: 40, borderRadius: 24, border: '1px solid rgba(59,130,246,0.3)', display: 'flex', flexDirection: 'column', position: 'relative' }}
          >
            <div style={{ position: 'absolute', top: -12, left: 24, backgroundColor: '#3B82F6', color: '#FFF', padding: '3px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
              NOVO
            </div>
            <div style={{ marginBottom: 24, marginTop: 8 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>Básico</h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8 }}>Para quem precisa de mais sem pagar pelo Pro.</p>
            </div>
            <div style={{ marginBottom: 40 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-main)' }}>R$ {billingCycle === 'anual' ? starterYearly.toFixed(2).replace('.', ',') : starterMonthly.toFixed(2).replace('.', ',')}</span>
              <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/mês</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              {['3 Obras Simultâneas', '15 Orçamentos por mês', '30 Clientes', 'Financeiro e Cronograma', 'Suporte por Email'].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={20} color="#3B82F6" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: 'var(--text-main)', fontWeight: 500 }}>{feature}</span>
                </div>
              ))}
            </div>
            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: 40, padding: 18, borderRadius: 16, fontWeight: 800, fontSize: 16, color: '#3B82F6', borderColor: 'rgba(59,130,246,0.4)', backgroundColor: 'rgba(59,130,246,0.06)' }} 
              onClick={onSubscribe}
            >
              Assinar Básico
            </button>
          </motion.div>

          {/* PRO PLAN */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(37,99,235,0.2)' }}
            className="glass-panel" 
            style={{ padding: 40, borderRadius: 24, border: '2px solid var(--color-primary)', position: 'relative', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-surface)' }}
          >
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '6px 20px', borderRadius: 20, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(37,99,235,0.3)', whiteSpace: 'nowrap' }}>
              <Sparkles size={16} /> Mais Popular
            </div>
            <div style={{ marginBottom: 24, marginTop: 8 }}>
              <h3 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                PRO <Crown size={24} color="#F59E0B" />
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8 }}>Escala total para o engenheiro que não tem tempo a perder.</p>
            </div>
            <div style={{ marginBottom: 40 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-main)' }}>R$ {billingCycle === 'anual' ? proYearly.toFixed(2).replace('.', ',') : proMonthly.toFixed(2).replace('.', ',')}</span>
              <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/mês</span>
            </div>
            
            <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: 16, borderRadius: 16, marginBottom: 24, border: '1px solid rgba(37, 99, 235, 0.1)' }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Bot size={18} /> Copilot da Obra (IA)
              </h4>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Análise de escopo, geração automática de cronogramas e assistente técnico 24h.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              {['Até 10 Obras Simultâneas', 'Orçamentos Ilimitados', 'Acesso a +80 Calculadoras', 'Portal do Cliente Connect', 'PDFs Premium (White-label & QR)'].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: 'var(--text-main)', fontWeight: 600 }}>{feature}</span>
                </div>
              ))}
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: 40, padding: 18, borderRadius: 16, fontWeight: 800, fontSize: 16, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)' }} 
              onClick={onSubscribe}
            >
              Assinar PRO
            </button>
          </motion.div>

          {/* BUSINESS PLAN */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(139,92,246,0.2)' }}
            className="glass-panel" 
            style={{ padding: 40, borderRadius: 24, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                Business <Building2 size={24} color="#8B5CF6" />
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8 }}>Para construtoras e equipes com múltiplas operações.</p>
            </div>
            <div style={{ marginBottom: 40 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-main)' }}>R$ {billingCycle === 'anual' ? businessYearly.toFixed(2).replace('.', ',') : businessMonthly.toFixed(2).replace('.', ',')}</span>
              <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/mês</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              {['Obras Ilimitadas', 'Gestão de Múltiplos Profissionais', 'Permissões Granulares (RBAC)', 'Relatórios Consolidados', 'Suporte Prioritário VIP'].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={20} color="#8B5CF6" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: 'var(--text-main)', fontWeight: 500 }}>{feature}</span>
                </div>
              ))}
            </div>
            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: 40, padding: 18, borderRadius: 16, fontWeight: 700, fontSize: 16, color: '#8B5CF6', borderColor: 'rgba(139, 92, 246, 0.3)', backgroundColor: 'rgba(139, 92, 246, 0.05)' }} 
              onClick={onSubscribe}
            >
              Falar com Especialista
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
