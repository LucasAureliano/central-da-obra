import { motion } from 'framer-motion';
import { DollarSign, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export function FinanceDemoSection() {
  const handleScrollToRegister = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="landing-section">
      <div className="landing-container">
        <div className="bento-grid" style={{ alignItems: 'center' }}>
          
          {/* Left Column (Content) */}
          <motion.div 
            className="col-span-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ paddingRight: 'clamp(0px, 4vw, 48px)' }}
          >
            <div className="card-icon-wrapper" style={{ marginBottom: 32 }}>
              <DollarSign size={24} />
            </div>
            
            <h2 className="landing-section-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16 }}>
              O Dinheiro da Obra sob Controle
            </h2>
            
            <p className="landing-section-subtitle" style={{ marginBottom: 32 }}>
              Gerencie orçamentos, registre gastos diários, anexe comprovantes e saiba exatamente quanto custa cada etapa da construção.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--text-main)' }}>Acompanhamento de orçamento vs real</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--text-main)' }}>Gráficos automáticos de custo por etapa</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--text-main)' }}>Escaneamento de notas fiscais via foto</span>
              </div>
            </div>
            
            <button onClick={handleScrollToRegister} className="btn-landing-primary">
              Conhecer Gestão Financeira <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Right Column (Visual) */}
          <motion.div 
            className="col-span-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mockup-window" style={{ position: 'relative' }}>
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              
              <div style={{ padding: 24, background: 'var(--bg-base)' }}>
                {/* Simulated Financial App UI */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>Custo Total da Obra</div>
                    <div style={{ color: 'var(--text-main)', fontSize: 32, fontWeight: 700 }}>R$ 145.200,00</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(39, 201, 63, 0.1)', color: '#27C93F', padding: '4px 8px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>
                    <TrendingUp size={14} /> Dentro do previsto
                  </div>
                </div>

                {/* Simulated Chart */}
                <div style={{ display: 'flex', height: 120, alignItems: 'flex-end', gap: 8, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                  {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                      <div style={{ width: '100%', height: `${height}%`, background: i === 6 ? 'var(--color-primary)' : 'var(--border-strong)', borderRadius: 4 }}></div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>M{i+1}</div>
                    </div>
                  ))}
                </div>
                
                {/* Recent Transactions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧱</div>
                      <div>
                        <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 14 }}>Materiais - Alvenaria</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Depósito Silva</div>
                      </div>
                    </div>
                    <div style={{ color: '#FF5F56', fontWeight: 600, fontSize: 14 }}>- R$ 4.500,00</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👷</div>
                      <div>
                        <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 14 }}>Mão de Obra - Semana</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Empreiteira</div>
                      </div>
                    </div>
                    <div style={{ color: '#FF5F56', fontWeight: 600, fontSize: 14 }}>- R$ 2.800,00</div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
