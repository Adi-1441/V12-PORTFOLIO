import { useRef, useState } from 'react';
import type { ProjectItem } from '@/content/projects';
import { TitleBlock } from './TitleBlock';

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Gentle 3D card tilt (max 4° per Part 6.4 & Part VIII)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRot({
      x: -y * 8, // max 4 deg in each direction
      y: x * 8,
    });
  };

  const handlePointerLeave = () => {
    setRot({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const isNeural = project.accentType === 'neural';
  const isFusion = project.accentType === 'fusion';

  const hoverBorderColor = isNeural
    ? 'hover:border-violet-300/50'
    : isFusion
    ? 'hover:border-copper-300/50'
    : 'hover:border-copper-300/50';

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      onClick={() => onSelect(project)}
      style={{
        transform: `perspective(1000px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transition: isHovered ? 'transform 100ms ease-out' : 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface border border-hairline ${hoverBorderColor} transition-colors duration-250 cursor-pointer p-5`}
    >
      {/* Top Media / Thumbnail */}
      <div>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-void/60 border border-hairline mb-4">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Category Chip Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-block px-2.5 py-1 rounded text-[11px] font-mono border backdrop-blur-md ${
                isNeural
                  ? 'border-violet-500/40 bg-void/80 text-violet-100'
                  : 'border-copper-500/40 bg-void/80 text-copper-100'
              }`}
            >
              {project.category}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="font-display text-lg font-medium text-text-primary group-hover:text-copper-100 transition-colors mb-2">
          {project.title}
        </h4>
        <p className="font-body text-sm text-text-secondary line-clamp-3 leading-relaxed mb-4">
          {project.description}
        </p>
      </div>

      {/* Bottom Tech Tags & Title Block */}
      <div className="pt-3 border-t border-hairline mt-auto">
        {/* Discrete Tech Tags (No middle-dot joining!) */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[11px] font-mono rounded bg-elevated border border-hairline text-text-tertiary group-hover:text-text-secondary transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title-Block Corner Motif */}
        <TitleBlock
          drawnBy={project.titleBlock.drawnBy}
          rev={project.titleBlock.rev}
          date={project.titleBlock.date}
          scale={project.titleBlock.scale}
        />
      </div>
    </div>
  );
}
