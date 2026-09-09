const fs = require('fs');
let code = fs.readFileSync('src/components/landing/CalculatorLandingSection.tsx', 'utf8');

// add import
code = "import { LayoutTextFlip } from '../ui/LayoutTextFlip';\n" + code;

// replace text
const searchStr = `<h2 className="landing-section-title">A Mais Completa <span className="text-gradient">Calculadora de Materiais</span></h2>
          <p className="landing-section-subtitle">
            Diga adeus ao "chutômetro" e ao desperdício. Nossa plataforma oferece dezenas de calculadoras precisas para quantificar materiais de construção de forma simples, rápida e gratuita.
          </p>`;

// fallback for weird charset
const searchFallbackRegex = /<h2 className="landing-section-title">A Mais Completa[\s\S]*?gratuita\.[\s\S]*?<\/p>/m;

const replaceStr = `<LayoutTextFlip text="Cálculos precisos para" words={["Alvenaria", "Pisos e Revestimentos", "Gesso e Drywall", "Telhados", "Concreto", "Pintura"]} />
          <p className="landing-section-subtitle" style={{ marginTop: 24 }}>
            Experimente o poder de calculadoras gratuitas que evitam desperdícios e trazem precisão milimétrica para a sua obra.
          </p>`;

if (code.includes('A Mais Completa')) {
  code = code.replace(searchFallbackRegex, replaceStr);
}
fs.writeFileSync('src/components/landing/CalculatorLandingSection.tsx', code, 'utf8');
console.log('updated');
