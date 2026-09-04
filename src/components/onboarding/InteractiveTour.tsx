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
              description: 'Nossa IA foi treinada com normas da ABNT para responder dúvidas técnicas e orçar plantas.',
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
        ]
      });
      tour.drive();
    }, 500);

    return () => {
      // Unmount cleanup handled by internal driver instance if needed
    };
  }, [onComplete]);

  return null;
}
