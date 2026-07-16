export function ConstructionShaderBg({ theme }: { theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const blueprintBg = isDark ? '#1C2127' : '#E8EEF2';
  
  return (
    <div className="shader-bg-wrapper" style={{
      backgroundImage: `url('/assets/images/concrete-texture.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: isDark ? 'overlay' : 'multiply',
      backgroundColor: blueprintBg,
      opacity: 0.95
    }}>
      {/* 1. Static Blueprint Grid */}
      <div 
        className="shader-grid" 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px), 
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 2. Techy Abstract Architecture Lines */}
      <svg className="shader-lines" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: isDark ? 0.3 : 0.2 }}>
        <line x1="0" y1="100%" x2="100%" y2="0" stroke={gridColor} strokeWidth="1" strokeDasharray="4 4" />
        <line x1="20%" y1="100%" x2="100%" y2="20%" stroke={gridColor} strokeWidth="1" strokeDasharray="4 4" />
        {/* Technical crosshairs */}
        <g transform="translate(80vw, 20vh)">
          <circle cx="0" cy="0" r="20" fill="none" stroke={gridColor} strokeWidth="1" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke={gridColor} strokeWidth="1" />
          <line x1="0" y1="-30" x2="0" y2="30" stroke={gridColor} strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
