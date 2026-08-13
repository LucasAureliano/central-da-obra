interface QuoteStepConditionsProps {
  conditions: { prazo: string; garantia: string; pagamento: string; validade: string };
  setConditions: (conditions: any) => void;
}

export function QuoteStepConditions({ conditions, setConditions }: QuoteStepConditionsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Prazo de Execução</label>
        <input type="text" className="input-field" placeholder="Ex: 15 dias úteis após início" value={conditions.prazo} onChange={e => setConditions({...conditions, prazo: e.target.value})} style={{ fontSize: 16, fontWeight: 600 }} />
      </div>
      <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Garantia do Serviço</label>
        <input type="text" className="input-field" placeholder="Ex: 6 meses contra defeitos" value={conditions.garantia} onChange={e => setConditions({...conditions, garantia: e.target.value})} style={{ fontSize: 16, fontWeight: 600 }} />
      </div>
      <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Forma de Pagamento</label>
        <input type="text" className="input-field" placeholder="Ex: 50% Entrada, 50% Término" value={conditions.pagamento} onChange={e => setConditions({...conditions, pagamento: e.target.value})} style={{ fontSize: 16, fontWeight: 600 }} />
      </div>
      <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Validade da Proposta</label>
        <input type="text" className="input-field" placeholder="Ex: 15 dias" value={conditions.validade} onChange={e => setConditions({...conditions, validade: e.target.value})} style={{ fontSize: 16, fontWeight: 600 }} />
      </div>
    </div>
  );
}
