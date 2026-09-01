const fs = require('fs');
let code = fs.readFileSync('api/copilot.ts', 'utf8');

// Replace imports
code = code.replace(/import \{ searchLeroyMerlin.*\} from '\.\/_adapters\/leroyMerlin\.js';\n/g, '');
code = code.replace(/import \{ searchObramax \} from '\.\/_adapters\/obramax\.js';\n/g, '');

// Replace the tool implementation block
const searchStart = 'const [leroy, obramax] = await Promise.allSettled([';
const searchEnd = 'const resultText = prices.length > 0 ? prices.join(\'\\n\') : "Material não encontrado no momento.";';

if (code.includes(searchStart)) {
  const replacement = 
            const STATIC_CATALOG: Record<string, number> = {
              'cimento': 35.90, 'areia': 150.00, 'brita': 160.00, 'tijolo': 1.20,
              'bloco': 3.50, 'aco': 45.00, 'tinta': 250.00, 'argamassa': 20.00,
              'rejunte': 8.50, 'piso': 45.00
            };
            let foundPrice = null;
            let matLower = args.material.toLowerCase();
            for (const [key, p] of Object.entries(STATIC_CATALOG)) {
              if (matLower.includes(key) || key.includes(matLower)) {
                foundPrice = p;
                break;
              }
            }
            const resultText = foundPrice ? \Catálogo CentralObra: R$ \\ : "Material não encontrado no momento. Utilize valores aproximados.";
  ;
  
  const p1 = code.indexOf(searchStart);
  const p2 = code.indexOf(searchEnd) + searchEnd.length;
  code = code.substring(0, p1) + replacement + code.substring(p2);
} else {
  // If we missed due to character encoding, try generic regex
  const rx = /const\s*\[leroy[\s\S]*?Material n.o encontrado no momento."\s*;/;
  code = code.replace(rx, 
            const STATIC_CATALOG: Record<string, number> = {
              'cimento': 35.90, 'areia': 150.00, 'brita': 160.00, 'tijolo': 1.20,
              'bloco': 3.50, 'aco': 45.00, 'tinta': 250.00, 'argamassa': 20.00,
              'rejunte': 8.50, 'piso': 45.00
            };
            let foundPrice = null;
            let matLower = args.material.toLowerCase();
            for (const [key, p] of Object.entries(STATIC_CATALOG)) {
              if (matLower.includes(key) || key.includes(matLower)) {
                foundPrice = p;
                break;
              }
            }
            const resultText = foundPrice ? \Catálogo CentralObra: R$ \\ : "Material não encontrado no momento. Utilize valores aproximados.";
  );
}

fs.writeFileSync('api/copilot.ts', code, 'utf8');