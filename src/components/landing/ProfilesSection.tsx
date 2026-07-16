import { motion } from 'framer-motion';
import { HardHat, Briefcase, Home } from 'lucide-react';

const profiles = [
  {
    icon: <HardHat size={32} strokeWidth={1.5} />,
    title: "Engenheiros e Mestres",
    description: "Controle diário do canteiro. Calcule quantitativos precisos e registre o avanço físico da obra com facilidade.",
    color: "#FF6B00",
    bg: "rgba(255, 107, 0, 0.1)"
  },
  {
    icon: <Briefcase size={32} strokeWidth={1.5} />,
    title: "Arquitetos e Escritórios",
    description: "Apresente orçamentos profissionais e transparentes. Passe credibilidade organizando custos para o cliente final.",
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.1)"
  },
  {
    icon: <Home size={32} strokeWidth={1.5} />,
    title: "Proprietários",
    description: "Vai construir ou reformar? Saiba para onde está indo seu dinheiro. Proteja-se de desperdícios e compras erradas.",
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)"
  }
];

export function ProfilesSection() {
  return (
    <section className="landing-section" style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="landing-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="landing-section-title">Feito para <span className="text-gradient">Quem Constrói</span></h2>
          <p className="landing-section-subtitle">Diferentes perfis, uma mesma necessidade: ter previsibilidade e controle absoluto sobre a obra.</p>
        </motion.div>

        <div className="grid-cols-3">
          {profiles.map((profile, index) => (
            <motion.div 
              key={index} 
              className="landing-card"
              style={{ textAlign: 'center', alignItems: 'center' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 40, 
                background: profile.bg, 
                color: profile.color,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 24
              }}>
                {profile.icon}
              </div>
              <h3 className="card-title">{profile.title}</h3>
              <p className="card-description">{profile.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
