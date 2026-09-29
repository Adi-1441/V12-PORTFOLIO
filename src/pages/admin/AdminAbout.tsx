import { useState, useEffect } from 'react';
import {
  fetchProfile,
  updateProfile,
} from '@/lib/portfolioService';
import type { Profile } from '@/lib/types';
import {
  BookOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Layers,
  Cpu,
  Flame,
  Binary,
} from 'lucide-react';

export default function AdminAbout() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
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
        const prof = data || {
          about_heading: 'Engineering Precision Grounded in Physics',
          about_description:
            'Dedicated to advancing mechanical systems through rigorous CAD design, non-linear structural FEA, turbulence-resolved CFD, and computational automation.',
          discipline: 'Mechanical Engineering',
          location: 'India',
        };
        setProfile(prof);
        setInitialData(JSON.stringify(prof));
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
      await updateProfile(profile.id || 'primary_profile', profile);
      setInitialData(JSON.stringify(profile));
      setFeedback({
        type: 'success',
        message: 'ABOUT DOSSIER COMMITTED // Updated in database & synced to public view.',
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
    if (confirm('REVERT CHANGES // Discard uncommitted changes in About section?')) {
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
          LOADING ABOUT DOSSIER...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CONTENT MANAGEMENT // ABOUT SECTION</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
            Edit About Section
          </h1>
          <p className="text-xs text-[var(--color-silver)] mt-1">
            Maintain your engineering dossier, section headline, core methodology, and domain specialization cards.
          </p>
        </div>

        {hasUnsavedChanges && (
          <button
            type="button"
            onClick={handleReset}
            className="eng-btn eng-btn-ghost !text-xs !py-2 !px-3 text-amber hover:text-amber-dim self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REVERT</span>
          </button>
        )}
      </div>

      {hasUnsavedChanges && (
        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs font-mono text-amber-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
          <span>UNCOMMITTED CHANGES // Commit to update the public About section.</span>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Headlines */}
        <div className="eng-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <BookOpen className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Section Header & Mission
            </h3>
          </div>

          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              ABOUT SECTION HEADING
            </label>
            <input
              type="text"
              required
              value={profile.about_heading || ''}
              onChange={(e) => setProfile({ ...profile, about_heading: e.target.value })}
              placeholder="Engineering Precision Grounded in Physics"
              className="eng-input font-display text-base font-bold"
            />
          </div>

          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              PRIMARY ABOUT DESCRIPTION / SUBTITLE
            </label>
            <textarea
              rows={4}
              required
              value={profile.about_description || ''}
              onChange={(e) => setProfile({ ...profile, about_description: e.target.value })}
              placeholder="Dedicated to bridging physical mechanical systems with high-fidelity digital twins..."
              className="eng-input eng-textarea text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Engineering Philosophy & Long Dossier */}
        <div className="eng-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Layers className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Engineering Philosophy & Academic Dossier
            </h3>
          </div>

          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              ENGINEERING PHILOSOPHY (OPTIONAL SUPPORTING NARRATIVE)
            </label>
            <textarea
              rows={3}
              value={profile.philosophy || ''}
              onChange={(e) => setProfile({ ...profile, philosophy: e.target.value })}
              placeholder="Approach to engineering design: First-principles physics, verified simulation before prototyping, and automated agentic design workflows."
              className="eng-input eng-textarea text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                ENGINEERING DISCIPLINE
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
                PRIMARY FOCUS AREAS
              </label>
              <input
                type="text"
                value={profile.focus_areas || 'CAD / CAE / CFD / Thermal / Automation / AI × Engineering'}
                onChange={(e) => setProfile({ ...profile, focus_areas: e.target.value })}
                placeholder="CAD / CAE / CFD / Thermal / Automation / AI × Engineering"
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
            <span>{saving ? 'SAVING DOSSIER...' : 'SAVE ABOUT SECTION'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
