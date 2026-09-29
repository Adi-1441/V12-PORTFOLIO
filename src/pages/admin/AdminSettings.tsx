import { useState, useEffect } from 'react';
import {
  fetchSiteSettings,
  updateSiteSettings,
  insertItem,
} from '@/lib/portfolioService';
import type { SiteSettings, BackgroundPreset, QualityLevel } from '@/lib/types';
import { BACKGROUND_PRESETS } from '@/lib/constants';
import { Sliders, Save, CheckCircle2, AlertCircle, Sparkles, Box } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    background_preset: 'cyber-grid',
    animation_enabled: true,
    particles_enabled: true,
    grid_enabled: true,
    energy_lines_enabled: true,
    holographic_rings_enabled: true,
    scanning_enabled: true,
    mouse_parallax_enabled: true,
    animation_speed: 'medium',
    particle_density: 'medium',
    glow_intensity: 'high',
    mobile_animation_enabled: true,
    scene_enabled: true,
    scene_quality: 'high',
    scene_auto_rotate: true,
    scene_interaction_enabled: true,
    intro_primary_btn_text: 'View Projects',
    intro_primary_btn_link: '#projects',
    intro_secondary_btn_text: 'Contact Me',
    intro_secondary_btn_link: '#contact',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    fetchSiteSettings().then(({ data }) => {
      if (mounted) {
        if (data) setSettings(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (settings.id) {
        const { success, error } = await updateSiteSettings(settings.id, settings);
        if (!success) throw new Error(error || 'Failed to update settings');
      } else {
        const { data, error } = await insertItem('site_settings', settings);
        if (error) throw new Error(error);
        if (data) setSettings(data);
      }
      setFeedback({ type: 'success', message: 'PARAMETERS COMMITTED // Settings saved successfully.' });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error updating settings',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-mono text-[var(--color-cyan)]">LOADING SETTINGS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1">
          SYSTEM PREFERENCES
        </div>
        <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
          Site & 3D Digital Twin Settings
        </h1>
        <p className="text-xs text-[var(--color-silver)] mt-1">
          Configure background visual presets, particle telemetry, 3D WebGL performance tiers, and call-to-actions.
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* 3D Scene Controls */}
        <div className="eng-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Box className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              3D Planetary Gear Mechanical Assembly
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                SCENE QUALITY TIER
              </label>
              <select
                value={settings.scene_quality || 'high'}
                onChange={(e) =>
                  setSettings({ ...settings, scene_quality: e.target.value as QualityLevel })
                }
                className="eng-input eng-select text-xs font-mono"
              >
                <option value="low">Low (Mobile Optimized / Max FPS)</option>
                <option value="medium">Medium (Standard Laptops)</option>
                <option value="high">High (Dedicated GPU / Antialiased)</option>
                <option value="ultra">Ultra (High DPR / Extreme Reflections)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <div>
                <div className="text-xs font-mono text-[var(--color-platinum)]">AUTO ROTATE MESH</div>
                <div className="text-[0.6rem] font-mono text-[var(--color-gunmetal)]">
                  Autonomous planetary rotation
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, scene_auto_rotate: !settings.scene_auto_rotate })
                }
                className={`eng-toggle ${settings.scene_auto_rotate ? 'active' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Background Visual Presets */}
        <div className="eng-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Sparkles className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Background Holographic & Grid Calibration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                BACKGROUND PRESET
              </label>
              <select
                value={settings.background_preset || 'cyber-grid'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    background_preset: e.target.value as BackgroundPreset,
                  })
                }
                className="eng-input eng-select text-xs font-mono"
              >
                {BACKGROUND_PRESETS.map((p: { id: string; label: string }) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                PARTICLE DENSITY
              </label>
              <select
                value={settings.particle_density || 'medium'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    particle_density: e.target.value as 'low' | 'medium' | 'high',
                  })
                }
                className="eng-input eng-select text-xs font-mono"
              >
                <option value="low">Low (15 nodes)</option>
                <option value="medium">Medium (30 nodes)</option>
                <option value="high">High (50 nodes)</option>
              </select>
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                GLOW INTENSITY
              </label>
              <select
                value={settings.glow_intensity || 'high'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    glow_intensity: e.target.value as 'low' | 'medium' | 'high',
                  })
                }
                className="eng-input eng-select text-xs font-mono"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <span className="text-xs font-mono text-[var(--color-platinum)]">
                ENGINEERING GRID
              </span>
              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, grid_enabled: !settings.grid_enabled })
                }
                className={`eng-toggle ${settings.grid_enabled ? 'active' : ''}`}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <span className="text-xs font-mono text-[var(--color-platinum)]">
                LASER SCAN LINE
              </span>
              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, scanning_enabled: !settings.scanning_enabled })
                }
                className={`eng-toggle ${settings.scanning_enabled ? 'active' : ''}`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="eng-btn eng-btn-primary !px-6 !py-2.5 text-xs font-mono"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'UPDATING PARAMETERS...' : 'COMMIT PARAMETERS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
