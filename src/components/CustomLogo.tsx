

export function CustomLogo({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* 3D App Icon Thumbnail */}
      <div style={{ 
        width: 32, 
        height: 32, 
        borderRadius: 8, 
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img src={`/assets/${theme === 'dark' ? 'logo_3d.jpg' : 'logo_light_3d.jpg'}`} alt="Logo Central da Obra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      {/* Typography Logo */}
      <span style={{ 
        fontFamily: 'Plus Jakarta Sans, sans-serif', 
        fontSize: 18, 
        fontWeight: 800, 
        letterSpacing: '-0.03em',
        color: 'var(--text-main)',
        display: 'flex',
        alignItems: 'center'
      }}>
        Central da Obra<span style={{ color: 'var(--color-primary)' }}>.</span>
      </span>
    </div>
  );
}
