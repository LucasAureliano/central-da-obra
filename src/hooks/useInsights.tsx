import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWorks } from '../contexts/WorksContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AlertCircle, TrendingUp, Package, Settings, ShieldAlert, Construction, Briefcase, DollarSign, Users } from 'lucide-react';

export type InsightPriority = 'critical' | 'high' | 'medium' | 'info';
export type InsightCategory = 'finance' | 'shopping' | 'schedule' | 'calculator' | 'execution' | 'safety' | 'technical' | 'work';

export interface Insight {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  priority: InsightPriority;
  category: InsightCategory;
  date: Date;
  suggestedAction: string;
  actionRoute: string;
}

export function useInsights() {
  const { user, profile } = useAuth();
  const { activeWork, works, primaryWorkStats } = useWorks();
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    if (!user) {
      setInsights([]);
      return;
    }

    const generatedInsights: Insight[] = [];
    const now = new Date();
    const role = profile?.role || 'owner';
    
    // --- BASIC WORK CHECK ---
    if (!activeWork && role === 'owner') {
      generatedInsights.push({
        id: 'no-active-work-owner',
        icon: <Construction size={20} color="var(--color-primary)" />,
        title: 'Nenhuma Obra Ativa',
        description: 'Você precisa criar ou selecionar uma obra para começarmos a gerenciar.',
        priority: 'high',
        category: 'work',
        date: now,
        suggestedAction: 'Criar uma Obra',
        actionRoute: 'obras'
      });
      setInsights(generatedInsights);
      return;
    }

    // Role-specific static/dynamic logic (Since we don't have deep modules yet, we infer from basic stats)
    if (role === 'service') {
      if (works.length > 0) {
        generatedInsights.push({
          id: 'service-budget',
          icon: <DollarSign size={20} color="#10B981" />,
          title: 'Orçamentos em Aberto',
          description: `Você possui ${works.length} projeto(s) em andamento. Lembre-se de enviar as atualizações para seus clientes.`,
          priority: 'medium',
          category: 'finance',
          date: now,
          suggestedAction: 'Ver Projetos',
          actionRoute: 'obras'
        });
      } else {
         generatedInsights.push({
          id: 'service-no-clients',
          icon: <Users size={20} color="#F59E0B" />,
          title: 'Nenhum Cliente Ativo',
          description: `Que tal criar seu primeiro orçamento ou cadastrar um novo cliente?`,
          priority: 'high',
          category: 'work',
          date: now,
          suggestedAction: 'Novo Cliente',
          actionRoute: 'obras'
        });
      }
      generatedInsights.push({
        id: 'service-receivables',
        icon: <TrendingUp size={20} color="#3B82F6" />,
        title: 'Recebimentos Pendentes',
        description: `Mantenha seu fluxo de caixa saudável conferindo os valores a receber esta semana.`,
        priority: 'info',
        category: 'finance',
        date: now,
        suggestedAction: 'Ir para Financeiro',
        actionRoute: 'financeiro'
      });
    }

    if (role === 'architect') {
       if (works.length > 0) {
        generatedInsights.push({
          id: 'arch-schedule',
          icon: <Briefcase size={20} color="#F59E0B" />,
          title: 'Acompanhamento Técnico',
          description: `Você possui ${works.length} projeto(s) ativos. Verifique se os relatórios semanais estão atualizados.`,
          priority: 'medium',
          category: 'schedule',
          date: now,
          suggestedAction: 'Ver Projetos',
          actionRoute: 'obras'
        });
      }
      generatedInsights.push({
        id: 'arch-visit',
        icon: <AlertCircle size={20} color="#3B82F6" />,
        title: 'Vistorias',
        description: `Existe uma recomendação de vistoria técnica programada para os próximos dias em suas obras principais.`,
        priority: 'info',
        category: 'execution',
        date: now,
        suggestedAction: 'Agenda',
        actionRoute: 'agenda'
      });
    }

    if (role === 'builder') {
      const overBudget = works.filter(w => (w.spent || 0) > (w.budget || 0) && (w.budget || 0) > 0);
      if (overBudget.length > 0) {
        generatedInsights.push({
          id: 'builder-overbudget',
          icon: <ShieldAlert size={20} color="#EF4444" />,
          title: 'Obras Estouradas',
          description: `${overBudget.length} obra(s) ultrapassaram 100% do orçamento previsto. Ação imediata requerida.`,
          priority: 'critical',
          category: 'finance',
          date: now,
          suggestedAction: 'Ver Gestão',
          actionRoute: 'obras'
        });
      } else {
        generatedInsights.push({
          id: 'builder-status',
          icon: <TrendingUp size={20} color="#10B981" />,
          title: 'Indicadores Saudáveis',
          description: `Nenhuma das suas ${works.length} obras cadastradas estourou o orçamento.`,
          priority: 'info',
          category: 'finance',
          date: now,
          suggestedAction: 'Ver Painel',
          actionRoute: 'centro-operacoes'
        });
      }
    }

    if (role === 'builder') {
      const delayedWorksCount = works.filter(w => w.status === 'Atrasada').length;
      if (delayedWorksCount > 0) {
        generatedInsights.push({
          id: 'builder-delayed',
          icon: <AlertCircle size={20} color="#EF4444" />,
          title: 'Obras Atrasadas',
          description: `Há ${delayedWorksCount} obra(s) com cronograma atrasado precisando de ação corretiva imediata.`,
          priority: 'critical',
          category: 'execution',
          date: now,
          suggestedAction: 'Centro de Operações',
          actionRoute: 'centro-operacoes'
        });
      }

      const totalBudget = works.reduce((acc, w) => acc + (w.budget || 0), 0);
      const totalSpent = works.reduce((acc, w) => acc + (w.spent || 0), 0);
      if (totalBudget > 0 && totalSpent > totalBudget) {
        generatedInsights.push({
          id: 'builder-finance-critical',
          icon: <DollarSign size={20} color="#EF4444" />,
          title: 'Estouro de Custo Global',
          description: `O custo realizado corporativo ultrapassou o orçado global. Verifique as margens das obras em andamento.`,
          priority: 'critical',
          category: 'finance',
          date: now,
          suggestedAction: 'DRE Consolidado',
          actionRoute: 'financeiro'
        });
      } else if (totalBudget > 0 && (totalSpent / totalBudget) > 0.8) {
        generatedInsights.push({
          id: 'builder-finance-high',
          icon: <TrendingUp size={20} color="#F59E0B" />,
          title: 'Atenção às Margens',
          description: `O custo global atingiu ${Math.round((totalSpent / totalBudget) * 100)}%. Monitore o planejamento de suprimentos e mão de obra.`,
          priority: 'high',
          category: 'finance',
          date: now,
          suggestedAction: 'Ver BI e Margens',
          actionRoute: 'indicadores-bi'
        });
      }

      generatedInsights.push({
        id: 'builder-teams',
        icon: <Users size={20} color="#F59E0B" />,
        title: 'Gestão de Equipes',
        description: `Verifique os apontamentos de produtividade das equipes terceirizadas hoje.`,
        priority: 'medium',
        category: 'execution',
        date: now,
        suggestedAction: 'Equipes',
        actionRoute: 'equipe'
      });
    }

      // Owner logic follows the current work active
      if (role === 'owner' && activeWork) {
        const budget = activeWork.budget || 0;
        const spent = primaryWorkStats?.totalSpent || activeWork.spent || 0;
        const percentSpent = budget > 0 ? (spent / budget) * 100 : 0;

        if (budget > 0 && spent > budget) {
          generatedInsights.push({
            id: 'finance-overbudget',
            icon: <AlertCircle size={20} color="#EF4444" />,
            title: 'Orçamento Ultrapassado',
            description: `Atenção! Você ultrapassou o orçamento em ${Math.abs(budget - spent).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}.`,
            priority: 'critical',
            category: 'finance',
            date: now,
            suggestedAction: 'Ver Financeiro',
            actionRoute: 'financeiro'
          });
        } else if (budget > 0 && percentSpent >= 90) {
          generatedInsights.push({
            id: 'finance-critical',
            icon: <AlertCircle size={20} color="#EF4444" />,
            title: 'Orçamento Crítico',
            description: `Você já utilizou ${percentSpent.toFixed(0)}% do orçamento total. Risco alto de ultrapassar o limite.`,
            priority: 'critical',
            category: 'finance',
            date: now,
            suggestedAction: 'Ver Financeiro',
            actionRoute: 'financeiro'
          });
        } else if (budget > 0 && percentSpent >= 70) {
        generatedInsights.push({
          id: 'finance-high',
          icon: <TrendingUp size={20} color="#F59E0B" />,
          title: 'Atenção ao Orçamento',
          description: `O orçamento está ${percentSpent.toFixed(0)}% utilizado. Planeje bem as próximas compras.`,
          priority: 'high',
          category: 'finance',
          date: now,
          suggestedAction: 'Ver Orçamento',
          actionRoute: 'financeiro'
        });
      }

      if (budget === 0) {
        generatedInsights.push({
          id: 'finance-no-budget',
          icon: <Settings size={20} color="#3B82F6" />,
          title: 'Defina seu Orçamento',
          description: 'Para um melhor controle, defina o valor total que pretende investir na sua obra.',
          priority: 'medium',
          category: 'finance',
          date: now,
          suggestedAction: 'Configurar Obra',
          actionRoute: 'obras'
        });
      }
    }

    // --- PROVIDER SPECIALTY INSIGHTS ---
    const effectiveSpecialty = profile?.specialty || activeWork?.providerServiceType || (works.length > 0 ? works[0].providerServiceType : '');
    if (role === 'service' && effectiveSpecialty) {
      const normSpec = effectiveSpecialty.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (normSpec.includes('eletric') || normSpec.includes('eletrica')) {
        generatedInsights.push({
          id: 'spec-eletrica',
          icon: <Settings size={20} color="#F59E0B" />,
          title: 'Dica de Elétrica',
          description: 'Lembre-se sempre de conferir a NBR 5410 ao dimensionar os disjuntores e seções de fios das obras.',
          priority: 'info',
          category: 'technical',
          date: now,
          suggestedAction: 'Ver Dicas',
          actionRoute: 'assistente'
        });
      } else if (normSpec.includes('encanador') || normSpec.includes('hidráulic')) {
        generatedInsights.push({
          id: 'spec-hidro',
          icon: <Settings size={20} color="#3B82F6" />,
          title: 'Dica de Hidráulica',
          description: 'Teste de estanqueidade (pressurização) deve ser feito antes de fechar a alvenaria para evitar vazamentos invisíveis.',
          priority: 'info',
          category: 'technical',
          date: now,
          suggestedAction: 'Ver Dicas',
          actionRoute: 'assistente'
        });
      } else if (normSpec.includes('pedreiro') || normSpec.includes('alvenaria')) {
        generatedInsights.push({
          id: 'spec-pedreiro',
          icon: <Construction size={20} color="#EF4444" />,
          title: 'Dica de Obra (Alvenaria)',
          description: 'Não se esqueça de usar aditivos impermeabilizantes no baldrame e nas 3 primeiras fiadas para evitar umidade no rodapé.',
          priority: 'info',
          category: 'technical',
          date: now,
          suggestedAction: 'Ver Dicas',
          actionRoute: 'assistente'
        });
      } else if (normSpec.includes('pintor')) {
        generatedInsights.push({
          id: 'spec-pintor',
          icon: <Settings size={20} color="#8B5CF6" />,
          title: 'Dica de Pintura',
          description: 'Lembre-se de respeitar o tempo de cura da massa corrida e aplicar o fundo preparador antes da tinta final.',
          priority: 'info',
          category: 'technical',
          date: now,
          suggestedAction: 'Ver Dicas',
          actionRoute: 'assistente'
        });
      }
    }



    // Realtime Schedule Stages integration
    let unsubStages: (() => void) | null = null;
    let unsubscribeCalcs: () => void = () => {};
    let unsubscribeShopping: () => void = () => {};

    const evaluateAsyncInsights = async () => {
      let dynamicInsights = [...generatedInsights];
      const pValues = { critical: 4, high: 3, medium: 2, info: 1 };
      
      const updateInsights = () => {
        setInsights([...dynamicInsights].sort((a, b) => pValues[b.priority] - pValues[a.priority]));
      };

      const pushInsight = (insight: Insight) => {
        dynamicInsights = dynamicInsights.filter(i => i.id !== insight.id);
        dynamicInsights.push(insight);
        updateInsights();
      };

      if (activeWork) {
        const qStages = query(collection(db, 'works', activeWork.id, 'schedule_stages'));
        unsubStages = onSnapshot(qStages, (snap) => {
          // Clear previous stage insights
          dynamicInsights = dynamicInsights.filter(i => !i.id.startsWith('delayed-') && !i.id.startsWith('pendency-'));
          
          snap.forEach(doc => {
            const stage = doc.data();
            if (stage.endDate) {
              const end = new Date(stage.endDate);
              if (end < new Date() && !stage.completed) {
                dynamicInsights.push({
                  id: `delayed-${doc.id}`,
                  icon: <AlertCircle size={20} color="#EF4444" />,
                  title: `Etapa Atrasada: ${stage.title || stage.name}`,
                  description: `A etapa '${stage.title || stage.name}' deveria ter sido concluída em ${end.toLocaleDateString()}.`,
                  priority: 'critical',
                  category: 'execution',
                  date: now,
                  suggestedAction: 'Ver Cronograma',
                  actionRoute: 'cronograma'
                });
              }
            }
            if (!stage.completed && stage.startDate) {
              const start = new Date(stage.startDate);
              if (start <= new Date() && (!stage.endDate || new Date(stage.endDate) >= new Date())) {
                dynamicInsights.push({
                  id: `pendency-${doc.id}`,
                  icon: <Construction size={20} color="#F59E0B" />,
                  title: `Próxima Etapa: ${stage.title || stage.name}`,
                  description: `A etapa está em andamento ou prestes a iniciar. Mantenha a equipe informada.`,
                  priority: 'high',
                  category: 'schedule',
                  date: now,
                  suggestedAction: 'Ver Etapas',
                  actionRoute: 'cronograma'
                });
              }
            }
          });
          updateInsights();
        });
      }

      // Only check shopping/calcs for owner with active work
      if (role === 'owner' && activeWork) {
        const qCalc = query(collection(db, 'works', activeWork.id, 'calculations'));
        unsubscribeCalcs = onSnapshot(qCalc, (snap) => {
          let calcCount = 0;
          snap.forEach(() => calcCount++);
          if (calcCount === 0) {
            pushInsight({
              id: 'calc-empty',
              icon: <Settings size={20} color="#10B981" />,
              title: 'Otimize seus Materiais',
              description: 'Você ainda não utilizou nenhuma calculadora. Evite desperdícios calculando as quantidades corretas.',
              priority: 'info',
              category: 'calculator',
              date: now,
              suggestedAction: 'Usar Calculadoras',
              actionRoute: 'calculadoras'
            });
          }
        });

        const qShopping = query(collection(db, 'users', user.uid, 'shopping'));
        unsubscribeShopping = onSnapshot(qShopping, (snap) => {
          let pendingItemsCount = 0;
          snap.forEach(docSnap => {
            const data = docSnap.data();
            if (!data.isPurchased) pendingItemsCount++;
          });

          if (pendingItemsCount > 0) {
            pushInsight({
              id: 'shopping-many',
              icon: <Package size={20} color="#F59E0B" />,
              title: 'Materiais Pendentes',
              description: `Há ${pendingItemsCount} materiais pendentes na sua lista.`,
              priority: 'medium',
              category: 'shopping',
              date: now,
              suggestedAction: 'Ver Lista',
              actionRoute: 'compras'
            });
          } else {
             dynamicInsights = dynamicInsights.filter(i => i.id !== 'shopping-many');
             updateInsights();
          }
        });
      } else {
        // If not owner or no active work, just set static insights we already gathered
        updateInsights();
      }
    };

    evaluateAsyncInsights();

    return () => {
      if (unsubStages) unsubStages();
      unsubscribeCalcs();
      unsubscribeShopping();
    };
  }, [user, activeWork, profile, works]);

  return { insights };
}
