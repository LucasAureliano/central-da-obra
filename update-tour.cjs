const fs = require('fs');
let code = fs.readFileSync('src/components/onboarding/InteractiveTour.tsx', 'utf8');

const newSteps = `        steps: [
          {
            popover: {
              title: 'Bem-vindo ao CentralObra!',
              description: 'Este é o seu painel de controle. Vamos fazer um tour rápido de 1 minuto para você dominar tudo.',
            }
          },
          {
            element: document.querySelector('.tour-inicio') || undefined,
            popover: {
              title: 'Visão Geral',
              description: 'Aqui você acompanha o progresso de tudo. Fique de olho nos alertas vermelhos!',
              side: isDesktop ? 'right' : 'top',
              align: 'start'
            }
          },
          {
            element: document.querySelector('.tour-obras') || undefined,
            popover: {
              title: 'Gestão de Obras',
              description: 'Onde a mágica acontece. Crie cronogramas, orçamentos e convide clientes.',
              side: isDesktop ? 'right' : 'top',
              align: 'start'
            }
          },
          {
            element: document.querySelector('.tour-assistente') || undefined,
            popover: {
              title: 'Inteligência Artificial',
              description: 'Tem dúvidas técnicas? Nossa IA tira dúvidas e pesquisa a ABNT para você na hora.',
              side: isDesktop ? 'right' : 'top',
              align: 'start'
            }
          },
          {
            element: document.querySelector('.tour-calculos') || undefined,
            popover: {
              title: 'Calculadoras Exatas',
              description: 'Quantifique cimento, tijolo, piso e tinta para evitar dor de cabeça com sobras ou faltas.',
              side: isDesktop ? 'right' : 'top',
              align: 'start'
            }
          },
          {
            popover: {
              title: 'Tudo pronto! 🚀',
              description: 'Sinta-se em casa. Explore, crie e se torne mais produtivo hoje mesmo!',
            }
          }
        ]`;

// regex to replace the steps array safely
code = code.replace(/steps: \[\s*\{[\s\S]*\}\s*\]/, newSteps);

// add popoverClass dynamic
code = code.replace("popoverClass: 'premium-tour-popover',", "popoverClass: 'premium-tour-popover',");

fs.writeFileSync('src/components/onboarding/InteractiveTour.tsx', code, 'utf8');
console.log('updated tour');
