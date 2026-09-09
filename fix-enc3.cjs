const fs = require('fs');

function fix(file) {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/constru\xef\xbf\xbd\u01DCo/gi, 'construção');
  text = text.replace(/Constru\xef\xbf\xbd\u01DCo/gi, 'Construção');
  text = text.replace(/Gest\u01DCo/gi, 'Gestão');
  text = text.replace(/gest\u01DCo/gi, 'gestão');
  text = text.replace(/Gr\u01ADtis/gi, 'Grátis');
  text = text.replace(/precis\u01DCo/gi, 'precisão');
  text = text.replace(/c\u01ADlculo/gi, 'cálculo');
  text = text.replace(/desperd\xef\xbf\xbdcio/gi, 'desperdício');
  text = text.replace(/desperdi\xef\xbf\xbdar/gi, 'desperdiçar');
  text = text.replace(/\xef\xbf\xbdndices/gi, 'índices');
  text = text.replace(/funda\xef\xbf\xbd\u01FDes/gi, 'fundações');
  text = text.replace(/especifica\xef\xbf\xbd\u01FDes/gi, 'especificações');
  text = text.replace(/t\u01F8cnicas/gi, 'técnicas');
  text = text.replace(/pr\u01ADtica/gi, 'prática');
  text = text.replace(/gal\u01FDes/gi, 'galões');
  text = text.replace(/\u01ADgua/gi, 'água');
  text = text.replace(/tra\xef\xbf\xbdo/gi, 'traço');
  text = text.replace(/padr\u01DCo/gi, 'padrão');
  text = text.replace(/dem\u01DCo/gi, 'demão');
  text = text.replace(/dem\u01DCos/gi, 'demãos');
  text = text.replace(/Revolu\xef\xbf\xbd\u01DCo/gi, 'Revolução');
  text = text.replace(/fa\xef\xbf\xbda/gi, 'faça');
  text = text.replace(/or\xef\xbf\xbdamento/gi, 'orçamento');
  text = text.replace(/m\u01DCo/gi, 'mão');
  text = text.replace(/voc\u01E6/gi, 'você');
  text = text.replace(/necess\u01ADrios/gi, 'necessários');
  text = text.replace(/Al\u01F8m/gi, 'Além');
  text = text.replace(/p\u01E7blico/gi, 'público');
  text = text.replace(/aut\xef\xbf\xbdnomos/gi, 'autônomos');
  text = text.replace(/f\xef\xbf\xbdsico/gi, 'físico');
  text = text.replace(/propriet\u01ADrios/gi, 'proprietários');
  text = text.replace(/im\xef\xbf\xbdveis/gi, 'imóveis');
  text = text.replace(/solu\xef\xbf\xbd\u01FDes/gi, 'soluções');
  fs.writeFileSync(file, text, 'utf8');
}

fix('index.html');
fix('src/components/public/PublicCalculatorsHubView.tsx');
fix('src/components/public/PublicCalculatorView.tsx');
console.log('Fixed');
