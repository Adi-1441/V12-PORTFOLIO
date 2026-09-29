import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TurbineScene, type TurbineState } from '@/components/turbine/TurbineScene';
import { TurbineFallback } from '@/components/turbine/TurbineFallback';
import { NexusPortal } from '@/components/transitions/NexusPortal';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { fetchProfile } from '@/lib/portfolioService';
import type { Profile } from '@/lib/types';
import { PORTFOLIO_IDENTITY } from '@/lib/constants';
import { Activity, Shield, Sparkles, Layers, Box, Eye, Flame, Compass, Maximize2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   GENESIS PAGE — Introduction & Living Digital Twin
   Fullscreen cinematic entry with turbine background,
   interactive digital twin states, authentic identity,
   and CLICK HERE TO EXPLORE engineering activation.
   ═══════════════════════════════════════════════════════ */

export default function GenesisPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portalActive, setPortalActive] = useState(false);
  const [portalCoords, setPortalCoords] = useState({ x: 0, y: 0 });
  const [turbineAccelerate, setTurbineAccelerate] = useState(false);
  const [turbineState, setTurbineState] = useState<TurbineState>('realistic');
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Fetch real profile data from Supabase
  useEffect(() => {
    let mounted = true;
    fetchProfile().then((res) => {
      if (mounted && res.data) setProfile(res.data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // WebGL & reduced-motion detection
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

  // Real-time telemetry clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeStr(
        `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} // ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} UTC`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Explore activation action
  const handleExplore = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPortalCoords({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setTurbineAccelerate(true);
    // Controlled acceleration duration before portal expansion
    setTimeout(() => setPortalActive(true), 450);
  }, []);

  const handlePortalComplete = useCallback(() => {
    navigate('/work');
  }, [navigate]);

  const name = profile?.name || PORTFOLIO_IDENTITY.name;
  const role = profile?.role || PORTFOLIO_IDENTITY.role;

  // Profile photo: ONLY display if genuinely configured & enabled in Supabase
  const hasRealPhoto = Boolean(profile?.profile_photo_enabled && profile?.profile_photo_url);

  const showWebGL = hasWebGL && !reducedMotion;

  // Digital Twin state buttons list
  const TWIN_STATES: { id: TurbineState; label: string; icon: typeof Layers }[] = [
    { id: 'realistic', label: 'REALISTIC', icon: Box },
    { id: 'wireframe', label: 'WIREFRAME', icon: Layers },
    { id: 'xray', label: 'X-RAY', icon: Eye },
    { id: 'flowfield', label: 'FLOW FIELD', icon: Flame },
    { id: 'exploded', label: 'EXPLODED', icon: Maximize2 },
    { id: 'inspection', label: 'INSPECT', icon: Compass },
  ];

  return (
    <div className="relative min-h-screen bg-void text-text-primary selection:bg-cyan selection:text-void overflow-hidden flex flex-col justify-between">
      {/* Precision CAD Inspection Cursor */}
      <CustomCursor />

      {/* Cinematic Transition Portal */}
      <NexusPortal
        active={portalActive}
        originX={portalCoords.x}
        originY={portalCoords.y}
        direction="forward"
        onComplete={handlePortalComplete}
      />

      {/* ─── FULLSCREEN 3D TURBINE BACKGROUND ─── */}
      <div className="absolute inset-0 z-0">
        {showWebGL ? (
          <TurbineScene
            accelerate={turbineAccelerate}
            visualState={turbineState}
          />
        ) : (
          <TurbineFallback />
        )}

        {/* Cinematic Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/75 via-void/35 to-void/90 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/65 via-transparent to-void/65 pointer-events-none z-[1]" />

        {/* Central Radial Focus */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 75% 65% at 50% 48%, transparent 0%, rgba(7,8,11,0.65) 100%)',
          }}
        />
      </div>

      {/* ─── FOREGROUND CONTENT LAYER ─── */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between pointer-events-none">

        {/* ─── TOP TELEMETRY BAR ─── */}
        <header className="w-full px-6 py-5 md:px-10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-status-online shadow-[0_0_8px_#10B981] animate-pulse" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-primary tracking-widest uppercase">
                DIGITAL TWIN ONLINE
              </span>
              <span className="font-mono text-[8px] text-text-tertiary tracking-wider hidden sm:inline">
                TI-6AL-4V // 5-STAGE TURBOMACHINERY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] text-text-tertiary hidden md:inline">
              {timeStr}
            </span>
            <button
              onClick={() => navigate('/admin/login')}
              className="px-3 py-1.5 rounded-md border border-white/[0.06] hover:border-cyan/40 bg-surface/40 backdrop-blur-md font-mono text-[10px] text-text-tertiary hover:text-cyan transition-colors tracking-wider uppercase cursor-pointer flex items-center gap-1.5"
              title="Admin Command Gate"
            >
              <Shield size={11} className="text-amber" />
              <span>SYS.GATE</span>
            </button>
          </div>
        </header>

        {/* ─── CENTRAL IDENTITY & ACTIVATION ─── */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center my-auto pointer-events-auto">

          {/* Profile Identity Frame: Real Photo OR Engineering Monogram (NEVER fake human) */}
          <div className="mb-6">
            {hasRealPhoto ? (
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-cyan/30 shadow-[0_0_40px_rgba(0,212,255,0.18)] group transition-transform hover:scale-105 duration-500">
                <img
                  src={profile!.profile_photo_url!}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-1 right-1 text-[8px] font-mono text-cyan bg-void/80 px-1 rounded">
                  VERIFIED
                </div>
              </div>
            ) : (
              /* Precision Engineering CAD Monogram */
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl border border-white/[0.08] flex items-center justify-center bg-surface/50 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] group">
                {/* CAD crosshair corners */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-cyan/60" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-cyan/60" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-cyan/60" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-cyan/60" />

                <span className="font-display text-2xl md:text-3xl font-bold tracking-wider text-text-primary/70">
                  {name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
            )}
          </div>

          {/* Role Specification Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[10px] md:text-[11px] text-cyan/90 tracking-[0.25em] uppercase">
              {role}
            </span>
          </div>

          {/* Primary Identity: ADITHYA MECHNEXUS */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-text-primary mb-3 leading-[0.95] select-none">
            <span className="block text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              ADITHYA
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan via-blue to-cyan-bright drop-shadow-[0_4px_24px_rgba(0,212,255,0.3)]">
              MECHNEXUS
            </span>
          </h1>

          {/* Core Mission Tagline */}
          <p className="font-body text-sm md:text-base text-text-secondary/85 max-w-xl mx-auto leading-relaxed mb-8 select-none">
            Futuristic Mechanical Engineering Digital Laboratory
          </p>

          {/* ─── CLICK HERE TO EXPLORE — Advanced Engineering Activation Control ─── */}
          <button
            data-cursor="activate"
            onClick={handleExplore}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            className="group relative cursor-pointer outline-none focus:ring-2 focus:ring-cyan/40 rounded-full"
            aria-label="Click here to explore engineering portfolio"
          >
            {/* Outer radar scanning ring 1 */}
            <div
              className={`absolute -inset-4 rounded-full border transition-all duration-500 pointer-events-none ${
                buttonHovered
                  ? 'border-cyan/40 scale-100 opacity-100'
                  : 'border-transparent scale-90 opacity-0'
              }`}
            />
            {/* Outer radar scanning ring 2 */}
            <div
              className={`absolute -inset-8 rounded-full border border-dashed transition-all duration-700 pointer-events-none ${
                buttonHovered
                  ? 'border-cyan/20 scale-100 opacity-100 animate-[spin_12s_linear_infinite]'
                  : 'border-transparent scale-80 opacity-0'
              }`}
            />

            {/* Main Activation Button Pill */}
            <div
              className={`relative px-10 py-4.5 rounded-full border backdrop-blur-xl transition-all duration-500 flex items-center gap-3 ${
                buttonHovered
                  ? 'border-cyan bg-cyan/[0.12] shadow-[0_0_50px_rgba(0,212,255,0.25)] scale-[1.02]'
                  : 'border-white/[0.12] bg-surface/60 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
              }`}
            >
              <Sparkles
                size={16}
                className={`transition-colors duration-300 ${
                  buttonHovered ? 'text-cyan-bright animate-spin' : 'text-text-tertiary'
                }`}
              />
              <span
                className={`font-mono text-xs md:text-sm font-semibold tracking-[0.28em] uppercase transition-colors duration-300 ${
                  buttonHovered ? 'text-cyan' : 'text-text-primary'
                }`}
              >
                CLICK HERE TO EXPLORE
              </span>
            </div>

            {/* Telemetry Indicator Dots */}
            <div
              className={`absolute -bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 transition-opacity duration-300 ${
                buttonHovered ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div className="w-1 h-1 rounded-full bg-cyan animate-pulse" />
              <div
                className="w-1 h-1 rounded-full bg-cyan animate-pulse"
                style={{ animationDelay: '200ms' }}
              />
              <div
                className="w-1 h-1 rounded-full bg-cyan animate-pulse"
                style={{ animationDelay: '400ms' }}
              />
            </div>
          </button>

          {/* ─── DIGITAL TWIN INTERACTIVE STATE SELECTOR HUD ─── */}
          {showWebGL && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 max-w-2xl px-4 pointer-events-auto">
              <span className="font-mono text-[9px] text-text-tertiary/60 tracking-widest mr-2 uppercase hidden sm:inline">
                MODE:
              </span>
              {TWIN_STATES.map((st) => {
                const Icon = st.icon;
                const isSelected = turbineState === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setTurbineState(st.id)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan/15 border border-cyan/50 text-cyan shadow-[0_0_16px_rgba(0,212,255,0.15)] font-semibold'
                        : 'bg-surface/30 border border-white/[0.05] text-text-tertiary hover:text-text-secondary hover:border-white/[0.12]'
                    }`}
                  >
                    <Icon size={11} className={isSelected ? 'text-cyan' : 'text-text-tertiary'} />
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </main>

        {/* ─── BOTTOM TELEMETRY FOOTER ─── */}
        <footer className="w-full px-6 py-5 md:px-10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3 font-mono text-[9px] text-text-tertiary/60 tracking-widest uppercase">
            <span>MECHNEXUS DIGITAL LAB // V15</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">ISO 2768-mH</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[9px] text-text-tertiary/60 tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <Activity size={10} className="text-status-online" />
              <span>{showWebGL ? `CORE: ${turbineState.toUpperCase()}` : '2D BLUEPRINT'}</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
