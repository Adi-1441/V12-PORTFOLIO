import { useEffect, useRef } from 'react';
import { useInView, useAnimation } from 'framer-motion';

type AnimationControls = ReturnType<typeof useAnimation>;

interface SectionRevealOptions {
  threshold?: number;
  once?: boolean;
  delay?: number;
}

/**
 * Hook for triggering section reveal animations when scrolling into view.
 */
export function useSectionReveal(options: SectionRevealOptions = {}): {
  ref: React.RefObject<HTMLElement | null>;
  controls: AnimationControls;
  isInView: boolean;
} {
  const { threshold = 0.2, once = true, delay = 0 } = options;
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: threshold, once });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        controls.start('visible');
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, controls, delay]);

  return { ref, controls, isInView };
}

/**
 * Common animation variants for section reveals.
 */
export const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
