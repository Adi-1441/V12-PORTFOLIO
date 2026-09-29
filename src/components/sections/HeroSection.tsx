import { TurbineScene } from '../turbine/TurbineScene';
import HeroContent from '../hero/HeroContent';
import { ChevronDown } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16"
    >
      {/* Fullscreen 3D Turbine Background */}
      <div className="absolute inset-0 z-0">
        <TurbineScene />
        <div className="absolute inset-0 bg-gradient-to-b from-void/75 via-void/40 to-void/90 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/65 via-transparent to-void/65 pointer-events-none z-[1]" />
      </div>

      {/* Main Architectural Container — Centered Open Environment */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center text-center">
        <HeroContent />

        {/* Scroll Down Prompt */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => scrollToSection('about')}
            className="flex flex-col items-center gap-2 text-text-tertiary hover:text-cyan transition-colors cursor-pointer group"
            aria-label="Scroll to About The Engineer"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em]">
              EXPLORE ENGINEERING DOSSIER
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce text-cyan" />
          </button>
        </div>
      </div>
    </section>
  );
}
