import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: "O aplicativo funciona sem internet (offline)?",
    answer: "Sim! A CentralObra foi desenvolvida com suporte total offline (Progressive Web App). Você pode realizar cálculos, consultar normas e adicionar notas enquanto estiver no canteiro sem sinal. Assim que reconectar, seus dados serão sincronizados com a nuvem automaticamente."
  },
  {
    question: "Preciso pagar para usar as calculadoras de materiais?",
    answer: "As calculadoras básicas de materiais são gratuitas. Oferecemos um plano Premium que libera funcionalidades avançadas de gestão financeira, relatórios analíticos, exportação em PDF e acesso ilimitado à biblioteca técnica."
  },
  {
    question: "As normas (NBRs) estão atualizadas?",
    answer: "Trabalhamos constantemente para manter a nossa base de dados alinhada com as publicações mais recentes da ABNT. Além disso, as calculadoras incorporam regras de melhores práticas e taxas de perda/desperdício reais do mercado."
  },
  {
    question: "Posso compartilhar um orçamento com meu cliente?",
    answer: "Sim, no plano Premium você pode gerar relatórios e orçamentos em PDF com a sua logomarca, formatados de maneira profissional e prontos para envio direto via WhatsApp ou E-mail."
  },
  {
    question: "Meus dados financeiros estão seguros?",
    answer: "Nossa infraestrutura utiliza os mesmos protocolos de criptografia e segurança de grandes bancos (Firebase/Google Cloud), garantindo que apenas você e as pessoas que você autorizar tenham acesso aos números da sua obra."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <h2 className="landing-section-title">Perguntas <span className="text-gradient">Frequentes</span></h2>
          <p className="landing-section-subtitle">Tire suas principais dúvidas sobre o aplicativo.</p>
        </motion.div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              className="faq-item"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <button 
                className="faq-question"
                onClick={() => toggleOpen(index)}
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  style={{ 
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: openIndex === index ? 'var(--color-primary)' : 'var(--text-muted)'
                  }} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="faq-answer">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          style={{ textAlign: 'center', marginTop: 48 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Ainda tem dúvidas?</p>
          <a href="mailto:contato@centralobra.com.br" className="btn-landing-secondary">
            Fale com a nossa equipe <MessageCircle size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
