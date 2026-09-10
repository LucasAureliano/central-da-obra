import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuth } from '../../contexts/AuthContext';

interface InteractiveTourProps {
  onComplete: () => void;
}

export function InteractiveTour({ onComplete }: InteractiveTourProps) {
  const isRunning = useRef(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;

    
    const checkElements = setInterval(() => {
      const isDesktop = window.innerWidth > 1024;
      const requiredSelector = isDesktop ? '#tour-inicio-desktop' : '#tour-inicio-mobile';
      
      if (document.querySelector(requiredSelector)) {
        clearInterval(checkElements);
        startTour();
      }
    }, 200);

    // Timeout after 5s just in case
    setTimeout(() => { clearInterval(checkElements); startTour(); }, 5000);

    const startTour = () => {
      const isDesktop = window.innerWidth > 1024;
      const role = profile?.role;
      
      // Selectors based on screen size
      const sel = {
        inicio: isDesktop ? '#tour-inicio-desktop' : '#tour-inicio-mobile',
        obras: isDesktop ? '#tour-obras-desktop' : '#tour-obras-mobile',
        assistente: isDesktop ? '#tour-assistente-desktop' : '#tour-assistente-mobile',
        menu: isDesktop ? '#tour-menu-desktop' : '#tour-menu-mobile',
        calculos: isDesktop ? '#tour-calculos-desktop' : '#tour-calculos-mobile',
      };

      let roleSteps: any[] = [];

      switch(role) {
        case 'owner':
          roleSteps = [
            { popover: { title: 'Olá!', description: 'Vou te mostrar rapidamente como acompanhar sua obra pela CentralObra.' } },
            { element: sel.inicio, popover: { title: 'Seu Painel', description: 'Aqui você acompanha o resumo financeiro e alertas urgentes da sua obra principal.', side: 'top', align: 'start' } },
            { element: sel.obras, popover: { title: 'Obra Principal', description: 'Nesta aba você tem acesso detalhado ao progresso, fotos e diário da sua construção.', side: 'top', align: 'start' } },
            { element: sel.assistente, popover: { title: 'Assistente IA', description: 'Sempre que tiver dúvidas sobre materiais ou normas, converse com nosso Assistente de Engenharia.', side: 'top', align: 'start' } },
            { element: sel.calculos, popover: { title: 'Calculadoras', description: 'Acesse dezenas de calculadoras exatas para tijolo, tinta, cimento e evite desperdícios.', side: 'top', align: 'start' } },
            { element: sel.menu, popover: { title: 'Menu Completo', description: 'Abra o Menu para acessar Compras, Financeiro, Cronograma e Compartilhamento da sua obra!', side: 'top', align: 'end' } }
          ];
          break;
        case 'service':
          roleSteps = [
            { popover: { title: 'Olá, Profissional!', description: 'Vou te mostrar como digitalizar seus serviços e impressionar seus clientes.' } },
            { element: sel.inicio, popover: { title: 'Seu Painel', description: 'Acompanhe seus orçamentos ativos e recebimentos pendentes de relance.', side: 'top', align: 'start' } },
            { element: sel.assistente, popover: { title: 'IA Técnica', description: 'Gere descritivos rápidos para orçamentos ou tire dúvidas técnicas de obra na hora.', side: 'top', align: 'start' } },
            { element: sel.calculos, popover: { title: 'Quantitativos', description: 'Calcule rapidamente o material que o cliente precisa comprar, sem erro.', side: 'top', align: 'start' } },
            { element: sel.menu, popover: { title: 'Gestão Completa', description: 'No Menu você cria Novos Orçamentos, cadastra Clientes, Agenda serviços e lança Recebimentos!', side: 'top', align: 'end' } }
          ];
          break;
        case 'architect':
        case 'engineer':
          roleSteps = [
            { popover: { title: 'Bem-vindo(a)!', description: 'A CentralObra será sua ferramenta de gestão e acompanhamento técnico.' } },
            { element: sel.inicio, popover: { title: 'Dashboard', description: 'Tenha a visão geral de todos os seus projetos e medições pendentes.', side: 'top', align: 'start' } },
            { element: sel.obras, popover: { title: 'Projetos', description: 'Cadastre suas obras, crie Cronogramas e registre as Vistorias do Diário de Obra.', side: 'top', align: 'start' } },
            { element: sel.assistente, popover: { title: 'Apoio ABNT', description: 'Consulte normas ABNT e valide cálculos estruturais rapidamente com nossa IA.', side: 'top', align: 'start' } },
            { element: sel.menu, popover: { title: 'Relatórios Técnicos', description: 'Acesse o Menu para gerar Relatórios fotográficos, Notas Técnicas e enviar aos clientes.', side: 'top', align: 'end' } }
          ];
          break;
        case 'builder':
          roleSteps = [
            { popover: { title: 'Bem-vindo, Construtor!', description: 'Vamos organizar a escala total das suas operações e equipes.' } },
            { element: sel.inicio, popover: { title: 'Visão Executiva', description: 'Acompanhe a margem de lucro, alertas de estouro e fluxo de caixa de todas as obras.', side: 'top', align: 'start' } },
            { element: sel.obras, popover: { title: 'Suas Obras', description: 'Gerencie cada canteiro de obras, com cronogramas e centros de custo isolados.', side: 'top', align: 'start' } },
            { element: sel.assistente, popover: { title: 'Assistente Corporativo', description: 'Peça à IA para analisar fornecedores ou gerar relatórios resumidos de canteiro.', side: 'top', align: 'start' } },
            { element: sel.menu, popover: { title: 'Centro de Operações', description: 'Acesse o Menu para escalar: Equipes (RH), Financeiro Corporativo e Central de Compras.', side: 'top', align: 'end' } }
          ];
          break;
        default:
          roleSteps = [
            { popover: { title: 'Olá Visitante!', description: 'Sinta-se livre para explorar as Calculadoras e o Assistente Inteligente gratuitamente.' } },
            { element: sel.assistente, popover: { title: 'Assistente IA', description: 'Faça perguntas técnicas para a nossa inteligência baseada na ABNT.', side: 'top', align: 'start' } },
            { element: sel.calculos, popover: { title: 'Calculadoras', description: 'Simule quantidades de material para qualquer etapa da obra.', side: 'top', align: 'start' } }
          ];
      }

      const tour = driver({
        showProgress: true,
        animate: true,
        smoothScroll: true,
        overlayColor: 'rgba(0,0,0,0.85)',
        stagePadding: 8,
        stageRadius: 16,
        popoverClass: 'premium-tour-popover',
        allowClose: false,
        doneBtnText: 'Começar a Usar',
        nextBtnText: 'Avançar',
        prevBtnText: 'Voltar',
        progressText: '{{current}} de {{total}}',
        onDestroyed: () => {
          onComplete();
        },
        steps: [
          ...roleSteps,
          {
            popover: {
              title: 'Pronto!',
              description: 'Agora você já conhece a CentralObra. O aplicativo é seu!',
            }
          }
        ]
      });
      
      tour.drive();
    };

    return () => {};
  }, [onComplete, profile?.role]);

  return null;
}
