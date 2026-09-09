import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LayoutTextFlip({ text, words }: { text: string, words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center', width: '100%' }}>
      <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.3em' }}>
        <span>{text}</span>
        <span style={{ position: 'relative', display: 'inline-block', color: 'var(--color-primary)', textAlign: 'left' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' }}
            >
              {words[index]}
            </motion.div>
          </AnimatePresence>
          {/* Invisible text to reserve space based on the longest word */}
          <span style={{ opacity: 0, pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none' }}>
            {words.reduce((a, b) => a.length > b.length ? a : b)}
          </span>
        </span>
      </h2>
    </div>
  );
}
