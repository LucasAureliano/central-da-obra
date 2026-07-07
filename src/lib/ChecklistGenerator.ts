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

export const generateDefaultStages = (): Stage[] => {
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
