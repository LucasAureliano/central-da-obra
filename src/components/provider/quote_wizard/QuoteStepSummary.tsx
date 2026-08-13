import { motion } from 'framer-motion';
import { Download, Phone, CheckCircle } from 'lucide-react';

interface QuoteStepSummaryProps {
  client: any;
  workData: any;
  services: any[];
  materials: any[];
  conditions: any;
  grandTotal: number;
  totalServices: number;
  totalMaterials: number;
  totalLabor: number;
  totalCosts: number;
  discountAmount: number;
  isGenerating: boolean;
  generatePDF: () => void;
  handleApprove: () => void;
}

export function QuoteStepSummary({
  client,
  workData,
  services,
  materials,
  conditions,
  grandTotal,
  totalServices,
  totalMaterials,
  totalLabor,
  totalCosts,
  discountAmount,
  isGenerating,
  generatePDF,
  handleApprove
}: QuoteStepSummaryProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="glass-panel" style={{ padding: 32, borderRadius: 32, backgroundImage: 'linear-gradient(135deg, var(--bg-elevated) 0%, rgba(30, 58, 138, 0.05) 100%)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Geral do Orçamento</span>
          <h2 style={{ fontSize: 48, fontWeight: 900, color: 'var(--color-primary)', margin: '8px 0' }}>R$ {grandTotal.toFixed(2)}</h2>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Para o cliente: <strong>{client.name || 'Não informado'}</strong></span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Serviços ({services.length})</span>
            <span style={{ fontWeight: 600 }}>R$ {totalServices.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Materiais ({materials.length})</span>
            <span style={{ fontWeight: 600 }}>R$ {totalMaterials.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Mão de Obra</span>
            <span style={{ fontWeight: 600 }}>R$ {totalLabor.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Custos Adicionais</span>
            <span style={{ fontWeight: 600 }}>R$ {totalCosts.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12 }}>
            <span style={{ color: 'var(--color-danger)' }}>Descontos Aplicados</span>
            <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>- R$ {discountAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn-primary" 
          style={{ borderRadius: 20, padding: 20, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
          onClick={generatePDF}
          disabled={isGenerating}
        >
          {isGenerating ? 'Processando...' : <><Download size={20} /> Gerar PDF Formal</>}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn-primary" 
          style={{ borderRadius: 20, padding: 20, fontSize: 16, fontWeight: 700, backgroundColor: '#25D366', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, border: 'none' }}
          onClick={() => {
            const msg = `*Orçamento: ${client.name}*\n\nServiços: R$ ${totalServices.toFixed(2)}\nMateriais: R$ ${totalMaterials.toFixed(2)}\nMão de Obra: R$ ${totalLabor.toFixed(2)}\n\n*Total: R$ ${grandTotal.toFixed(2)}*\n\nPrazo: ${conditions.prazo}\nPagamento: ${conditions.pagamento}\nValidade: ${conditions.validade}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
          }}
        >
          <Phone size={20} /> Enviar WhatsApp
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn-primary" 
          style={{ borderRadius: 20, padding: 20, fontSize: 16, fontWeight: 700, backgroundColor: '#10B981', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, border: 'none' }}
          onClick={handleApprove}
        >
          <CheckCircle size={20} /> Aprovar e Salvar
        </motion.button>
      </div>
    </div>
  );
}
