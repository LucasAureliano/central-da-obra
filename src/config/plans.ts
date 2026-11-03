import type { UserRole } from '../types';

export interface PlanLimits {
  maxWorks: number;
  maxProjects?: number;
  maxQuotes: number;
  maxClients: number;
  maxTeamMembers?: number;
  hasAds: boolean;
  hasAdvancedPDF: boolean;
  hasFunnel: boolean;
  hasPremiumSupport?: boolean;
  connectVisibility?: 'basic' | 'enhanced' | 'top_priority' | 'exclusive_top1';
  hasVerifiedBadge?: boolean;
  hasMarketingCenter?: boolean;
}

export interface PlanDefinition {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  limits: PlanLimits;
  features: string[];
}

const DEFAULT_LIMITS: PlanLimits = {
  maxWorks: 1,
  maxQuotes: 3,
  maxClients: 5,
  hasAds: false,
  hasAdvancedPDF: false,
  hasFunnel: false,
  connectVisibility: 'basic',
  hasVerifiedBadge: false,
  hasMarketingCenter: false,
};

export const PLANS_CONFIG: Record<UserRole, Record<string, PlanDefinition>> = {
  owner: {
    free: {
      id: 'owner_free',
      name: 'Proprietário Gratuito',
      monthlyPrice: 0,
      yearlyPrice: 0,
      limits: {
        ...DEFAULT_LIMITS,
        maxWorks: 1,
        maxQuotes: 3,
        maxClients: 5,
        hasAds: true,
      },
      features: [
        '1 obra ativa',
        'Cálculo de materiais básico',
        'Controle financeiro simples',
        'Busca no Radar Connect de Profissionais',
        'Com anúncios na plataforma'
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
        'Até 30 contatos de profissionais',
        'Financeiro e cronograma básico',
        'Solicitação de orçamentos direta pelo Connect',
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
        maxWorks: 9999,
        maxQuotes: 9999,
        maxClients: 9999,
        hasAdvancedPDF: true,
      },
      features: [
        'Obras ilimitadas',
        'Relatórios avançados e comparativos',
        'PDFs White-label (Sem marca do app)',
        'Acesso prioritário a profissionais PRO Verificados',
        'Copilot da Obra com IA e transcrição ilimitada',
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
        maxQuotes: 3,
        maxProjects: 2,
        maxWorks: 2,
        maxClients: 5,
        hasAds: true,
        connectVisibility: 'basic',
        hasVerifiedBadge: false,
        hasMarketingCenter: false,
      },
      features: [
        'Visibilidade padrão no CentralObra Connect',
        'Até 3 orçamentos por mês',
        'Até 2 projetos/obras',
        'Até 5 clientes',
        'Com anúncios na plataforma'
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
        connectVisibility: 'enhanced',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Selo de Prestador Verificado no Connect',
        '+2x mais visualizações no Radar de Profissionais',
        'Central de Marketing (artes para Instagram e WhatsApp)',
        'Até 15 orçamentos por mês',
        'Até 30 clientes',
        'Cadastro de serviços e agenda',
        'Suporte por email'
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
        connectVisibility: 'top_priority',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Destaque no Topo do Radar Connect da sua Cidade',
        'Até 10x mais visualizações de perfil por proprietários',
        'Selo PRO Dourado de Alta Recomendação',
        'Prioridade máxima ao orçar serviços no app',
        'Central de Marketing Completa com artes ilimitadas',
        'Até 50 orçamentos por mês e clientes ilimitados',
        'Orçamentos White-label (PDF Premium com QR Code)',
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
        connectVisibility: 'exclusive_top1',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Posição TOP 1 Absoluto na sua Região no Connect',
        'Máxima visibilidade em reformas comerciais e grandes obras',
        'Selo Prestador Master Verificado',
        'Central de Marketing VIP (sem marca d\'água)',
        'Orçamentos e clientes ilimitados',
        'Automações e análise de margem de lucro',
        'Copilot da Obra com IA e suporte 24/7'
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
        hasAds: true,
        connectVisibility: 'basic',
        hasVerifiedBadge: false,
        hasMarketingCenter: false,
      },
      features: [
        'Perfil básico no CentralObra Connect',
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
        connectVisibility: 'enhanced',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Selo de Arquiteto Verificado (CAU)',
        '+3x mais visualizações no Radar Connect',
        'Central de Marketing (posts de projetos para redes sociais)',
        'Até 5 projetos ativos e 20 clientes',
        'Diário técnico e vistorias com fotos',
        'Suporte por email'
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
        connectVisibility: 'top_priority',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Destaque Master no Topo do Radar Connect de Arquitetura',
        'Até 10x mais visualizações por proprietários e construtoras',
        'Selo PRO Dourado + Vitrine de Projetos 3D em Alta Resolução',
        'Recomendação prioritária quando proprietários iniciam obras',
        'Central de Marketing Completa com artes conceituais e cartão digital',
        'Projetos e clientes ilimitados',
        'Portal do Cliente e Diário técnico com fotos ilimitadas',
        'PDFs Premium White-label com QR Code customizado'
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
        hasAds: true,
        connectVisibility: 'basic',
        hasVerifiedBadge: false,
        hasMarketingCenter: false,
      },
      features: [
        'Perfil básico no CentralObra Connect',
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
        connectVisibility: 'enhanced',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Selo de Engenheiro Verificado (CREA)',
        '+3x mais visualizações no Radar Connect',
        'Central de Marketing (posts de autoridade técnica e laudos)',
        'Até 5 projetos ativos e 20 clientes',
        'Diário técnico e controle básico',
        'Suporte por email'
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
        connectVisibility: 'top_priority',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Destaque Master no Topo das Buscas de Engenharia da Cidade',
        'Até 10x mais visualizações de perfil para laudos e projetos estruturais',
        'Selo PRO Dourado de Autoridade Técnica (CREA)',
        'Indicação direta para proprietários e construtoras',
        'Central de Marketing Completa com artes profissionais',
        'Projetos e clientes ilimitados',
        'Controle documental avançado, laudos técnicos e ART',
        'PDFs Premium White-label com QR Code customizado'
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
        hasAds: true,
        connectVisibility: 'basic',
        hasVerifiedBadge: false,
        hasMarketingCenter: false,
      },
      features: [
        'Perfil institucional básico no CentralObra Connect',
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
        connectVisibility: 'enhanced',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Selo Construtora Verificada no Connect',
        '+3x mais visualizações no Catálogo de Construtoras',
        'Central de Marketing (artes de obras em andamento)',
        'Até 2 obras ativas',
        'Equipe de até 4 membros',
        'Financeiro e compras básicas',
        'Suporte por email'
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
        connectVisibility: 'top_priority',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Destaque Corporativo no Radar Connect para Obras e Reformas',
        'Até 10x mais visualizações por investidores e proprietários',
        'Selo Construtora Business Verificada',
        'Recepção prioritária de cotações de grande porte',
        'Central de Marketing Corporativa com posts para redes sociais',
        'Até 5 obras ativas e 10 membros de equipe',
        'Gestão financeira e compras avançadas',
        'Gantt, Centro de Operações e PDFs Profissionais White-label'
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
        connectVisibility: 'exclusive_top1',
        hasVerifiedBadge: true,
        hasMarketingCenter: true,
      },
      features: [
        'Posição TOP 1 Regional de Construtoras e Empreiteiras',
        'Canal exclusivo direto com investidores e grandes empreendimentos',
        'Selo Construtora Enterprise Premium',
        'Divulgação patrocinada de lançamentos no Connect',
        'Obras ilimitadas e membros de equipe ilimitados',
        'Central de Marketing Corporativa VIP',
        'API, integrações ERP e Dashboards corporativos'
      ]
    }
  }
};

export const getPlanDetails = (role?: UserRole | string | null, planId: string = 'free'): PlanDefinition => {
  if (!role || !PLANS_CONFIG[role as UserRole]) return PLANS_CONFIG.owner.free;
  
  const rolePlans = PLANS_CONFIG[role as UserRole];
  if (planId === 'starter') {
    return rolePlans.starter || rolePlans.free;
  }
  if (planId === 'pro' || planId === 'premium' || planId === 'business') {
    return rolePlans.pro; 
  }
  if (planId === 'enterprise' && rolePlans.business) {
    return rolePlans.business;
  }
  return rolePlans.free;
};
