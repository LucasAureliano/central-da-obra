export interface TechnicalArticle {
  id: string;
  title: string;
  category: string;
  subcategories: string[];
  summary: string;
  content: {
    whatIsIt: string;
    whereToUse: string[];
    whenToUse?: string[];
    materialsNeeded: string[];
    toolsNeeded: string[];
    stepByStep: string[];
    averageTime?: string;
    averageConsumption?: string;
    averageYield?: string;
    goodPractices: string[];
    commonErrors: string[];
    carePrecautions?: string[];
    safety: {
      epis: string[];
      nrs: string[];
      precautions: string[];
    };
  };
  related: {
    norms: { id: string, name: string, summary: string }[];
    calculators: string[];
    materials: string[];
    articles: string[]; 
    problems?: string[];
  };
  metadata: {
    keywords: string[];
    synonyms: string[];
    recommendedProfile: string[];
    tags: string[];
    level: 'Básico' | 'Intermediário' | 'Avançado';
    lastUpdate: string;
  };
}

export const CATEGORIES = [
  'Todos',
  'Normas',
  'Materiais',
  'Execução',
  'Ferramentas',
  'Problemas',
  'Segurança',
  'Acabamentos',
  'Estruturas',
  'Elétrica',
  'Hidráulica',
  'Cobertura',
  'Impermeabilização',
  'Pintura'
];

