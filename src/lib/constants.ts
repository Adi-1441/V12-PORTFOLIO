/* ═══════════════════════════════════════════════════════════
   ADITHYA MECHNEXUS — V15 CONSTANTS & DESIGN TOKENS
   ═══════════════════════════════════════════════════════════ */

import type { NavItem } from './types';

// ─── Portfolio Identity ───
export const PORTFOLIO_IDENTITY = {
  name: 'Adithya G',
  brandName: 'ADITHYA MECHNEXUS',
  role: 'Mechanical Engineering Student',
  tagline: 'Futuristic Mechanical Engineering Digital Laboratory',
  shortDescription:
    'Dedicated to advancing Mechanical Engineering at the nexus of CAD/CAE, computational simulation, industrial automation, and applied artificial intelligence.',
  secondaryTagline:
    'CAD · CAE · FEA · CFD · Thermal · Simulation · Automation · PLC · Robotics · AI × Engineering',
  ctaText: 'ADITHYA MECHNEXUS',
} as const;

// ─── Core Navigation (Static Sections) ───
export const CORE_NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', href: '#about', order: 1, isDynamic: false },
  { id: 'skills', label: 'Skills', href: '#skills', order: 2, isDynamic: false },
  { id: 'projects', label: 'Projects', href: '#projects', order: 3, isDynamic: false },
  { id: 'research', label: 'Research', href: '#research', order: 4, isDynamic: false },
  { id: 'cad-cae', label: 'CAD & CAE', href: '#cad-cae', order: 5, isDynamic: false },
  { id: 'plc', label: 'PLC', href: '#plc', order: 6, isDynamic: false },
  { id: 'certifications', label: 'Certifications', href: '#certifications', order: 7, isDynamic: false },
  { id: 'ai-engineering', label: 'AI × Engineering', href: '#ai-engineering', order: 8, isDynamic: false },
  { id: 'articles', label: 'Articles', href: '#articles', order: 9, isDynamic: false },
  { id: 'resume', label: 'Resume', href: '#resume', order: 10, isDynamic: false },
  { id: 'connections', label: 'Connections', href: '#connections', order: 11, isDynamic: false },
  { id: 'contact', label: 'Contact', href: '#contact', order: 12, isDynamic: false },
];

// ─── Engineering Disciplines ───
export const ENGINEERING_DOMAINS = [
  'Mechanical Design',
  'CAD',
  'CAE',
  'FEA',
  'CFD',
  'Thermal Engineering',
  'Automation',
  'PLC',
  'Robotics',
  'Research',
  'Manufacturing',
  'Engineering Simulation',
  'AI × Engineering',
] as const;

// ─── Engineering Software & Tools ───
export const SOFTWARE_LIST = [
  'SolidWorks',
  'CATIA',
  'AutoCAD',
  'Fusion 360',
  'ANSYS Mechanical',
  'ANSYS Fluent',
  'ANSYS Icepak',
  'MATLAB & Simulink',
  'Siemens TIA Portal',
  'Factory I/O',
  'Python (NumPy, SciPy, PyTorch)',
  'OpenFOAM',
] as const;

// ─── Upload & Storage Constants ───
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const MAX_IMAGE_SIZE_MB = 10;

export const STORAGE_PATHS = {
  profilePhoto: 'profile-photos',
  profilePhotos: 'profile-photos',
  resume: 'documents',
  documents: 'documents',
  projects: 'project-media',
  projectMedia: 'project-media',
  cadCae: 'cad-cae-media',
  cadCaeMedia: 'cad-cae-media',
  research: 'research-media',
  researchMedia: 'research-media',
  plc: 'plc-media',
  certificates: 'certificates',
  media: 'portfolio-media',
  articles: 'articles-media',
} as const;

// ─── Skill Categories ───
export const SKILL_CATEGORIES = [
  'CAD & 3D Modeling',
  'CAE & Simulation',
  'Thermal Engineering',
  'Automation & PLC',
  'AI × Engineering',
  'Manufacturing & Prototyping',
  'Programming & Computational',
] as const;

// ─── Background Presets ───
export const BACKGROUND_PRESETS = [
  { id: 'cyber-grid', label: 'Cyber Grid', description: 'Technical grid with precision coordinates' },
  { id: 'mechanical-blueprint', label: 'Mechanical Blueprint', description: 'CAD blueprint drafting grid' },
  { id: 'particle-field', label: 'Particle Field', description: 'Dynamic vector flow field' },
  { id: 'holographic-interface', label: 'Holographic Interface', description: 'HUD circles and sensor reticles' },
  { id: 'digital-circuit', label: 'Digital Circuit', description: 'Computational trace conduits' },
  { id: 'engineering-hud', label: 'Engineering HUD', description: 'Full digital laboratory telemetry' },
] as const;

// ─── V15 Engineering Color System Tokens ───
export const MECHNEXUS_COLORS = {
  void: '#07080B',
  surface: '#0F1117',
  elevated: '#171A23',
  elevatedHover: '#212533',
  steel: '#2B3042',
  titanium: '#424962',

  cyan: '#00D4FF',
  cyanDim: '#0099CC',
  cyanBright: '#38E1FF',

  blue: '#38BDF8',
  blueDim: '#0284C7',

  amber: '#F59E0B',
  amberDim: '#D97706',

  copper: '#D4844A',

  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',

  statusOnline: '#10B981',
  statusWarning: '#F59E0B',
  statusError: '#EF4444',
} as const;
