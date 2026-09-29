import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { DigitalTwinAssembly } from './DigitalTwinAssembly';
import { DigitalTwinHUD } from './DigitalTwinHUD';

export function DigitalTwinCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

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

  if (!hasWebGL || reducedMotion) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[460px] p-6 bg-surface/50 rounded-2xl border border-hairline blueprint-grid">
        <svg
          viewBox="0 0 400 400"
          className="w-72 h-72 text-cyan stroke-current fill-none"
          strokeWidth="1.5"
        >
          <circle cx="200" cy="200" r="170" strokeDasharray="4 4" opacity="0.3" />
          <circle cx="200" cy="200" r="140" opacity="0.8" />
          <circle cx="200" cy="200" r="100" strokeDasharray="6 3" opacity="0.5" />
          <polygon
            points="200,150 245,175 245,225 200,250 155,225 155,175"
            fill="rgba(0,212,255,0.08)"
            stroke="#00D4FF"
          />
          <circle cx="200" cy="200" r="18" fill="#00D4FF" />
          <line x1="20" y1="200" x2="380" y2="200" strokeDasharray="2 4" opacity="0.3" />
          <line x1="200" y1="20" x2="200" y2="380" strokeDasharray="2 4" opacity="0.3" />
        </svg>
        <div className="mt-4 font-mono text-xs text-text-tertiary">
          MECHNEXUS DIGITAL TWIN // 2D STATIC SCHEMATIC (REDUCED MOTION / 2D MODE)
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex flex-col items-center justify-center w-full h-[440px] sm:h-[500px] lg:h-[580px] rounded-2xl bg-surface/40 border border-hairline p-2 sm:p-4 overflow-hidden backdrop-blur-sm shadow-2xl"
    >
      {/* HUD Corner Reticles */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-mono text-text-tertiary border-b border-hairline">
        <span className="text-cyan font-semibold">MECHNEXUS // TWIN CORE 01</span>
        <span>SPEC: Ø 380mm · Ti-6Al-4V</span>
        <span>DATUM: X:0 Y:0 Z:0</span>
      </div>

      {/* Three.js Canvas */}
      <div className="relative w-full flex-1">
        <Canvas
          camera={{ position: [0, 0, 5.4], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          className="cursor-grab active:cursor-grabbing"
        >
          <Suspense fallback={null}>
            <DigitalTwinAssembly pointerPos={pointerPos} />
          </Suspense>
        </Canvas>
      </div>

      {/* Interactive HUD Strip */}
      <DigitalTwinHUD />
    </div>
  );
}
