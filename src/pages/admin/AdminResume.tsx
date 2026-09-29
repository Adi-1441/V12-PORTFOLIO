import { useState, useEffect } from 'react';
import {
  fetchProfile,
  updateProfile,
  uploadMediaFile,
} from '@/lib/portfolioService';
import type { Profile } from '@/lib/types';
import { STORAGE_PATHS } from '@/lib/constants';
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Download,
  Info,
} from 'lucide-react';

export default function AdminResume() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    fetchProfile().then(({ data }) => {
      if (mounted) {
        if (data) {
          setProfile(data);
          if (data.resume_url) {
            try {
              const parts = data.resume_url.split('/');
              setFileName(decodeURIComponent(parts[parts.length - 1]));
            } catch {
              setFileName('Adithya_Resume.pdf');
            }
          }
        }
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setFeedback({
        type: 'error',
        message: 'INVALID FILE FORMAT // Only official PDF documents are accepted for engineering resume.',
      });
      return;
    }

    setUploading(true);
    setFeedback(null);

    try {
      const sanitizedName = file.name.replace(/\s+/g, '_');
      const path = `${STORAGE_PATHS.resume}/resume_${Date.now()}_${sanitizedName}`;
      const { url, error } = await uploadMediaFile('portfolio', path, file);

      if (error) throw new Error(error);

      if (url) {
        const updated = {
          ...profile,
          resume_url: url,
          resume_enabled: true,
        };
        setProfile(updated);
        setFileName(file.name);
        await updateProfile(profile.id || 'primary_profile', updated);
        setFeedback({
          type: 'success',
          message: 'RESUME PDF TRANSMITTED // Stored securely in documents repository and activated.',
        });
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Resume upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async () => {
    const newState = !profile.resume_enabled;
    const updated = { ...profile, resume_enabled: newState };
    setProfile(updated);
    setSaving(true);
    try {
      await updateProfile(profile.id || 'primary_profile', updated);
      setFeedback({
        type: 'success',
        message: newState
          ? 'RESUME ACCESS ENABLED // Public download node active.'
          : 'RESUME ACCESS DISABLED // Download button will notify visitors to request document via contact channel.',
      });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Toggle failed',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!profile.resume_url) return;

    if (
      !confirm('CONFIRM DELETION // Remove resume document reference from portfolio database?')
    ) {
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const updated = {
        ...profile,
        resume_url: '',
        resume_enabled: false,
      };
      setProfile(updated);
      setFileName('');
      await updateProfile(profile.id || 'primary_profile', updated);
      setFeedback({
        type: 'success',
        message: 'RESUME REMOVED // Public site now indicates resume document is unavailable.',
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
          LOADING RESUME DOCUMENT STATE...
        </span>
      </div>
    );
  }

  const hasResume = Boolean(profile.resume_url);
  const isEnabled = Boolean(profile.resume_enabled);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>DOCUMENTS & ASSETS // RESUME</span>
        </div>
        <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
          Manage Resume Document
        </h1>
        <p className="text-xs text-[var(--color-silver)] mt-1">
          Upload, replace, inspect, or toggle availability of your verified curriculum vitae / engineering resume.
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

      {/* Current Document Status Card */}
      <div className="eng-card p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Current Active Resume Document
            </h3>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${
              hasResume && isEnabled
                ? 'bg-emerald-950/60 border border-emerald-700 text-emerald-300'
                : 'bg-amber-950/60 border border-amber-700 text-amber-300'
            }`}
          >
            {hasResume && isEnabled ? 'PUBLICLY AVAILABLE' : 'INACTIVE / RESTRICTED'}
          </span>
        </div>

        {hasResume ? (
          <div className="p-4 rounded-xl bg-surface/80 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-lg bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white font-mono truncate max-w-sm">
                  {fileName || 'Engineering_Resume.pdf'}
                </div>
                <div className="text-[0.65rem] text-[var(--color-silver)] font-mono mt-0.5">
                  FORMAT: PDF · SECURE STORAGE
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="eng-btn eng-btn-secondary !text-xs !py-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>PREVIEW DOCUMENT</span>
              </a>

              <button
                type="button"
                onClick={handleDeleteResume}
                disabled={saving}
                className="eng-btn eng-btn-danger !text-xs !py-2"
                title="Remove resume"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-white/[0.1] text-center space-y-2">
            <FileText className="w-8 h-8 text-[var(--color-silver)] mx-auto opacity-40" />
            <div className="text-xs font-mono text-white">NO RESUME DOCUMENT UPLOADED</div>
            <p className="text-[0.65rem] font-mono text-[var(--color-silver)] max-w-md mx-auto">
              Upload your genuine engineering resume PDF below to enable direct download access on the public portfolio.
            </p>
          </div>
        )}
      </div>

      {/* Upload & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="eng-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <Upload className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-white">
              {hasResume ? 'Replace Resume PDF' : 'Upload Resume PDF'}
            </h3>
          </div>
          <p className="text-xs text-[var(--color-silver)] leading-relaxed">
            Select a verified engineering resume in standard PDF format. Uploaded to <code className="text-[var(--color-cyan)]">portfolio/documents</code> bucket.
          </p>

          <label className="eng-btn eng-btn-primary !py-2.5 !px-5 cursor-pointer flex items-center justify-center gap-2 w-full">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'TRANSMITTING PDF...' : hasResume ? 'SELECT REPLACEMENT PDF' : 'SELECT RESUME PDF'}</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="eng-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <Shield className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-white">
              Public Availability Control
            </h3>
          </div>
          <p className="text-xs text-[var(--color-silver)] leading-relaxed">
            Control whether visitors on the public portfolio can directly download your resume file.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-white">
              Public Download Link:
            </span>
            <button
              type="button"
              onClick={handleToggleActive}
              disabled={saving || !hasResume}
              className={`eng-btn !text-xs !py-1.5 !px-3 ${
                isEnabled && hasResume ? 'eng-btn-secondary text-emerald-400' : 'eng-btn-ghost text-amber'
              } ${!hasResume ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {isEnabled && hasResume ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-[rgba(0,212,255,0.03)] border border-[rgba(0,212,255,0.15)] flex items-start gap-3">
        <Info className="w-4 h-4 text-[var(--color-cyan)] flex-shrink-0 mt-0.5" />
        <p className="text-[0.7rem] text-[var(--color-silver)] leading-relaxed font-mono">
          AUTHENTIC RESUME SPECIFICATION // The public download button on WorkHub and Genesis accesses only the real verified PDF you configure here. If no file is uploaded, the public download button gracefully requests visitors to contact you instead of serving broken links or dummy documents.
        </p>
      </div>
    </div>
  );
}
