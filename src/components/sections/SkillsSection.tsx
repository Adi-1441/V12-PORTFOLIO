import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Filter, Activity, Cpu } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { fetchSkills } from '@/lib/portfolioService';
import type { Skill } from '@/lib/types';
import { SKILL_CATEGORIES } from '@/lib/constants';

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchSkills().then(({ data }) => {
      if (mounted) {
        setSkills(data || []);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter((s) => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Technical Matrix Grid & Radar Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 30%, rgba(0, 212, 255, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 90% 70%, rgba(59, 130, 246, 0.06) 0%, transparent 45%),
              linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 32px 32px, 32px 32px',
          }}
        />
        {/* Subtle matrix scan pulse */}
        <div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.2)] to-transparent"
          style={{
            top: '40%',
            animation: 'pulseGlow 5s ease-in-out infinite',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="CAPABILITY MATRIX"
          title="Skills & Technical Arsenal"
          description="Parametric modeling, multi-physics computational solver suites, industrial control logic, and modern programming architectures."
          badge="TELEMETRY"
        />

        {/* Category Filters with High-Precision Engineering Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[0.65rem] font-mono text-[var(--color-silver)] flex-shrink-0">
            <Filter className="w-3 h-3 text-[var(--color-cyan)]" />
            <span>SECTOR FILTER:</span>
          </div>

          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all flex-shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[var(--color-cyan)] text-black font-bold shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                : 'bg-[rgba(18,18,26,0.7)] text-[var(--color-silver)] hover:text-white border border-[rgba(255,255,255,0.08)]'
            }`}
          >
            ALL SECTORS ({skills.length})
          </button>

          {SKILL_CATEGORIES.map((cat: string) => {
            const count = skills.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all flex-shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[var(--color-cyan)] text-black font-bold shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                    : 'bg-[rgba(18,18,26,0.7)] text-[var(--color-silver)] hover:text-white border border-[rgba(255,255,255,0.08)]'
                }`}
              >
                {cat.toUpperCase()} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        {loading ? (
          <LoadingState label="FETCHING CAPABILITY REPOSITORIES..." />
        ) : filteredSkills.length === 0 ? (
          <EmptyState
            category="SKILLS ARSENAL"
            title="NO SKILLS CURRENTLY LOGGED"
            message={`No skill records have been published for "${selectedCategory}". Use the Admin Console to register engineering competencies.`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map((skill, index) => {
              const isHovered = hoveredSkillId === skill.id;
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  onMouseEnter={() => setHoveredSkillId(skill.id)}
                  onMouseLeave={() => setHoveredSkillId(null)}
                  className={`eng-card p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                    isHovered
                      ? 'border-[rgba(0,212,255,0.35)] shadow-[0_8px_30px_rgba(0,212,255,0.08)] -translate-y-1'
                      : 'border-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  {/* Subtle sweep light on hover */}
                  <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.04) 50%, transparent 100%)',
                    }}
                  />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.18)] flex items-center justify-center text-[var(--color-cyan)] group-hover:scale-105 transition-transform">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm sm:text-base text-[var(--color-pure-white)] font-display tracking-wide">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[var(--color-cyan)] px-2 py-0.5 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.15)]">
                        {skill.proficiency}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[0.62rem] font-mono text-[var(--color-gunmetal)] mb-3">
                      <span>SECTOR // {skill.category}</span>
                      <span className="text-[var(--color-silver)] flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5 text-emerald-400" />
                        CALIBRATED
                      </span>
                    </div>
                  </div>

                  {/* Technical Meter Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-[rgba(255,255,255,0.05)] h-2 rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)] p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            skill.proficiency >= 85
                              ? 'linear-gradient(90deg, #00a5cc, #00d4ff)'
                              : skill.proficiency >= 65
                              ? 'linear-gradient(90deg, #2563eb, #38bdf8)'
                              : 'linear-gradient(90deg, #ea580c, #f97316)',
                          boxShadow: isHovered
                            ? '0 0 8px rgba(0, 212, 255, 0.4)'
                            : 'none',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
