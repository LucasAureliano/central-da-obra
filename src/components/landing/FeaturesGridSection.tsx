import { motion } from 'framer-motion';
import { Smartphone, Zap, Cloud, Lock, Users, PieChart } from 'lucide-react';

const features = [
  {
    icon: <Smartphone size={24} />,
    title: 'Mobile First',
    description: 'Feito para funcionar perfeitamente no canteiro de obras, direto do seu celular.'
  },
  {
    icon: <Zap size={24} />,
    title: 'Mais Rápido',
    description: 'Crie orçamentos e pedidos de material em segundos, não em horas.'
  },
  {
    icon: <Cloud size={24} />,
    title: 'Sincronização em Nuvem',
    description: 'Seus dados sempre seguros e acessíveis de qualquer dispositivo, a qualquer momento.'
  },
  {
    icon: <Lock size={24} />,
    title: 'Segurança Bancária',
    description: 'Proteção avançada para os dados financeiros dos seus clientes e da sua empresa.'
  },
  {
    icon: <Users size={24} />,
    title: 'Trabalho em Equipe',
    description: 'Compartilhe o progresso com clientes e delegue tarefas para sua equipe.'
  },
  {
    icon: <PieChart size={24} />,
    title: 'Relatórios Inteligentes',
    description: 'Gráficos automáticos mostrando para onde está indo o dinheiro da obra.'
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
