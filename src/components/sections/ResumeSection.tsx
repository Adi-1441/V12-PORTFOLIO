import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileDown, GraduationCap, Briefcase, Award, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { fetchProfile } from '@/lib/portfolioService';
import type { Profile } from '@/lib/types';
import { scrollToSection } from '@/lib/utils';

export default function ResumeSection() {
  const [profile, setProfile] = useState<Profile | null>(null);

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

  const milestones = [
    {
      type: 'education',
      title: 'B.E. in Mechanical Engineering',
      institution: 'Undergraduate Engineering Program',
      period: 'Present',
      description:
        'Focus on Machine Design, Thermodynamics, Fluid Dynamics, Finite Element Analysis (FEA), Computational Fluid Dynamics (CFD), and Control Systems.',
      icon: GraduationCap,
    },
    {
      type: 'specialization',
      title: 'Advanced Computer-Aided Engineering (CAE)',
      institution: 'Independent & Academic Research',
      period: 'Specialization',
      description:
        'Parametric CAD modeling, structural meshing, non-linear stress investigations, conjugate heat transfer simulations, and physics-informed ML surrogates.',
      icon: Briefcase,
    },
    {
      type: 'automation',
      title: 'Mechatronics & Industrial Automation',
      institution: 'Robotics & Control Logic Systems',
      period: 'Focus Area',
      description:
        'PLC ladder programming, industrial sensor integration, closed-loop actuator feedback, and kinematic trajectory planning.',
      icon: Award,
    },
  ];

  return (
    <section id="resume" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Engineering Dossier Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 85% 75%, rgba(0, 212, 255, 0.08) 0%, transparent 45%),
              linear-gradient(rgba(0, 212, 255, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 36px 36px, 36px 36px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="CURRICULUM VITAE"
          title="Resume & Engineering Milestones"
          description="Academic qualifications, specialized technical proficiencies, and documented industrial engineering milestones."
          badge="CREDENTIALS"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Download & Resume Overview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 eng-card p-6 md:p-8 flex flex-col items-center text-center relative group hover:border-[rgba(0,212,255,0.4)] transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center text-[var(--color-cyan)] mb-4 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,212,255,0.1)]">
              <FileText className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold font-display text-[var(--color-pure-white)] mb-1">
              Engineering Dossier
            </h3>
            <p className="text-xs text-[var(--color-silver)] font-mono mb-6">
              PDF FORMAT // VERIFIED SPECIFICATIONS
            </p>

            {profile?.resume_enabled && profile?.resume_url ? (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                download
                className="eng-btn eng-btn-primary w-full !text-xs !py-3 mb-4 font-mono font-semibold"
              >
                <FileDown className="w-4 h-4" />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>
            ) : (
              <button
                onClick={() => scrollToSection('contact')}
                className="eng-btn eng-btn-secondary w-full !text-xs !py-3 mb-4 font-mono font-semibold cursor-pointer"
              >
                <span>REQUEST DOSSIER VIA CONTACT</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}

            <div className="w-full text-left space-y-2.5 pt-4 border-t border-[rgba(255,255,255,0.06)] text-xs font-mono">
              <div className="flex items-center gap-2 text-[var(--color-platinum)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Mechanical Engineering Degree</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-platinum)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>CAD/CAE & FEA/CFD Solver Suite</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-platinum)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>PLC, Robotics & Control Automation</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Chronological Trajectory */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between text-[0.65rem] font-mono tracking-widest uppercase text-[var(--color-gunmetal)] mb-1 px-1">
              <span>CHRONOLOGICAL ENGINEERING TRAJECTORY</span>
              <span className="text-[var(--color-cyan)]">ACTIVE MILESTONES</span>
            </div>

            {milestones.map((ms, index) => {
              const IconComp = ms.icon;
              return (
                <div
                  key={index}
                  className="eng-card p-6 flex items-start gap-4 hover:border-[rgba(0,212,255,0.35)] transition-all duration-300 relative group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.18)] flex items-center justify-center text-[var(--color-cyan)] flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-[var(--color-pure-white)] font-display">
                        {ms.title}
                      </h4>
                      <span className="text-[0.65rem] font-mono text-[var(--color-cyan)] px-2.5 py-0.5 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.2)] font-semibold">
                        {ms.period}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[var(--color-platinum)] mb-2 font-semibold">
                      {ms.institution}
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--color-silver)] leading-relaxed">
                      {ms.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
