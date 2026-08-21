import { motion } from 'framer-motion';
import { UserPlus, ClipboardList, TrendingUp, FileText } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={32} />,
    title: '1. Crie sua Conta',
    description: 'Cadastre-se rapidamente e escolha seu perfil: Proprietário, Prestador ou Empresa.'
  },
  {
    icon: <ClipboardList size={32} />,
    title: '2. Configure sua Obra',
    description: 'Adicione os dados do seu projeto, defina o orçamento inicial e monte o cronograma básico.'
  },
  {
    icon: <TrendingUp size={32} />,
    title: '3. Acompanhe em Tempo Real',
    description: 'Lance despesas, controle os materiais e verifique o progresso da obra de onde estiver.'
  },
  {
    icon: <FileText size={32} />,
    title: '4. Gere Relatórios',
    description: 'Exporte relatórios financeiros e diários de obra em PDF para compartilhar com a equipe ou clientes.'
  }
];

export function HowItWorksSection() {
  return (
    <section className="landing-section" style={{ background: 'var(--bg-card)' }}>
      <div className="landing-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="landing-section-title">Como <span className="text-gradient">Funciona</span></h2>
          <p className="landing-section-subtitle">Começar a usar a CentralObra é simples e rápido. Veja o passo a passo.</p>
        </motion.div>

        <div className="grid-cols-4" style={{ position: 'relative', marginTop: 40 }}>
          {/* Timeline connecting line for desktop */}
          <div 
            className="mobile-hidden"
            style={{
              position: 'absolute',
              top: '40px',
              left: '12%',
              right: '12%',
              height: '2px',
              background: 'var(--border-color)',
              zIndex: 0
            }}
          />

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div 
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: 'var(--bg-body)', 
                  border: '2px solid var(--border-color)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: 24,
                  color: 'var(--color-primary)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                {step.icon}
              </div>
              <h3 className="card-title" style={{ fontSize: '1.25rem' }}>{step.title}</h3>
              <p className="card-description">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
