import { motion } from 'framer-motion';
import { FileText, LayoutGrid, Settings, Package } from 'lucide-react';

interface QuoteStepWelcomeProps {
  setStep: (step: number) => void;
}

export function QuoteStepWelcome({ setStep }: QuoteStepWelcomeProps) {
  const options = [
    { title: 'Novo Orçamento', desc: 'Comece um orçamento totalmente em branco, preenchendo serviços, materiais e mão de obra do zero.', icon: <FileText size={32} color="#FFF" />, bg: 'var(--color-primary)', action: () => setStep(1) },
    { title: 'Usar Modelo Existente', desc: 'Utilize estruturas pré-configuradas (ex: Pintura, Elétrica) para ganhar tempo no preenchimento.', icon: <LayoutGrid size={32} color="#FFF" />, bg: '#10B981', action: () => setStep(3) },
    { title: 'Duplicar Anterior', desc: 'Copie todos os dados de um orçamento que você já enviou para outro cliente.', icon: <Settings size={32} color="#FFF" />, bg: '#8B5CF6', action: () => alert('Em breve!') },
    { title: 'A partir de Lista', desc: 'Gere um orçamento importando itens diretamente de uma Lista de Compras salva.', icon: <Package size={32} color="#FFF" />, bg: '#F59E0B', action: () => alert('Em breve!') }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
      {options.map((item, i) => (
        <motion.div 
          key={i}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={item.action}
          className="glass-panel"
          style={{ padding: 32, borderRadius: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 20, border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
            {item.icon}
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-main)' }}>{item.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
