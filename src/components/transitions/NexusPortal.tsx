import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NexusPortalProps {
  active: boolean;
  originX: number;
  originY: number;
  direction?: 'forward' | 'reverse';
  onComplete?: () => void;
}

export function NexusPortal({
  active,
  originX,
  originY,
  direction = 'forward',
  onComplete,
}: NexusPortalProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
  }, []);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, reducedMotion ? 200 : 950);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete, reducedMotion]);

  if (!active) return null;

  // Reduced motion: simple subtle crossfade
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-[100] bg-surface/90 transition-opacity duration-200 pointer-events-none" />
    );
  }

  const promptText =
    direction === 'forward'
      ? 'INITIALIZING MECHNEXUS WORKSPACE…'
      : 'RETURNING TO INTRODUCTION…';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #00D4FF 0%, #38BDF8 50%, #0284C7 100%)',
        }}
        initial={{
          clipPath: `circle(0px at ${originX}px ${originY}px)`,
          opacity: 1,
        }}
        animate={{
          clipPath: `circle(170% at ${originX}px ${originY}px)`,
          transition: {
            duration: 0.72,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.25 },
        }}
      >
        {/* Central Monospace Beat Flash */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.96, 1, 1, 1.02],
          }}
          transition={{
            duration: 0.45,
            times: [0, 0.3, 0.7, 1],
            delay: 0.32,
          }}
        >
          <div className="px-6 py-3 rounded bg-void/85 border border-hairline backdrop-blur-md shadow-2xl">
            <span className="font-mono text-base md:text-lg font-medium text-text-primary tracking-wide">
              {promptText}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
