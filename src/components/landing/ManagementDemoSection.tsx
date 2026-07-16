import { motion } from 'framer-motion';
import { CalendarClock, ArrowRight, CheckCircle2 } from 'lucide-react';

export function ManagementDemoSection() {
  const handleScrollToRegister = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="landing-section" style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="landing-container">
        <div className="bento-grid" style={{ alignItems: 'center' }}>
          
          {/* Left Column (Visual) */}
          <motion.div 
            className="col-span-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mockup-window" style={{ position: 'relative' }}>
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              
              <div style={{ padding: 24, background: 'var(--bg-base)' }}>
                {/* Simulated Management App UI */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Progresso da Obra</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 8, background: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: '65%', height: '100%', background: 'var(--color-primary)' }}></div>
                      </div>
                      <span style={{ color: 'var(--text-main)', fontSize: 14, fontWeight: 600 }}>65%</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ color: 'var(--text-main)', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Cronograma</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ padding: 16, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                      <CheckCircle2 size={14} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 14, textDecoration: 'line-through', opacity: 0.7 }}>Fundação e Baldrame</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Concluído em 12/04</div>
                    </div>
                  </div>
                  
                  <div style={{ padding: 16, background: 'rgba(255, 107, 0, 0.1)', border: '1px solid var(--color-primary-alpha)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, border: '2px solid var(--color-primary)', flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}>Alvenaria de Vedação</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Em andamento • 45%</div>
                    </div>
                    <div style={{ padding: '4px 8px', background: 'var(--color-primary)', color: '#fff', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>ATRASADO</div>
                  </div>

                  <div style={{ padding: 16, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16, opacity: 0.6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, border: '2px solid var(--border-strong)', flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 14 }}>Cobertura e Telhado</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Início previsto: 25/04</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column (Content) */}
          <motion.div 
            className="col-span-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ paddingLeft: 'clamp(0px, 4vw, 48px)' }}
          >
            <div className="card-icon-wrapper" style={{ marginBottom: 32 }}>
              <CalendarClock size={24} />
            </div>
            
            <h2 className="landing-section-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16 }}>
              A Obra na Palma da Mão
            </h2>
            
            <p className="landing-section-subtitle" style={{ marginBottom: 32 }}>
              Organize o fluxo de trabalho, defina prazos e mantenha todos na mesma página. Saiba exatamente o que deve ser feito hoje, amanhã e na próxima semana.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--text-main)' }}>Checklists de tarefas diárias</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--text-main)' }}>Alertas de atraso no cronograma</span>
              </div>
            </div>
            
            <button onClick={handleScrollToRegister} className="btn-landing-secondary">
              Explorar Gestão <ArrowRight size={18} />
            </button>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
