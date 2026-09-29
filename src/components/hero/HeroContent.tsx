import { motion } from 'framer-motion';
import { FileText, Mail, Activity, Compass, ShieldCheck, ArrowRight } from 'lucide-react';
import { PORTFOLIO_IDENTITY } from '@/lib/constants';
import { scrollToSection } from '@/lib/utils';

export default function HeroContent() {
  const { name, role, tagline, secondaryTagline, shortDescription } = PORTFOLIO_IDENTITY;

  return (
    <div className="flex flex-col items-center text-center justify-center py-6 sm:py-10 z-10 max-w-4xl mx-auto">
      {/* 1. Engineering Role Identity Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-5 flex items-center justify-center gap-3 flex-wrap"
      >
        <span
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase"
          style={{
            background: 'rgba(0, 212, 255, 0.08)',
            border: '1px solid rgba(0, 212, 255, 0.25)',
            color: 'var(--color-cyan)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full bg-[var(--color-cyan)] shadow-[0_0_8px_var(--color-cyan)] animate-pulse"
          />
          {role}
        </span>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.68rem] font-mono text-[var(--color-silver)] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
          <Activity className="w-3 h-3 text-emerald-400" />
          SYS.ONLINE // 60FPS
        </span>
      </motion.div>

      {/* 2. Dominant Name Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="font-display font-black mb-4 tracking-tight text-white select-none"
        style={{
          fontSize: 'clamp(3rem, 7vw, 5.5rem)',
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
        }}
      >
        <span>ADITHYA </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-blue to-cyan-bright">
          MECHNEXUS
        </span>
      </motion.h1>

      {/* 3. Primary Engineering Mission Tagline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="font-display font-bold text-text-primary/90 mb-3 tracking-tight max-w-2xl"
        style={{
          fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)',
          lineHeight: 1.3,
        }}
      >
        {tagline}
      </motion.h2>

      {/* 4. Core Engineering Domain Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mb-6 py-2 px-4 rounded-xl bg-cyan/[0.04] border border-cyan/15 inline-block max-w-2xl"
      >
        <p className="font-mono text-xs sm:text-[0.82rem] font-semibold text-cyan tracking-wide">
          {secondaryTagline}
        </p>
      </motion.div>

      {/* 5. Concise Technical Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mb-8 text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed"
      >
        {shortDescription}
      </motion.p>

      {/* 6. Primary Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.85 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-10"
      >
        <button
          onClick={() => scrollToSection('projects')}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan to-blue text-void font-mono font-bold text-xs uppercase tracking-wider shadow-[0_4px_24px_rgba(0,212,255,0.35)] hover:shadow-[0_6px_30px_rgba(0,212,255,0.5)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>View Engineering Projects</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </button>

        <button
          onClick={() => scrollToSection('contact')}
          className="px-7 py-3.5 rounded-full border border-white/[0.12] hover:border-cyan/40 bg-surface/50 text-text-primary font-mono font-semibold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Mail className="w-4 h-4 text-cyan" />
          <span>Contact Engineer</span>
        </button>
      </motion.div>

      {/* 7. Bottom Telemetry Status Specifications */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-4 text-[0.68rem] font-mono text-text-tertiary"
      >
        <div className="flex items-center gap-1.5 text-text-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DIGITAL TWIN VERIFIED</span>
        </div>
        <span>&bull;</span>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Compass className="w-3.5 h-3.5 text-cyan" />
          <span>CAD/CAE COORD: REALTIME</span>
        </div>
        <span>&bull;</span>
        <span className="hidden sm:inline">TOLERANCE: ISO-2768-mH</span>
      </motion.div>
    </div>
  );
}
