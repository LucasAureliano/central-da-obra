import { motion } from 'framer-motion';
import { Calculator, Ruler, PaintRoller, Hammer, CheckCircle2, FileSpreadsheet } from 'lucide-react';

const calculatorFeatures = [
  {
    icon: <Calculator size={24} />,
    title: 'Mais de 80 Calculadoras Integradas',
    description: 'De alvenaria a acabamento, encontre ferramentas completas para calcular exatamente o que você precisa.'
  },
  {
    icon: <PaintRoller size={24} />,
    title: 'Acabamentos e Revestimentos',
    description: 'Calcule a quantidade exata de pisos, porcelanatos, tintas, rejuntes e argamassas sem desperdício.'
  },
  {
    icon: <Ruler size={24} />,
    title: 'Estrutura e Alvenaria',
    description: 'Quantifique tijolos, blocos de concreto, cimento, areia e brita com precisão milimétrica.'
  },
  {
    icon: <Hammer size={24} />,
    title: 'Gesso, Drywall e Telhados',
    description: 'Planeje sua cobertura e forros de gesso com facilidade, reduzindo sobras e economizando dinheiro.'
  },
  {
    icon: <FileSpreadsheet size={24} />,
    title: 'Geração de Listas',
    description: 'Exporte os resultados diretamente para a sua lista de compras ou orçamento da obra.'
  },
  {
    icon: <CheckCircle2 size={24} />,
    title: '100% Gratuito',
    description: 'Todas as calculadoras de materiais são totalmente gratuitas para todos os usuários da plataforma.'
  }
];

export function CalculatorLandingSection() {
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '16px' }}>
            <span style={{ position: 'relative', display: 'flex', height: '10px', width: '10px' }}>
              <span style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '9999px', backgroundColor: '#34d399', opacity: 0.75 }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '9999px', height: '10px', width: '10px', backgroundColor: '#10b981' }}></span>
            </span>
            Gratuito para Todos
          </div>
          
          <h2 className="landing-section-title">A Mais Completa <span className="text-gradient">Calculadora de Materiais</span></h2>
          <p className="landing-section-subtitle">
            Diga adeus ao "chutômetro" e ao desperdício. Nossa plataforma oferece dezenas de calculadoras precisas para quantificar materiais de construção de forma simples, rápida e gratuita.
          </p>
        </motion.div>

        <div className="grid-cols-3">
          {calculatorFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              className="landing-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="card-icon-wrapper" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                {feature.icon}
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}
        >
          <button 
            onClick={() => window.location.href = '/calculadoras'}
            className="btn-primary" 
            style={{ padding: '16px 32px', fontSize: '18px', fontWeight: 700, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            Acessar Calculadoras Gratuitas
            <Calculator size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
