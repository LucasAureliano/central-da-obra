const fs = require('fs');
let code = fs.readFileSync('src/components/onboarding/OnboardingEngine.tsx', 'utf8');

const particlesCode = `
const ParticlesBackground = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [null, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-primary-alpha) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  );
};
`;

code = code.replace("export const OnboardingEngine: React.FC<OnboardingEngineProps> = ({ role, onComplete }) => {", particlesCode + "\nexport const OnboardingEngine: React.FC<OnboardingEngineProps> = ({ role, onComplete }) => {");

// Add ParticlesBackground to the render
code = code.replace("<AnimatePresence mode=\"wait\">", "<ParticlesBackground />\n      <AnimatePresence mode=\"wait\">");

// Enhance main div animation
code = code.replace("initial={{ opacity: 0 }}\n            animate={{ opacity: 1 }}\n            exit={{ opacity: 0 }}", "initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}\n            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}\n            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}\n            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}");

// Ensure action Completed button shines more
code = code.replace("className=\"btn-primary\"", "className=\"btn-primary glow-effect\"");

fs.writeFileSync('src/components/onboarding/OnboardingEngine.tsx', code, 'utf8');
console.log('updated');