export const TECHNICAL_ARTICLES: TechnicalArticle[] = [
  {
    id: 'concreto-armado',
    title: 'Concreto Armado',
    category: 'Estruturas',
    subcategories: ['Materiais', 'Execução'],
    summary: 'Guia completo sobre concretagem de peças estruturais como pilares, vigas e lajes.',
    content: {
      whatIsIt: 'É a união do concreto (cimento, areia, brita e água) com armaduras de aço, unindo a resistência à compressão do concreto com a resistência à tração do aço.',
      whereToUse: [
        'Fundações (sapatas, blocos, estacas)',
        'Vigas e Pilares',
        'Lajes e Escadas'
      ],
      whenToUse: [
        'Estruturas que exigem alta resistência e durabilidade',
        'Obras de pequeno a grande porte',
        'Fundações em solos de diferentes capacidades'
      ],
      materialsNeeded: [
        'Cimento CP II, CP III ou CP IV',
        'Areia média ou grossa',
        'Brita 1 ou 2',
        'Água potável (sem impurezas)',
        'Aço (CA-50, CA-60)',
        'Arame recozido',
        'Madeira para forma (tábuas, pontaletes)'
      ],
      toolsNeeded: [
        'Betoneira',
        'Vibrador de concreto',
        'Carrinho de mão',
        'Pás e enxadas',
        'Desempenadeira e colher de pedreiro',
        'Mangueira de nível e prumo'
      ],
      stepByStep: [
        '1. Montagem das formas: Garantir que estão no prumo, no nível e travadas.',
        '2. Colocação das armaduras: Garantir o cobrimento mínimo exigido por norma usando espaçadores.',
        '3. Preparo ou Recebimento: Se rodado em obra, seguir o traço ideal. Se usinado, conferir nota fiscal e abatimento (slump test).',
        '4. Lançamento: Não lançar de alturas superiores a 2 metros para evitar segregação.',
        '5. Adensamento: Utilizar vibrador de imersão de forma vertical sem encostar nas armaduras ou nas formas.',
        '6. Cura: Manter a superfície úmida por no mínimo 7 dias para evitar fissuras de retração térmica.'
      ],
      averageTime: 'Varia pelo volume, mas uma laje de 100m² pode ser concretada em cerca de 3 a 5 horas utilizando bomba.',
      averageConsumption: 'Aproximadamente 350 a 400 kg de cimento por m³ de concreto (dependendo do fck e do traço).',
      averageYield: '1 caminhão betoneira rende cerca de 7 a 8 m³ de concreto usinado.',
      goodPractices: [
        'Sempre umedecer as formas de madeira antes da concretagem para não roubar água do concreto.',
        'Limpar o fundo das formas de pilares antes de iniciar o lançamento (usar janelas de limpeza).',
        'Programar a concretagem para horários mais frescos do dia.'
      ],
      commonErrors: [
        'Nunca adicionar água no caminhão betoneira além do especificado na nota para "amolecer" o concreto (isso derruba o FCK).',
        'Nunca concretar sem realizar o processo de cura molhada. O concreto trinca ao perder água muito rápido.',
        'Não utilizar areia com excesso de argila/barro ou água suja.'
      ],
      carePrecautions: [
        'Manter fôrmas bem escoradas para não vazar a nata do cimento',
        'Não atrasar o lançamento do concreto usinado (máx 2h30 da saída da usina)',
        'Evitar o super adensamento que pode causar segregação'
      ],
      safety: {
        epis: ['Capacete', 'Luvas de raspa', 'Botas de PVC ou segurança', 'Óculos de proteção (durante lançamento)'],
        nrs: ['NR-18 (Segurança e Saúde no Trabalho na Indústria da Construção)'],
        precautions: ['Atenção à fixação das formas; o estouro de uma forma durante concretagem pode ser fatal.']
      }
    },
    related: {
      norms: [
        { id: 'nbr-6118', name: 'NBR 6118', summary: 'Projeto de Estruturas de Concreto' },
        { id: 'nbr-12655', name: 'NBR 12655', summary: 'Preparo, controle e recebimento de concreto' }
      ],
      calculators: ['concreto'],
      materials: ['Cimento', 'Areia', 'Brita', 'Aço'],
      articles: ['cura-concreto', 'fissuras-retraçao'],
      problems: ['fissuras-retraçao', 'bicheiras', 'armadura-exposta']
    },
    metadata: {
      keywords: ['fck', 'traço', 'betoneira', 'slump', 'pilar', 'viga', 'laje'],
      synonyms: ['Concretagem', 'Massa de concreto', 'Estrutura'],
      recommendedProfile: ['builder', 'service', 'owner'],
      tags: ['Estrutura', 'Fundação', 'Superestrutura'],
      level: 'Intermediário',
      lastUpdate: '2023-10-01'
    }
  },
  {
    id: 'pintura-parede',
    title: 'Pintura de Paredes (Látex e Acrílica)',
    category: 'Acabamentos',
    subcategories: ['Pintura', 'Execução'],
    summary: 'Como preparar e pintar superfícies internas e externas garantindo durabilidade e bom acabamento.',
    content: {
      whatIsIt: 'Aplicação de tintas líquidas para proteger e decorar paredes de alvenaria, gesso ou reboco.',
      whereToUse: [
        'Paredes de alvenaria rebocadas',
        'Paredes de drywall (gesso)',
        'Tetos e fachadas'
      ],
      whenToUse: [
        'Acabamento final de alvenarias',
        'Renovação estética de ambientes',
        'Proteção contra intempéries (em áreas externas)'
      ],
      materialsNeeded: [
        'Lixa para massa/parede (grana 150 a 220)',
        'Selador acrílico ou Fundo preparador',
        'Massa corrida (interior) ou Massa acrílica (exterior)',
        'Tinta (Acrílica, Látex PVA ou Epóxi)',
        'Fita crepe'
      ],
      toolsNeeded: [
        'Rolo de lã (pelo baixo para massa/pelo alto para superfícies ásperas)',
        'Bandeja para pintura',
        'Trincha (pincel) para recortes',
        'Espátula e Desempenadeira de aço',
        'Extensor para rolo'
      ],
      stepByStep: [
        '1. Limpeza: Remover poeira, graxa ou partes soltas da parede.',
        '2. Lixamento Inicial: Quebrar imperfeições grandes do reboco e limpar o pó.',
        '3. Fundo: Aplicar 1 demão de selador acrílico (parede nova) ou fundo preparador (parede esfarelando/gesso).',
        '4. Massa: Aplicar 2 ou 3 demãos finas de massa corrida/acrílica, esperando secar entre elas.',
        '5. Lixamento Fino: Lixar a massa até ficar perfeitamente lisa e retirar todo o pó com pano úmido.',
        '6. Recorte: Pintar os cantos, rodapés e teto com a trincha.',
        '7. Pintura: Aplicar a tinta com rolo de lã em movimentos de "W", cobrindo a área toda (normalmente 2 a 3 demãos).'
      ],
      averageTime: 'Para um cômodo 4x4m, cerca de 1 dia para preparo/emassamento e 1 a 2 dias para pintura completa.',
      averageConsumption: 'Massa corrida: cerca de 1 a 1,5 kg/m² por demão. Tinta: 0,15 a 0,25 Litros/m² por demão.',
      averageYield: 'Tinta 18L rende 250 a 300 m² por demão. Massa corrida 25kg rende de 30 a 50 m².',
      goodPractices: [
        'Proteger o chão com lona ou papelão ondulado, prendendo bem com fita.',
        'Remover os espelhos de tomadas e maçanetas antes de começar.',
        'Diluir a tinta exatamente conforme o manual do fabricante.'
      ],
      commonErrors: [
        'Não esperar o tempo de cura do reboco novo (28 dias). O cimento "queima" a tinta, gerando descascamento e manchas.',
        'Pintar sobre superfícies com poeira, fazendo a tinta soltar (famoso "descascamento").',
        'Usar massa corrida em áreas externas. Embaixo de umidade, a massa corrida derrete.'
      ],
      carePrecautions: [
        'Não aplicar em dias muito úmidos (umidade relativa acima de 90%) ou chuvosos',
        'Proteger móveis adequadamente para evitar respingos de difícil remoção',
        'Atenção ao lixamento para não criar ondulações na parede'
      ],
      safety: {
        epis: ['Óculos de proteção', 'Máscara contra poeira (essencial durante o lixamento)'],
        nrs: ['NR-18', 'NR-35 (Trabalho em altura, caso use andaimes)'],
        precautions: ['Mantenha o ambiente sempre ventilado para dissipação do odor e aceleração da secagem.']
      }
    },
    related: {
      norms: [],
      calculators: ['tinta'],
      materials: ['Tinta', 'Massa Corrida', 'Rolo de Pintura'],
      articles: ['descascamento-tinta', 'infiltracao'],
      problems: ['descascamento', 'manchas-de-umidade', 'mofo']
    },
    metadata: {
      keywords: ['Látex', 'Acrílica', 'Massa corrida', 'Lixamento', 'Rolo', 'Demão', 'Acabamento'],
      synonyms: ['Emassar', 'Pintar casa', 'Rolagem'],
      recommendedProfile: ['owner', 'service'],
      tags: ['Acabamento', 'Decoração', 'Parede'],
      level: 'Básico',
      lastUpdate: '2023-11-05'
    }
  },
  {
    id: 'chuveiro-eletrico',
    title: 'Instalação de Chuveiro Elétrico',
    category: 'Elétrica',
    subcategories: ['Hidráulica', 'Execução'],
    summary: 'Passo a passo seguro para dimensionar e instalar chuveiros elétricos.',
    content: {
      whatIsIt: 'Conexão hidráulica e elétrica do equipamento responsável pelo aquecimento de água no banho.',
      whereToUse: [
        'Banheiros'
      ],
      whenToUse: [
        'Instalações em residências sem sistema de aquecimento a gás/solar',
        'Substituição de chuveiros danificados ou com resistência queimada'
      ],
      materialsNeeded: [
        'Chuveiro elétrico e cano (se não for acoplado)',
        'Fita Veda-Rosca',
        'Conectores de porcelana ou bornes de mola (tipo Wago)',
        'Cabos flexíveis (geralmente 4mm² ou 6mm²)',
        'Disjuntor termomagnético (geralmente 32A, 40A ou 50A)'
      ],
      toolsNeeded: [
        'Chave de fenda e philips',
        'Alicate decapador e alicate universal',
        'Chave de teste ou multímetro'
      ],
      stepByStep: [
        '1. Desligue a Energia: Desligue o disjuntor do quadro de força.',
        '2. Preparo Hidráulico: Passe fita veda-rosca na conexão do chuveiro (cerca de 5 a 8 voltas no sentido horário).',
        '3. Rosqueamento: Rosqueie o chuveiro no ponto de água da parede usando apenas as mãos (nunca use chaves que possam trincar o plástico).',
        '4. Encher de Água (CRÍTICO): Abra o registro e deixe a água fria escorrer pelo chuveiro. ISSO EVITA QUEIMAR A RESISTÊNCIA NO PRIMEIRO USO.',
        '5. Conexão Elétrica: Use os conectores (cerâmica ou wago) para ligar os cabos Fase-Fase (220V) ou Fase-Neutro (110V) e o TERRA (cabo verde ou verde/amarelo).',
        '6. Finalização: Feche os fios, religue o disjuntor e teste no modo "Inverno".'
      ],
      averageTime: 'Cerca de 30 a 60 minutos para uma instalação completa (hidráulica e elétrica).',
      averageConsumption: 'Varia com a potência, mas em média 5 a 7 kWh por hora de banho na potência máxima.',
      averageYield: 'Não aplicável (equipamento unitário).',
      goodPractices: [
        'Utilizar cabos e disjuntores compatíveis com a potência (Watts) do chuveiro. Chuveiros de 6800W+ exigem cabos de 6mm².',
        'O circuito do chuveiro deve ser exclusivo, vindo direto do quadro.'
      ],
      commonErrors: [
        'Usar fita isolante para emendar fio de chuveiro. Com o calor e alta corrente, a fita derrete e gera curto-circuito/incêndio.',
        'Ligar o chuveiro seco na eletricidade, queimando a resistência instantaneamente.',
        'Instalar sem cabo de aterramento (risco grave de choque fatal no molhado).'
      ],
      carePrecautions: [
        'Sempre garantir que a energia está desligada verificando com chave de teste',
        'Não apertar excessivamente a rosca de plástico para evitar fissuras na tubulação',
        'Assegurar-se de que a vedação do acabamento da parede impeça a entrada de água para o conduite'
      ],
      safety: {
        epis: ['Botas com solado de borracha (isolante)'],
        nrs: ['NR-10 (Segurança em Instalações e Serviços em Eletricidade)'],
        precautions: ['Nunca faça instalações com o chão do banheiro molhado ou descalço. Certifique-se com chave de teste que não há corrente antes de tocar nos fios.']
      }
    },
    related: {
      norms: [
        { id: 'nbr-5410', name: 'NBR 5410', summary: 'Instalações Elétricas de Baixa Tensão' }
      ],
      calculators: [],
      materials: ['Chuveiro', 'Cabo Elétrico 6mm', 'Disjuntor', 'Fita Veda-rosca', 'Conector de Porcelana'],
      articles: ['quadro-distribuicao', 'aterramento'],
      problems: ['resistencia-queimada', 'disjuntor-desarmando', 'choque-no-registro']
    },
    metadata: {
      keywords: ['Disjuntor', 'Cabo', 'Fio', 'Aterramento', 'Resistência', 'Queimou', 'Banho'],
      synonyms: ['Ducha', 'Aquecedor', 'Instalação elétrica'],
      recommendedProfile: ['owner', 'service'],
      tags: ['Elétrica', 'Instalação', 'Banheiro'],
      level: 'Básico',
      lastUpdate: '2023-09-12'
    }
  },
  {
    id: 'infiltracao-parede',
    title: 'Infiltração de Parede (Umidade Ascendente)',
    category: 'Problemas',
    subcategories: ['Impermeabilização'],
    summary: 'Como identificar e resolver problemas de umidade subindo pelo rodapé das paredes (ascendente).',
    content: {
      whatIsIt: 'É a água presente no solo que sobe através dos poros da fundação e da alvenaria (capilaridade), descascando a tinta e gerando mofo até cerca de 1 metro de altura.',
      whereToUse: [],
      whenToUse: [
        'Manchas úmidas aparecem próximas ao rodapé',
        'A tinta começa a formar bolhas e descascar',
        'Presença de eflorescência (pó branco) ou mofo'
      ],
      materialsNeeded: [
        'Argamassa polimérica (ex: Viaplus 1000, Sikatop 100)',
        'Cristalizante para concreto (opcional)',
        'Areia, Cimento, Aditivo impermeabilizante para reboco (ex: Vedacit)',
        'Massa acrílica e Tinta'
      ],
      toolsNeeded: [
        'Marreta e Talhadeira (para descascar o reboco)',
        'Trincha (para aplicar a argamassa polimérica)',
        'Desempenadeira e colher',
        'Escova de aço'
      ],
      stepByStep: [
        '1. Remoção: Descasque o reboco podre/úmido até o bloco/tijolo, ultrapassando a mancha de umidade em pelo menos 50 cm para cima.',
        '2. Limpeza: Escove bem os blocos para retirar pó e partes soltas. Molhe levemente a superfície.',
        '3. Bloqueio: Aplique de 3 a 4 demãos cruzadas de argamassa polimérica com trincha, estendendo até o contrapiso.',
        '4. Chapisco: Faça um chapisco forte com adesivo (ex: Bianco).',
        '5. Novo Reboco: Refaça o reboco usando aditivo impermeabilizante (hidrófugo) na massa.',
        '6. Acabamento: Use massa acrílica (resistente à água) e tinta acrílica premium.'
      ],
      averageTime: 'De 2 a 4 dias dependendo da área, devido ao tempo necessário para secagem da argamassa polimérica e novo reboco.',
      averageConsumption: 'Argamassa polimérica: cerca de 3 a 4 kg/m² considerando 3 a 4 demãos.',
      averageYield: 'Uma caixa de 18kg de argamassa polimérica faz aproximadamente 4,5 a 6 m².',
      goodPractices: [
        'A melhor forma de evitar esse problema é tratar a fundação (baldrame) DURANTE a construção, cobrindo o topo do baldrame e descendo 10cm nas laterais com tinta asfáltica.',
        'Sempre limpar bem a junta entre a parede e o chão antes da impermeabilização.'
      ],
      commonErrors: [
        'Passar massa corrida e repintar a parede úmida achando que vai resolver. O problema voltará em poucas semanas.',
        'Aplicar revestimento cerâmico para esconder a umidade. A água vai continuar subindo pelo tijolo por trás da cerâmica e estourará a parede mais acima.'
      ],
      carePrecautions: [
        'Umedecer levemente a base de alvenaria antes de aplicar a argamassa polimérica (não encharcar)',
        'Respeitar fielmente o tempo de cura das camadas',
        'Não utilizar gesso como reboco em áreas com histórico de umidade'
      ],
      safety: {
        epis: ['Óculos de proteção (ao quebrar parede)', 'Luvas de proteção', 'Máscara'],
        nrs: [],
        precautions: ['A quebra do reboco gera muita poeira respirável e estilhaços pontiagudos.']
      }
    },
    related: {
      norms: [],
      calculators: [],
      materials: ['Argamassa Polimérica', 'Vedacit', 'Bianco', 'Massa Acrílica'],
      articles: ['impermeabilizacao-laje'],
      problems: ['descascamento-tinta', 'mofo', 'degradacao-alvenaria']
    },
    metadata: {
      keywords: ['Mofo', 'Bolor', 'Descascando', 'Água', 'Rodapé', 'Bolha', 'Capilaridade', 'Baldrame'],
      synonyms: ['Parede molhada', 'Umidade rodapé', 'Parede estourando', 'Vazamento'],
      recommendedProfile: ['owner', 'service', 'architect'],
      tags: ['Patologia', 'Reforma', 'Umidade'],
      level: 'Intermediário',
      lastUpdate: '2023-08-20'
    }
  },
  {
    id: 'nbr-6118',
    title: 'NBR 6118 - Projeto de Estruturas de Concreto',
    category: 'Normas',
    subcategories: ['Estruturas'],
    summary: 'A bíblia do concreto armado no Brasil. Define critérios de projeto, segurança e durabilidade das estruturas.',
    content: {
      whatIsIt: 'Norma técnica brasileira que estabelece os requisitos fundamentais para o projeto de estruturas de concreto (simples, armado e protendido).',
      whereToUse: [
        'Projetos estruturais de edifícios residenciais e comerciais.',
        'Dimensionamento de vigas, lajes, pilares e fundações.'
      ],
      whenToUse: [
        'Dimensionamento de estruturas de concreto',
        'Inspeções e análises patológicas de viabilidade estrutural',
        'Elaboração de projetos executivos'
      ],
      materialsNeeded: [],
      toolsNeeded: [],
      stepByStep: [],
      averageTime: 'Não aplicável.',
      averageConsumption: 'Não aplicável.',
      averageYield: 'Não aplicável.',
      goodPractices: [
        'Classe de Agressividade Ambiental (CAA): A norma define 4 classes (de rural a marinha/industrial). Cada classe exige um cobrimento de armadura diferente e um FCK mínimo diferente. Em área litorânea, o mínimo para concreto armado geralmente é Fck = 30MPa e cobrimentos generosos.',
        'A espessura mínima para lajes maciças varia de acordo com o uso (ex: 7 cm em coberturas, 9 cm em pisos residenciais, 12 cm para passagem de veículos).'
      ],
      commonErrors: [
        'Ignorar a dimensão máxima do agregado (brita) na hora de definir o espaçamento entre as armaduras, causando "bicheiras" onde o concreto não penetra.',
        'Deixar as armaduras encostadas na forma. A norma exige o uso de espaçadores para garantir o cobrimento nominal mínimo de concreto, que é o que protege o aço da ferrugem.'
      ],
      carePrecautions: [
        'Atenção estrita aos recobrimentos nominais',
        'Validar resistência exigida x resistência entregue (corpos de prova)'
      ],
      safety: {
        epis: [],
        nrs: [],
        precautions: ['Qualquer alteração na obra (ex: quebrar vigas, furos em lajes) deve ser validada por um engenheiro calculista em conformidade com esta norma.']
      }
    },
    related: {
      norms: [
        { id: 'nbr-12655', name: 'NBR 12655', summary: 'Preparo, controle e recebimento do concreto' },
        { id: 'nbr-14931', name: 'NBR 14931', summary: 'Execução de estruturas de concreto' }
      ],
      calculators: ['concreto'],
      materials: ['Aço', 'Concreto'],
      articles: ['concreto-armado'],
      problems: ['fissuras-excessivas', 'flechas-altas', 'corrosao-armaduras']
    },
    metadata: {
      keywords: ['Engenharia', 'Cálculo Estrutural', 'FCK', 'Cobrimento', 'Agressividade'],
      synonyms: ['Norma de estrutura', 'Norma de concreto'],
      recommendedProfile: ['architect', 'builder'],
      tags: ['Técnico', 'Engenharia', 'Projeto'],
      level: 'Avançado',
      lastUpdate: '2023-12-01'
    }
  },
  {
    id: 'nbr-5410',
    title: 'NBR 5410 - Instalações Elétricas de Baixa Tensão',
    category: 'Normas',
    subcategories: ['Elétrica'],
    summary: 'Diretrizes para garantir a segurança de pessoas e bens contra os perigos da energia elétrica e o funcionamento adequado da instalação.',
    content: {
      whatIsIt: 'Norma que rege todas as instalações elétricas de baixa tensão (até 1000V em corrente alternada). É essencial para engenheiros e eletricistas.',
      whereToUse: [
        'Instalações prediais, comerciais e residenciais.'
      ],
      whenToUse: [
        'Projetos de novas instalações elétricas',
        'Emissão de Laudo de Instalação Elétrica',
        'Reformas que exijam novos quadros ou readequação de carga'
      ],
      materialsNeeded: [],
      toolsNeeded: [],
      stepByStep: [],
      averageTime: 'Não aplicável.',
      averageConsumption: 'Não aplicável.',
      averageYield: 'Não aplicável.',
      goodPractices: [
        'Obrigatoriedade do Dispositivo DR (Diferencial Residual): Deve proteger circuitos de áreas molhadas (banheiros, cozinhas, lavanderias e áreas externas). Ele salva vidas contra choques elétricos.',
        'Aterramento: Toda tomada e todo equipamento deve possuir o condutor de proteção (fio terra - cor verde ou verde/amarelo).',
        'Divisão de Circuitos: Circuitos de iluminação devem ser separados dos de tomadas. Equipamentos de alta potência (ar-condicionado, chuveiro, microondas) exigem circuitos independentes.'
      ],
      commonErrors: [
        'Usar fio neutro de um circuito diferente. Cada circuito deve ter seu próprio fio fase e seu fio neutro correspondente.',
        'Dimensionar disjuntor para proteger o equipamento. O disjuntor deve ser calculado e instalado para **proteger o cabo** (condutor) contra superaquecimento.',
        'Emendas mal feitas. As conexões e emendas devem garantir a mesma condutividade e isolação do cabo original (recomendado uso de conectores ao invés de fita isolante).'
      ],
      carePrecautions: [
        'Exigir produtos (cabos, disjuntores) certificados pelo INMETRO',
        'Sempre dimensionar cabos considerando queda de tensão',
        'Garantir separação física adequada entre elétrica e hidráulica'
      ],
      safety: {
        epis: [],
        nrs: ['NR-10'],
        precautions: ['Choques elétricos são fatais. As diretrizes da 5410 são obrigatórias por lei em projetos elétricos no Brasil.']
      }
    },
    related: {
      norms: [
        { id: 'nbr-5444', name: 'NBR 5444', summary: 'Símbolos gráficos para instalações elétricas' }
      ],
      calculators: [],
      materials: ['Disjuntor DR', 'DPS', 'Cabos Elétricos', 'Aterramento'],
      articles: ['chuveiro-eletrico'],
      problems: ['curto-circuito', 'choque-eletrico', 'sobrecarga']
    },
    metadata: {
      keywords: ['DR', 'DPS', 'Disjuntor', 'Curto-circuito', 'Aterramento', 'Tomada', 'Projeto elétrico'],
      synonyms: ['Norma elétrica', 'Instalação elétrica residencial'],
      recommendedProfile: ['architect', 'builder', 'service'],
      tags: ['Elétrica', 'Segurança', 'Projeto'],
      level: 'Avançado',
      lastUpdate: '2024-01-15'
    }
  },
  {
    id: 'telhado-ceramico',
    title: 'Execução de Telhado Cerâmico',
    category: 'Cobertura',
    subcategories: ['Execução', 'Materiais'],
    summary: 'Guia de montagem de estrutura de madeira e instalação de telhas cerâmicas para coberturas residenciais.',
    content: {
      whatIsIt: 'Sistema de cobertura tradicional formado por uma trama estrutural de madeira (tesouras, terças, caibros e ripas) sobre a qual se apoiam as telhas cerâmicas de barro.',
      whereToUse: [
        'Residências',
        'Áreas de lazer',
        'Edificações comerciais com estilo rústico/tradicional'
      ],
      whenToUse: [
        'Em projetos que exigem conforto térmico superior (o barro é um ótimo isolante térmico)',
        'Para agregar valor estético tradicional à fachada'
      ],
      materialsNeeded: [
        'Telhas cerâmicas (Romana, Portuguesa, Francesa, etc.)',
        'Madeira para estrutura (Tesouras, Terças, Caibros e Ripas - ex: Maçaranduba, Garapeira, Pinus Autoclavado)',
        'Pregos galvanizados (diversos tamanhos)',
        'Manta térmica subcobertura (opcional, mas recomendado)',
        'Argamassa para emboçamento da cumeeira ou passarinheira'
      ],
      toolsNeeded: [
        'Serra circular ou Serrote',
        'Martelo',
        'Esquadro, trena e nível',
        'Linha de pedreiro',
        'Furadeira/Parafusadeira'
      ],
      stepByStep: [
        '1. Instalação das Tesouras e Terças: Fixação dos componentes estruturais principais sobre as lajes ou oitões, garantindo a inclinação definida em projeto.',
        '2. Instalação dos Caibros: Pregados sobre as terças, seguindo a direção do caimento d\'água.',
        '3. Fixação das Ripas (Galga): As ripas são pregadas horizontalmente sobre os caibros. A distância entre elas (galga) depende do modelo exato da telha (consultar fabricante).',
        '4. Telhamento: Inicia-se sempre de baixo (beiral) para cima (cumeeira).',
        '5. Cumeeira: Instalação das peças de cumeeira no topo do telhado, unindo as duas águas, fixadas com argamassa ou sistemas a seco.',
        '6. Acabamentos: Colocação de passarinheiras e rufo lateral (se houver encosto em parede).'
      ],
      averageTime: 'Um telhado de 100m² leva de 4 a 7 dias para uma equipe experiente (carpinteiro e ajudantes).',
      averageConsumption: 'Depende da telha (ex: Romana leva em média 16 unidades/m²; Portuguesa 17/m²).',
      averageYield: 'O consumo de madeira varia muito conforme a estrutura, mas pode-se prever cerca de 0,02 a 0,03 m³ de madeira por metro quadrado de cobertura.',
      goodPractices: [
        'Respeitar rigorosamente a inclinação mínima especificada pelo fabricante (geralmente entre 30% e 35% para telhas cerâmicas).',
        'Aplicar tratamento preservativo contra cupins e brocas na madeira antes da instalação.'
      ],
      commonErrors: [
        'Fazer a galga (distância das ripas) incorreta, fazendo com que as telhas não encaixem direito e fiquem frouxas.',
        'Falta de amarração da estrutura na laje, permitindo que ventos fortes desloquem a cobertura.',
        'Deixar inclinação inferior ao recomendado, o que provoca retorno de água com ventos (goteiras e vazamentos).'
      ],
      carePrecautions: [
        'Nunca pisar diretamente no meio da telha; pisar sempre sobre a região apoiada na ripa ou usar tábuas para distribuir o peso',
        'Atenção ao sentido predominante dos ventos para sobreposição das telhas nas bordas'
      ],
      safety: {
        epis: ['Cinto de segurança tipo paraquedista com talabarte duplo', 'Capacete com jugular', 'Botas de segurança', 'Luvas'],
        nrs: ['NR-35 (Trabalho em Altura)', 'NR-18'],
        precautions: ['Trabalho em telhados possui risco crítico de queda, agravado em dias de vento forte ou chuva. Uso de linha de vida é obrigatório.']
      }
    },
    related: {
      norms: [
        { id: 'nbr-15310', name: 'NBR 15310', summary: 'Componentes cerâmicos - Telhas - Terminologia, requisitos e métodos de ensaio' }
      ],
      calculators: ['telhado'],
      materials: ['Telha Cerâmica', 'Madeira para Telhado', 'Manta Térmica'],
      articles: ['manta-termica-telhado'],
      problems: ['goteiras', 'cupim-na-madeira', 'telhas-quebradas']
    },
    metadata: {
      keywords: ['Telha', 'Romana', 'Portuguesa', 'Madeiramento', 'Tesoura', 'Caibro', 'Ripa', 'Cumeeira', 'Galga'],
      synonyms: ['Fazer telhado', 'Cobrir casa', 'Estrutura de madeira'],
      recommendedProfile: ['builder', 'owner'],
      tags: ['Cobertura', 'Telhado', 'Estrutura'],
      level: 'Intermediário',
      lastUpdate: '2024-03-21'
    }
  }
];
