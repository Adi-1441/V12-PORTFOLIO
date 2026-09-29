import { useEffect, useState, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════
   CUSTOM CURSOR — Advanced Engineering Inspection HUD
   Precision CAD reticle, dynamic state recognition,
   mechanical click pulse, coordinate telemetry HUD.
   Disabled on touch / coarse pointer devices.
   ═══════════════════════════════════════════════════════ */

type CursorState = 'default' | 'hover' | 'inspect' | 'project' | 'image' | 'activate';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [state, setState] = useState<CursorState>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const coordRef = useRef({ x: 0, y: 0 });

  const getCursorState = useCallback((target: HTMLElement | null): CursorState => {
    if (!target) return 'default';
    if (target.closest('[data-cursor="activate"]')) return 'activate';
    if (target.closest('[data-cursor="project"]')) return 'project';
    if (target.closest('img') || target.closest('[data-cursor="image"]')) return 'image';
    if (target.closest('canvas') || target.closest('[data-cursor="inspect"]')) return 'inspect';
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('[role="button"]') ||
      target.closest('[data-interactive]')
    ) {
      return 'hover';
    }
    return 'default';
  }, []);

  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    // Check for precise pointer (mouse) vs touch screen
    const mql = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mql.matches);
    if (!mql.matches) return;

    document.body.classList.add('custom-cursor-active');

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let frameId: number;

    const handlePointerMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });

      coordRef.current = {
        x: Math.round((e.clientX / window.innerWidth) * 999),
        y: Math.round((e.clientY / window.innerHeight) * 999),
      };

      if (!isVisible) setIsVisible(true);
      const newState = getCursorState(e.target as HTMLElement | null);
      setState(newState);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    // Smooth inertia interpolation loop
    const loop = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      setRingPos({ x: currentX, y: currentY });
      frameId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    frameId = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(frameId);
    };
  }, [isVisible, getCursorState, isAdminRoute]);

  if (isAdminRoute || !isFinePointer || !isVisible) return null;

  // Determine sizing according to state
  const ringSize =
    state === 'activate'
      ? 54
      : state === 'project'
      ? 48
      : state === 'image'
      ? 42
      : state === 'hover'
      ? 38
      : state === 'inspect'
      ? 34
      : 24;

  const halfRing = ringSize / 2;

  // Mode label text
  const modeLabel =
    state === 'activate'
      ? 'ACTIVATE'
      : state === 'inspect'
      ? 'INSPECT'
      : state === 'project'
      ? 'TARGET'
      : state === 'image'
      ? 'SCAN'
      : state === 'hover'
      ? 'SELECT'
      : 'TRACK';

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* ─── Center Precision Dot ─── */}
      <div
        className="fixed top-0 left-0 rounded-full transition-all duration-75"
        style={{
          width: state === 'activate' ? 6 : isClicking ? 2 : 3.5,
          height: state === 'activate' ? 6 : isClicking ? 2 : 3.5,
          background:
            state === 'activate'
              ? '#00D4FF'
              : state === 'inspect'
              ? '#38BDF8'
              : '#F8FAFC',
          transform: `translate3d(${pos.x - (state === 'activate' ? 3 : 1.75)}px, ${
            pos.y - (state === 'activate' ? 3 : 1.75)
          }px, 0)`,
          boxShadow:
            state === 'activate'
              ? '0 0 16px #00D4FF'
              : isClicking
              ? '0 0 12px #38BDF8'
              : 'none',
        }}
      />

      {/* ─── Mechanical Click Ripple Pulse ─── */}
      {isClicking && (
        <div
          className="fixed top-0 left-0 rounded-full border border-cyan/60 animate-ping"
          style={{
            width: 32,
            height: 32,
            transform: `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0)`,
          }}
        />
      )}

      {/* ─── Outer Tracking Reticle ─── */}
      <div
        className="fixed top-0 left-0 transition-all duration-[220ms] ease-out"
        style={{
          width: ringSize,
          height: ringSize,
          transform: `translate3d(${ringPos.x - halfRing}px, ${ringPos.y - halfRing}px, 0) scale(${
            isClicking ? 0.85 : 1
          })`,
        }}
      >
        {state === 'activate' ? (
          /* Activation: Rotating dual octagonal reticle */
          <svg viewBox="0 0 54 54" className="w-full h-full animate-[spin_5s_linear_infinite]">
            <polygon
              points="27,2 46,10 52,27 46,44 27,52 8,44 2,27 8,10"
              fill="none"
              stroke="#00D4FF"
              strokeWidth="1.2"
              strokeDasharray="6 4"
            />
            <circle cx="27" cy="27" r="14" fill="none" stroke="#00D4FF" strokeWidth="0.8" opacity="0.6" />
          </svg>
        ) : state === 'project' ? (
          /* Project focus: CAD square bracket frame */
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <line x1="2" y1="2" x2="12" y2="2" stroke="#00D4FF" strokeWidth="1.2" />
            <line x1="2" y1="2" x2="2" y2="12" stroke="#00D4FF" strokeWidth="1.2" />
            <line x1="46" y1="2" x2="36" y2="2" stroke="#00D4FF" strokeWidth="1.2" />
            <line x1="46" y1="2" x2="46" y2="12" stroke="#00D4FF" strokeWidth="1.2" />
            <line x1="2" y1="46" x2="12" y2="46" stroke="#00D4FF" strokeWidth="1.2" />
            <line x1="2" y1="46" x2="2" y2="36" stroke="#00D4FF" strokeWidth="1.2" />
            <line x1="46" y1="46" x2="36" y2="46" stroke="#00D4FF" strokeWidth="1.2" />
            <line x1="46" y1="46" x2="46" y2="36" stroke="#00D4FF" strokeWidth="1.2" />
          </svg>
        ) : state === 'image' ? (
          /* Image scan: horizontal scanline with reticle */
          <svg viewBox="0 0 42 42" className="w-full h-full">
            <circle cx="21" cy="21" r="18" fill="none" stroke="#38BDF8" strokeWidth="0.9" opacity="0.6" />
            <line x1="5" y1="21" x2="37" y2="21" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
          </svg>
        ) : state === 'inspect' ? (
          /* 3D Inspection: Precision crosshairs with angular ticks */
          <svg viewBox="0 0 34 34" className="w-full h-full">
            <line x1="0" y1="17" x2="7" y2="17" stroke="#00D4FF" strokeWidth="1" />
            <line x1="27" y1="17" x2="34" y2="17" stroke="#00D4FF" strokeWidth="1" />
            <line x1="17" y1="0" x2="17" y2="7" stroke="#00D4FF" strokeWidth="1" />
            <line x1="17" y1="27" x2="17" y2="34" stroke="#00D4FF" strokeWidth="1" />
            <circle cx="17" cy="17" r="11" fill="none" stroke="#00D4FF" strokeWidth="0.8" opacity="0.4" />
          </svg>
        ) : state === 'hover' ? (
          /* Button Hover: Expanded smooth ring */
          <svg viewBox="0 0 38 38" className="w-full h-full">
            <circle cx="19" cy="19" r="16" fill="none" stroke="#00D4FF" strokeWidth="1.2" opacity="0.75" />
          </svg>
        ) : (
          /* Default: Restrained precision circle */
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="9" fill="none" stroke="#94A3B8" strokeWidth="0.8" opacity="0.4" />
          </svg>
        )}
      </div>

      {/* ─── Telemetry HUD (Restrained & Informative) ─── */}
      <div
        className="fixed top-0 left-0 font-mono text-[8px] tracking-wider select-none pointer-events-none transition-opacity duration-200"
        style={{
          color: state === 'activate' ? '#00D4FF' : '#94A3B8',
          opacity: state === 'default' || state === 'inspect' ? 0.45 : 0.7,
          transform: `translate3d(${pos.x + 18}px, ${pos.y + 12}px, 0)`,
        }}
      >
        <div className="flex items-center gap-1.5 leading-none mb-0.5">
          <span>X:{String(coordRef.current.x).padStart(3, '0')}</span>
          <span>Y:{String(coordRef.current.y).padStart(3, '0')}</span>
        </div>
        <div className="text-[7px] text-cyan/70 tracking-widest uppercase">
          MODE:{modeLabel}
        </div>
      </div>
    </div>
  );
}
