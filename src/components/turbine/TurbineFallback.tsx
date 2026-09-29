/* ═══════════════════════════════════════════════════════
   TURBINE FALLBACK — Architectural CAD Blueprint SVG
   Rendered when WebGL is not supported or prefers-reduced-motion
   is toggled. Realistic multi-stage cross-section schematic.
   ═══════════════════════════════════════════════════════ */

export function TurbineFallback() {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-30 pointer-events-none select-none">
      <svg
        viewBox="0 0 900 900"
        className="w-[110%] h-[110%] max-w-none text-text-tertiary"
        style={{ filter: 'drop-shadow(0 0 1px rgba(0,212,255,0.15))' }}
      >
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="450" cy="450" r="180" fill="url(#hubGlow)" />

        {/* Outer Casing Diameters */}
        <circle
          cx="450"
          cy="450"
          r="410"
          fill="none"
          stroke="#00D4FF"
          strokeWidth="0.8"
          strokeDasharray="6 8"
          opacity="0.35"
        />
        <circle
          cx="450"
          cy="450"
          r="370"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.45"
        />
        <circle
          cx="450"
          cy="450"
          r="310"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="3 6"
          opacity="0.35"
        />
        <circle
          cx="450"
          cy="450"
          r="250"
          fill="none"
          stroke="#00D4FF"
          strokeWidth="0.9"
          opacity="0.3"
        />
        <circle
          cx="450"
          cy="450"
          r="190"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
        <circle
          cx="450"
          cy="450"
          r="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="4 4"
          opacity="0.3"
        />

        {/* Stage 1 Compressor Fan Blades (Swept Aerodynamic Airfoils) */}
        {Array.from({ length: 22 }, (_, i) => {
          const ang = (i / 22) * Math.PI * 2;
          const r1 = 80;
          const r2 = 365;
          const midR = 220;
          const sweep = 0.14;
          const x1 = 450 + Math.cos(ang) * r1;
          const y1 = 450 + Math.sin(ang) * r1;
          const xm = 450 + Math.cos(ang + sweep * 0.5) * midR;
          const ym = 450 + Math.sin(ang + sweep * 0.5) * midR;
          const x2 = 450 + Math.cos(ang + sweep) * r2;
          const y2 = 450 + Math.sin(ang + sweep) * r2;
          return (
            <path
              key={`blade-s1-${i}`}
              d={`M ${x1} ${y1} Q ${xm} ${ym} ${x2} ${y2}`}
              fill="none"
              stroke="#00D4FF"
              strokeWidth="1.4"
              opacity="0.55"
            />
          );
        })}

        {/* Stage 2 Compressor Blades */}
        {Array.from({ length: 28 }, (_, i) => {
          const ang = (i / 28) * Math.PI * 2;
          const r1 = 195;
          const r2 = 305;
          const sweep = -0.09;
          const x1 = 450 + Math.cos(ang) * r1;
          const y1 = 450 + Math.sin(ang) * r1;
          const x2 = 450 + Math.cos(ang + sweep) * r2;
          const y2 = 450 + Math.sin(ang + sweep) * r2;
          return (
            <line
              key={`blade-s2-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1.1"
              opacity="0.4"
            />
          );
        })}

        {/* Center Spinner Nose Cone Hub */}
        <circle
          cx="450"
          cy="450"
          r="48"
          fill="none"
          stroke="#00D4FF"
          strokeWidth="1.6"
          opacity="0.7"
        />
        <circle
          cx="450"
          cy="450"
          r="16"
          fill="#00D4FF"
          opacity="0.4"
        />

        {/* Engineering Measurement Datum Axes & Tolerances */}
        <line
          x1="450"
          y1="20"
          x2="450"
          y2="880"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 10"
          opacity="0.25"
        />
        <line
          x1="20"
          y1="450"
          x2="880"
          y2="450"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 10"
          opacity="0.25"
        />

        {/* Dimension Callout HUD Text */}
        <text
          x="450"
          y="35"
          textAnchor="middle"
          fill="#00D4FF"
          fontSize="9"
          fontFamily="monospace"
          letterSpacing="0.2em"
          opacity="0.6"
        >
          Ø 820.00 mm [ROTOR STAGE 01]
        </text>
        <text
          x="870"
          y="444"
          textAnchor="end"
          fill="currentColor"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="0.15em"
          opacity="0.4"
        >
          DATUM AXIS-Z // TI-6AL-4V
        </text>
        <text
          x="30"
          y="464"
          textAnchor="start"
          fill="currentColor"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="0.15em"
          opacity="0.4"
        >
          ISO 2768-mH // DUAL-SPOOL
        </text>
      </svg>
    </div>
  );
}
