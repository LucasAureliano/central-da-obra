

type InputMethod = 'dimensions' | 'direct';

interface Props {
  value: InputMethod;
  onChange: (val: InputMethod) => void;
  title?: string;
  dimLabel?: string;
  dirLabel?: string;
}

export function InputMethodSelector({ 
  value, 
  onChange, 
  title = "Como deseja informar as medidas?", 
  dimLabel = "Informar as dimensões (recomendado)", 
  dirLabel = "Já possuo a área (m²)" 
}: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button 
          onClick={() => onChange('dimensions')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            padding: '12px 16px', 
            borderRadius: 16, 
            border: value === 'dimensions' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)', 
            background: value === 'dimensions' ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)', 
            color: value === 'dimensions' ? 'var(--color-primary)' : 'var(--text-main)', 
            fontWeight: value === 'dimensions' ? 700 : 500,
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: 9, border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {value === 'dimensions' && <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'currentColor' }} />}
          </div>
          {dimLabel}
        </button>

        <button 
          onClick={() => onChange('direct')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            padding: '12px 16px', 
            borderRadius: 16, 
            border: value === 'direct' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)', 
            background: value === 'direct' ? 'var(--color-primary-alpha)' : 'var(--bg-input-glass)', 
            color: value === 'direct' ? 'var(--color-primary)' : 'var(--text-main)', 
            fontWeight: value === 'direct' ? 700 : 500,
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: 9, border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {value === 'direct' && <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'currentColor' }} />}
          </div>
          {dirLabel}
        </button>
      </div>
    </div>
  );
}
