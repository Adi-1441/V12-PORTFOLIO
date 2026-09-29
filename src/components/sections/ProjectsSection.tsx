import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Code2,
  FolderGit2,
  Layers,
  X,
  Maximize2,
  Cpu,
  Calendar,
  Sparkles,
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { fetchProjects } from '@/lib/portfolioService';
import type { Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchProjects().then(({ data }) => {
      if (mounted) {
        setProjects(data || []);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Digital Engineering Laboratory Viewport */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 85% 15%, rgba(0, 212, 255, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 15% 85%, rgba(14, 165, 233, 0.06) 0%, transparent 45%),
              linear-gradient(rgba(0, 212, 255, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="ENGINEERING ARCHIVES"
          title="Featured Projects"
          description="Parametric assemblies, computational structural analyses, fluid flow optimizations, and automated mechatronic prototypes."
          badge="DIGITAL TWIN"
        />

        {loading ? (
          <LoadingState label="RETRIEVING PROJECT REPOSITORIES..." />
        ) : projects.length === 0 ? (
          <EmptyState
            category="PROJECT REPOSITORY"
            title="NO PROJECTS RECORDED"
            message="No active projects are currently published in the database. Use the Admin Dashboard to add mechanical engineering case studies and assemblies."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="eng-card flex flex-col justify-between group cursor-pointer hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300"
                onClick={() => setSelectedProject(project)}
              >
                <div>
                  {/* Thumbnail / Engineering Canvas Preview with Technical Overlays */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[rgba(10,12,18,0.95)] border-b border-[rgba(255,255,255,0.08)]">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-gunmetal)] p-4 eng-grid-dense">
                        <Layers className="w-12 h-12 mb-2 opacity-50 text-[var(--color-cyan)] group-hover:scale-110 transition-transform" />
                        <span className="text-[0.62rem] font-mono tracking-widest uppercase text-[var(--color-silver)]">
                          CAD / CAE ARTIFACT
                        </span>
                      </div>
                    )}

                    {/* Laser Scan line on hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-transparent via-[rgba(0,212,255,0.15)] to-transparent" />

                    {/* Corner Reticle Brackets */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[var(--color-cyan)]" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[var(--color-cyan)]" />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[var(--color-cyan)]" />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[var(--color-cyan)]" />

                    {/* Inspection badge */}
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded bg-[rgba(0,0,0,0.8)] border border-[rgba(0,212,255,0.3)] text-[var(--color-cyan)]">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Domain badge */}
                    {project.engineering_domain && (
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[rgba(10,12,18,0.85)] border border-[rgba(0,212,255,0.3)] text-[0.62rem] font-mono text-[var(--color-cyan)] font-semibold backdrop-blur-sm">
                        {project.engineering_domain}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-2 text-[0.65rem] font-mono text-[var(--color-gunmetal)] mb-2.5">
                      <span className="text-[var(--color-cyan-dim)]">
                        {project.category || 'MECHANICAL DESIGN'}
                      </span>
                      {project.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(project.date)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-display text-[var(--color-pure-white)] group-hover:text-[var(--color-cyan)] transition-colors mb-2 line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[var(--color-silver)] line-clamp-3 mb-4 leading-relaxed">
                      {project.short_description || project.description}
                    </p>

                    {/* Software Tools */}
                    {project.software && project.software.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.software.slice(0, 3).map((sw) => (
                          <span
                            key={sw}
                            className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[0.62rem] font-mono text-[var(--color-platinum)]"
                          >
                            {sw}
                          </span>
                        ))}
                        {project.software.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[0.62rem] font-mono text-[var(--color-gunmetal)]">
                            +{project.software.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Links & Inspection Callout */}
                <div className="p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] mt-2">
                  <span className="text-[0.68rem] font-mono text-[var(--color-cyan)] flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    INSPECT SPECIFICATION →
                  </span>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[var(--color-silver)] hover:text-white transition-colors"
                        title="Repository / Code"
                      >
                        <Code2 className="w-4 h-4" />
                      </a>
                    )}
                    {project.external_links && project.external_links.length > 0 && (
                      <a
                        href={project.external_links[0].url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[var(--color-silver)] hover:text-white transition-colors"
                        title={project.external_links[0].label}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detailed Inspection Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="modal-content !max-w-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)] mb-4">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[var(--color-cyan)]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-cyan)] font-bold">
                      ENGINEERING SPECIFICATION // {selectedProject.slug || 'INSPECTION'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-[var(--color-silver)] hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedProject.thumbnail && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 border border-[rgba(255,255,255,0.1)]">
                    <img
                      src={selectedProject.thumbnail}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h3 className="text-2xl font-bold font-display text-[var(--color-pure-white)] mb-2">
                  {selectedProject.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-mono text-[var(--color-cyan-dim)]">
                  {selectedProject.engineering_domain && (
                    <span className="eng-badge eng-badge-cyan">
                      {selectedProject.engineering_domain}
                    </span>
                  )}
                  {selectedProject.category && (
                    <span className="px-2.5 py-0.5 rounded bg-[rgba(255,255,255,0.04)] text-[var(--color-silver)]">
                      {selectedProject.category}
                    </span>
                  )}
                  {selectedProject.date && (
                    <span className="text-[var(--color-gunmetal)]">
                      {formatDate(selectedProject.date)}
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-[var(--color-platinum)] leading-relaxed whitespace-pre-wrap mb-6">
                  {selectedProject.description || selectedProject.short_description}
                </div>

                {/* Software / Tools */}
                {selectedProject.software && selectedProject.software.length > 0 && (
                  <div className="mb-6">
                    <div className="text-[0.65rem] font-mono text-[var(--color-gunmetal)] uppercase mb-2 font-bold">
                      APPLIED SOFTWARE & TOOLS
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.software.map((sw) => (
                        <span
                          key={sw}
                          className="px-3 py-1 rounded-lg bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.25)] text-xs font-mono text-[var(--color-cyan)]"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* External links */}
                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                  {selectedProject.github_url && (
                    <a
                      href={selectedProject.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="eng-btn eng-btn-secondary !text-xs !py-2.5"
                    >
                      <Code2 className="w-4 h-4" />
                      View Code / Artifacts
                    </a>
                  )}
                  {selectedProject.external_links?.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="eng-btn eng-btn-ghost !text-xs !py-2.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {link.label || 'Documentation'}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
