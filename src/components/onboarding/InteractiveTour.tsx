import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface InteractiveTourProps {
  onComplete: () => void;
  role?: string;
}

export function InteractiveTour({ onComplete, role }: InteractiveTourProps) {
  const isRunning = useRef(false);

  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;

    setTimeout(() => {
      const isDesktop = window.innerWidth > 1024;
      
      const tour = driver({
        showProgress: true,
        animate: true,
        smoothScroll: true,
        overlayColor: 'rgba(0,0,0,0.7)',
        stagePadding: 8,
        stageRadius: 16,
        popoverClass: 'premium-tour-popover',
        allowClose: false,
        doneBtnText: 'Começar',
        nextBtnText: 'Avançar',
        prevBtnText: 'Voltar',
        progressText: '{{current}} de {{total}}',
        onDestroyed: () => {
          onComplete();
        },
                steps: [
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
        ]
      });
      tour.drive();
    }, 800);

    return () => {
      // Unmount cleanup handled by internal driver instance if needed
    };
  }, [onComplete]);

  return null;
}
