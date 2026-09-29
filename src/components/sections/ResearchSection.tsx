import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Microscope, ExternalLink, Calendar, Tag, FileText, FlaskConical, Atom } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { fetchResearch } from '@/lib/portfolioService';
import type { Research } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function ResearchSection() {
  const [researchList, setResearchList] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchResearch().then(({ data }) => {
      if (mounted) {
        setResearchList(data || []);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'published':
        return <span className="eng-badge eng-badge-cyan">PEER REVIEWED &bull; PUBLISHED</span>;
      case 'completed':
        return <span className="eng-badge eng-badge-success">EXPERIMENT COMPLETED</span>;
      case 'ongoing':
        return <span className="eng-badge eng-badge-orange">INVESTIGATION IN PROGRESS</span>;
      default:
        return <span className="eng-badge eng-badge-cyan">LABORATORY DRAFT</span>;
    }
  };

  return (
    <section id="research" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Scientific Analytical Grid & Empirical Data Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 80%, rgba(0, 212, 255, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 90% 20%, rgba(59, 130, 246, 0.06) 0%, transparent 45%),
              linear-gradient(rgba(0, 212, 255, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="LABORATORY INVESTIGATIONS"
          title="Engineering Research"
          description="Theoretical mechanics, computational modeling, experimental validation protocols, and technical academic documentation."
          badge="SCIENTIFIC"
        />

        {/* Laboratory Status Bar */}
        <div className="mb-8 p-3 rounded-xl bg-[rgba(10,12,18,0.7)] border border-[rgba(0,212,255,0.2)] flex flex-wrap items-center justify-between gap-4 text-[0.68rem] font-mono text-[var(--color-silver)] backdrop-blur-md">
          <div className="flex items-center gap-2 text-[var(--color-cyan)]">
            <FlaskConical className="w-3.5 h-3.5 text-[var(--color-cyan)]" />
            <span>LAB METHODOLOGY: EMPIRICAL &bull; FINITE ELEMENT CORRELATION</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-gunmetal)]">
            <Atom className="w-3.5 h-3.5 text-blue-400" />
            <span>CONTINUUM MECHANICS PROTOCOL</span>
          </div>
        </div>

        {loading ? (
          <LoadingState label="SCANNING RESEARCH REPOSITORIES..." />
        ) : researchList.length === 0 ? (
          <EmptyState
            category="LABORATORY REPOSITORY"
            title="NO RESEARCH PUBLICATIONS LOGGED"
            message="No scientific research entries have been submitted to the database. Use the Admin Console to register technical papers and laboratory experimental findings."
          />
        ) : (
          <div className="space-y-6">
            {researchList.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="eng-card p-6 md:p-8 hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,212,255,0.08)] transition-all duration-300 relative group overflow-hidden"
              >
                {/* Subtle horizontal highlight ray */}
                <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-cyan)] to-transparent group-hover:w-full transition-all duration-700" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[var(--color-cyan)] flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Microscope className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-[var(--color-cyan-bright)] uppercase tracking-wider font-semibold">
                      {item.category || 'THEORETICAL MECHANICS'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {getStatusBadge(item.status)}
                    {item.date && (
                      <span className="text-xs font-mono text-[var(--color-gunmetal)] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(item.date)}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-bold font-display text-[var(--color-pure-white)] group-hover:text-[var(--color-cyan)] transition-colors mb-3">
                  {item.title}
                </h3>

                <p className="text-xs md:text-sm text-[var(--color-silver)] leading-relaxed mb-6">
                  {item.description || item.short_description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <Tag className="w-3 h-3 text-[var(--color-gunmetal)] mr-1" />
                    {item.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[0.62rem] font-mono text-[var(--color-platinum)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-2">
                    {item.external_links?.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="eng-btn eng-btn-secondary !text-xs !py-2 !px-3.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{link.label || 'Read Research Paper'}</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
