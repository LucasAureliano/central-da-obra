import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

export function InsightsDemoSection() {
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
              <Lightbulb size={24} />
            </div>
            
            <h2 className="landing-section-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16 }}>
              Insights e Previsibilidade
            </h2>
            
            <p className="landing-section-subtitle" style={{ marginBottom: 32 }}>
              Nossos algoritmos analisam o histórico da sua obra e te avisam antes dos problemas acontecerem. Preveja faltas de material, estouros de orçamento e atrase de cronograma.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 40 }}>
              <div style={{ padding: 16, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
                <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 24, marginBottom: 4 }}>98%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Precisão nos cálculos de argamassa</div>
              </div>
              <div style={{ padding: 16, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
                <div style={{ color: '#FFBD2E', fontWeight: 600, fontSize: 24, marginBottom: 4 }}>Risco</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Alerta de aumento no aço CA-50</div>
              </div>
            </div>
            
            <button onClick={handleScrollToRegister} className="btn-landing-secondary">
              Ver Relatórios de Exemplo <ArrowRight size={18} />
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
                {/* Simulated AI Insights UI */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-main)', fontSize: 16, fontWeight: 600 }}>Análise Inteligente da Obra</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Gerado há 2 horas</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  
                  <div style={{ padding: 20, background: 'rgba(255, 189, 46, 0.1)', border: '1px solid rgba(255, 189, 46, 0.3)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FFBD2E', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                      ⚠️ Alerta de Orçamento
                    </div>
                    <div style={{ color: 'var(--text-main)', fontSize: 13, lineHeight: 1.5 }}>
                      O gasto com blocos cerâmicos está <strong>12% acima</strong> da previsão inicial. Recomendamos revisar o índice de quebra no canteiro e conferir a argamassa de assentamento.
                    </div>
                  </div>

                  <div style={{ padding: 20, background: 'rgba(39, 201, 63, 0.1)', border: '1px solid rgba(39, 201, 63, 0.3)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#27C93F', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                      ✅ Otimização de Compras
                    </div>
                    <div style={{ color: 'var(--text-main)', fontSize: 13, lineHeight: 1.5 }}>
                      Comprar areia e cimento juntos para as fases de Alvenaria e Reboco gerará uma economia estimada de <strong>R$ 350,00</strong> em fretes neste mês.
                    </div>
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
