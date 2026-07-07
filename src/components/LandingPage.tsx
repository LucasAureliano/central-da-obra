import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Calculator, Briefcase, FileText, Building2, 
  PenTool, DraftingCompass, Wrench, Cloud, PieChart, Users, 
  CheckCircle, ChevronDown, Clock, Home, ThumbsUp, ShieldCheck, Zap
} from 'lucide-react';
import { CustomLogo } from './CustomLogo';
import { AnimatedCounter } from './AnimatedCounter';
import { TestimonialStack } from './landing/TestimonialStack';
import { ConstructionShaderBg } from './landing/ConstructionShaderBg';
import type { Testimonial } from './landing/TestimonialStack';

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    initials: 'RC',
    name: 'Ricardo Carvalho',
    role: 'Engenheiro Civil',
    quote: "A Central da Obra eliminou 90% das minhas planilhas. Faço orçamentos em minutos e acompanho o custo real da obra pelo celular enquanto estou no canteiro.",
    tags: [{ text: 'DESTAQUE', type: 'featured' }, { text: 'Gestão de Obras', type: 'default' }],
    stats: [{ icon: Building2, text: '12 Obras Ativas' }, { icon: Clock, text: 'Economiza 10h/semana' }],
    avatarGradient: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
  },
  {
    id: 2,
    initials: 'MS',
    name: 'Mariana Silva',
    role: 'Arquiteta',
    quote: "Meus clientes ficam impressionados quando envio os orçamentos em PDF com a identidade visual do meu escritório. O app me passa muito profissionalismo.",
    tags: [{ text: 'Premium', type: 'default' }, { text: 'Orçamentos', type: 'default' }],
    stats: [{ icon: ThumbsUp, text: 'Aumento em Vendas' }, { icon: PenTool, text: 'Design Focado' }],
    avatarGradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    id: 3,
    initials: 'JL',
    name: 'João Lima',
    role: 'Proprietário',
    quote: "Construir minha casa era um pesadelo até eu achar este app. Agora guardo todas as notas fiscais e sei exatamente quanto gastei na fundação e na alvenaria.",
    tags: [{ text: 'Novo', type: 'default' }, { text: 'Controle', type: 'featured' }],
    stats: [{ icon: ShieldCheck, text: 'Tudo Registrado' }, { icon: Zap, text: 'Fácil de Usar' }],
    avatarGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  }
];

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  theme: 'light' | 'dark';
}

