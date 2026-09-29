interface TitleBlockProps {
  drawnBy?: string;
  rev?: string;
  date?: string;
  scale?: string;
  material?: string;
  tolerance?: string;
  className?: string;
}

export function TitleBlock({
  drawnBy = 'A.G.',
  rev = '01',
  date = '2026.03',
  scale = 'NTS',
  material,
  tolerance,
  className = '',
}: TitleBlockProps) {
  return (
    <div
      className={`title-block-box rounded border border-dashed border-text-primary/15 bg-void/80 px-2.5 py-1.5 font-mono text-[11px] leading-tight text-text-tertiary select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span>DRAWN: <strong className="font-medium text-text-secondary">{drawnBy}</strong></span>
        <span>REV: <strong className="font-medium text-copper-300">{rev}</strong></span>
      </div>
      <div className="flex items-center justify-between gap-3 mt-0.5">
        <span>DATE: {date}</span>
        <span>SCALE: {scale}</span>
      </div>
      {(material || tolerance) && (
        <div className="mt-1 pt-1 border-t border-hairline flex flex-col gap-0.5 text-[10px] text-text-tertiary">
          {material && <span>MAT: <span className="text-text-secondary">{material}</span></span>}
          {tolerance && <span>TOL: <span className="text-text-secondary">{tolerance}</span></span>}
        </div>
      )}
    </div>
  );
}
