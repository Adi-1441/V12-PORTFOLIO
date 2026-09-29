import { useState, useEffect } from 'react';
import {
  fetchSiteSettings,
  updateSiteSettings,
  fetchProfile,
  updateProfile,
} from '@/lib/portfolioService';
import type { SiteSettings, Profile } from '@/lib/types';
import { PORTFOLIO_IDENTITY } from '@/lib/constants';
import {
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export default function AdminIntroduction() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [initialData, setInitialData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchProfile(), fetchSiteSettings()]).then(([pRes, sRes]) => {
      if (mounted) {
        const prof = pRes.data || {
          name: PORTFOLIO_IDENTITY.name,
          role: PORTFOLIO_IDENTITY.role,
          tagline: PORTFOLIO_IDENTITY.tagline,
          short_description: PORTFOLIO_IDENTITY.shortDescription,
        };
        const sett = sRes.data || {
          intro_title: 'ADITHYA',
          intro_brand: 'MECHNEXUS',
          intro_subtitle: 'Futuristic Mechanical Engineering Digital Laboratory',
          intro_primary_btn_text: 'CLICK HERE TO EXPLORE',
          intro_status_text: 'DIGITAL TWIN ONLINE',
          intro_spec_text: 'TI-6AL-4V // 5-STAGE TURBOMACHINERY',
        };
        setProfile(prof);
        setSettings(sett);
        setInitialData(JSON.stringify({ prof, sett }));
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const hasUnsavedChanges = JSON.stringify({ prof: profile, sett: settings }) !== initialData;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (settings.id) {
        await updateSiteSettings(settings.id, settings);
      } else {
        await updateSiteSettings('site_settings', settings);
      }

      if (profile.id) {
        await updateProfile(profile.id, {
          role: profile.role,
          tagline: settings.intro_subtitle || profile.tagline,
        });
      }

      setInitialData(JSON.stringify({ prof: profile, sett: settings }));
      setFeedback({
        type: 'success',
        message: 'INTRODUCTION SPECIFICATIONS COMMITTED // Updated in database & synced live.',
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
    if (confirm('RESET FIELDS // Revert uncommitted changes to last saved state?')) {
      if (initialData) {
        const parsed = JSON.parse(initialData);
        setProfile(parsed.prof);
        setSettings(parsed.sett);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-mono text-[var(--color-cyan)] tracking-wider">
          LOADING INTRODUCTION SPECIFICATIONS...
        </span>
      </div>
    );
  }

  const introTitle = settings.intro_title || 'ADITHYA';
  const introBrand = settings.intro_brand || 'MECHNEXUS';
  const introRole = profile.role || 'Mechanical Engineering Student';
  const introSubtitle = settings.intro_subtitle || 'Futuristic Mechanical Engineering Digital Laboratory';
  const introBtn = settings.intro_primary_btn_text || 'CLICK HERE TO EXPLORE';
  const introStatus = settings.intro_status_text || 'DIGITAL TWIN ONLINE';
  const introSpec = settings.intro_spec_text || 'TI-6AL-4V // 5-STAGE TURBOMACHINERY';

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTRODUCTION & GENESIS PORTAL</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
            Edit Introduction Page
          </h1>
          <p className="text-xs text-[var(--color-silver)] mt-1">
            Configure primary titles, mission tagline, activation button label, and telemetry readouts displayed on the entry Genesis page.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="eng-btn eng-btn-secondary !text-xs !py-2 !px-3"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewMode ? 'HIDE PREVIEW' : 'LIVE PREVIEW'}</span>
          </button>
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="eng-btn eng-btn-ghost !text-xs !py-2 !px-3 text-amber hover:text-amber-dim"
              title="Discard unsaved changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REVERT</span>
            </button>
          )}
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs font-mono text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            <span>UNCOMMITTED CHANGES // Save your modifications to update the public portal.</span>
          </div>
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

      {/* Live Preview Frame */}
      {previewMode && (
        <div className="eng-card p-6 md:p-8 border border-[var(--color-cyan)]/40 relative overflow-hidden bg-void/90">
          <div className="text-[0.65rem] font-mono text-[var(--color-cyan)] uppercase tracking-widest mb-4 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" />
            <span>GENESIS HERO PREVIEW (APPROXIMATE)</span>
          </div>

          <div className="py-8 flex flex-col items-center text-center space-y-4">
            {/* Status Telemetry */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] text-text-primary tracking-widest uppercase">
                {introStatus}
              </span>
              <span className="font-mono text-[8px] text-text-tertiary hidden sm:inline">
                // {introSpec}
              </span>
            </div>

            {/* Role Tag */}
            <div className="font-mono text-[11px] text-[var(--color-cyan)] tracking-[0.25em] uppercase">
              {introRole}
            </div>

            {/* Title */}
            <div className="font-display text-4xl sm:text-5xl font-black tracking-tight">
              <span className="text-white block">{introTitle}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] to-blue-400 block">
                {introBrand}
              </span>
            </div>

            {/* Subtitle */}
            <p className="font-body text-xs md:text-sm text-text-secondary max-w-lg mx-auto">
              {introSubtitle}
            </p>

            {/* Button */}
            <div className="pt-3">
              <div className="px-8 py-3.5 rounded-full border border-[var(--color-cyan)] bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] font-mono text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(0,212,255,0.25)] inline-flex items-center gap-2">
                <Sparkles size={14} />
                <span>{introBtn}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity Panel */}
        <div className="eng-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Layers className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Primary Brand Identity & Hero Typography
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                PRIMARY BRAND TITLE (LINE 1)
              </label>
              <input
                type="text"
                required
                value={settings.intro_title ?? 'ADITHYA'}
                onChange={(e) => setSettings({ ...settings, intro_title: e.target.value })}
                placeholder="ADITHYA"
                className="eng-input font-display font-bold text-sm tracking-wider"
              />
              <span className="text-[0.6rem] font-mono text-[var(--color-silver)] mt-1 block">
                Rendered as the white prominent headline
              </span>
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                BRAND ACCENT / NEXUS (LINE 2)
              </label>
              <input
                type="text"
                required
                value={settings.intro_brand ?? 'MECHNEXUS'}
                onChange={(e) => setSettings({ ...settings, intro_brand: e.target.value })}
                placeholder="MECHNEXUS"
                className="eng-input font-display font-bold text-sm tracking-wider text-[var(--color-cyan)]"
              />
              <span className="text-[0.6rem] font-mono text-[var(--color-silver)] mt-1 block">
                Rendered with cyan metallic gradient
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                PROFESSIONAL TITLE / ROLE
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

            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                EXPLORE ACTIVATION BUTTON LABEL
              </label>
              <input
                type="text"
                required
                value={settings.intro_primary_btn_text ?? 'CLICK HERE TO EXPLORE'}
                onChange={(e) =>
                  setSettings({ ...settings, intro_primary_btn_text: e.target.value })
                }
                placeholder="CLICK HERE TO EXPLORE"
                className="eng-input font-mono uppercase tracking-wider"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              MISSION TAGLINE / INTRODUCTION DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={settings.intro_subtitle ?? ''}
              onChange={(e) => setSettings({ ...settings, intro_subtitle: e.target.value })}
              placeholder="Futuristic Mechanical Engineering Digital Laboratory"
              className="eng-input eng-textarea text-xs"
            />
          </div>
        </div>

        {/* Technical Telemetry Readouts Panel */}
        <div className="eng-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Sparkles className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Digital Twin Telemetry Readouts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                TOP LEFT SYSTEM STATUS
              </label>
              <input
                type="text"
                value={settings.intro_status_text ?? 'DIGITAL TWIN ONLINE'}
                onChange={(e) => setSettings({ ...settings, intro_status_text: e.target.value })}
                placeholder="DIGITAL TWIN ONLINE"
                className="eng-input font-mono text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                TECHNICAL SPECIFICATION LABEL
              </label>
              <input
                type="text"
                value={settings.intro_spec_text ?? 'TI-6AL-4V // 5-STAGE TURBOMACHINERY'}
                onChange={(e) => setSettings({ ...settings, intro_spec_text: e.target.value })}
                placeholder="TI-6AL-4V // 5-STAGE TURBOMACHINERY"
                className="eng-input font-mono text-xs uppercase"
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

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="eng-btn eng-btn-primary !px-6 !py-2.5 text-xs font-mono"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'COMMITTING SPECS...' : 'SAVE INTRODUCTION'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
