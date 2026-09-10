const fs = require('fs');
let code = fs.readFileSync('src/components/landing/InstitutionalFooter.tsx', 'utf8');

code = code.replace(/<li><button onClick=\{\(\) => onNavigate\('history'\)\} className="footer-link">.*?<\/button><\/li>/g, '<li><a href="/sobre" className="footer-link">Sobre nós</a></li>');
code = code.replace(/<li><button onClick=\{\(\) => onNavigate\('privacy'\)\} className="footer-link">.*?<\/button><\/li>/g, '<li><a href="/privacidade" className="footer-link">Política de Privacidade</a></li>');
code = code.replace(/<li><button onClick=\{\(\) => onNavigate\('terms'\)\} className="footer-link">.*?<\/button><\/li>/g, '<li><a href="/termos" className="footer-link">Termos de Uso</a></li>');

// Since Blog/Calculators were already added or were there? Let me check
// Actually I didn't see Blog CentralObra in "Empresa" where I injected it, wait, it seems someone manually added it in Produto? Let's check.
// Wait, the output showed:
// <li><a href="/calculadoras" className="footer-link" style={{ color: 'var(--color-primary)' }}>Calculadoras Gratuitas</a></li>
// <li><a href="/blog" className="footer-link" style={{ color: 'var(--color-primary)' }}>Blog de Engenharia</a></li>
// So they ALREADY existed in "Produto"! Excellent!

fs.writeFileSync('src/components/landing/InstitutionalFooter.tsx', code, 'utf8');
console.log("Updated InstitutionalFooter remaining links");
