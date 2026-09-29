import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { GenesisCore } from './GenesisCore';
import { CoreControls } from './CoreControls';
import { useCoreState } from './useCoreState';

export function GenesisCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { isBooting, bootProgress, setBootProgress, skipBoot } = useCoreState();

  // Check WebGL availability and reduced motion preference
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Boot sequence timer on first mount (~2.3s total)
  useEffect(() => {
    const hasBooted = sessionStorage.getItem('mechnexus_booted');
    if (hasBooted || reducedMotion) {
      setBootProgress(1);
      return;
    }

    sessionStorage.setItem('mechnexus_booted', 'true');
    useCoreState.setState({ isBooting: true, bootProgress: 0.1 });

    const startTime = performance.now();
    const duration = 2300; // 2.3 seconds

    const animateBoot = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setBootProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animateBoot);
      } else {
        useCoreState.setState({ isBooting: false, bootProgress: 1 });
      }
    };

    const frameId = requestAnimationFrame(animateBoot);

    // Skip boot on any wheel or touch scroll
    const handleUserInteraction = () => {
      skipBoot();
    };

    window.addEventListener('wheel', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [reducedMotion, setBootProgress, skipBoot]);

  // Pointer tracking relative to container bounds (desktop only)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setPointerPos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  const handlePointerLeave = () => {
    setPointerPos({ x: 0, y: 0 });
  };

  // Fallback for reduced motion or WebGL unsupported
  if (!hasWebGL || reducedMotion) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[420px] md:h-[500px] p-6">
        <svg
          viewBox="0 0 400 400"
          className="w-72 h-72 text-copper-300 stroke-current fill-none"
          strokeWidth="1.5"
        >
          {/* Static SVG Blueprint Schematic */}
          <circle cx="200" cy="200" r="160" strokeDasharray="4 4" opacity="0.3" />
          <circle cx="200" cy="200" r="130" opacity="0.8" />
          <ellipse cx="200" cy="200" rx="130" ry="40" opacity="0.6" />
          <ellipse cx="200" cy="200" rx="40" ry="130" opacity="0.6" />
          <polygon points="200,160 235,180 235,220 200,240 165,220 165,180" fill="rgba(212,132,74,0.15)" stroke="#D4844A" />
          <circle cx="200" cy="200" r="14" fill="#D4844A" />
        </svg>
        <div className="mt-4 font-mono text-xs text-text-tertiary">
          GENESIS CORE · STATIC SCHEMATIC (REDUCED MOTION)
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex flex-col items-center justify-center w-full h-[420px] sm:h-[480px] lg:h-[560px]"
    >
      {/* Three.js WebGL Canvas */}
      <div className="relative w-full flex-1">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          className="cursor-grab active:cursor-grabbing"
        >
          <Suspense fallback={null}>
            <GenesisCore pointerPos={pointerPos} />
          </Suspense>
        </Canvas>

        {/* Boot Sequence White Flash Beat */}
        {isBooting && bootProgress > 0.45 && bootProgress < 0.55 && (
          <div className="absolute inset-0 bg-white/20 pointer-events-none transition-opacity duration-150" />
        )}
      </div>

      {/* Control Strip & Engineering Tolerances */}
      <div className="relative z-10 w-full px-4">
        <CoreControls />
      </div>
    </div>
  );
}
