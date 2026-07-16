import { motion } from 'framer-motion';
import { BookOpen, Search, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export function LibraryDemoSection() {
  const handleScrollToRegister = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Idealmente, a prop onRegister seria passada, mas para o demo, o scroll pro topo (onde há o CTA de registro) serve.
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
                {/* Simulated App UI */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '12px 16px' }}>
                    <Search size={18} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-main)', fontSize: 14 }}>NBR 6118</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-alpha)', color: 'var(--color-primary)' }}>
                    <BookOpen size={20} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ padding: 16, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>NBR 6118 - Projeto de Estruturas de Concreto</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12 }}>Procedimento • Atualizada em 2023</div>
                      <div style={{ display: 'inline-block', padding: '4px 8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 4, fontSize: 11, color: 'var(--text-main)' }}>
                        Capítulo 7: Critérios de Projeto
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ padding: 16, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', gap: 16, opacity: 0.6 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>NBR 14931 - Execução de Estruturas</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Procedimento</div>
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
              <BookOpen size={24} />
            </div>
            
            <h2 className="landing-section-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16 }}>
              Obras 100% nas Normas
            </h2>
            
            <p className="landing-section-subtitle" style={{ marginBottom: 32 }}>
              Acesse a biblioteca técnica completa com as principais normas (NBRs) e manuais de execução diretamente do canteiro. Tire dúvidas de execução na hora.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--text-main)' }}>Normas ABNT sempre atualizadas</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--text-main)' }}>Manuais de boa prática de execução</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--text-main)' }}>Busca rápida por palavras-chave</span>
              </div>
            </div>
            
            <button onClick={handleScrollToRegister} className="btn-landing-secondary">
              Explorar Biblioteca <ArrowRight size={18} />
            </button>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
