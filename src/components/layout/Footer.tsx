import { ArrowUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/[0.06] py-12 px-6 md:px-10 bg-void select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Identity */}
        <div className="text-center md:text-left space-y-1">
          <div className="font-display text-sm md:text-base font-black text-text-primary tracking-wide">
            ADITHYA MECHNEXUS
          </div>
          <p className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase">
            MECHANICAL ENGINEERING DIGITAL LABORATORY · {new Date().getFullYear()}
          </p>
        </div>

        {/* Admin Access Portal & Actions */}
        <div className="flex items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-status-online text-[11px]">
            <span className="w-2 h-2 rounded-full bg-status-online animate-pulse" />
            <span>ONLINE</span>
          </div>

          <span className="text-white/[0.1]">|</span>

          {/* Admin Access Portal Entry */}
          <Link
            to="/admin/login"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber/20 bg-amber/[0.04] text-amber hover:border-amber/50 hover:bg-amber/[0.08] transition-all text-xs font-mono font-semibold tracking-wider"
            title="Admin Access Portal"
          >
            <Shield className="w-3.5 h-3.5 text-amber" />
            <span>ADMIN ACCESS PORTAL</span>
          </Link>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg border border-white/[0.08] hover:border-cyan/40 bg-surface text-text-tertiary hover:text-cyan transition-all cursor-pointer"
            aria-label="Scroll to top"
            title="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
