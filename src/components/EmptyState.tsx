

interface EmptyStateProps {
  imageSrc: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ imageSrc, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ width: 240, height: 240, marginBottom: 32, borderRadius: 32, overflow: 'hidden', boxShadow: 'var(--shadow-elevated)', position: 'relative' }}>
        <img src={imageSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)', borderRadius: 32, pointerEvents: 'none' }} />
      </div>
      
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
        {title}
      </h2>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 300, lineHeight: 1.5, marginBottom: 32 }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button className="btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
