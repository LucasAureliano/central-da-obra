import { motion } from 'framer-motion';
import { Target, Shield, Zap, HeartHandshake } from 'lucide-react';

const differentials = [
  {
    icon: <Target size={24} />,
    title: 'Foco Exclusivo',
    description: 'Não somos um sistema genérico de gestão. Focamos 100% nas necessidades reais de quem constrói e reforma no Brasil.'
  },
  {
    icon: <Shield size={24} />,
    title: 'Embasamento Técnico',
    description: 'Todas as nossas calculadoras são baseadas nas normas técnicas brasileiras (ABNT) e manuais de fornecedores homologados.'
  },
  {
    icon: <Zap size={24} />,
    title: 'Curva de Aprendizado Zero',
    description: 'Interface intuitiva que sua equipe aprende a usar em 5 minutos. Chega de treinamentos extensos e manuais complexos.'
  },
  {
    icon: <HeartHandshake size={24} />,
    title: 'Suporte que Entende de Obra',
    description: 'Nossa equipe de suporte é formada por profissionais da área que falam a mesma língua que você.'
  }
];

export function DifferentialsSection() {
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
          <h2 className="landing-section-title">Por que escolher a <span className="text-gradient">CentralObra</span></h2>
          <p className="landing-section-subtitle">Diferenciais que nos tornam a melhor opção do mercado para a gestão inteligente da sua construção.</p>
        </motion.div>

        <div className="grid-cols-2">
          {differentials.map((diff, index) => (
            <motion.div 
              key={index} 
              className="landing-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div className="card-icon-wrapper" style={{ marginBottom: 0 }}>
                  {diff.icon}
                </div>
                <div>
                  <h3 className="card-title">{diff.title}</h3>
                  <p className="card-description">{diff.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
