import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchProfile,
  updateProfile,
  insertItem,
} from '@/lib/portfolioService';
import type { Profile } from '@/lib/types';
import { PORTFOLIO_IDENTITY } from '@/lib/constants';
import {
  User,
  Save,
  CheckCircle2,
  AlertCircle,
  Camera,
  Layers,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function AdminProfile() {
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: PORTFOLIO_IDENTITY.name,
    role: PORTFOLIO_IDENTITY.role,
    tagline: PORTFOLIO_IDENTITY.tagline,
    secondary_tagline: PORTFOLIO_IDENTITY.secondaryTagline,
    short_description: PORTFOLIO_IDENTITY.shortDescription,
    about_description: '',
    discipline: 'Mechanical Engineering',
    focus_areas: 'CAD / CAE / CFD / Thermal / Automation / AI × Engineering',
    technical_labels: 'ASME Y14.5 · FEA · CFD · CHT · PLC',
    email: '',
    phone: '',
    location: 'India',
    profile_photo_enabled: true,
  });

  const [initialData, setInitialData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    fetchProfile().then(({ data }) => {
      if (mounted) {
        if (data) {
          setProfile(data);
          setInitialData(JSON.stringify(data));
        }
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const hasUnsavedChanges = JSON.stringify(profile) !== initialData;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (profile.id) {
        const { success, error } = await updateProfile(profile.id, profile);
        if (!success) throw new Error(error || 'Failed to update profile');
      } else {
        const { data, error } = await insertItem('profiles', profile);
        if (error) throw new Error(error);
        if (data) setProfile(data);
      }
      setInitialData(JSON.stringify(profile));
      setFeedback({
        type: 'success',
        message: 'PROFILE SPECIFICATIONS COMMITTED // Updated in database & synced live.',
      });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Save operation encountered an error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('REVERT CHANGES // Discard uncommitted changes to profile?')) {
      if (initialData) {
        setProfile(JSON.parse(initialData));
      }
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-mono text-[var(--color-cyan)] tracking-wider">
          LOADING PROFILE SPECIFICATIONS...
        </span>
      </div>
    );
  }

  const name = profile.name || PORTFOLIO_IDENTITY.name;
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>PERSONA CONFIGURATION</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
            Edit Profile
          </h1>
          <p className="text-xs text-[var(--color-silver)] mt-1">
            Maintain your professional persona, titles, discipline, location, and the introductory biography text displayed beside your profile photo.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/admin/profile-photo"
            className="eng-btn eng-btn-secondary !text-xs !py-2 !px-3"
            title="Open Dedicated Profile Photo Manager"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>PHOTO MANAGER</span>
          </Link>
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="eng-btn eng-btn-ghost !text-xs !py-2 !px-3 text-amber hover:text-amber-dim"
              title="Discard changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REVERT</span>
            </button>
          )}
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs font-mono text-amber-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
          <span>UNCOMMITTED CHANGES // Save your updates to propagate to the public portfolio.</span>
        </div>
      )}

      {feedback && (
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Visual Identity Card Preview */}
      <div className="eng-card p-6 border-l-2 border-l-[var(--color-cyan)] bg-surface/50">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/[0.1] bg-void flex items-center justify-center shrink-0 shadow-lg">
            {profile.profile_photo_enabled && profile.profile_photo_url ? (
              <img
                src={profile.profile_photo_url}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <span className="font-display text-2xl font-bold text-white/50">{initials}</span>
                <span className="block font-mono text-[7px] text-[var(--color-cyan)] mt-1">CAD MONOGRAM</span>
              </div>
            )}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-display text-xl font-bold text-white">{name}</h2>
              <span className="px-2 py-0.5 rounded bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/25 text-[var(--color-cyan)] font-mono text-[9px] uppercase tracking-wider">
                {profile.role || 'Mechanical Engineer'}
              </span>
            </div>
            <p className="text-xs text-[var(--color-silver)] font-body max-w-xl">
              {profile.short_description || 'No introductory biography configured.'}
            </p>
            <div className="text-[10px] font-mono text-text-tertiary pt-1">
              <span>LOCATION: {profile.location || 'India'}</span>
              <span className="mx-2">·</span>
              <span>PHOTO: {profile.profile_photo_enabled && profile.profile_photo_url ? 'ACTIVE' : 'CAD MONOGRAM'}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Profile Fields */}
        <div className="eng-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <User className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Personal Identity & Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                FULL NAME *
              </label>
              <input
                type="text"
                required
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Adithya G"
                className="eng-input font-display font-semibold"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                PROFESSIONAL TITLE / ROLE *
              </label>
              <input
                type="text"
                required
                value={profile.role || ''}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                placeholder="Mechanical Engineering Student"
                className="eng-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                PRIMARY ENGINEERING DISCIPLINE
              </label>
              <input
                type="text"
                value={profile.discipline || 'Mechanical Engineering'}
                onChange={(e) => setProfile({ ...profile, discipline: e.target.value })}
                placeholder="Mechanical Engineering"
                className="eng-input"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                GEOGRAPHIC LOCATION
              </label>
              <input
                type="text"
                value={profile.location || 'India'}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="India"
                className="eng-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              FOCUS AREAS SPECIFICATION
            </label>
            <input
              type="text"
              value={profile.focus_areas || ''}
              onChange={(e) => setProfile({ ...profile, focus_areas: e.target.value })}
              placeholder="CAD / CAE / CFD / Thermal / Automation / AI × Engineering"
              className="eng-input font-mono text-xs"
            />
          </div>
        </div>

        {/* Narrative & Paragraph Beside Photo */}
        <div className="eng-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <FileText className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Biography & Narrative Text Beside Profile Photo
            </h3>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[0.65rem] font-mono text-[var(--color-silver)] uppercase">
                PARAGRAPH NEAR PROFILE PHOTO (HERO SHORT DESCRIPTION)
              </label>
              <span className="text-[0.6rem] font-mono text-[var(--color-cyan)]">CRITICAL FIELD</span>
            </div>
            <textarea
              rows={4}
              required
              value={profile.short_description || ''}
              onChange={(e) => setProfile({ ...profile, short_description: e.target.value })}
              placeholder="Dedicated to advancing Mechanical Engineering at the nexus of CAD/CAE, computational simulation, industrial automation, and applied artificial intelligence."
              className="eng-input eng-textarea text-xs leading-relaxed"
            />
            <span className="text-[0.6rem] font-mono text-[var(--color-silver)] mt-1 block">
              This exact text appears prominently beside your profile photo on both Genesis and WorkHub pages.
            </span>
          </div>

          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              PRIMARY TAGLINE / SUMMARY
            </label>
            <input
              type="text"
              value={profile.tagline || ''}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              placeholder="Futuristic Mechanical Engineering Digital Laboratory"
              className="eng-input"
            />
          </div>

          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              SECONDARY TECHNICAL SPECIFICATION TAGLINE
            </label>
            <input
              type="text"
              value={profile.secondary_tagline || ''}
              onChange={(e) => setProfile({ ...profile, secondary_tagline: e.target.value })}
              placeholder="CAD · CAE · FEA · CFD · Thermal · Simulation · Automation · PLC · Robotics · AI × Engineering"
              className="eng-input font-mono text-xs"
            />
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="eng-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Sparkles className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Direct Contact Coordinates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                PRIMARY EMAIL
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="engineer@domain.com"
                className="eng-input"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                CONTACT NUMBER / TELEPHONE
              </label>
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91..."
                className="eng-input"
              />
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="eng-card p-4 flex items-center justify-between sticky bottom-4 z-20 shadow-2xl bg-surface/95 backdrop-blur-md">
          <div className="text-[0.65rem] font-mono text-[var(--color-silver)]">
            {hasUnsavedChanges ? (
              <span className="text-amber flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                MODIFICATIONS PENDING COMMIT
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                SYNCHRONIZED WITH DATABASE
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="eng-btn eng-btn-primary !px-6 !py-2.5 text-xs font-mono"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'COMMITTING PROFILE...' : 'SAVE PROFILE'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
