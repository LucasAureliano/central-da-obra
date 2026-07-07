import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  direction?: 'up' | 'down';
  format?: 'currency' | 'number' | 'percentage';
  duration?: number;
}

export function AnimatedCounter({ 
  value, 
  direction = 'up', 
  format = 'number',
  duration = 2
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: duration * 1000
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(direction === 'down' ? 0 : value);
    }
  }, [motionValue, inView, value, direction]);

  const displayValue = useTransform(springValue, (current) => {
    if (format === 'currency') {
      return `R$ ${current.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (format === 'percentage') {
      return `${current.toFixed(1)}%`;
    }
    return Math.floor(current).toLocaleString('pt-BR');
  });

  return (
    <motion.span ref={ref}>
      {displayValue}
    </motion.span>
  );
}
