import { Camera, Briefcase, MessageCircle } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface InstitutionalFooterProps {
  theme: 'light' | 'dark';
  onLogin: () => void;
  onNavigate: (page: 'home' | 'history' | 'careers' | 'contact' | 'privacy' | 'terms') => void;
}

export function InstitutionalFooter({ theme, onLogin, onNavigate }: InstitutionalFooterProps) {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      onNavigate('home');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="landing-footer" style={{ backgroundColor: '#000000', borderTop: '1px solid #1f1f1f', position: 'relative', zIndex: 10 }} data-theme="dark">
      <div className="landing-container">
        <div className="footer-grid">
          {/* Col 1: Brand */}
          <div className="footer-brand" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Logo variant="horizontal" theme={theme} />
            <p style={{ color: '#A3A3A3', lineHeight: 1.6, margin: 0, maxWidth: '280px' }}>
              Plataforma inteligente para construção civil. Orçamentos, normas e calculadoras em um só lugar.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com/centralobra" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <Camera size={20} />
              </a>
              <a href="https://linkedin.com/company/centralobra" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <Briefcase size={20} />
              </a>
              <a href="mailto:contato@centralobra.com.br" className="social-icon" aria-label="Contato">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Col 2: Empresa */}
          <div>
            <h4 className="footer-col-title">Empresa</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('history')} className="footer-link">Sobre nós</button></li>
              <li><a href="#recursos" onClick={(e) => handleScrollTo(e, 'recursos')} className="footer-link">Recursos</a></li>
              <li><button onClick={() => onNavigate('careers')} className="footer-link">Carreiras</button></li>
              <li><button onClick={() => onNavigate('contact')} className="footer-link">Contato</button></li>
            </ul>
          </div>

          {/* Col 3: Produto */}
          <div>
            <h4 className="footer-col-title">Produto</h4>
            <ul className="footer-links">
              <li><a href="#calculadoras" onClick={(e) => handleScrollTo(e, 'calculadoras')} className="footer-link">Calculadoras</a></li>
              <li><a href="#gestao" onClick={(e) => handleScrollTo(e, 'gestao')} className="footer-link">Gestão Financeira</a></li>
              <li><a href="#biblioteca" onClick={(e) => handleScrollTo(e, 'biblioteca')} className="footer-link">Biblioteca Técnica</a></li>
              <li><a href="#demonstracao" onClick={(e) => handleScrollTo(e, 'demonstracao')} className="footer-link">Demonstração</a></li>
            </ul>
          </div>

          {/* Col 4: Suporte */}
          <div>
            <h4 className="footer-col-title">Suporte</h4>
            <ul className="footer-links">
              <li><a href="#faq" onClick={(e) => handleScrollTo(e, 'faq')} className="footer-link">FAQ</a></li>
              <li><button onClick={onLogin} className="footer-link">Central de Ajuda</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="footer-link">Política de Privacidade</button></li>
              <li><button onClick={() => onNavigate('terms')} className="footer-link">Termos de Uso</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} CentralObra. Todos os direitos reservados.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A3A3A3', fontSize: '14px', marginTop: '8px' }}>
            Feito com dedicação para a construção civil.
          </div>
        </div>
      </div>
    </footer>
  );
}
