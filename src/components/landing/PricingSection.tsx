import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Building2, Crown, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingSectionProps {
  onSubscribe: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSubscribe }) => {
  const [billingCycle, setBillingCycle] = useState<'mensal' | 'anual'>('anual');

  const starterMonthly = 29.99;
  const starterYearly = 23.99; // (287.90 / 12)

  const proMonthly = 49.99;
  const proYearly = 39.99; // (479.90 / 12)

  const businessMonthly = 79.90;
  const businessYearly = 66.58; // (799.00 / 12)

  return (
    <section className="landing-section" style={{ padding: '80px 20px', backgroundColor: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-main)', marginBottom: 16 }}>
            Planos que se pagam na <span style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }}>primeira obra</span>
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
            Experimente grátis. Quando a operação crescer, escolha o plano ideal para alavancar seus lucros com inteligência artificial.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 32, gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: billingCycle === 'mensal' ? 'var(--text-main)' : 'var(--text-muted)' }}>Mensal</span>
            <div 
              style={{ width: 64, height: 36, borderRadius: 18, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', position: 'relative', cursor: 'pointer' }}
              onClick={() => setBillingCycle(billingCycle === 'mensal' ? 'anual' : 'mensal')}
            >
              <motion.div 
                animate={{ x: billingCycle === 'mensal' ? 4 : 32 }}
                style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: 'var(--color-primary)', position: 'absolute', top: 4 }}
              />
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: billingCycle === 'anual' ? 'var(--text-main)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              Anual <span style={{ fontSize: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 8px', borderRadius: 12 }}>Economize 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          
          {/* FREE PLAN */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
            className="glass-panel" 
            style={{ padding: 40, borderRadius: 24, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>Starter</h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8 }}>Para engenheiros autônomos iniciando digitalização.</p>
            </div>
            <div style={{ marginBottom: 40 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-main)' }}>R$ 0</span>
              <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/para sempre</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              {['1 Obra Simultânea', '3 Orçamentos por mês', 'Calculadoras Básicas', 'Diário de Obra Padrão'].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: 'var(--text-main)', fontWeight: 500 }}>{feature}</span>
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
              {['Até 10 Obras Simultâneas', 'Orçamentos Ilimitados', 'Acesso a +80 Calculadoras', 'Portal do Cliente Connect', 'Exportação PDF/Excel (Logo)'].map((feature, i) => (
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
