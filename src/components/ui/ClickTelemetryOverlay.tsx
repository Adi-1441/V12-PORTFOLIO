import { useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export default function ClickTelemetryOverlay() {
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleClick = (e: MouseEvent) => {
      // Ignore clicks on inputs or textareas to maintain native text selection experience
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 420);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || ripples.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full border border-[var(--color-cyan)] pointer-events-none shadow-[0_0_8px_var(--color-cyan)]"
          style={{
            left: r.x - 14,
            top: r.y - 14,
            width: 28,
            height: 28,
            animation: 'reticlePulse 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      ))}
    </div>
  );
}
