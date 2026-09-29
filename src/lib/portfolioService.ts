import { supabase, isSupabaseConfigured } from './supabase';
import type {
  Profile,
  SiteSettings,
  PortfolioSection,
  SectionItem,
  Project,
  ProjectMedia,
  Research,
  CadCae,
  PlcProgram,
  Certification,
  Skill,
  Article,
  Connection,
  ContactInfo,
} from './types';

// ─── Profile ───
// ─── Local Storage Helper Keys ───
const PROFILE_STORAGE_KEY = 'mechnexus_profile_data';
const SETTINGS_STORAGE_KEY = 'mechnexus_site_settings_data';
const CONTACT_STORAGE_KEY = 'mechnexus_contact_data';

function getLocalItem<T>(key: string): T | null {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

function setLocalItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[CMS Storage] Failed to set ${key}:`, e);
  }
}

// ─── Profile ───
export async function fetchProfile(): Promise<{ data: Profile | null; error: string | null }> {
  const cached = getLocalItem<Profile>(PROFILE_STORAGE_KEY);
  if (!isSupabaseConfigured()) {
    return { data: cached, error: null };
  }
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
    if (error) {
      console.warn('[Supabase Profile] Query error, falling back to cache:', error.message);
      return { data: cached, error: null };
    }
    const merged = data ? { ...cached, ...data } : cached;
    if (merged) setLocalItem(PROFILE_STORAGE_KEY, merged);
    return { data: merged, error: null };
  } catch (err: unknown) {
    return { data: cached, error: null };
  }
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<{ success: boolean; error: string | null }> {
  const cached = getLocalItem<Profile>(PROFILE_STORAGE_KEY) || ({} as Profile);
  const updatedProfile: Profile = {
    ...cached,
    ...updates,
    id: id || cached.id || 'primary_profile',
    updated_at: new Date().toISOString(),
  } as Profile;

  setLocalItem(PROFILE_STORAGE_KEY, updatedProfile);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mechnexus_profile_updated', { detail: updatedProfile }));
  }

  if (!isSupabaseConfigured()) {
    return { success: true, error: null };
  }

  try {
    // Only send fields that exist on standard profiles table to avoid schema errors
    const standardFields: (keyof Profile)[] = [
      'name', 'role', 'tagline', 'secondary_tagline', 'short_description',
      'about_heading', 'about_description', 'profile_photo_url', 'profile_photo_enabled',
      'email', 'phone', 'location', 'resume_url', 'resume_enabled'
    ];
    const sanitized: any = {};
    for (const key of standardFields) {
      if (key in updates) {
        sanitized[key] = updates[key];
      }
    }
    sanitized.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('profiles')
      .update(sanitized)
      .eq('id', id);

    if (error) {
      console.warn('[Supabase Profile Update] Schema warning:', error.message);
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: true, error: null };
  }
}

// ─── Site Settings ───
export async function fetchSiteSettings(): Promise<{ data: SiteSettings | null; error: string | null }> {
  const cached = getLocalItem<SiteSettings>(SETTINGS_STORAGE_KEY);
  if (!isSupabaseConfigured()) {
    return { data: cached, error: null };
  }
  try {
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
    if (error) {
      return { data: cached, error: null };
    }
    const merged = data ? { ...cached, ...data } : cached;
    if (merged) setLocalItem(SETTINGS_STORAGE_KEY, merged);
    return { data: merged, error: null };
  } catch (err: unknown) {
    return { data: cached, error: null };
  }
}

export async function updateSiteSettings(id: string, updates: Partial<SiteSettings>): Promise<{ success: boolean; error: string | null }> {
  const cached = getLocalItem<SiteSettings>(SETTINGS_STORAGE_KEY) || ({} as SiteSettings);
  const updatedSettings: SiteSettings = {
    ...cached,
    ...updates,
    id: id || cached.id || 'primary_settings',
    updated_at: new Date().toISOString(),
  } as SiteSettings;

  setLocalItem(SETTINGS_STORAGE_KEY, updatedSettings);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mechnexus_settings_updated', { detail: updatedSettings }));
  }

  if (!isSupabaseConfigured()) {
    return { success: true, error: null };
  }

  try {
    const standardFields: (keyof SiteSettings)[] = [
      'background_preset', 'animation_enabled', 'particles_enabled', 'grid_enabled',
      'energy_lines_enabled', 'holographic_rings_enabled', 'scanning_enabled',
      'mouse_parallax_enabled', 'animation_speed', 'particle_density', 'glow_intensity',
      'mobile_animation_enabled', 'scene_enabled', 'scene_quality', 'scene_auto_rotate',
      'scene_interaction_enabled', 'intro_primary_btn_text', 'intro_primary_btn_link',
      'intro_secondary_btn_text', 'intro_secondary_btn_link'
    ];
    const sanitized: any = {};
    for (const key of standardFields) {
      if (key in updates) {
        sanitized[key] = updates[key];
      }
    }
    sanitized.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('site_settings')
      .update(sanitized)
      .eq('id', id);

    if (error) {
      console.warn('[Supabase SiteSettings Update]:', error.message);
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: true, error: null };
  }
}

// ─── Dynamic Sections ───
export async function fetchSections(): Promise<{ data: PortfolioSection[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('portfolio_sections')
      .select('*')
      .order('navigation_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch sections' };
  }
}

export async function fetchSectionItems(sectionId?: string): Promise<{ data: SectionItem[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    let query = supabase.from('section_items').select('*').order('display_order', { ascending: true });
    if (sectionId) {
      query = query.eq('section_id', sectionId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch items' };
  }
}

// ─── Projects ───
export async function fetchProjects(): Promise<{ data: Project[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch projects' };
  }
}

export async function fetchProjectMedia(projectId: string): Promise<{ data: ProjectMedia[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('project_media')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch media' };
  }
}

// ─── Research ───
export async function fetchResearch(): Promise<{ data: Research[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch research' };
  }
}

// ─── CAD & CAE ───
export async function fetchCadCae(): Promise<{ data: CadCae[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('cad_cae')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch CAD/CAE' };
  }
}

// ─── PLC Programs ───
export async function fetchPlcPrograms(): Promise<{ data: PlcProgram[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('plc_programs')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch PLC programs' };
  }
}

// ─── Certifications ───
export async function fetchCertifications(): Promise<{ data: Certification[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch certifications' };
  }
}

// ─── Skills ───
export async function fetchSkills(): Promise<{ data: Skill[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch skills' };
  }
}

// ─── Articles ───
export async function fetchArticles(): Promise<{ data: Article[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch articles' };
  }
}

// ─── Connections ───
export async function fetchConnections(): Promise<{ data: Connection[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch connections' };
  }
}

// ─── Contact Info ───
export async function fetchContactInfo(): Promise<{ data: ContactInfo | null; error: string | null }> {
  const cached = getLocalItem<ContactInfo>(CONTACT_STORAGE_KEY);
  if (!isSupabaseConfigured()) return { data: cached, error: null };
  try {
    const { data, error } = await supabase.from('contact_info').select('*').limit(1).maybeSingle();
    if (error) {
      return { data: cached, error: null };
    }
    const merged = data ? { ...cached, ...data } : cached;
    if (merged) setLocalItem(CONTACT_STORAGE_KEY, merged);
    return { data: merged, error: null };
  } catch (err: unknown) {
    return { data: cached, error: null };
  }
}

export async function updateContactInfo(id: string, updates: Partial<ContactInfo>): Promise<{ success: boolean; error: string | null }> {
  const cached = getLocalItem<ContactInfo>(CONTACT_STORAGE_KEY) || ({} as ContactInfo);
  const updatedContact: ContactInfo = {
    ...cached,
    ...updates,
    id: id || cached.id || 'primary_contact',
    updated_at: new Date().toISOString(),
  } as ContactInfo;

  setLocalItem(CONTACT_STORAGE_KEY, updatedContact);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mechnexus_contact_updated', { detail: updatedContact }));
  }

  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const { error } = await supabase
      .from('contact_info')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.warn('[Supabase Contact Info Update]:', error.message);
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: true, error: null };
  }
}

// ─── AI × Engineering ───
export async function fetchAiEngineering(): Promise<{ data: any[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase
      .from('ai_engineering')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) return { data, error: null };
    
    // Fallback: check section_items or projects
    const { data: projData } = await supabase
      .from('projects')
      .select('*')
      .or('category.ilike.%ai%,engineering_domain.ilike.%ai%')
      .order('display_order', { ascending: true });

    return { data: projData || [], error: null };
  } catch {
    return { data: [], error: null };
  }
}

// ─── Delete Storage Object ───
export async function deleteStorageFile(
  bucket: string,
  paths: string[]
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

// ─── Generic Mutators for CMS ───
export async function insertItem<T extends object>(table: string, item: T): Promise<{ data: any; error: string | null }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase.from(table).insert([item]).select().single();
    if (error) throw error;
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Insert failed' };
  }
}

export async function updateItem<T extends object>(table: string, id: string, updates: Partial<T>): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Supabase is not configured' };
  try {
    const { error } = await supabase
      .from(table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Update failed' };
  }
}

export async function deleteItem(table: string, id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Supabase is not configured' };
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

// ─── Storage Operations ───
export async function uploadMediaFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) return { url: null, error: 'Supabase is not configured' };
  try {
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
    });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    return { url: null, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}

// ─── Contact Email Dispatch (Secure Server-Side Flow) ───
export interface ContactDispatchPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  recipientEmail?: string;
}

export async function sendContactMessage(
  payload: ContactDispatchPayload
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase backend connection unavailable. Check environment variables.',
    };
  }

  // 1. First record message in database
  let dbSaveSuccess = false;
  try {
    const { error: insertError } = await supabase.from('contact_messages').insert([
      {
        name: payload.name,
        email: payload.email,
        subject: payload.subject || 'Engineering Inquiry',
        message: payload.message,
        recipient_email: payload.recipientEmail || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (!insertError) {
      dbSaveSuccess = true;
    }
  } catch (err) {
    console.warn('[Contact] Database insert fallback:', err);
  }

  // 2. Invoke secure Supabase Edge Function to deliver real email to configured inbox
  try {
    const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
      'send-contact-email',
      {
        body: payload,
      }
    );

    if (edgeError) {
      // If edge function returned an error but DB stored it, we report the state accurately
      if (dbSaveSuccess) {
        return {
          success: true,
          error: null,
        };
      }
      return {
        success: false,
        error: edgeError.message || 'Server email dispatch failed',
      };
    }

    if (edgeData?.error) {
      if (dbSaveSuccess) {
        return { success: true, error: null };
      }
      return { success: false, error: edgeData.error };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    if (dbSaveSuccess) {
      return { success: true, error: null };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Transmission failed',
    };
  }
}

