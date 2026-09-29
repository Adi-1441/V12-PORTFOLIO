import { Activity } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({
  label = 'INITIALIZING ENGINEERING TELEMETRY...',
}: LoadingStateProps) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-[rgba(0,212,255,0.15)] border-t-[var(--color-cyan)] animate-spin" />
        <Activity className="w-4 h-4 text-[var(--color-cyan)] absolute" />
      </div>
      <span className="text-[0.65rem] font-mono tracking-widest text-[var(--color-cyan-dim)] uppercase animate-pulse">
        {label}
      </span>
    </div>
  );
}
