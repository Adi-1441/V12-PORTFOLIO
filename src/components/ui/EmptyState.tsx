/* ═══════════════════════════════════════════════════════
   EMPTY STATE — Elegant Engineering Archive Status
   Replaces the old "STATUS 204" repetitive pattern
   with dignified, honest archive messages.
   ═══════════════════════════════════════════════════════ */

interface EmptyStateProps {
  title?: string;
  message?: string;
  category?: string;
}

export default function EmptyState({
  title = 'AWAITING VERIFIED RECORDS',
  message = 'This engineering archive is ready to receive verified case studies and documentation through the Admin Console.',
  category = 'ENGINEERING ARCHIVE',
}: EmptyStateProps) {
  return (
    <div className="relative w-full py-20 px-8 flex flex-col items-center justify-center text-center">
      {/* Subtle background geometry */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
        <svg viewBox="0 0 600 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <circle cx="300" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="300" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 12" />
          <line x1="300" y1="0" x2="300" y2="200" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 12" />
        </svg>
      </div>

      {/* Category tag */}
      <div className="font-mono text-[10px] tracking-[0.25em] text-text-tertiary/60 uppercase mb-6">
        {category}
      </div>

      {/* Main title */}
      <h4 className="font-display text-lg sm:text-xl font-medium text-text-secondary/70 mb-3 tracking-wide">
        {title}
      </h4>

      {/* Description */}
      <p className="font-body text-sm text-text-tertiary/60 max-w-md leading-relaxed">
        {message}
      </p>

      {/* Bottom line accent */}
      <div className="mt-8 w-16 h-px bg-gradient-to-r from-transparent via-text-tertiary/20 to-transparent" />
    </div>
  );
}
