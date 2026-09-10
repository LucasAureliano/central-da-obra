const fs = require('fs');
let code = fs.readFileSync('src/components/landing/InstitutionalFooter.tsx', 'utf8');

code = code.replace(/<li><button onClick=\{\(\) => onNavigate\('history'\)\} className="footer-link">Sobre ns<\/button><\/li>/g, '<li><a href="/sobre" className="footer-link">Sobre nós</a></li>');
code = code.replace(/<li><button onClick=\{\(\) => onNavigate\('contact'\)\} className="footer-link">Contato<\/button><\/li>/g, '<li><a href="/contato" className="footer-link">Contato</a></li>');
code = code.replace(/<li><button onClick=\{\(\) => onNavigate\('privacy'\)\} className="footer-link">Poltica de Privacidade<\/button><\/li>/g, '<li><a href="/privacidade" className="footer-link">Política de Privacidade</a></li>');
code = code.replace(/<li><button onClick=\{\(\) => onNavigate\('terms'\)\} className="footer-link">Termos de Uso<\/button><\/li>/g, '<li><a href="/termos" className="footer-link">Termos de Uso</a></li>');

// Also inject Blog and Calculators links
code = code.replace(/<ul className="footer-links">(\s*)<li><a href="#recursos"/, '<ul className="footer-links">\n                <li><a href="/blog" className="footer-link">Blog CentralObra</a></li>\n                <li><a href="/calculadoras" className="footer-link">Calculadoras Gratuitas</a></li>$1<li><a href="#recursos"');

fs.writeFileSync('src/components/landing/InstitutionalFooter.tsx', code, 'utf8');
console.log("Updated InstitutionalFooter with real hrefs");
