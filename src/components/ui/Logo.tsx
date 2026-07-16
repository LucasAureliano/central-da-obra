interface LogoProps {
  variant?: 'horizontal' | 'splash' | 'icon' | 'reduced';
  theme?: 'light' | 'dark';
  size?: number;
}

export function Logo({ variant = 'horizontal', theme = 'dark', size }: LogoProps) {
  const iconSize = size ?? (variant === 'splash' ? 96 : variant === 'icon' ? 40 : 32);
  const fontSize = size ? size * 0.55 : (variant === 'splash' ? 52 : 18);

  const img = (
    <div style={{
      width: iconSize,
      height: iconSize,
      borderRadius: iconSize * 0.22,
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
      flexShrink: 0,
    }}>
      <img
        src={`/assets/${theme === 'dark' ? 'logo_3d.jpg' : 'logo_light_3d.jpg'}`}
        alt="CentralObra"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );

  const text = (
    <span style={{
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize,
      fontWeight: 800,
      letterSpacing: '-0.03em',
      color: 'var(--text-main)',
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
    }}>
      CentralObra<span style={{ color: 'var(--color-primary)' }}>.</span>
    </span>
  );

  if (variant === 'icon') return img;
  if (variant === 'reduced') return text;

  if (variant === 'splash') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {img}
        {text}
      </div>
    );
  }

  // horizontal (default)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {img}
      {text}
    </div>
  );
}
