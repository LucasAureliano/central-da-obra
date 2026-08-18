import type { UserRole } from '../contexts/AuthContext';

export interface PlanLimits {
  maxWorks: number;
  maxQuotes: number;
  maxClients: number;
  maxProjects: number;
  maxTeamMembers: number;
  hasAdvancedPDF: boolean;
  hasFunnel: boolean;
  hasPremiumSupport: boolean;
}

export interface PlanDefinition {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  limits: PlanLimits;
  features: string[];
}

export type RolePlans = {
  free: PlanDefinition;
  starter?: PlanDefinition;
  pro: PlanDefinition;
  business?: PlanDefinition;
};

export const DEFAULT_LIMITS: PlanLimits = {
  maxWorks: 1,
  maxQuotes: 5,
  maxClients: 5,
  maxProjects: 2,
  maxTeamMembers: 1,
  hasAdvancedPDF: false,
  hasFunnel: false,
  hasPremiumSupport: false,
};

export const PLANS_CONFIG: Record<string, RolePlans> = {
  owner: {
    free: {
      id: 'owner_free',
      name: 'Proprietário Gratuito',
      monthlyPrice: 0,
      yearlyPrice: 0,
      limits: {
        ...DEFAULT_LIMITS,
        maxWorks: 1,
        maxQuotes: 10,
        maxClients: 10,
      },
      features: [
        '1 obra ativa',
        'Cronograma e progresso básico',
        'Lista de compras',
        'Calculadoras ilimitadas',
      ]
    },
    starter: {
      id: 'owner_starter',
      name: 'Proprietário Básico',
      monthlyPrice: 29.99,
      yearlyPrice: 287.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxWorks: 3,
        maxQuotes: 15,
        maxClients: 30,
        hasAdvancedPDF: false,
        hasFunnel: false,
      },
      features: [
        'Até 3 obras ativas',
        'Até 15 orçamentos por mês',
        'Até 30 clientes',
        'Financeiro e cronograma básico',
        'Suporte por email',
      ]
    },
    pro: {
      id: 'owner_pro',
      name: 'Proprietário Premium',
      monthlyPrice: 49.99,
      yearlyPrice: 479.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxWorks: 9999, // unlimited
        maxQuotes: 9999,
        maxClients: 9999,
        hasAdvancedPDF: true,
      },
      features: [
        'Obras ilimitadas',
        'Relatórios avançados e comparativos',
        "PDFs Premium (Sem marca d'água)",
        'Armazenamento ampliado de fotos'
      ]
    }
  },
  service: {
    free: {
      id: 'service_free',
      name: 'Prestador Gratuito',
      monthlyPrice: 0,
      yearlyPrice: 0,
      limits: {
        ...DEFAULT_LIMITS,
        maxQuotes: 5,
        maxClients: 10,
      },
      features: [
        'Até 5 orçamentos por mês',
        'Até 10 clientes',
        'Cadastro de serviços e agenda',
        'Calculadoras ilimitadas'
      ]
    },
    starter: {
      id: 'service_starter',
      name: 'Prestador Básico',
      monthlyPrice: 29.99,
      yearlyPrice: 287.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxQuotes: 15,
        maxClients: 30,
        hasAdvancedPDF: false,
        hasFunnel: false,
      },
      features: [
        'Até 15 orçamentos por mês',
        'Até 30 clientes',
        'Cadastro de serviços e agenda',
        'Suporte por email',
      ]
    },
    pro: {
      id: 'service_pro',
      name: 'Prestador Profissional',
      monthlyPrice: 49.99,
      yearlyPrice: 479.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxQuotes: 50,
        maxClients: 9999,
        hasAdvancedPDF: true,
        hasFunnel: true,
      },
      features: [
        'Até 50 orçamentos por mês',
        'Clientes ilimitados',
        'Identidade visual no orçamento (PDF Premium)',
        'Funil de vendas e indicadores comerciais'
      ]
    },
    business: {
      id: 'service_plus',
      name: 'Prestador Plus',
      monthlyPrice: 99.99,
      yearlyPrice: 959.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxQuotes: 9999,
        maxClients: 9999,
        hasAdvancedPDF: true,
        hasFunnel: true,
        hasPremiumSupport: true,
      },
      features: [
        'Orçamentos e clientes ilimitados',
        'Automações e análise de margem',
        'Agenda avançada',
        'Copilot da Obra (IA)'
      ]
    }
  },
  architect: {
    free: {
      id: 'arch_free',
      name: 'Arquiteto Gratuito',
      monthlyPrice: 0,
      yearlyPrice: 0,
      limits: {
        ...DEFAULT_LIMITS,
        maxProjects: 2,
        maxClients: 5,
      },
      features: [
        'Até 2 projetos ativos',
        'Até 5 clientes',
        'Diário técnico e vistorias básicas',
        'Calculadoras ilimitadas'
      ]
    },
    starter: {
      id: 'arch_starter',
      name: 'Arquiteto Básico',
      monthlyPrice: 29.99,
      yearlyPrice: 287.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxProjects: 5,
        maxClients: 20,
        hasAdvancedPDF: false,
        hasFunnel: false,
      },
      features: [
        'Até 5 projetos ativos',
        'Até 20 clientes',
        'Diário técnico e vistorias básicas',
        'Suporte por email',
      ]
    },
    pro: {
      id: 'arch_pro',
      name: 'Arquiteto Profissional',
      monthlyPrice: 49.99,
      yearlyPrice: 479.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxProjects: 9999,
        maxClients: 9999,
        hasAdvancedPDF: true,
      },
      features: [
        'Projetos ilimitados',
        'Clientes ilimitados',
        'Diário técnico completo com fotos ilimitadas',
        'Portal do cliente e compartilhamento',
        'PDFs com identidade visual'
      ]
    }
  },
  engineer: {
    free: {
      id: 'eng_free',
      name: 'Engenheiro Gratuito',
      monthlyPrice: 0,
      yearlyPrice: 0,
      limits: {
        ...DEFAULT_LIMITS,
        maxProjects: 2,
        maxClients: 5,
      },
      features: [
        'Até 2 projetos ativos',
        'Até 5 clientes',
        'Diário técnico básico',
        'Calculadoras ilimitadas'
      ]
    },
    starter: {
      id: 'eng_starter',
      name: 'Engenheiro Básico',
      monthlyPrice: 29.99,
      yearlyPrice: 287.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxProjects: 5,
        maxClients: 20,
        hasAdvancedPDF: false,
        hasFunnel: false,
      },
      features: [
        'Até 5 projetos ativos',
        'Até 20 clientes',
        'Diário técnico básico',
        'Suporte por email',
      ]
    },
    pro: {
      id: 'eng_pro',
      name: 'Engenheiro Profissional',
      monthlyPrice: 49.99,
      yearlyPrice: 479.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxProjects: 9999,
        maxClients: 9999,
        hasAdvancedPDF: true,
      },
      features: [
        'Projetos ilimitados',
        'Clientes ilimitados',
        'Controle documental avançado',
        'Orçamento técnico profissional'
      ]
    }
  },
  builder: {
    free: {
      id: 'builder_free',
      name: 'Construtora Gratuita (Teste)',
      monthlyPrice: 0,
      yearlyPrice: 0,
      limits: {
        ...DEFAULT_LIMITS,
        maxWorks: 1,
        maxTeamMembers: 2,
      },
      features: [
        '1 obra ativa',
        'Equipe e compras básicas',
        'Financeiro básico',
        'Calculadoras ilimitadas'
      ]
    },
    starter: {
      id: 'builder_starter',
      name: 'Construtora Básica',
      monthlyPrice: 29.99,
      yearlyPrice: 287.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxWorks: 2,
        maxTeamMembers: 4,
        hasAdvancedPDF: false,
        hasFunnel: false,
      },
      features: [
        'Até 2 obras ativas',
        'Equipe de até 4 membros',
        'Financeiro e compras básicas',
        'Suporte por email',
      ]
    },
    pro: {
      id: 'builder_business',
      name: 'Construtora Business',
      monthlyPrice: 49.99,
      yearlyPrice: 479.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxWorks: 5,
        maxTeamMembers: 10,
        hasAdvancedPDF: true,
        hasPremiumSupport: true,
      },
      features: [
        'Até 5 obras ativas',
        'Equipes e usuários ampliados (até 10)',
        'Gestão financeira e compras avançadas',
        'Gantt e Centro de Operações'
      ]
    },
    business: {
      id: 'builder_enterprise',
      name: 'Construtora Enterprise',
      monthlyPrice: 99.99,
      yearlyPrice: 959.90,
      limits: {
        ...DEFAULT_LIMITS,
        maxWorks: 9999,
        maxTeamMembers: 9999,
        hasAdvancedPDF: true,
        hasPremiumSupport: true,
      },
      features: [
        'Obras ilimitadas',
        'Múltiplas equipes e usuários ilimitados',
        'API e integrações ERP',
        'Dashboards personalizados'
      ]
    }
  }
};

export const getPlanDetails = (role: UserRole, planId: string): PlanDefinition => {
  if (!role || !PLANS_CONFIG[role]) return PLANS_CONFIG.owner.free;
  
  const rolePlans = PLANS_CONFIG[role];
  if (planId === 'starter') {
    return rolePlans.starter || rolePlans.free;
  }
  if (planId === 'pro' || planId === 'premium' || planId === 'business') {
    return rolePlans.pro; // map legacy 'premium' to 'pro'
  }
  if (planId === 'enterprise' && rolePlans.business) {
    return rolePlans.business;
  }
  return rolePlans.free;
};
