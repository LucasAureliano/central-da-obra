import { motion } from 'framer-motion';

export function ConstructionShaderBg({ theme }: { theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const primaryGlow = isDark ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.1)';
  const secondaryGlow = isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)';
  
  return (
    <div className="shader-bg-wrapper" style={{
      backgroundImage: `url('/assets/images/concrete-texture.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: isDark ? 'overlay' : 'multiply',
      backgroundColor: isDark ? '#111' : '#ddd',
      opacity: 0.95
    }}>
      {/* 1. Animated Blueprint Grid */}
      <div 
        className="shader-grid" 
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`
        }}
      />

      {/* 2. Topography / Contour lines effect using SVG */}
      <div className="shader-contours" style={{ opacity: isDark ? 0.4 : 0.2 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path d="M0 50 Q 25 20, 50 50 T 100 50" fill="none" stroke={gridColor} strokeWidth="0.5" />
          <path d="M0 60 Q 25 30, 50 60 T 100 60" fill="none" stroke={gridColor} strokeWidth="0.5" />
          <path d="M0 70 Q 25 40, 50 70 T 100 70" fill="none" stroke={gridColor} strokeWidth="0.5" />
          <path d="M0 80 Q 25 50, 50 80 T 100 80" fill="none" stroke={gridColor} strokeWidth="0.5" />
        </svg>
      </div>

      {/* 3. Techy Abstract Architecture Lines */}
      <svg className="shader-lines" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: isDark ? 0.3 : 0.1 }}>
        {/* Diagonal Draft Lines */}
        <line x1="0" y1="100%" x2="100%" y2="0" stroke={gridColor} strokeWidth="1" strokeDasharray="4 4" />
        <line x1="20%" y1="100%" x2="100%" y2="20%" stroke={gridColor} strokeWidth="1" strokeDasharray="4 4" />
        {/* Technical crosshairs */}
        <g transform="translate(80vw, 20vh)">
          <circle cx="0" cy="0" r="20" fill="none" stroke={gridColor} strokeWidth="1" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke={gridColor} strokeWidth="1" />
          <line x1="0" y1="-30" x2="0" y2="30" stroke={gridColor} strokeWidth="1" />
        </g>
        <g transform="translate(15vw, 70vh)">
          <circle cx="0" cy="0" r="40" fill="none" stroke={gridColor} strokeWidth="1" strokeDasharray="2 2" />
          <rect x="-5" y="-5" width="10" height="10" fill={gridColor} />
        </g>
      </svg>

      {/* 4. Glowing Orbs for modern feel */}
      <motion.div 
        className="shader-glow-1"
        animate={{
          x: ['-5vw', '5vw', '-5vw'],
          y: ['-5vh', '5vh', '-5vh'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(circle, ${primaryGlow} 0%, transparent 60%)`
        }}
      />
      <motion.div 
        className="shader-glow-2"
        animate={{
          x: ['5vw', '-5vw', '5vw'],
          y: ['5vh', '-5vh', '5vh'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(circle, ${secondaryGlow} 0%, transparent 60%)`
        }}
      />
    </div>
  );
}
