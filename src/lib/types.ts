/* ═══════════════════════════════════════════
   V12 PORTFOLIO — TYPE DEFINITIONS
   ═══════════════════════════════════════════ */

// ─── Profile ───
export interface Profile {
  id: string;
  name: string;
  role: string;
  tagline: string;
  secondary_tagline?: string;
  short_description: string;
  about_heading?: string;
  about_description?: string;
  discipline?: string;
  focus_areas?: string;
  biography?: string;
  philosophy?: string;
  technical_labels?: string;
  profile_photo_url?: string;
  profile_photo_enabled: boolean;
  email?: string;
  phone?: string;
  location?: string;
  resume_url?: string;
  resume_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Site Settings ───
export interface SiteSettings {
  id: string;
  // Background
  background_preset: BackgroundPreset;
  animation_enabled: boolean;
  particles_enabled: boolean;
  grid_enabled: boolean;
  energy_lines_enabled: boolean;
  holographic_rings_enabled: boolean;
  scanning_enabled: boolean;
  mouse_parallax_enabled: boolean;
  animation_speed: 'low' | 'medium' | 'high';
  particle_density: 'low' | 'medium' | 'high';
  glow_intensity: 'low' | 'medium' | 'high';
  mobile_animation_enabled: boolean;
  // 3D Scene
  scene_enabled: boolean;
  scene_quality: QualityLevel;
  scene_auto_rotate: boolean;
  scene_interaction_enabled: boolean;
  twin_default_state?: string;
  // Intro & Brand Specifications
  intro_primary_btn_text: string;
  intro_primary_btn_link: string;
  intro_secondary_btn_text: string;
  intro_secondary_btn_link: string;
  intro_title?: string;
  intro_brand?: string;
  intro_subtitle?: string;
  intro_status_text?: string;
  intro_spec_text?: string;
  section_visibility?: Record<string, boolean>;
  navigation_labels?: Record<string, string>;
  navigation_order?: string[];
  updated_at: string;
}

export type BackgroundPreset =
  | 'cyber-grid'
  | 'mechanical-blueprint'
  | 'particle-field'
  | 'holographic-interface'
  | 'digital-circuit'
  | 'engineering-hud'
  | 'custom';

export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';

// ─── Portfolio Section ───
export interface PortfolioSection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  cover_image?: string;
  enabled: boolean;
  visible_in_navigation: boolean;
  navigation_order: number;
  content_type: SectionContentType;
  created_at: string;
  updated_at: string;
}

export type SectionContentType = 'grid' | 'list' | 'timeline' | 'gallery' | 'document';

// ─── Section Item ───
export interface SectionItem {
  id: string;
  section_id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  date?: string;
  category?: string;
  tags?: string[];
  software?: string[];
  engineering_domain?: string;
  thumbnail?: string;
  featured: boolean;
  enabled: boolean;
  display_order: number;
  external_links?: ExternalLink[];
  github_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalLink {
  label: string;
  url: string;
  icon?: string;
}

// ─── Section Item Media ───
export interface SectionItemMedia {
  id: string;
  item_id: string;
  url: string;
  type: MediaType;
  filename: string;
  size?: number;
  display_order: number;
  caption?: string;
  created_at: string;
}

export type MediaType = 'image' | 'video' | 'pdf' | 'document';

// ─── Project ───
export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  date?: string;
  category?: string;
  tags?: string[];
  software?: string[];
  engineering_domain?: string;
  thumbnail?: string;
  featured: boolean;
  enabled: boolean;
  display_order: number;
  external_links?: ExternalLink[];
  github_url?: string;
  created_at: string;
  updated_at: string;
}

// ─── Project Media ───
export interface ProjectMedia {
  id: string;
  project_id: string;
  url: string;
  type: MediaType;
  filename: string;
  size?: number;
  display_order: number;
  caption?: string;
  created_at: string;
}

// ─── Research ───
export interface Research {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  date?: string;
  status?: 'ongoing' | 'completed' | 'published' | 'draft';
  category?: string;
  tags?: string[];
  software?: string[];
  thumbnail?: string;
  featured: boolean;
  enabled: boolean;
  display_order: number;
  external_links?: ExternalLink[];
  created_at: string;
  updated_at: string;
}

// ─── CAD & CAE ───
export interface CadCae {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  date?: string;
  category?: string;
  tags?: string[];
  software?: string[];
  engineering_details?: string;
  thumbnail?: string;
  featured: boolean;
  enabled: boolean;
  display_order: number;
  external_links?: ExternalLink[];
  created_at: string;
  updated_at: string;
}

// ─── PLC Program ───
export interface PlcProgram {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  date?: string;
  category?: string;
  tags?: string[];
  software?: string[];
  thumbnail?: string;
  featured: boolean;
  enabled: boolean;
  display_order: number;
  external_links?: ExternalLink[];
  created_at: string;
  updated_at: string;
}

// ─── AI × Engineering ───
export interface AiEngineering {
  id: string;
  title: string;
  slug?: string;
  short_description?: string;
  description?: string;
  ai_methods?: string;
  engineering_domain?: string;
  tools?: string[];
  software?: string[];
  thumbnail?: string;
  external_links?: ExternalLink[];
  featured?: boolean;
  enabled: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Certification ───
export interface Certification {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  credential_id?: string;
  credential_url?: string;
  file_url?: string;
  thumbnail?: string;
  enabled: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Skill ───
export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
  icon?: string;
  enabled: boolean;
  display_order: number;
  created_at: string;
}

// ─── Article ───
export interface Article {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  content?: string;
  date?: string;
  tags?: string[];
  thumbnail?: string;
  published: boolean;
  enabled: boolean;
  display_order: number;
  external_url?: string;
  created_at: string;
  updated_at: string;
}

// ─── Connection ───
export interface Connection {
  id: string;
  name: string;
  platform: string;
  url: string;
  icon?: string;
  description?: string;
  enabled: boolean;
  display_order: number;
  created_at: string;
}

// ─── Contact Info ───
export interface ContactInfo {
  id: string;
  heading?: string;
  description?: string;
  email?: string;
  phone?: string;
  location?: string;
  updated_at: string;
}

// ─── Navigation Item ───
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  order: number;
  isDynamic: boolean;
}

// ─── Device Quality Detection ───
export interface DeviceCapabilities {
  quality: QualityLevel;
  isMobile: boolean;
  isTablet: boolean;
  supportsWebGL: boolean;
  prefersReducedMotion: boolean;
  gpuTier: number;
  pixelRatio: number;
}

// ─── Toast Notification ───
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// ─── Confirm Dialog ───
export interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

// ─── 3D Scene State ───
export type SceneViewState = 'wireframe' | 'xray' | 'metallic' | 'blueprint';

export interface SceneConfig {
  viewState: SceneViewState;
  autoRotate: boolean;
  inspectionMode: boolean;
  explodedView: boolean;
  blueprintMode: boolean;
  selectedComponent: string | null;
}
