import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { CustomLogo } from '../CustomLogo';
import { InstitutionalFooter } from './InstitutionalFooter';

interface GenericInfoPageProps {
  pageId: 'history' | 'careers' | 'contact' | 'privacy' | 'terms';
  onBack: () => void;
  onLogin: () => void;
  onNavigate: (pageId: 'home' | 'history' | 'careers' | 'contact' | 'privacy' | 'terms') => void;
  theme: 'light' | 'dark';
}

export function GenericInfoPage({ pageId, onBack, onLogin, onNavigate, theme }: GenericInfoPageProps) {
  
  const contentMap = {
    history: {
      title: 'Nossa História',
      content: (
        <>
          <p>O CentralObra nasceu de uma dor real: a dificuldade de gerenciar canteiros de obra utilizando papéis, planilhas fragmentadas e o WhatsApp. Fundada por profissionais que vivenciaram na pele os atrasos, os furos de orçamento e o desperdício de materiais, a plataforma foi desenvolvida com um único propósito: democratizar a gestão profissional na construção civil.</p>
          <p>O que começou como um simples agregador de calculadoras de materiais, rapidamente evoluiu. Ouvindo proprietários, pedreiros, arquitetos e construtoras, percebemos que o mercado precisava de um ecossistema integrado. Hoje, somos a ponte entre a prancheta de projetos e o pedreiro no canteiro, garantindo transparência, previsibilidade e lucro.</p>
        </>
      )
    },
    careers: {
      title: 'Carreiras',
      content: (
        <>
          <p>no CentralObra, acreditamos que a tecnologia tem o poder de transformar a maneira como o mundo constrói. Estamos sempre em busca de mentes brilhantes e inquietas que queiram fazer parte dessa revolução.</p>
          <h3>Vagas Abertas</h3>
          <p>No momento, não temos vagas abertas publicamente, mas estamos sempre analisando novos talentos. Envie seu currículo e portfólio para <strong>talentos@centraldaobra.com.br</strong> e entraremos em contato assim que surgir uma oportunidade com a sua cara!</p>
        </>
      )
    },
    contact: {
      title: 'Contato',
      content: (
        <>
          <p>Ficou com alguma dúvida, encontrou um bug ou quer sugerir uma nova calculadora? Nossa equipe está pronta para te ajudar.</p>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-panel" style={{ padding: 16, borderRadius: 12 }}>
              <strong>E-mail de Suporte:</strong><br />
              <a href="mailto:suporte@centraldaobra.com.br" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>suporte@centraldaobra.com.br</a>
            </div>
            <div className="glass-panel" style={{ padding: 16, borderRadius: 12 }}>
              <strong>Comercial e Parcerias:</strong><br />
              <a href="mailto:comercial@centraldaobra.com.br" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>comercial@centraldaobra.com.br</a>
            </div>
            <div className="glass-panel" style={{ padding: 16, borderRadius: 12 }}>
              <strong>WhatsApp (Apenas Mensagens):</strong><br />
              <span style={{ color: 'var(--text-muted)' }}>+55 (11) 99999-9999</span>
            </div>
          </div>
        </>
      )
    },
    privacy: {
      title: 'Política de Privacidade',
      content: (
        <>
          <p>A sua privacidade é importante para nós. É política do CentralObra respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no aplicativo e no site.</p>
          <h3>1. Informações que coletamos</h3>
          <p>Solicitamos informações pessoais, como nome, e-mail e função profissional apenas quando realmente precisamos delas para lhe fornecer nossos serviços. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
          <h3>2. Uso dos dados</h3>
          <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Os dados de obras, orçamentos e listas de compras são privados e não são compartilhados com terceiros sob nenhuma circunstância sem consentimento explícito.</p>
          <h3>3. Segurança</h3>
          <p>Utilizamos infraestrutura em nuvem de ponta (Google Cloud/Firebase) para garantir que seus dados estejam protegidos contra acesso não autorizado.</p>
        </>
      )
    },
    terms: {
      title: 'Termos de Uso',
      content: (
        <>
          <p>Ao acessar o aplicativo CentralObra, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
          <h3>1. Uso da Plataforma</h3>
          <p>É concedida permissão para o uso temporário e não exclusivo do software. Esta é a concessão de uma licença, não uma transferência de título. Durante a fase Beta, o uso da plataforma é gratuito.</p>
          <h3>2. Precisão das Calculadoras</h3>
          <p>As calculadoras de materiais e custos fornecidas no aplicativo são baseadas em normas técnicas (ABNT/NBRs) e médias de mercado. No entanto, elas fornecem estimativas teóricas. O CentralObra não se responsabiliza por sobras ou faltas de materiais, visto que o consumo real depende das técnicas de execução, desperdícios locais e variações de fabricantes.</p>
          <h3>3. Isenção de responsabilidade</h3>
          <p>Os materiais e serviços do CentralObra são fornecidos "como estão". Não oferecemos garantias, expressas ou implícitas, sobre resultados exatos em orçamentos complexos.</p>
        </>
      )
    }
  };

  const data = contentMap[pageId];

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageId]);

  return (
    <div className="landing-body" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <nav className="landing-navbar scrolled">
        <div className="landing-nav-container">
          <div className="nav-left">
            <a href="#" className="logo-link" onClick={(e) => { e.preventDefault(); onBack(); }}>
              <CustomLogo theme={theme} />
            </a>
          </div>
          <div className="nav-right mobile-hidden">
            <button onClick={onLogin} className="landing-nav-link" style={{ fontWeight: 600 }}>Entrar no App</button>
            <button onClick={onBack} className="btn-landing-primary">Voltar ao Início</button>
          </div>
          <div className="nav-mobile-only">
            <button onClick={onBack} className="btn-icon" style={{ width: 40, height: 40, borderRadius: 20 }}>
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, paddingTop: 120, paddingBottom: 64 }}>
        <div className="landing-container" style={{ maxWidth: 800 }}>
          <button 
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 32, padding: 0 }}
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="landing-section-title" style={{ textAlign: 'left', marginBottom: 40, fontSize: 40 }}>{data.title}</h1>
            
            <div className="glass-panel" style={{ padding: '32px 40px', borderRadius: 24, fontSize: 16, lineHeight: 1.6, color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
              {data.content}
            </div>
          </motion.div>
        </div>
      </main>

      <InstitutionalFooter theme={theme} onLogin={onLogin} onNavigate={onNavigate} />
    </div>
  );
}
