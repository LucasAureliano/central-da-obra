const fs = require('fs');

let tour = fs.readFileSync('src/components/onboarding/InteractiveTour.tsx', 'utf8');

const stepsObj = `steps: [
          {
            element: document.querySelector('.tour-inicio') || undefined,
            popover: {
              title: 'Bem-vindo ao CentralObra!',
              description: 'Este é o seu painel central. Aqui você tem uma visão geral de tudo.',
              side: isDesktop ? 'right' : 'top',
              align: 'start'
            }
          },
          {
            element: document.querySelector('.tour-obras') || undefined,
            popover: {
              title: 'Seus Projetos',
              description: 'Gerencie todas as suas obras, orçamentos e clientes neste menu.',
              side: isDesktop ? 'right' : 'top',
              align: 'start'
            }
          },
          {
            element: document.querySelector('.tour-assistente') || undefined,
            popover: {
              title: 'Inteligência Artificial',
              description: 'Nossa IA responde dúvidas técnicas, normas da ABNT e auxilia nos seus orçamentos.',
              side: isDesktop ? 'right' : 'top',
              align: 'start'
            }
          },
          {
            element: document.querySelector('.tour-calculos') || document.querySelector('.tour-obras') || undefined,
            popover: {
              title: 'Calculadoras Exatas',
              description: 'Descubra a quantidade exata de materiais para cada etapa, evitando desperdício.',
              side: isDesktop ? 'right' : 'top',
              align: 'start'
            }
          },
          {
            popover: {
              title: 'Tudo pronto!',
              description: 'Você está preparado para usar a plataforma. Explore as ferramentas e ganhe produtividade!',
            }
          }
        ]`;

tour = tour.replace(/steps: \[[\s\S]*?\]/, stepsObj);
tour = tour.replace(/doneBtnText: '.*?'/, "doneBtnText: 'Começar'");
tour = tour.replace(/nextBtnText: '.*?'/, "nextBtnText: 'Avançar'");

fs.writeFileSync('src/components/onboarding/InteractiveTour.tsx', tour, 'utf8');
