export interface TaskItem {
  id: string;
  title: string;
  isCompleted: boolean;
  notes?: string;
}

export interface Stage {
  id: string;
  title: string;
  tasks: TaskItem[];
  order: number;
}

export const generateDefaultStages = (specialty?: string | null): Stage[] => {
  const spec = (specialty || '').toLowerCase();
  
  if (spec.includes('eletric') || spec.includes('elétrica')) {
    return [
      {
        id: 'stage_1', title: 'Infraestrutura e Tubulação', order: 1,
        tasks: [
          { id: 't1_1', title: 'Corte de alvenaria e chumbação', isCompleted: false },
          { id: 't1_2', title: 'Passagem de condutes', isCompleted: false },
          { id: 't1_3', title: 'Fixação das caixinhas', isCompleted: false }
        ]
      },
      {
        id: 'stage_2', title: 'Fiação e Cabeamento', order: 2,
        tasks: [
          { id: 't2_1', title: 'Passagem de cabos de fora', isCompleted: false },
          { id: 't2_2', title: 'Passagem de cabos de lógica/antena', isCompleted: false },
          { id: 't2_3', title: 'Fechamento de emendas', isCompleted: false }
        ]
      },
      {
        id: 'stage_3', title: 'Acabamentos e Quadro', order: 3,
        tasks: [
          { id: 't3_1', title: 'Montagem do Quadro de Distribuição (QDC)', isCompleted: false },
          { id: 't3_2', title: 'Instalação de tomadas e interruptores', isCompleted: false },
          { id: 't3_3', title: 'Instalação de luminárias e testes', isCompleted: false }
        ]
      }
    ];
  }

  if (spec.includes('encanador') || spec.includes('hidr')) {
    return [
      {
        id: 'stage_1', title: 'Infraestrutura Hidráulica', order: 1,
        tasks: [
          { id: 't1_1', title: 'Rasgo na alvenaria', isCompleted: false },
          { id: 't1_2', title: 'Tubulação de água fria e quente', isCompleted: false },
          { id: 't1_3', title: 'Tubulação de esgoto', isCompleted: false }
        ]
      },
      {
        id: 'stage_2', title: 'Testes', order: 2,
        tasks: [
          { id: 't2_1', title: 'Teste de estanqueidade / pressurização', isCompleted: false },
          { id: 't2_2', title: 'Fechamento da alvenaria', isCompleted: false }
        ]
      },
      {
        id: 'stage_3', title: 'Louças e Metais', order: 3,
        tasks: [
          { id: 't3_1', title: 'Instalação de vasos sanitários e pias', isCompleted: false },
          { id: 't3_2', title: 'Instalação de torneiras e registros', isCompleted: false },
          { id: 't3_3', title: 'Teste final de vazão', isCompleted: false }
        ]
      }
    ];
  }

  if (spec.includes('pintor') || spec.includes('pintura')) {
    return [
      {
        id: 'stage_1', title: 'Preparação', order: 1,
        tasks: [
          { id: 't1_1', title: 'Proteção de pisos e móveis', isCompleted: false },
          { id: 't1_2', title: 'Lixamento das superfícies', isCompleted: false },
          { id: 't1_3', title: 'Aplicação de massa corrida', isCompleted: false }
        ]
      },
      {
        id: 'stage_2', title: 'Fundo e Acabamento', order: 2,
        tasks: [
          { id: 't1_1', title: 'Lixamento da massa', isCompleted: false },
          { id: 't1_2', title: 'Aplicação do fundo preparador/selador', isCompleted: false },
          { id: 't1_3', title: 'Demãos de tinta', isCompleted: false },
          { id: 't1_4', title: 'Limpeza pós-obra', isCompleted: false }
        ]
      }
    ];
  }

  // Padrão para construção geral
  return [
    {
      id: 'stage_1',
      title: 'Serviços Preliminares',
      order: 1,
      tasks: [
        { id: 'task_1_1', title: 'Limpeza do terreno', isCompleted: false },
        { id: 'task_1_2', title: 'Instalação do canteiro (água e luz)', isCompleted: false },
        { id: 'task_1_3', title: 'Gabarito da obra', isCompleted: false },
      ]
    },
    {
      id: 'stage_2',
      title: 'Infraestrutura (Fundação)',
      order: 2,
      tasks: [
        { id: 'task_2_1', title: 'Escavação das sapatas/blocos', isCompleted: false },
        { id: 'task_2_2', title: 'Armação de aço da fundação', isCompleted: false },
        { id: 'task_2_3', title: 'Concretagem da fundação', isCompleted: false },
        { id: 'task_2_4', title: 'Impermeabilização do baldrame', isCompleted: false },
      ]
    },
    {
      id: 'stage_3',
      title: 'Supraestrutura (Alvenaria e Laje)',
      order: 3,
      tasks: [
        { id: 'task_3_1', title: 'Levantamento de alvenaria', isCompleted: false },
        { id: 'task_3_2', title: 'Concretagem de pilares', isCompleted: false },
        { id: 'task_3_3', title: 'Montagem da laje e escoramento', isCompleted: false },
        { id: 'task_3_4', title: 'Concretagem da laje', isCompleted: false },
      ]
    },
    {
      id: 'stage_4',
      title: 'Cobertura',
      order: 4,
      tasks: [
        { id: 'task_4_1', title: 'Montagem do madeiramento/estrutura metálica', isCompleted: false },
        { id: 'task_4_2', title: 'Instalação das telhas', isCompleted: false },
        { id: 'task_4_3', title: 'Instalação de calhas e rufos', isCompleted: false },
      ]
    },
    {
      id: 'stage_5',
      title: 'Instalações (Elétrica e Hidráulica)',
      order: 5,
      tasks: [
        { id: 'task_5_1', title: 'Rasgo nas paredes e passagem de conduítes', isCompleted: false },
        { id: 'task_5_2', title: 'Tubulação de água fria e quente', isCompleted: false },
        { id: 'task_5_3', title: 'Tubulação de esgoto', isCompleted: false },
        { id: 'task_5_4', title: 'Fiação e quadro de distribuição', isCompleted: false },
      ]
    },
    {
      id: 'stage_6',
      title: 'Acabamentos',
      order: 6,
      tasks: [
        { id: 'task_6_1', title: 'Reboco interno e externo', isCompleted: false },
        { id: 'task_6_2', title: 'Contrapiso', isCompleted: false },
        { id: 'task_6_3', title: 'Forro de gesso', isCompleted: false },
        { id: 'task_6_4', title: 'Assentamento de pisos e revestimentos', isCompleted: false },
        { id: 'task_6_5', title: 'Pintura', isCompleted: false },
      ]
    }
  ];
};
