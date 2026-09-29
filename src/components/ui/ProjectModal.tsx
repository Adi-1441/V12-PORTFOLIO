import { useEffect } from 'react';
import type { ProjectItem } from '@/content/projects';
import { TitleBlock } from './TitleBlock';
import { X } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-void/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-surface border border-hairline shadow-2xl z-10 my-8">
        {/* Header Close Bar */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4 bg-elevated/40">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-copper-300 uppercase tracking-widest">
              SPEC SHEET · {project.category}
            </span>
            <span className="text-text-tertiary">|</span>
            <span className="font-mono text-xs text-text-tertiary">
              ID: {project.slug}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors cursor-pointer"
            aria-label="Close specification"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Main Visual */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-void border border-hairline">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Heading */}
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary mb-2">
              {project.title}
            </h3>
            <p className="font-body text-base text-text-secondary leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Engineering Metrics Grid */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-elevated border border-hairline flex flex-col justify-between"
                >
                  <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider">
                    {m.label}
                  </span>
                  <span className="font-mono text-lg font-semibold text-copper-300 mt-1">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tech Stack Pills */}
          <div>
            <div className="font-mono text-xs text-text-tertiary uppercase tracking-wider mb-2">
              APPLIED TOOLCHAIN & METHODOLOGIES
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-mono rounded bg-elevated border border-hairline text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Expanded Engineering Title Block */}
          <div className="pt-4 border-t border-hairline">
            <TitleBlock
              drawnBy={project.titleBlock.drawnBy}
              rev={project.titleBlock.rev}
              date={project.titleBlock.date}
              scale={project.titleBlock.scale}
              material={project.titleBlock.material}
              tolerance={project.titleBlock.tolerance}
              className="max-w-md ml-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
