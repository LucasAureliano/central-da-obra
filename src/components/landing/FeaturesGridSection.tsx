import { motion } from 'framer-motion';
import { Lightbulb, Settings2, Users, PieChart, Calculator, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <PieChart size={24} />,
    title: 'Raio-X & Insights',
    description: 'Diagnóstico financeiro ao vivo. O sistema te avisa caso a obra esteja estourando o orçamento ou atrasada.'
  },
  {
    icon: <Lightbulb size={24} />,
    title: 'Projetos Complementares',
    description: 'Módulos interativos para Elétrica, Hidráulica, Automação, Interiores, Luminotécnica e Marcenaria.'
  },
  {
    icon: <Users size={24} />,
    title: 'CentralObra Connect',
    description: 'Um hub de talentos. Crie seu Portfólio Público e encontre clientes ou profissionais próximos a você.'
  },
  {
    icon: <Calculator size={24} />,
    title: 'Central de Cálculos',
    description: 'Mais de 15 calculadoras técnicas integradas: alvenaria, pisos, tintas, gesso, ar-condicionado e mais.'
  },
  {
    icon: <Settings2 size={24} />,
    title: 'Gestão Inteligente',
    description: 'Integração de Cronograma Interativo com Lista de Compras. Tudo o que precisa ser feito, com o que precisa ser comprado.'
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Planos & Assinaturas',
    description: 'Ecossistema seguro com Checkout nativo, permitindo upgrade de recursos para donos, prestadores e construtoras.'
  }
];

export function FeaturesGridSection() {
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
          <h2 className="landing-section-title">Tudo que você precisa em <span className="text-gradient">um só lugar</span></h2>
          <p className="landing-section-subtitle">Substitua planilhas complexas e papéis perdidos por um sistema feito sob medida para a construção civil.</p>
        </motion.div>

        <div className="grid-cols-3">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="landing-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="card-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
