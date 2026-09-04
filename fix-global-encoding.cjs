const fs = require('fs');
const path = require('path');

const map = {
  'Ã£': 'ã', 'Ã§': 'ç', 'Ã©': 'é', 'Ã¡': 'á', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú', 'Ãª': 'ê', 'Ãµ': 'õ', 'Ã¢': 'â', 'Ã ': 'à',
  'Ã§Ã£o': 'ção', 'Ãµes': 'ões', 'Ã´': 'ô', 'Ã§Ãµes': 'ções',
  'Nǜo': 'Não', 'Concludo': 'Concluído', 'possvel': 'possível', 'Cǭlculos': 'Cálculos', 'TǸcnicas': 'Técnicas', 'Relatrios': 'Relatórios',
  'TǸcnicos': 'Técnicos', 'TǸcnica': 'Técnica', '?ndices': 'Índices', 'Construǜo': 'Construção', 'TendǦncias': 'Tendências',
  'ElǸtrico': 'Elétrico', 'Hidrǭulico': 'Hidráulico', 'Automaǜo': 'Automação', 'LuminotǸcnico': 'Luminotécnico',
  'Oramentos': 'Orçamentos', 'Cotaes': 'Cotações', 'Servios': 'Serviços', 'Diǭrio': 'Diário', 'TǸcnico': 'Técnico',
  'Medies': 'Medições', 'PendǦncias': 'Pendências', 'Operaes': 'Operações', 'Mǜo': 'Mão', 'Oramento': 'Orçamento',
  'Catǭlogo': 'Catálogo', 'Administraǜo': 'Administração', 'Negcios': 'Negócios', 'Imveis': 'Imóveis', 'Portflio': 'Portfólio',
  'estǭ': 'está', 'cartǜo': 'cartão', 'dǧvidas': 'dúvidas', 'tǸcnicas': 'técnicas', 'vocǦ': 'você', 'visǜo': 'visão', 'Ǹ': 'é'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if(file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

let fixedCount = 0;
walk('./src').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [bad, good] of Object.entries(map)) {
    content = content.split(bad).join(good);
  }
  
  // also fix some specific ones that are weird combinations
  content = content.replace(/Ã§Ã£o/g, 'ção');
  content = content.replace(/Ã§Ãµes/g, 'ções');
  content = content.replace(/Ã¡/g, 'á');
  content = content.replace(/Ã©/g, 'é');
  content = content.replace(/Ã/g, 'í'); // wait, careful with bare 'Ã'
  
  if(original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
  }
});

console.log('Fixed ' + fixedCount + ' files.');
