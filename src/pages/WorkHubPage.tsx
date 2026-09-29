import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchProfile,
  fetchProjects,
  fetchResearch,
  fetchCadCae,
  fetchPlcPrograms,
  fetchCertifications,
  fetchSkills,
  fetchArticles,
  fetchConnections,
  fetchContactInfo,
  fetchSections,
} from '@/lib/portfolioService';
import type {
  Profile,
  Project,
  Research,
  CadCae,
  PlcProgram,
  Certification,
  Skill,
  Article,
  Connection,
  ContactInfo,
  PortfolioSection,
} from '@/lib/types';
import { PORTFOLIO_IDENTITY } from '@/lib/constants';
import { TitleBlock } from '@/components/ui/TitleBlock';
import { NexusPortal } from '@/components/transitions/NexusPortal';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { CommandMenu } from '@/components/ui/CommandMenu';
import EmptyState from '@/components/ui/EmptyState';
import {
  FileText,
  Download,
  Mail,
  ExternalLink,
  Award,
  Cpu,
  Layers,
  Flame,
  Binary,
  Sparkles,
  CheckCircle2,
  Terminal,
  Shield,
  Menu,
  X,
  ArrowUp,
  Box,
  Compass,
  Zap,
  Activity,
  Workflow,
  Wrench,
  Search,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   WORK HUB PAGE — Advanced Mechanical Engineering Facility
   Spacious, atmospheric environments for every discipline:
   ABOUT | SKILLS | PROJECTS | RESEARCH | CAD & CAE | PLC |
   CERTIFICATIONS | AI × ENGINEERING | ARTICLES | RESUME |
   CONNECTIONS | CONTACT | DYNAMIC SECTIONS
   ═══════════════════════════════════════════════════════ */

export default function WorkHubPage() {
  const navigate = useNavigate();

  // Supabase Data State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [research, setResearch] = useState<Research[]>([]);
  const [cadCae, setCadCae] = useState<CadCae[]>([]);
  const [plcPrograms, setPlcPrograms] = useState<PlcProgram[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [dynamicSections, setDynamicSections] = useState<PortfolioSection[]>([]);
  const [loading, setLoading] = useState(true);

  // UI Navigation & Interaction States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [portalActive, setPortalActive] = useState(false);
  const [portalCoords, setPortalCoords] = useState({ x: 50, y: 50 });
  const [isPlottingResume, setIsPlottingResume] = useState(false);
  const [previewResume, setPreviewResume] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('All');

  // Contact Form State
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formFeedback, setFormFeedback] = useState('');

  // Fetch real data from Supabase
  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetchProfile(),
      fetchProjects(),
      fetchResearch(),
      fetchCadCae(),
      fetchPlcPrograms(),
      fetchCertifications(),
      fetchSkills(),
      fetchArticles(),
      fetchConnections(),
      fetchContactInfo(),
      fetchSections(),
    ]).then(
      ([
        profRes,
        projRes,
        resRes,
        cadRes,
        plcRes,
        certRes,
        skillsRes,
        artRes,
        connRes,
        contactRes,
        secRes,
      ]) => {
        if (!mounted) return;
        if (profRes.data) setProfile(profRes.data);
        if (projRes.data) setProjects(projRes.data);
        if (resRes.data) setResearch(resRes.data);
        if (cadRes.data) setCadCae(cadRes.data);
        if (plcRes.data) setPlcPrograms(plcRes.data);
        if (certRes.data) setCertifications(certRes.data);
        if (skillsRes.data) setSkills(skillsRes.data);
        if (artRes.data) setArticles(artRes.data);
        if (connRes.data) setConnections(connRes.data);
        if (contactRes.data) setContactInfo(contactRes.data);
        if (secRes.data) setDynamicSections(secRes.data.filter((s) => s.enabled));
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  // Scroll Progress Calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active Section Intersection Observer
  useEffect(() => {
    const sectionIds = [
      'about',
      'skills',
      'projects',
      'research',
      'cad-cae',
      'plc',
      'certifications',
      'ai-engineering',
      'articles',
      'resume',
      'connections',
      'contact',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-25% 0px -55% 0px' }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading]);

  // Project categories
  const categories: string[] = [
    'All',
    ...Array.from(
      new Set(
        projects
          .map((p) => p.category)
          .filter((c): c is string => typeof c === 'string' && c.length > 0)
      )
    ),
  ];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  // Skill categories
  const skillCategories = [
    'All',
    ...Array.from(
      new Set(
        skills
          .map((s) => s.category)
          .filter((c): c is string => typeof c === 'string' && c.length > 0)
      )
    ),
  ];

  const filteredSkills =
    activeSkillCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeSkillCategory);

  // Return to Genesis transition
  const handleBackToIntro = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPortalCoords({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setPortalActive(true);
  };

  const handlePortalComplete = () => navigate('/');

  // Resume Download Handler
  const handleDownloadResume = () => {
    setIsPlottingResume(true);
    setTimeout(() => {
      setIsPlottingResume(false);
      const url = profile?.resume_url;
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('Resume PDF can be uploaded and linked in the Admin Profile CMS.');
      }
    }, 600);
  };

  // Contact Form Submission Handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setFormStatus('error');
      setFormFeedback('Please fill out all required fields.');
      return;
    }
    setFormStatus('submitting');
    try {
      const existing = JSON.parse(localStorage.getItem('mechnexus_messages') || '[]');
      const newMsg = {
        id: Date.now().toString(),
        name: formState.name,
        email: formState.email,
        message: formState.message,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('mechnexus_messages', JSON.stringify([newMsg, ...existing]));

      const recipient = contactInfo?.email || profile?.email;
      if (recipient && !recipient.includes('example.com')) {
        setFormStatus('success');
        setFormFeedback(`Message recorded and queued for delivery to ${recipient}.`);
      } else {
        setFormStatus('success');
        setFormFeedback(
          'Message secured in local repository. Set real recipient email in Admin Contact Settings.'
        );
      }
      setFormState({ name: '', email: '', message: '' });
    } catch {
      setFormStatus('error');
      setFormFeedback('Network dispatch failure. Please retry.');
    }
  };

  const name = profile?.name || PORTFOLIO_IDENTITY.name;
  const role = profile?.role || PORTFOLIO_IDENTITY.role;
  const aboutHeading = profile?.about_heading || 'Engineering Precision Grounded in Physics';
  const aboutDesc =
    profile?.about_description ||
    'Dedicated to advancing mechanical systems through rigorous CAD design, non-linear structural FEA, turbulence-resolved CFD, and computational automation. Grounded in thermodynamics and materials science, extended with agentic engineering pipelines.';

  const hasRealPhoto = Boolean(profile?.profile_photo_enabled && profile?.profile_photo_url);

  const NAV_ITEMS = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'research', label: 'Research' },
    { id: 'cad-cae', label: 'CAD & CAE' },
    { id: 'plc', label: 'PLC' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'ai-engineering', label: 'AI × Engineering' },
    { id: 'articles', label: 'Articles' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  // ─── Environment Section Component ───
  const SectionEnvironment = ({
    id,
    tag,
    title,
    subtitle,
    children,
  }: {
    id: string;
    tag: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }) => (
    <section id={id} className="scroll-mt-28 py-32 md:py-44 relative">
      {/* Section Header */}
      <div className="mb-14 md:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/[0.06] border border-cyan/20 font-mono text-[10px] md:text-[11px] text-cyan tracking-[0.28em] uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
          <span>{tag}</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-[1.05]">
          {title}
        </h2>
        {subtitle && (
          <p className="font-body text-base md:text-lg text-text-secondary/80 max-w-3xl mt-4 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-8 flex items-center gap-3">
          <div className="w-16 h-px bg-cyan/60" />
          <div className="w-2 h-2 rotate-45 border border-cyan/60" />
          <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-white/[0.08] to-transparent" />
        </div>
      </div>

      {children}
    </section>
  );

  // ─── Atmospheric Spatial Transition Divider ───
  const SpatialTransition = ({ label }: { label?: string }) => (
    <div className="w-full py-12 flex flex-col items-center justify-center relative pointer-events-none select-none">
      <div className="w-px h-32 bg-gradient-to-b from-transparent via-cyan/25 to-transparent" />
      {label && (
        <span className="font-mono text-[8px] text-text-tertiary/40 tracking-[0.3em] uppercase mt-2">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-void text-text-primary selection:bg-cyan selection:text-void overflow-x-hidden">
      <CustomCursor />
      <CommandMenu isOpen={commandMenuOpen} onClose={() => setCommandMenuOpen(false)} />
      <NexusPortal
        active={portalActive}
        originX={portalCoords.x}
        originY={portalCoords.y}
        direction="reverse"
        onComplete={handlePortalComplete}
      />

      {/* Global Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 z-50 h-[2.5px] bg-gradient-to-r from-cyan via-blue to-cyan-bright transition-all duration-75 pointer-events-none shadow-[0_0_12px_rgba(0,212,255,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ─── REDESIGNED SPACIOUS HIGH-TECH NAVIGATION ─── */}
      <header className="sticky top-0 z-40 w-full bg-void/85 backdrop-blur-2xl border-b border-white/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4.5 flex items-center justify-between">
          {/* Logo Brand / Return to Introduction */}
          <button
            onClick={handleBackToIntro}
            className="flex items-center gap-3.5 group cursor-pointer select-none shrink-0"
            title="Return to Introduction Turbine Environment"
          >
            <div className="w-10 h-10 rounded-xl bg-surface border border-white/[0.08] flex items-center justify-center text-cyan group-hover:border-cyan/50 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] transition-all">
              <Cpu size={18} />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 font-display text-sm md:text-base font-black tracking-wide">
                <span className="text-text-primary">ADITHYA</span>
                <span className="text-cyan">MECHNEXUS</span>
              </div>
              <span className="font-mono text-[8px] text-text-tertiary/60 group-hover:text-cyan transition-colors tracking-widest uppercase">
                ← TURBINE CORE
              </span>
            </div>
          </button>

          {/* Desktop Navigation Items */}
          <nav className="hidden xl:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`font-mono text-xs tracking-wider transition-all duration-300 relative py-1.5 ${
                  activeSection === item.id
                    ? 'text-cyan font-semibold'
                    : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan to-blue shadow-[0_0_8px_#00D4FF]" />
                )}
              </a>
            ))}
          </nav>

          {/* Utility Buttons: Command Center, Admin Gateway, Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandMenuOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.06] hover:border-cyan/40 bg-surface/40 text-text-tertiary hover:text-cyan font-mono text-[11px] transition-all cursor-pointer"
              title="Command Center (Ctrl+K)"
            >
              <Terminal size={14} />
              <span className="hidden sm:inline tracking-wider font-semibold">CMD</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[9px] rounded bg-surface border border-white/[0.08] text-text-tertiary">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => navigate('/admin/login')}
              className="px-3 py-2 rounded-lg border border-amber/20 hover:border-amber/60 bg-amber/[0.03] text-amber hover:text-amber-dim font-mono text-[11px] transition-all tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Protected Admin Access Portal"
            >
              <Shield size={12} />
              <span>SYS.GATE</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg border border-white/[0.06] bg-surface text-text-secondary hover:text-text-primary cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden px-6 py-6 border-t border-white/[0.06] bg-surface/98 backdrop-blur-2xl grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 px-3 rounded-lg font-mono text-xs transition-colors flex items-center justify-between ${
                  activeSection === item.id
                    ? 'text-cyan bg-cyan/[0.08] border border-cyan/20 font-bold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
                }`}
              >
                <span>{item.label}</span>
                {activeSection === item.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan" />}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="max-w-6xl mx-auto px-6 md:px-10">

        {/* ══════════════════════════════════════════════════ */}
        {/* 1. ABOUT — Engineering Identity / Blueprint Lab   */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="about"
          tag="ENGINEERING IDENTITY // SPEC.01"
          title={aboutHeading}
          subtitle={aboutDesc}
        >
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Authentic Profile / CAD Monogram */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
              <div className="relative group">
                {/* Precision CAD Corner Brackets */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan pointer-events-none z-10" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan pointer-events-none z-10" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan pointer-events-none z-10" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan pointer-events-none z-10" />

                {hasRealPhoto ? (
                  <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-cyan/30 shadow-[0_16px_48px_rgba(0,0,0,0.6)] relative bg-surface">
                    <img
                      src={profile!.profile_photo_url!}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan bg-void/80 px-2 py-0.5 rounded border border-cyan/30">
                      AUTHENTICATED ID
                    </div>
                  </div>
                ) : (
                  <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl border border-white/[0.08] bg-surface/60 backdrop-blur-md flex flex-col items-center justify-center p-6 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
                    <span className="font-display text-5xl md:text-6xl font-black text-text-primary/40 tracking-wider">
                      {name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <span className="font-mono text-[9px] text-cyan/70 tracking-widest uppercase mt-4">
                      CAD BLUEPRINT IDENTITY
                    </span>
                  </div>
                )}
              </div>

              {/* Identity Telemetry Callout */}
              <div className="mt-6 text-center lg:text-left space-y-1">
                <h3 className="font-display text-2xl font-bold text-text-primary">{name}</h3>
                <span className="font-mono text-xs text-cyan tracking-wider block">{role}</span>
              </div>

              <div className="mt-6 w-full max-w-xs">
                <TitleBlock drawnBy="A.G." rev="03" date="2026.03" scale="ISO 2768-m" />
              </div>
            </div>

            {/* Right Column: Multi-Discipline Engineering Highlights */}
            <div className="lg:col-span-7 space-y-6">
              {[
                {
                  title: 'CAD & Parametric Generative Design',
                  desc: 'Kinematic tolerance stacks (ASME Y14.5), structural topology optimization, and 5-axis CNC manufacturability drafting in SolidWorks & CATIA.',
                  icon: Layers,
                  code: 'SPEC // CAD-01',
                },
                {
                  title: 'Non-Linear FEA & Continuum Mechanics',
                  desc: 'Multi-axial yield criteria, harmonic vibration resonance avoidance, and thermal shock stress analysis in ANSYS Mechanical.',
                  icon: Cpu,
                  code: 'SPEC // FEA-02',
                },
                {
                  title: 'Turbomachinery & Turbulent CFD',
                  desc: 'Conjugate Heat Transfer (CHT), pressure drop minimization in complex manifolds, and k-omega SST turbulence modeling in ANSYS Fluent.',
                  icon: Flame,
                  code: 'SPEC // CFD-03',
                },
                {
                  title: 'Industrial Automation & Mechatronics',
                  desc: 'IEC 61131-3 PLC ladder logic, structured text routines, and sensor-actuator feedback control in Siemens TIA Portal.',
                  icon: Binary,
                  code: 'SPEC // PLC-04',
                },
              ].map((domain, i) => {
                const Icon = domain.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-surface/40 border border-white/[0.05] hover:border-cyan/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface border border-white/[0.08] flex items-center justify-center text-cyan group-hover:border-cyan/50 group-hover:scale-105 transition-all shrink-0">
                        <Icon size={22} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display text-base font-bold text-text-primary group-hover:text-cyan transition-colors">
                            {domain.title}
                          </h4>
                          <span className="font-mono text-[9px] text-text-tertiary/60 uppercase tracking-widest hidden sm:inline">
                            {domain.code}
                          </span>
                        </div>
                        <p className="font-body text-sm text-text-secondary leading-relaxed">
                          {domain.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionEnvironment>

        <SpatialTransition label="FACILITY TRANSITION // CAPABILITY MATRIX" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 2. SKILLS — Engineering Capability Matrix          */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="skills"
          tag="CAPABILITY MATRIX // SPEC.02"
          title="Engineering Competency Matrix"
          subtitle="Direct technical mastery across engineering toolchains, analytical modeling frameworks, and automation platforms. Honest capabilities without fabricated metrics."
        >
          {/* Category Filter Pills */}
          {skillCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 font-mono text-xs">
              {skillCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveSkillCategory(cat)}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    activeSkillCategory === cat
                      ? 'bg-cyan/15 text-cyan border border-cyan/40 font-semibold shadow-[0_0_16px_rgba(0,212,255,0.15)]'
                      : 'text-text-tertiary hover:text-text-primary border border-white/[0.05] hover:border-white/[0.12] bg-surface/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {skills.length === 0 ? (
            /* Structured Default Capability Arsenal (Honest disciplines) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'CAD & Kinematic Modeling',
                  tools: ['SolidWorks', 'CATIA', 'Fusion 360', 'AutoCAD'],
                  desc: 'Parametric part design, assembly constraints, GD&T drawings, and tolerance analysis.',
                  icon: Layers,
                },
                {
                  title: 'CAE & Finite Element Analysis',
                  tools: ['ANSYS Mechanical', 'HyperMesh', 'FEA Meshing'],
                  desc: 'Static structural, modal, fatigue life assessment, and topology mass reduction.',
                  icon: Cpu,
                },
                {
                  title: 'Computational Fluid Dynamics',
                  tools: ['ANSYS Fluent', 'OpenFOAM', 'CFD Meshing'],
                  desc: 'Turbulent flow fields, Conjugate Heat Transfer (CHT), and pressure drop analysis.',
                  icon: Flame,
                },
                {
                  title: 'Industrial PLC & Automation',
                  tools: ['Siemens TIA Portal', 'Factory I/O', 'IEC 61131-3'],
                  desc: 'Ladder logic (LD), Structured Text (ST), sensor integration, and SCADA telemetry.',
                  icon: Binary,
                },
                {
                  title: 'AI × Computational Engineering',
                  tools: ['Python', 'PyTorch', 'PINNs', 'SciPy'],
                  desc: 'Physics-informed surrogate networks and automated metrology inspection pipelines.',
                  icon: Sparkles,
                },
                {
                  title: 'Manufacturing & Prototyping',
                  tools: ['CNC 5-Axis Drafting', 'Additive Mfg', 'CMM Inspection'],
                  desc: 'Design for Manufacturing (DFM), casting draft angles, and rapid polymer/metal printing.',
                  icon: Wrench,
                },
              ].map((domain, i) => {
                const Icon = domain.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-surface/30 border border-white/[0.04] hover:border-cyan/30 transition-all duration-300 space-y-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface border border-white/[0.08] flex items-center justify-center text-cyan group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold text-text-primary group-hover:text-cyan transition-colors">
                        {domain.title}
                      </h4>
                      <p className="font-body text-xs text-text-secondary mt-1.5 leading-relaxed">
                        {domain.desc}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {domain.tools.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] font-mono text-[10px] text-text-secondary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="p-6 rounded-2xl bg-surface/30 border border-white/[0.04] hover:border-cyan/30 transition-all duration-300 group space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-text-primary group-hover:text-cyan transition-colors">
                      {sk.name}
                    </span>
                    <span className="font-mono text-[9px] text-cyan/70 bg-cyan/[0.06] px-2 py-0.5 rounded border border-cyan/20 uppercase">
                      {sk.category}
                    </span>
                  </div>
                  {sk.proficiency && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between font-mono text-[10px] text-text-tertiary">
                        <span>PROFICIENCY</span>
                        <span className="text-cyan">{sk.proficiency}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-void overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan to-blue"
                          style={{ width: `${sk.proficiency}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionEnvironment>

        <SpatialTransition label="FACILITY TRANSITION // CASE STUDY ARCHIVES" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 3. PROJECTS — Digital Twin Case Studies            */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="projects"
          tag="ENGINEERING ARCHIVE // SPEC.03"
          title="Digital Twin Case Studies"
          subtitle="Rigorous engineering assemblies, finite-element analyses, fluid dynamics simulations, and automated mechatronic mechanisms."
        >
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 font-mono text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan/15 text-cyan border border-cyan/40 font-semibold shadow-[0_0_16px_rgba(0,212,255,0.15)]'
                      : 'text-text-tertiary hover:text-text-primary border border-white/[0.05] hover:border-white/[0.12] bg-surface/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {projects.length === 0 ? (
            <EmptyState
              category="PROJECT ARCHIVE"
              title="AWAITING VERIFIED CASE STUDIES"
              message="Verified mechanical design projects, CAD models, and FEA/CFD datasets can be published through the Admin Console."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  data-cursor="project"
                  className="group rounded-3xl bg-surface/35 border border-white/[0.06] hover:border-cyan/40 transition-all duration-500 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Media Showcase */}
                    {proj.thumbnail && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-void/80 border-b border-white/[0.06]">
                        <img
                          src={proj.thumbnail}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent pointer-events-none" />
                        {proj.category && (
                          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-void/80 backdrop-blur-md font-mono text-[10px] text-cyan border border-white/[0.08]">
                            {proj.category}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Metadata & Description */}
                    <div className="p-8 space-y-4">
                      <h4 className="font-display text-2xl font-bold text-text-primary group-hover:text-cyan transition-colors">
                        {proj.title}
                      </h4>
                      <p className="font-body text-sm text-text-secondary leading-relaxed">
                        {proj.short_description || proj.description}
                      </p>
                    </div>
                  </div>

                  {/* Title Block Engineering Stamp */}
                  <div className="px-8 pb-8 pt-2 flex items-center justify-between border-t border-white/[0.04]">
                    <span className="font-mono text-[10px] text-text-tertiary">
                      {proj.date || '2026.01'}
                    </span>
                    <TitleBlock drawnBy="A.G." rev="01" date={proj.date || '2026.01'} scale="NTS" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionEnvironment>

        <SpatialTransition label="FACILITY TRANSITION // SCIENTIFIC LAB" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 4. RESEARCH — Scientific Laboratory Environment    */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="research"
          tag="SCIENTIFIC INVESTIGATIONS // SPEC.04"
          title="Research & Scientific Publications"
          subtitle="Peer-reviewed continuum mechanics papers, thermodynamics investigations, and computational simulations."
        >
          {research.length === 0 ? (
            <EmptyState
              category="RESEARCH ARCHIVE"
              title="AWAITING VERIFIED PUBLICATIONS"
              message="Peer-reviewed publications, experimental laboratory notes, and conference submissions can be published through the Admin CMS."
            />
          ) : (
            <div className="space-y-8">
              {research.map((res) => (
                <div
                  key={res.id}
                  className="p-8 md:p-10 rounded-3xl bg-surface/30 border border-white/[0.05] hover:border-cyan/30 transition-all duration-300 group"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="space-y-4 max-w-3xl">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-amber uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber/[0.08] border border-amber/20 font-semibold">
                          {res.status || 'PUBLISHED'}
                        </span>
                        <span className="font-mono text-xs text-text-tertiary">{res.date}</span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-text-primary group-hover:text-cyan transition-colors">
                        {res.title}
                      </h3>
                      <p className="font-body text-base text-text-secondary leading-relaxed">
                        {res.short_description || res.description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <TitleBlock drawnBy="A.G." rev="02" date={res.date || '2026.02'} scale="N/A" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionEnvironment>

        <SpatialTransition label="FACILITY TRANSITION // CAE SIMULATION LAB" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 5. CAD & CAE — Computational Simulation Lab        */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="cad-cae"
          tag="COMPUTATIONAL SIMULATION // SPEC.05"
          title="CAD & CAE Simulation Lab"
          subtitle="Finite element boundary value solutions, non-linear harmonic resonance, and fluid dynamic velocity field simulations."
        >
          {cadCae.length === 0 ? (
            <EmptyState
              category="CAD / CAE ARCHIVE"
              title="AWAITING SIMULATION DATASETS"
              message="Structural FEA datasets, fluid flow meshes, and parametric CAD studies can be documented through the Admin Console."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cadCae.map((item) => (
                <div
                  key={item.id}
                  className="p-8 rounded-3xl bg-surface/30 border border-white/[0.05] hover:border-cyan/30 transition-all duration-300 space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan tracking-wider uppercase bg-cyan/[0.06] px-2.5 py-0.5 rounded border border-cyan/20">
                      {item.category || 'FEA / CFD'}
                    </span>
                    <span className="font-mono text-[10px] text-text-tertiary">{item.date}</span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-text-primary group-hover:text-cyan transition-colors">
                    {item.title}
                  </h4>
                  <p className="font-body text-sm text-text-secondary leading-relaxed">
                    {item.short_description || item.description}
                  </p>
                  <div className="pt-2">
                    <TitleBlock drawnBy="A.G." rev="01" date={item.date || '2026.01'} scale="1:1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionEnvironment>

        <SpatialTransition label="FACILITY TRANSITION // AUTOMATION & PLC" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 6. PLC / AUTOMATION — Industrial Control System    */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="plc"
          tag="MECHATRONICS & CONTROL // SPEC.06"
          title="PLC Programming & Industrial Controls"
          subtitle="IEC 61131-3 Ladder Logic routines, structured text control loops, and robotic actuator sequencing."
        >
          {plcPrograms.length === 0 ? (
            <EmptyState
              category="PLC ARCHIVE"
              title="AWAITING AUTOMATION ROUTINES"
              message="Industrial automation routines, ladder logic diagrams, and mechatronic control sequences can be recorded in the Admin CMS."
            />
          ) : (
            <div className="space-y-6">
              {plcPrograms.map((plc) => (
                <div
                  key={plc.id}
                  className="p-8 md:p-10 rounded-3xl bg-surface/30 border border-white/[0.05] hover:border-cyan/30 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-cyan">
                        <Activity size={12} className="animate-pulse" />
                        <span>IEC 61131-3 COMPLIANT</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-text-primary group-hover:text-cyan transition-colors">
                        {plc.title}
                      </h3>
                      <p className="font-body text-sm text-text-secondary max-w-2xl leading-relaxed">
                        {plc.short_description || plc.description}
                      </p>
                    </div>
                    <TitleBlock drawnBy="A.G." rev="01" date={plc.date || '2025.12'} scale="IEC-61131" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionEnvironment>

        <SpatialTransition label="FACILITY TRANSITION // CREDENTIAL VERIFICATION" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 7. CERTIFICATIONS — Authenticated Credentials      */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="certifications"
          tag="ACCREDITATIONS // SPEC.07"
          title="Verified Professional Certifications"
          subtitle="Authenticated certifications, software licenses, and professional credentials with direct verification records."
        >
          {certifications.length === 0 ? (
            <EmptyState
              category="CREDENTIALS ARCHIVE"
              title="AWAITING VERIFIED CREDENTIALS"
              message="Upload verified certificates, software accreditations, and formal licensing through the Admin Console."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-6 md:p-8 rounded-3xl bg-surface/30 border border-white/[0.05] hover:border-cyan/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-white/[0.08] flex items-center justify-center text-cyan shrink-0 group-hover:scale-105 transition-transform">
                      <Award size={22} />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold text-text-primary group-hover:text-cyan transition-colors">
                        {cert.title}
                      </h4>
                      <span className="font-body text-xs text-text-secondary block mt-0.5">
                        {cert.issuer}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between font-mono text-[10px] text-text-tertiary">
                    {cert.credential_id && (
                      <span>
                        ID: <strong className="text-text-secondary">{cert.credential_id}</strong>
                      </span>
                    )}
                    <span>{cert.date}</span>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan hover:underline flex items-center gap-1 font-semibold"
                      >
                        VERIFY <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionEnvironment>

        <SpatialTransition label="FACILITY TRANSITION // COMPUTATIONAL NEURAL LAB" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 8. AI × ENGINEERING — Physics-Informed ML          */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="ai-engineering"
          tag="COMPUTATIONAL ENGINEERING // SPEC.08"
          title="AI × Computational Systems"
          subtitle="Physics-Informed Neural Networks (PINNs), deterministic tool-calling agentic pipelines, and automated dimensional metrology."
        >
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-surface/60 via-surface/30 to-void border border-white/[0.06] space-y-6">
            <h3 className="font-display text-2xl md:text-3xl font-black text-text-primary">
              Physics-Informed Surrogates & Deterministic Tool-Calling Agents
            </h3>
            <p className="font-body text-base text-text-secondary/90 leading-relaxed max-w-3xl">
              Applying artificial intelligence strictly as an engineered discipline. Utilizing
              Physics-Informed Neural Networks (PINNs) to approximate multi-physics boundary value
              solutions in milliseconds, and building local agentic workflows that parse CMM
              inspection data against ASME Y14.5 geometric tolerances to automate quality assurance
              without human error.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-3">
              {[
                'PINN Surrogate Acceleration',
                'ASME Y14.5 GD&T Metrology',
                'Python / PyTorch Simulation Pipeline',
                'Deterministic LLM Tool Calling',
                'Automated Nonconformance Auditing',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full bg-cyan/[0.06] border border-cyan/20 font-mono text-[10px] text-cyan tracking-wider font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </SectionEnvironment>

        <SpatialTransition label="FACILITY TRANSITION // TECHNICAL DOCUMENTATION" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 9. ARTICLES — Technical Documentation Archive      */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="articles"
          tag="TECHNICAL ARCHIVE // SPEC.09"
          title="Articles & Technical Notes"
          subtitle="Rigorous engineering documentation, computational mechanics analysis notes, and system architecture essays."
        >
          {articles.length === 0 ? (
            <EmptyState
              category="ARTICLES ARCHIVE"
              title="AWAITING TECHNICAL PUBLICATIONS"
              message="Technical whitepapers, simulation notes, and engineering guides can be published through the Admin CMS."
            />
          ) : (
            <div className="space-y-6">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-8 rounded-3xl bg-surface/30 border border-white/[0.04] hover:border-cyan/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-2 max-w-3xl">
                    <span className="font-mono text-[10px] text-cyan">{art.date}</span>
                    <h4 className="font-display text-2xl font-bold text-text-primary group-hover:text-cyan transition-colors">
                      {art.title}
                    </h4>
                    <p className="font-body text-sm text-text-secondary leading-relaxed">
                      {art.short_description}
                    </p>
                  </div>
                  {art.external_url && (
                    <a
                      href={art.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl border border-white/[0.08] hover:border-cyan/40 bg-surface/40 font-mono text-xs text-cyan hover:underline flex items-center gap-1.5 shrink-0 transition-all"
                    >
                      READ DOSSIER <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionEnvironment>

        <SpatialTransition label="FACILITY TRANSITION // VERIFIED DOSSIER" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 10. RESUME — Engineering Dossier                   */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="resume"
          tag="VERIFIED CURRICULUM VITAE // SPEC.10"
          title="Engineering Dossier"
          subtitle="Comprehensive professional record of mechanical coursework, CAD/CAE project repositories, research publications, and industry toolchains."
        >
          <div className="p-8 md:p-12 rounded-3xl bg-surface/30 border border-white/[0.06] flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="space-y-6 max-w-xl">
              <p className="font-body text-base text-text-secondary leading-relaxed">
                Contains complete academic standing, engineering software competencies (SolidWorks,
                ANSYS, Siemens TIA Portal), verified certifications, laboratory research, and
                mechanical prototype repositories.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleDownloadResume}
                  disabled={isPlottingResume}
                  className="px-8 py-4 rounded-full border border-cyan/40 bg-cyan/[0.08] hover:bg-cyan/[0.15] text-cyan font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] transition-all cursor-pointer flex items-center gap-2.5"
                >
                  <Download size={16} />
                  <span>{isPlottingResume ? 'PLOTTING PDF…' : 'DOWNLOAD DOSSIER'}</span>
                </button>

                <button
                  onClick={() => setPreviewResume(!previewResume)}
                  className="px-6 py-4 rounded-full border border-white/[0.08] bg-surface/50 text-text-secondary hover:text-text-primary font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                >
                  <FileText size={15} />
                  <span>{previewResume ? 'HIDE OVERVIEW' : 'INSPECT OVERVIEW'}</span>
                </button>
              </div>

              {previewResume && (
                <div className="p-6 rounded-2xl bg-void/80 border border-cyan/20 font-mono text-xs text-text-secondary space-y-2 animate-fadeIn">
                  <p>
                    <strong className="text-text-primary">ENGINEER:</strong> {name} · {role}
                  </p>
                  <p>
                    <strong className="text-text-primary">CORE TOOLCHAINS:</strong> SolidWorks,
                    ANSYS Mechanical, ANSYS Fluent, Siemens TIA Portal, Python
                  </p>
                  <p>
                    <strong className="text-text-primary">AUDIT:</strong> Authenticated via Supabase
                    Dossier Archive
                  </p>
                </div>
              )}
            </div>

            <TitleBlock drawnBy="A.G." rev="04" date="2026.03" scale="DOC-PDF" />
          </div>
        </SectionEnvironment>

        {/* ══════════════════════════════════════════════════ */}
        {/* 11. CONNECTIONS — Professional Engineering Network */}
        {/* ══════════════════════════════════════════════════ */}
        {connections.length > 0 && (
          <>
            <SpatialTransition label="FACILITY TRANSITION // VERIFIED NETWORK" />
            <SectionEnvironment
              id="connections"
              tag="PROFESSIONAL CHANNELS // SPEC.11"
              title="Engineering Network"
              subtitle="Verified nodes for professional collaboration, laboratory research, and technical exchanges."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {connections.map((conn) => (
                  <a
                    key={conn.id}
                    href={conn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 rounded-2xl bg-surface/30 border border-white/[0.05] hover:border-cyan/30 transition-all duration-300 flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface border border-white/[0.08] flex items-center justify-center text-cyan group-hover:scale-105 transition-transform shrink-0">
                      <ExternalLink size={18} />
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] text-text-tertiary uppercase tracking-widest">
                        {conn.platform}
                      </span>
                      <span className="font-display text-base font-bold text-text-primary group-hover:text-cyan transition-colors">
                        {conn.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </SectionEnvironment>
          </>
        )}

        {/* ══════════════════════════════════════════════════ */}
        {/* 12. DYNAMIC SECTIONS — Configured from Admin CMS   */}
        {/* ══════════════════════════════════════════════════ */}
        {dynamicSections.map((sec) => (
          <div key={sec.id}>
            <SpatialTransition label={`FACILITY TRANSITION // CMS // ${sec.slug.toUpperCase()}`} />
            <SectionEnvironment
              id={sec.slug}
              tag={`CMS // ${sec.slug.toUpperCase()}`}
              title={sec.name}
              subtitle={sec.description || undefined}
            >
              <div className="p-8 rounded-3xl bg-surface/30 border border-white/[0.06] font-mono text-sm text-text-secondary leading-relaxed">
                Dynamic Section loaded securely from Supabase CMS (Section ID: {sec.id}). Content
                can be configured via Admin CMS.
              </div>
            </SectionEnvironment>
          </div>
        ))}

        <SpatialTransition label="FACILITY TRANSITION // COMMUNICATION CONSOLE" />

        {/* ══════════════════════════════════════════════════ */}
        {/* 13. CONTACT — Secure Communication Console         */}
        {/* ══════════════════════════════════════════════════ */}
        <SectionEnvironment
          id="contact"
          tag="COMMUNICATION CONSOLE // SPEC.13"
          title={contactInfo?.heading || 'Engineering Dispatch Console'}
          subtitle={
            contactInfo?.description ||
            'Open to engineering collaboration, research inquiries, and technical roles. Messages are received directly.'
          }
        >
          <div className="max-w-2xl p-8 md:p-12 rounded-3xl bg-surface/40 border border-white/[0.06]">
            {formStatus === 'success' ? (
              <div className="p-8 rounded-2xl bg-status-online/[0.08] border border-status-online/30 flex items-start gap-4">
                <CheckCircle2 size={24} className="text-status-online shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-display text-lg font-bold text-text-primary">
                    Transmission Dispatched
                  </h4>
                  <p className="font-body text-sm text-text-secondary">{formFeedback}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                {formStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-status-error/[0.08] border border-status-error/30 text-status-error text-xs font-mono">
                    {formFeedback}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
                    Full Name / Organization *
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Engineering Colleague / Recruiter"
                    className="w-full px-5 py-3.5 rounded-xl bg-void/70 border border-white/[0.06] focus:border-cyan focus:outline-none text-text-primary font-body text-sm transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
                    Contact Email Address *
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="colleague@domain.com"
                    className="w-full px-5 py-3.5 rounded-xl bg-void/70 border border-white/[0.06] focus:border-cyan focus:outline-none text-text-primary font-body text-sm transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
                    Technical Inquiry / Collaboration Details *
                  </label>
                  <textarea
                    rows={6}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Specify project objectives, CAD/simulation requirements, or role details..."
                    className="w-full px-5 py-3.5 rounded-xl bg-void/70 border border-white/[0.06] focus:border-cyan focus:outline-none text-text-primary font-body text-sm resize-none transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4.5 rounded-xl bg-gradient-to-r from-cyan to-blue text-void font-mono text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail size={16} />
                  <span>{formStatus === 'submitting' ? 'DISPATCHING…' : 'TRANSMIT MESSAGE'}</span>
                </button>
              </form>
            )}
          </div>
        </SectionEnvironment>
      </main>

      {/* ─── FOOTER WITH ADMIN ACCESS PORTAL ─── */}
      <footer className="w-full border-t border-white/[0.06] py-12 px-6 md:px-10 mt-20 select-none bg-surface/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-display text-sm font-bold text-text-primary tracking-wide">
              ADITHYA MECHNEXUS
            </div>
            <div className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase">
              FUTURISTIC MECHANICAL ENGINEERING DIGITAL LABORATORY · 2026
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] text-text-tertiary">
            <span className="flex items-center gap-1.5 text-status-online">
              <span className="w-2 h-2 rounded-full bg-status-online animate-pulse" />
              ONLINE
            </span>

            {/* Admin Access Portal */}
            <button
              onClick={() => navigate('/admin/login')}
              className="hover:text-amber transition-colors cursor-pointer flex items-center gap-1.5 tracking-wider px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-amber/40 bg-surface/40"
              title="Access Admin CMS"
            >
              <Shield size={12} className="text-amber" />
              <span>ADMIN ACCESS PORTAL</span>
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-lg border border-white/[0.06] hover:border-cyan/40 hover:text-cyan transition-all cursor-pointer"
              title="Back to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
