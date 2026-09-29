import { useState, useEffect } from 'react';
import {
  fetchProfile,
  updateProfile,
  uploadMediaFile,
  deleteStorageFile,
} from '@/lib/portfolioService';
import type { Profile } from '@/lib/types';
import { STORAGE_PATHS, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '@/lib/constants';
import {
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Shield,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export default function AdminProfilePhoto() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileDetails, setFileDetails] = useState<{
    name?: string;
    size?: string;
    dimensions?: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    fetchProfile().then(({ data }) => {
      if (mounted) {
        if (data) setProfile(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFeedback({
        type: 'error',
        message: 'INVALID FILE TYPE // Please provide a JPEG, PNG, WEBP, or SVG image.',
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setFeedback({
        type: 'error',
        message: `FILE TOO LARGE // Maximum permitted asset size is ${MAX_IMAGE_SIZE_MB}MB.`,
      });
      return;
    }

    // Read dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setFileDetails({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        dimensions: `${img.width} × ${img.height} px`,
      });
    };

    setUploading(true);
    setFeedback(null);

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${STORAGE_PATHS.profilePhoto}/avatar_${Date.now()}.${ext}`;
      const { url, error } = await uploadMediaFile('portfolio', path, file);

      if (error) throw new Error(error);

      if (url) {
        const updated = {
          ...profile,
          profile_photo_url: url,
          profile_photo_enabled: true,
        };
        setProfile(updated);
        await updateProfile(profile.id || 'primary_profile', updated);
        setFeedback({
          type: 'success',
          message: 'PROFILE PHOTO UPLOADED & ACTIVATED // Stored securely in Supabase Storage.',
        });
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Photo upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async () => {
    const newState = !profile.profile_photo_enabled;
    const updated = { ...profile, profile_photo_enabled: newState };
    setProfile(updated);
    setSaving(true);
    try {
      await updateProfile(profile.id || 'primary_profile', updated);
      setFeedback({
        type: 'success',
        message: newState
          ? 'PROFILE PHOTO DISPLAY ENABLED // Will render on public portfolio.'
          : 'PROFILE PHOTO DISABLED // Neutral engineering CAD monogram will display publicly.',
      });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update visibility status',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!profile.profile_photo_url) return;

    if (
      !confirm(
        'CONFIRM DELETION // Remove profile photo asset? The public site will revert to the precision CAD monogram.'
      )
    ) {
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      // Try deleting from storage if path can be extracted
      try {
        const urlObj = new URL(profile.profile_photo_url);
        const parts = urlObj.pathname.split('portfolio/');
        if (parts[1]) {
          await deleteStorageFile('portfolio', [parts[1]]);
        }
      } catch {
        // Continue
      }

      const updated = {
        ...profile,
        profile_photo_url: '',
        profile_photo_enabled: false,
      };
      setProfile(updated);
      setFileDetails(null);
      await updateProfile(profile.id || 'primary_profile', updated);
      setFeedback({
        type: 'success',
        message: 'PHOTO REMOVED // Public site now renders authentic CAD monogram placeholder.',
      });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Deletion failed',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-mono text-[var(--color-cyan)] tracking-wider">
          LOADING PHOTO REPOSITORY...
        </span>
      </div>
    );
  }

  const name = profile.name || 'Adithya G';
  const hasPhoto = Boolean(profile.profile_photo_url);
  const isEnabled = Boolean(profile.profile_photo_enabled);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" />
          <span>MEDIA STORAGE // PROFILE PHOTO</span>
        </div>
        <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
          Profile Photo Manager
        </h1>
        <p className="text-xs text-[var(--color-silver)] mt-1">
          Upload, preview, replace, or deactivate your personal profile photograph independently from biography text.
        </p>
      </div>

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

      {/* Main Grid: Preview & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real-time Public Appearance Preview */}
        <div className="md:col-span-5 eng-card p-6 flex flex-col items-center text-center space-y-4">
          <div className="text-[0.65rem] font-mono text-[var(--color-silver)] uppercase tracking-wider">
            PUBLIC PORTFOLIO APPEARANCE
          </div>

          <div className="relative group my-2">
            {/* Precision CAD Corners */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--color-cyan)] pointer-events-none z-10" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--color-cyan)] pointer-events-none z-10" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--color-cyan)] pointer-events-none z-10" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--color-cyan)] pointer-events-none z-10" />

            {hasPhoto && isEnabled ? (
              <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-[var(--color-cyan)]/40 shadow-[0_0_30px_rgba(0,212,255,0.2)] relative bg-void">
                <img
                  src={profile.profile_photo_url}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 text-[9px] font-mono text-[var(--color-cyan)] bg-void/85 px-1.5 py-0.5 rounded border border-[var(--color-cyan)]/30">
                  ACTIVE
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 rounded-2xl border border-white/[0.1] bg-surface/80 flex flex-col items-center justify-center p-4">
                <span className="font-display text-4xl font-black text-text-primary/40 tracking-wider">
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <span className="font-mono text-[8px] text-[var(--color-cyan)]/70 tracking-widest uppercase mt-3">
                  CAD BLUEPRINT MONOGRAM
                </span>
                <span className="text-[7px] font-mono text-[var(--color-silver)] mt-1">
                  (Zero fake person photos)
                </span>
              </div>
            )}
          </div>

          <div className="w-full pt-4 border-t border-[rgba(255,255,255,0.06)] text-xs font-mono space-y-1">
            <div className="flex justify-between text-[0.7rem]">
              <span className="text-[var(--color-silver)]">STATUS:</span>
              <span className={isEnabled && hasPhoto ? 'text-emerald-400 font-bold' : 'text-amber font-bold'}>
                {isEnabled && hasPhoto ? 'PHOTO PUBLISHED' : 'CAD MONOGRAM ACTIVE'}
              </span>
            </div>
            {fileDetails && (
              <>
                <div className="flex justify-between text-[0.65rem] text-[var(--color-silver)]">
                  <span>FILE SIZE:</span>
                  <span>{fileDetails.size}</span>
                </div>
                <div className="flex justify-between text-[0.65rem] text-[var(--color-silver)]">
                  <span>DIMENSIONS:</span>
                  <span>{fileDetails.dimensions}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Upload & Actions */}
        <div className="md:col-span-7 space-y-6">
          {/* Upload Box */}
          <div className="eng-card p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <Upload className="w-4 h-4 text-[var(--color-cyan)]" />
              <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
                Upload New Image File
              </h3>
            </div>

            <p className="text-xs text-[var(--color-silver)] leading-relaxed">
              Upload your genuine professional engineering headshot. Supports JPEG, PNG, or WEBP up to 10MB. Assets are stored in the Supabase Storage <code className="text-[var(--color-cyan)]">portfolio/profile-photos</code> bucket.
            </p>

            <div className="pt-2">
              <label className="eng-btn eng-btn-primary !py-3 !px-6 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'TRANSMITTING ASSET...' : hasPhoto ? 'REPLACE PROFILE PHOTO' : 'SELECT PHOTO TO UPLOAD'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Visibility & Safety Toggles */}
          <div className="eng-card p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <Shield className="w-4 h-4 text-[var(--color-cyan)]" />
              <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
                Display & Control Settings
              </h3>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-white/[0.06]">
              <div>
                <div className="text-xs font-semibold text-[var(--color-pure-white)] font-display">
                  Enable Profile Photo Display
                </div>
                <div className="text-[0.65rem] text-[var(--color-silver)] font-mono mt-0.5">
                  When disabled, public site switches to clean CAD initials monogram
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleActive}
                disabled={saving || !hasPhoto}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  isEnabled && hasPhoto ? 'bg-[var(--color-cyan)]' : 'bg-white/[0.1]'
                } ${!hasPhoto ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEnabled && hasPhoto ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {hasPhoto && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  disabled={saving}
                  className="eng-btn eng-btn-danger !text-xs !py-2 !px-4"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>DELETE PHOTO PERMANENTLY</span>
                </button>
              </div>
            )}
          </div>

          {/* Neutral Fallback Information */}
          <div className="p-4 rounded-lg bg-[rgba(0,212,255,0.03)] border border-[rgba(0,212,255,0.15)] flex items-start gap-3">
            <Info className="w-4 h-4 text-[var(--color-cyan)] flex-shrink-0 mt-0.5" />
            <p className="text-[0.7rem] text-[var(--color-silver)] leading-relaxed font-mono">
              ZERO DEMO PERSON RULE // If no photograph is active, the portfolio maintains strict authenticity by displaying a CAD monogram frame with initials <strong className="text-white">"{name.split(' ').map((n) => n[0]).join('')}"</strong>. Demo or sample headshots are never fabricated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
