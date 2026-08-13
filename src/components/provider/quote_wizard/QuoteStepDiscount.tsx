import { motion } from 'framer-motion';

function CopilotTip({ tip }: { tip: string | null }) {
  if (!tip) return null;
  return (
    <div style={{ padding: 16, backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#EAB308', borderRadius: 12, fontSize: 14, fontWeight: 500 }}>
      💡 {tip}
    </div>
  );
}

interface QuoteStepDiscountProps {
  discount: { type?: string; value: number; isPercentage: boolean };
  setDiscount: (discount: any) => void;
  discountAmount: number;
  grandTotal: number;
}

export function QuoteStepDiscount({ discount, setDiscount, discountAmount, grandTotal }: QuoteStepDiscountProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
        <motion.div 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setDiscount({ ...discount, isPercentage: false })}
          style={{ 
            padding: 24, borderRadius: 24, cursor: 'pointer', textAlign: 'center',
            border: `2px solid ${!discount.isPercentage ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
            backgroundColor: !discount.isPercentage ? 'rgba(30, 58, 138, 0.05)' : 'var(--bg-elevated)'
          }}
        >
          <h4 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>Valor Fixo (R$)</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Desconto direto em Reais</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setDiscount({ ...discount, isPercentage: true })}
          style={{ 
            padding: 24, borderRadius: 24, cursor: 'pointer', textAlign: 'center',
            border: `2px solid ${discount.isPercentage ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
            backgroundColor: discount.isPercentage ? 'rgba(30, 58, 138, 0.05)' : 'var(--bg-elevated)'
          }}
        >
          <h4 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>Percentual (%)</h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Desconto percentual</p>
        </motion.div>
      </div>

      <div className="glass-panel" style={{ padding: 32, borderRadius: 24, textAlign: 'center' }}>
        <input 
          type="number" 
          className="input-field" 
          style={{ fontSize: 48, fontWeight: 800, textAlign: 'center', padding: '16px 0', borderBottom: '2px solid var(--color-primary)', borderRadius: 0, backgroundColor: 'transparent' }}
          value={discount.value} 
          onChange={e => setDiscount({...discount, value: Number(e.target.value)})} 
        />
        <span style={{ display: 'block', marginTop: 16, fontSize: 16, color: 'var(--text-muted)' }}>
          Total de abatimento: <strong style={{ color: 'var(--color-danger)' }}>- R$ {discountAmount.toFixed(2)}</strong>
        </span>
      </div>
      
      <CopilotTip tip={discountAmount > grandTotal * 0.1 ? 'Atenção: Seu desconto está superando 10% do valor total. Certifique-se de que sua margem de lucro não está sendo comprometida.' : null} />
    </div>
  );
}
