const fs = require('fs');
let code = fs.readFileSync('src/config/plans.ts', 'utf-8');

// We will add 'Sem anúncios' or 'Navegação sem anúncios' to the features array
// Let's replace the last feature with the feature + ',\n          \'Navegação sem anúncios\''
// But it's easier to just do a string replacement for a known feature

code = code.replace(/('Suporte por email',?\s*)/g, "\\n          'Navegação sem anúncios',");
code = code.replace(/('Armazenamento ampliado de fotos',?\s*)/g, "\\n          'Navegação sem anúncios',");
code = code.replace(/('Funil de vendas e indicadores comerciais',?\s*)/g, "\\n          'Navegação sem anúncios',");
code = code.replace(/('Copilot da Obra \(IA\)',?\s*)/g, "\\n          'Navegação sem anúncios',");
code = code.replace(/('PDFs com identidade visual',?\s*)/g, "\\n          'Navegação sem anúncios',");
code = code.replace(/('Orçamento técnico profissional',?\s*)/g, "\\n          'Navegação sem anúncios',");
code = code.replace(/('Gantt e Centro de Operações',?\s*)/g, "\\n          'Navegação sem anúncios',");
code = code.replace(/('Dashboards personalizados',?\s*)/g, "\\n          'Navegação sem anúncios',");
code = code.replace(/('Calculadoras ilimitadas',?\s*)/g, "\\n          'Navegação sem anúncios',");

fs.writeFileSync('src/config/plans.ts', code, 'utf-8');
