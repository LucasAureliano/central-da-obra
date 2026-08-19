const fs = require('fs');

const path = 'src/components/landing/InstitutionalFooter.tsx';
let code = fs.readFileSync(path, 'utf8');

const target = `<li><a href="#calculadoras" onClick={(e) => handleScrollTo(e, 'calculadoras')} className="footer-link">Calculadoras</a></li>`;
const replacement = `<li><a href="#calculadoras" onClick={(e) => handleScrollTo(e, 'calculadoras')} className="footer-link">Calculadoras App</a></li>
              <li><a href="/?calc=concreto" className="footer-link" style={{ color: 'var(--color-primary)' }}>Calculadoras Gratuitas</a></li>
              <li><a href="/?blog=true" className="footer-link" style={{ color: 'var(--color-primary)' }}>Blog de Engenharia</a></li>`;

code = code.replace(target, replacement);

fs.writeFileSync(path, code, 'utf8');
