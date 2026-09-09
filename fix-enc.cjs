const fs = require('fs');

function fixEncoding(file) {
  let text = fs.readFileSync(file, 'utf8');
  // the character  is \uFFFD
  text = text.replace(/Constru\uFFFD\u01DCo/g, 'Construção');
  text = text.replace(/constru\uFFFD\u01DCo/g, 'construção');
  text = text.replace(/Gest\uFFFD\u01DCo/g, 'Gestão');
  text = text.replace(/gest\uFFFD\u01DCo/g, 'gestão');
  text = text.replace(/Gr\u01ADtis/g, 'Grátis');
  text = text.replace(/gr\u01ADtis/g, 'grátis');
  text = text.replace(/precis\uFFFD\u01DCo/g, 'precisão');
  text = text.replace(/c\u01ADlculo/g, 'cálculo');
  text = text.replace(/desperd\uFFFDcio/g, 'desperdício');
  text = text.replace(/desperdi\uFFFDar/g, 'desperdiçar');
  text = text.replace(/\uFFFDndices/g, 'índices');
  text = text.replace(/funda\uFFFD\uFFFDes/g, 'fundações');
  text = text.replace(/especifica\uFFFD\uFFFDes/g, 'especificações');
  text = text.replace(/t\u01F8cnicas/g, 'técnicas');
  text = text.replace(/pr\u01ADtica/g, 'prática');
  text = text.replace(/gal\uFFFDes/g, 'galões');
  text = text.replace(/\u01ADgua/g, 'água');
  text = text.replace(/tra\uFFFDo/g, 'traço');
  text = text.replace(/padr\uFFFD\u01DCo/g, 'padrão');
  text = text.replace(/dem\uFFFD\u01DCo/g, 'demão');
  text = text.replace(/dem\uFFFD\u01DCos/g, 'demãos');
  text = text.replace(/Revolu\uFFFD\u01DCo/g, 'Revolução');
  text = text.replace(/fa\uFFFDa/g, 'faça');
  text = text.replace(/or\uFFFDamento/g, 'orçamento');
  text = text.replace(/Or\uFFFDamento/g, 'Orçamento');
  text = text.replace(/m\uFFFD\u01DCo/g, 'mão');
  text = text.replace(/voc\u01E6/g, 'você');
  text = text.replace(/necess\u01ADrios/g, 'necessários');
  text = text.replace(/Al\u01F8m/g, 'Além');
  text = text.replace(/p\u01E7blico/g, 'público');
  text = text.replace(/aut\uFFFDnomos/g, 'autônomos');
  text = text.replace(/f\uFFFDsico/g, 'físico');
  text = text.replace(/propriet\u01ADrios/g, 'proprietários');
  text = text.replace(/im\uFFFDveis/g, 'imóveis');
  text = text.replace(/precis\u01DCo/g, 'precisão');
  text = text.replace(/Constru\u01DCo/g, 'Construção');
  text = text.replace(/constru\u01DCo/g, 'construção');
  
  fs.writeFileSync(file, text, 'utf8');
}

fixEncoding('index.html');
fixEncoding('src/components/public/PublicCalculatorsHubView.tsx');
fixEncoding('src/components/public/PublicCalculatorView.tsx');
console.log("Fixed files");
