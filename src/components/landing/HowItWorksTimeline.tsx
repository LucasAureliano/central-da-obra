import { motion } from 'framer-motion';
import { PencilRuler, BookOpen, Calculator, BarChart3 } from 'lucide-react';

const timelineSteps = [
  {
    icon: <PencilRuler size={24} />,
    title: "1. Comece pelo Projeto",
    description: "Insira os dados básicos da sua obra: metragens, tipo de fundação, alvenaria e acabamentos desejados."
  },
  {
    icon: <BookOpen size={24} />,
    title: "2. Consulte a Biblioteca",
    description: "Em caso de dúvida sobre alguma execução, consulte nosso acervo de NBRs e manuais de práticas recomendadas."
  },
  {
    icon: <Calculator size={24} />,
    title: "3. Calcule Materiais Instantaneamente",
    description: "Use as mais de 80 calculadoras integradas para saber exatamente quantos blocos, sacos de cimento e barras de aço comprar."
  },
  {
    icon: <BarChart3 size={24} />,
    title: "4. Acompanhe os Custos",
    description: "Registre compras, fotografe notas fiscais e veja os gráficos de custo por etapa se formando automaticamente."
  }
];

export function HowItWorksTimeline() {
  return (
    <section className="landing-section">
      <div className="landing-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="landing-section-title">Como a CentralObra <span className="text-gradient">funciona</span></h2>
          <p className="landing-section-subtitle">Um fluxo de trabalho contínuo, do projeto inicial à entrega das chaves.</p>
        </motion.div>

        <div className="timeline-container">
          {timelineSteps.map((step, index) => (
            <motion.div 
              key={index} 
              className="timeline-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="timeline-icon">
                {step.icon}
              </div>
              <div style={{ paddingTop: 12 }}>
                <h3 className="card-title" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', marginBottom: 8 }}>{step.title}</h3>
                <p className="card-description" style={{ fontSize: 'clamp(15px, 2vw, 16px)' }}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