const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function LandingPage({ onLogin, onRegister, theme }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-body">
      {/* Background Elements */}
      <div className="landing-bg">
        <ConstructionShaderBg theme={theme} />
      </div>

      {/* Navbar Premium */}
      <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-container">
          <div className="nav-left">
            <a href="#" className="logo-link" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}) }}>
              <CustomLogo theme={theme} />
            </a>
          </div>
          
          <div className="nav-center mobile-hidden">
            <a href="#recursos" onClick={(e) => handleScrollTo(e, 'recursos')} className="landing-nav-link animated-link">Recursos</a>
            <a href="#calculadoras" onClick={(e) => handleScrollTo(e, 'calculadoras')} className="landing-nav-link animated-link">Calculadoras</a>
            <a href="#perfis" onClick={(e) => handleScrollTo(e, 'perfis')} className="landing-nav-link animated-link">Para Quem</a>
            <a href="#depoimentos" onClick={(e) => handleScrollTo(e, 'depoimentos')} className="landing-nav-link animated-link">Depoimentos</a>
          </div>

          <div className="nav-right mobile-hidden">
            <button onClick={onLogin} className="landing-nav-link" style={{ fontWeight: 600 }}>Entrar</button>
            <button onClick={onRegister} className="btn-landing-primary">Começar Grátis</button>
          </div>
          
          {/* Mobile Only Button */}
          <div className="nav-mobile-only">
            <button onClick={onLogin} className="btn-landing-primary">Entrar</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="recursos" className="landing-section" style={{ paddingTop: 180, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            style={{ zIndex: 10 }}
          >
            <motion.div variants={fadeInUp} style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', 
              borderRadius: 999, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', 
              fontWeight: 700, fontSize: 13, marginBottom: 32, border: '1px solid var(--color-primary-alpha)'
            }}>
              <Cloud size={16} /> 100% Nuvem. Offline First.
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="hero-title">
              O ecossistema que a sua <span className="text-gradient-primary">Obra</span> precisa.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="landing-section-subtitle" style={{ fontSize: 20 }}>
              Planejamento, gestão financeira, compras e mais de 80 calculadoras de materiais integradas em um só lugar. Substitua o papel e planilhas por uma plataforma inteligente.
            </motion.p>
            
            <motion.div variants={fadeInUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={onRegister} className="btn-landing-primary" style={{ padding: '0 32px', height: 56, fontSize: 16 }}>
                Começar Gratuitamente <ArrowRight size={20} />
              </button>
              <button onClick={onLogin} className="btn-landing-secondary" style={{ padding: '0 32px', height: 56, fontSize: 16 }}>
                Entrar
              </button>
            </motion.div>
            
            <motion.div variants={fadeInUp} style={{ marginTop: 40, display: 'flex', gap: 24, color: 'var(--text-muted)', fontSize: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={16} color="var(--color-primary)" /> Sem cartão de crédito</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={16} color="var(--color-primary)" /> Configuração em 2 min</span>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ position: 'relative', zIndex: 5, perspective: 1000 }}
            className="mobile-hidden"
          >
            {/* Desktop Mockup */}
            <div className="mockup-window" style={{ transform: 'rotateX(5deg) rotateY(-5deg)', transformStyle: 'preserve-3d' }}>
              <div className="mockup-header">
                <div className="mockup-dot red" />
                <div className="mockup-dot yellow" />
                <div className="mockup-dot green" />
              </div>
              <div style={{ padding: 24, backgroundColor: 'var(--bg-base)', height: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Fake Dashboard UI */}
                <div style={{ display: 'flex', gap: 16 }}>
                   <div style={{ flex: 1, height: 100, borderRadius: 16, background: 'var(--bg-elevated)' }} />
                   <div style={{ flex: 1, height: 100, borderRadius: 16, background: 'var(--bg-elevated)' }} />
                   <div style={{ flex: 1, height: 100, borderRadius: 16, background: 'var(--color-primary-alpha)', border: '1px solid var(--color-primary)' }} />
                </div>
                <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                   <div style={{ flex: 2, borderRadius: 16, background: 'var(--bg-elevated)' }} />
                   <div style={{ flex: 1, borderRadius: 16, background: 'var(--bg-elevated)' }} />
                </div>
              </div>
            </div>
            
            {/* Mobile Mockup overlapping */}
            <div className="mockup-window" style={{ 
              position: 'absolute', bottom: -40, right: -20, width: 220, height: 450, 
              borderRadius: 32, border: '6px solid var(--bg-surface)', padding: 0,
              transform: 'translateZ(50px)'
            }}>
              <div style={{ width: 120, height: 24, background: 'var(--bg-surface)', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: 10 }} />
              <div style={{ padding: 16, paddingTop: 40, backgroundColor: 'var(--bg-base)', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ width: '60%', height: 24, borderRadius: 8, background: 'var(--bg-elevated)' }} />
                <div style={{ width: '100%', height: 80, borderRadius: 16, background: 'linear-gradient(135deg, var(--color-primary) 0%, #FFA057 100%)' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ height: 60, borderRadius: 12, background: 'var(--bg-elevated)' }} />
                  <div style={{ height: 60, borderRadius: 12, background: 'var(--bg-elevated)' }} />
                </div>
                <div style={{ flex: 1, borderRadius: 16, background: 'var(--bg-elevated)' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="recursos" className="landing-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h2 className="landing-section-title">Construído para escalar</h2>
          <p className="landing-section-subtitle">Ferramentas de nível corporativo acessíveis para qualquer tamanho de obra.</p>
        </motion.div>

        <motion.div 
          className="bento-grid"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="bento-item col-span-8" style={{ minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(145deg, var(--bg-elevated) 0%, var(--bg-base) 100%)' }}>
            <Calculator size={48} color="var(--color-primary)" style={{ position: 'absolute', top: 32, right: 32, opacity: 0.5 }} />
            <h3 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Mais de 80 Calculadoras</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 400 }}>Cálculo exato de materiais para alvenaria, pintura, pisos, elétrica e muito mais. Menos desperdício, mais lucro.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bento-item col-span-4" style={{ minHeight: 300 }}>
            <Briefcase size={32} color="var(--color-primary)" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Múltiplas Obras</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Gerencie dezenas de projetos simultaneamente em um único painel centralizado.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bento-item col-span-4" style={{ minHeight: 300 }}>
            <PieChart size={32} color="var(--color-primary)" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Controle Financeiro</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Acompanhe o orçamento previsto vs realizado em tempo real.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bento-item col-span-4" style={{ minHeight: 300 }}>
            <FileText size={32} color="var(--color-primary)" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Orçamentos Profissionais</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Gere PDFs detalhados para clientes em segundos.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bento-item col-span-4" style={{ minHeight: 300 }}>
            <Cloud size={32} color="var(--color-primary)" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Modo Offline</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Sem sinal na obra? A plataforma sincroniza os dados automaticamente quando houver conexão.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Como Funciona Timeline */}
      <section id="calculadoras" className="landing-section" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="landing-section-title">Como Funciona</h2>
            <p className="landing-section-subtitle" style={{ margin: '0 auto' }}>Um fluxo otimizado do cadastro até a entrega das chaves.</p>
          </motion.div>

          <div className="timeline-container">
            {[
              { icon: Users, title: 'Crie sua conta', desc: 'Defina seu perfil e personalize sua experiência.' },
              { icon: Briefcase, title: 'Cadastre a Obra', desc: 'Insira endereço, cliente e orçamento previsto.' },
              { icon: Calculator, title: 'Faça os Cálculos', desc: 'Calcule o material exato necessário para cada etapa.' },
              { icon: FileText, title: 'Gere Orçamentos', desc: 'Transforme os cálculos em uma proposta PDF elegante.' },
              { icon: Clock, title: 'Acompanhe a Execução', desc: 'Controle o financeiro e o andamento em tempo real.' }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                className="timeline-item"
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
              >
                <div className="timeline-icon">
                  <step.icon size={24} />
                </div>
                <div style={{ padding: 24, background: 'var(--bg-glass)', borderRadius: 16, border: '1px solid var(--border-subtle)', flex: 1 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfis */}
      <section id="perfis" className="landing-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h2 className="landing-section-title">Uma plataforma, múltiplos papéis</h2>
          <p className="landing-section-subtitle">Desenvolvida para atender às necessidades específicas de cada profissional da construção.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            { role: 'Construtora', icon: Building2, desc: 'Gestão multi-obras, controle financeiro agregado e relatórios executivos de alto nível.' },
            { role: 'Engenheiro', icon: DraftingCompass, desc: 'Precisão nos cálculos, ARTs organizadas e controle rigoroso de insumos.' },
            { role: 'Arquiteto', icon: PenTool, desc: 'Apresentações elegantes em PDF, controle de budget do cliente e memorial descritivo.' },
            { role: 'Proprietário', icon: Home, desc: 'Acompanhe gastos reais, evolução da obra e armazene notas fiscais e garantias.' },
            { role: 'Prestador de Serviço', icon: Wrench, desc: 'Orçamentos rápidos, lista de compras exata e profissionalismo na entrega.' }
          ].map((profile, i) => (
            <motion.div 
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="bento-item"
              style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--color-primary)' }}>
                <profile.icon size={24} />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{profile.role}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{profile.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Depoimentos Premium com Testimonial Stack */}
      <section id="depoimentos" className="landing-section">
        <div className="landing-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 className="landing-section-title">O que dizem os <span className="text-gradient">Profissionais</span></h2>
            <p className="landing-section-subtitle" style={{ margin: '0 auto' }}>Junte-se a milhares de pessoas que transformaram a forma como lidam com obras e reformas no Brasil.</p>
          </div>
          <div>
            <TestimonialStack testimonials={testimonialsData} visibleBehind={2} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-section" style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'linear-gradient(to right, transparent, var(--bg-elevated), transparent)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: 40, textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div style={{ fontSize: 56, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -2 }}>
              +<AnimatedCounter value={80} format="number" duration={2} />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500, marginTop: 8 }}>Calculadoras Prontas</div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div style={{ fontSize: 56, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -2 }}>
              <AnimatedCounter value={100} format="number" duration={2} />%
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500, marginTop: 8 }}>Sincronização Cloud</div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div style={{ fontSize: 56, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -2 }}>
              +<AnimatedCounter value={5} format="number" duration={1} />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500, marginTop: 8 }}>Perfis Especializados</div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="landing-section-title">Perguntas Frequentes</h2>
          <p className="landing-section-subtitle" style={{ margin: '0 auto' }}>Tudo que você precisa saber para começar.</p>
        </motion.div>

        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {[
            { q: 'Preciso ter conhecimento técnico para usar?', a: 'Não. A plataforma foi desenhada para ser intuitiva tanto para engenheiros experientes quanto para proprietários que estão construindo sua primeira casa.' },
            { q: 'Funciona sem internet na obra?', a: 'Sim. Graças à tecnologia Offline First, você pode adicionar fotos, gastos e fazer cálculos sem sinal. Assim que reconectar, tudo sincroniza com a nuvem.' },
            { q: 'Posso acessar pelo computador e celular?', a: 'Sim, a Central da Obra é 100% responsiva e pode ser instalada no celular como um aplicativo (PWA).' },
            { q: 'Como funcionam as calculadoras?', a: 'Basta inserir as medidas do ambiente (ex: 5x4m) e o sistema calcula a quantidade exata de tijolos, cimento, areia ou tinta, já aplicando margens de segurança.' }
          ].map((faq, i) => (
            <motion.div key={i} className="faq-item" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <button 
                className="faq-question" 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronDown size={20} style={{ transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="faq-answer">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-section" style={{ position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '160px 24px' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 60%)', filter: 'blur(100px)', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} />
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ position: 'relative', zIndex: 10, maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: clamp(40, '5vw', 64), fontWeight: 800, marginBottom: 24, letterSpacing: -1 }}>Pronto para modernizar sua obra?</h2>
          <p style={{ fontSize: 20, color: 'var(--text-muted)', marginBottom: 48 }}>
            Junte-se ao futuro da gestão de construção civil hoje mesmo.
          </p>
          <button onClick={onRegister} className="btn-landing-primary" style={{ padding: '0 48px', height: 64, fontSize: 18, borderRadius: 32 }}>
            Começar Gratuitamente
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid var(--border-subtle)', padding: '64px 24px 32px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 64 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <CustomLogo theme={theme} />
              <p style={{ color: 'var(--text-muted)', marginTop: 24, maxWidth: 300, lineHeight: 1.6 }}>
                A plataforma definitiva para controle de obras, orçamentos e cálculos de materiais.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 24 }}>Produto</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Recursos</a></li>
                <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Calculadoras</a></li>
                <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 24 }}>Suporte</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Central de Ajuda</a></li>
                <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contato</a></li>
                <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Status</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 24 }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacidade</a></li>
                <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, paddingTop: 32, borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>© 2026 Central da Obra. Todos os direitos reservados.</p>
            <div style={{ display: 'flex', gap: 16 }}>
              {/* Redes sociais placeholder */}
              <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'var(--bg-elevated)' }} />
              <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'var(--bg-elevated)' }} />
              <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'var(--bg-elevated)' }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Utility para o CSS clamp do React
function clamp(min: number, val: string, max: number) {
  return `clamp(${min}px, ${val}, ${max}px)`;
}
