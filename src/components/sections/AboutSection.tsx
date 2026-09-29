import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Cpu,
  Flame,
  Binary,
  GraduationCap,
  Sparkles,
  User,
  ShieldCheck,
  Scan,
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AboutBackground from './AboutBackground';
import { fetchProfile } from '@/lib/portfolioService';
import type { Profile } from '@/lib/types';
import { PORTFOLIO_IDENTITY } from '@/lib/constants';

export default function AboutSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchProfile().then(({ data }) => {
      if (mounted && data) {
        setProfile(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const name = profile?.name || PORTFOLIO_IDENTITY.name;
  const role = profile?.role || PORTFOLIO_IDENTITY.role;
  const tagline = profile?.tagline || PORTFOLIO_IDENTITY.tagline;
  const shortDescription = profile?.short_description || PORTFOLIO_IDENTITY.shortDescription;
  const aboutDescription =
    profile?.about_description ||
    'Dedicated to bridging physical mechanical systems with high-fidelity digital twins, computational simulation, and machine learning. Combining rigorous thermodynamic and structural analysis with modern CAD workflows and industrial automation logic.';

  const domains = [
    {
      title: 'CAD & Generative Design',
      desc: 'Precision parametric modeling, kinematic assembly validation, GD&T tolerance allocation, and additive manufacturing optimization.',
      icon: Layers,
      accent: 'var(--color-cyan)',
      code: 'CAD-01',
    },
    {
      title: 'CAE, FEA & Structural Simulation',
      desc: 'Non-linear stress analysis, harmonic response, fatigue life estimation, and topological mass reduction under extreme boundary conditions.',
      icon: Cpu,
      accent: 'var(--color-cyan-bright)',
      code: 'FEA-02',
    },
    {
      title: 'Thermal & CFD Analysis',
      desc: 'Convective heat transfer modeling, turbulent flow dynamics, conjugate heat transfer (CHT), and pressure drop optimization in complex manifolds.',
      icon: Flame,
      accent: 'var(--color-orange)',
      code: 'CFD-03',
    },
    {
      title: 'Robotics & PLC Automation',
      desc: 'Industrial PLC ladder logic, sensor-actuator feedback control, motion path planning, and SCADA monitoring architectures.',
      icon: Binary,
      accent: 'var(--color-electric-blue)',
      code: 'PLC-04',
    },
    {
      title: 'AI × Engineering',
      desc: 'Physics-informed neural networks (PINNs), rapid surrogate model approximation for FEA/CFD iterations, and automated design exploration.',
      icon: Sparkles,
      accent: 'var(--color-cyan)',
      code: 'PINN-05',
    },
  ];

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* 1. Dedicated CAD Blueprint / Engineering Drafting Environment */}
      <AboutBackground />

      <div className="section-container relative z-10">
        <SectionHeader
          label="ENGINEERING DOSSIER"
          title="About The Engineer"
          description="Mechanical engineering student focused on multi-physics simulation, automated design validation, and intelligent digital twin systems."
          badge="SPECIFICATION"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Prominent Digital Identity & Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Enhanced Profile Card with Hover Elevation & Edge Illumination */}
            <div className="eng-card p-6 sm:p-7 flex flex-col items-center text-center relative group hover:shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_24px_rgba(0,212,255,0.12)] transition-all duration-300">
              {/* Profile Photo Area - Prominently Enlarged with Futuristic CAD Frame */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-[rgba(0,212,255,0.35)] bg-[rgba(10,12,18,0.9)] shadow-2xl mb-5 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
                {profile?.profile_photo_enabled && profile?.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-[var(--color-cyan)]">
                    <User className="w-20 h-20 stroke-[1.2] mb-3 opacity-80" />
                    <span className="text-[0.65rem] font-mono tracking-widest text-[var(--color-cyan-dim)] uppercase">
                      DIGITAL IDENTITY
                    </span>
                    <span className="text-[0.55rem] font-mono text-[var(--color-gunmetal)] mt-1">
                      SPEC // ADITHYA G
                    </span>
                  </div>
                )}

                {/* Laser Scanning Effect across photo on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.12) 50%, transparent 100%)',
                    animation: 'scanLine 3s linear infinite',
                  }}
                />

                {/* Precision CAD Corner Brackets (┌ ┐ └ ┘) */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--color-cyan)] pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[var(--color-cyan)] pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[var(--color-cyan)] pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--color-cyan)] pointer-events-none" />

                {/* Telemetry Badge on Frame */}
                <div className="absolute top-2.5 right-2.5 text-[0.55rem] font-mono text-[var(--color-cyan)] bg-[rgba(0,0,0,0.75)] px-2 py-0.5 rounded border border-[rgba(0,212,255,0.25)] flex items-center gap-1 z-10">
                  <Scan className="w-2.5 h-2.5 animate-pulse" />
                  <span>ENG.ID // AG-2026</span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 text-[0.55rem] font-mono text-emerald-400 bg-[rgba(0,0,0,0.75)] px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 z-10">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>VERIFIED</span>
                </div>
              </div>

              {/* Identity Typography */}
              <h3 className="text-2xl font-bold font-display text-[var(--color-pure-white)] tracking-wide">
                {name}
              </h3>
              <p className="text-xs font-mono font-semibold text-[var(--color-cyan)] mt-1 uppercase tracking-widest">
                {role}
              </p>
              <p className="text-xs text-[var(--color-silver)] mt-2 font-mono max-w-sm">
                {tagline}
              </p>

              {/* Technical Spec Matrix */}
              <div className="w-full mt-6 pt-5 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.2)] transition-colors">
                  <div className="text-[0.6rem] font-mono text-[var(--color-gunmetal)] uppercase tracking-wider">DISCIPLINE</div>
                  <div className="text-xs font-semibold text-[var(--color-platinum)] mt-0.5 font-mono">Mechanical Eng.</div>
                </div>
                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.2)] transition-colors">
                  <div className="text-[0.6rem] font-mono text-[var(--color-gunmetal)] uppercase tracking-wider">FOCUS</div>
                  <div className="text-xs font-semibold text-[var(--color-platinum)] mt-0.5 font-mono">CAD / CAE / AI</div>
                </div>
                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.2)] transition-colors">
                  <div className="text-[0.6rem] font-mono text-[var(--color-gunmetal)] uppercase tracking-wider">SIMULATION</div>
                  <div className="text-xs font-semibold text-[var(--color-platinum)] mt-0.5 font-mono">FEA & CFD Dynamics</div>
                </div>
                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.2)] transition-colors">
                  <div className="text-[0.6rem] font-mono text-[var(--color-gunmetal)] uppercase tracking-wider">AUTOMATION</div>
                  <div className="text-xs font-semibold text-[var(--color-platinum)] mt-0.5 font-mono">PLC & Robotics</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Engineering Philosophy & Technical Competencies */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Engineering Mission & Philosophy Card */}
            <div className="eng-card p-6 sm:p-8 relative group hover:border-[rgba(0,212,255,0.25)] transition-all">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-[var(--color-cyan)] group-hover:scale-110 transition-transform" />
                <span className="text-[0.68rem] font-mono uppercase tracking-widest text-[var(--color-cyan)] font-semibold">
                  ENGINEERING PHILOSOPHY & OBJECTIVE
                </span>
              </div>
              <p className="text-sm sm:text-base text-[var(--color-platinum)] leading-relaxed mb-4">
                {shortDescription}
              </p>
              <p className="text-xs sm:text-sm text-[var(--color-silver)] leading-relaxed">
                {aboutDescription}
              </p>
            </div>

            {/* Core Technical Competency Matrix with Rich Interactions */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1 px-1">
                <span className="text-[0.65rem] font-mono tracking-widest uppercase text-[var(--color-gunmetal)] font-semibold">
                  CORE TECHNICAL COMPETENCY MATRIX
                </span>
                <span className="text-[0.6rem] font-mono text-[var(--color-cyan)]">
                  5 SECTORS
                </span>
              </div>

              {domains.map((dom, i) => {
                const IconComponent = dom.icon;
                const isHovered = activeCardIndex === i;
                return (
                  <motion.div
                    key={dom.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    onMouseEnter={() => setActiveCardIndex(i)}
                    onMouseLeave={() => setActiveCardIndex(null)}
                    className={`eng-card p-4 sm:p-5 flex items-start gap-4 transition-all duration-300 relative overflow-hidden cursor-default ${
                      isHovered
                        ? 'border-[rgba(0,212,255,0.4)] shadow-[0_8px_30px_rgba(0,212,255,0.08)] -translate-y-0.5'
                        : 'border-[rgba(255,255,255,0.06)]'
                    }`}
                  >
                    {/* Directional light sweep on hover */}
                    <div
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.05) 50%, transparent 100%)',
                      }}
                    />

                    {/* Technical Sector Code Pip */}
                    <div className="absolute top-2 right-2 text-[0.55rem] font-mono text-[var(--color-gunmetal)]">
                      {dom.code}
                    </div>

                    <div
                      className="p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: dom.accent }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-bold text-[var(--color-pure-white)] font-display tracking-wide mb-1">
                        {dom.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--color-silver)] leading-relaxed">
                        {dom.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
