import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Cpu, Lock, Compass } from 'lucide-react';
import { CORE_NAV_ITEMS } from '@/lib/constants';
import type { NavItem } from '@/lib/types';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { cn, scrollToSection } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const sectionIds = CORE_NAV_ITEMS.map((item: NavItem) => item.id);
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    setIsMobileMenuOpen(false);
    const id = href.replace('#', '');
    scrollToSection(id);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-[30] transition-all duration-300 px-3 sm:px-6',
          isScrolled ? 'pt-2 pb-2' : 'pt-4 pb-3'
        )}
      >
        <div
          className={cn(
            'max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 rounded-2xl px-5 py-3',
            'border shadow-lg backdrop-blur-2xl'
          )}
          style={{
            background: isScrolled ? 'rgba(10, 12, 18, 0.92)' : 'rgba(12, 14, 22, 0.8)',
            borderColor: isScrolled ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)',
            boxShadow: isScrolled
              ? '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 212, 255, 0.1)'
              : '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Logo / Engineering Command Title */}
          <button
            onClick={() => handleNavClick('#home')}
            className="flex items-center gap-3 group flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
            aria-label="Go to home"
          >
            <div className="w-10 h-10 rounded-xl bg-surface border border-white/[0.08] flex items-center justify-center text-cyan group-hover:border-cyan/50 group-hover:shadow-[0_0_16px_rgba(0,212,255,0.3)] transition-all">
              <Cpu className="w-5 h-5 text-cyan" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 font-display text-sm md:text-base font-black tracking-wide">
                <span className="text-white">ADITHYA</span>
                <span className="text-cyan">MECHNEXUS</span>
              </div>
              <span className="text-[0.62rem] font-mono tracking-widest text-text-tertiary uppercase hidden sm:block">
                MECHANICAL DIGITAL LAB
              </span>
            </div>
          </button>

          {/* Desktop Navigation: Spacious & Clear */}
          <nav
            ref={navContainerRef}
            className="hidden xl:flex items-center gap-2 overflow-x-auto scrollbar-none px-2"
            role="navigation"
            aria-label="Main navigation"
          >
            {CORE_NAV_ITEMS.filter((item: NavItem) => item.id !== 'home').map((item: NavItem) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    'relative px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer flex-shrink-0 select-none font-mono',
                    isActive
                      ? 'text-cyan bg-cyan/[0.1] shadow-[inset_0_0_8px_rgba(0,212,255,0.2)]'
                      : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'
                  )}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-active-bar"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan shadow-[0_0_8px_#00D4FF] rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Utilities: Admin Gateway + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber/20 bg-amber/[0.04] text-amber hover:border-amber/50 transition-all text-xs font-mono font-semibold"
              title="Admin Access Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[0.68rem] uppercase tracking-wider">ADMIN</span>
            </Link>

            {/* Mobile / Tablet Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg border transition-all cursor-pointer bg-surface/50 border-white/[0.08] text-text-secondary hover:text-white"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[29] xl:hidden"
            style={{ background: 'rgba(5, 5, 10, 0.8)', backdropFilter: 'blur(16px)' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] p-6 pt-24 overflow-y-auto flex flex-col justify-between bg-surface border-l border-cyan/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="navigation"
            >
              <div>
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
                  <span className="font-mono text-[10px] text-cyan uppercase tracking-widest">
                    FACILITY DIRECTORY
                  </span>
                  <span className="font-mono text-[9px] text-text-tertiary">
                    {CORE_NAV_ITEMS.length} SECTORS
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {CORE_NAV_ITEMS.map((item: NavItem, idx: number) => {
                    const isActive = activeSection === item.id;
                    const sectorNum = String(idx).padStart(2, '0');
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.href)}
                        className={cn(
                          'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all text-left cursor-pointer',
                          isActive
                            ? 'text-cyan bg-cyan/[0.1] border border-cyan/30 font-bold'
                            : 'text-text-secondary hover:text-white hover:bg-white/[0.02]'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] text-text-tertiary">{sectorNum} //</span>
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 text-cyan" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="mt-8 pt-4 border-t border-white/[0.06] space-y-3">
                <Link
                  to="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-amber/20 bg-amber/[0.04] text-xs font-mono text-amber hover:border-amber/50 transition-all font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>ADMIN ACCESS PORTAL</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <div className="text-[9px] font-mono text-text-tertiary text-center uppercase tracking-widest">
                  ADITHYA MECHNEXUS · V15
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
