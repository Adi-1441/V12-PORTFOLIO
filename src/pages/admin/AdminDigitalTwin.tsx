import { useState, useEffect } from 'react';
import {
  fetchSiteSettings,
  updateSiteSettings,
} from '@/lib/portfolioService';
import type { SiteSettings, QualityLevel } from '@/lib/types';
import {
  Cpu,
  Layers,
  Box,
  Eye,
  Flame,
  Maximize2,
  Compass,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export default function AdminDigitalTwin() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [initialData, setInitialData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    fetchSiteSettings().then(({ data }) => {
      if (mounted) {
        const sett = data || {
          scene_enabled: true,
          scene_quality: 'high',
          scene_auto_rotate: true,
          scene_interaction_enabled: true,
          twin_default_state: 'realistic',
          animation_speed: 'medium',
        };
        setSettings(sett);
        setInitialData(JSON.stringify(sett));
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const hasUnsavedChanges = JSON.stringify(settings) !== initialData;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      await updateSiteSettings(settings.id || 'site_settings', settings);
      setInitialData(JSON.stringify(settings));
      setFeedback({
        type: 'success',
        message: 'DIGITAL TWIN CALIBRATION COMMITTED // Synced to WebGL viewport.',
      });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Save failed',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('REVERT CALIBRATION // Discard uncommitted 3D changes?')) {
      if (initialData) {
        setSettings(JSON.parse(initialData));
      }
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-mono text-[var(--color-cyan)] tracking-wider">
          LOADING DIGITAL TWIN CALIBRATION...
        </span>
      </div>
    );
  }

  const defaultStates = [
    { id: 'realistic', label: 'Realistic Ti-6Al-4V', icon: Box, desc: 'PBR metallic materials with precision specular reflections' },
    { id: 'wireframe', label: 'CAD Wireframe Overlay', icon: Layers, desc: 'Visible CAD parametric polygon lines and vertex nodes' },
    { id: 'xray', label: 'Translucent X-Ray', icon: Eye, desc: 'Internal combustion and blade shaft cross-section inspection' },
    { id: 'flowfield', label: 'CFD Streamline Field', icon: Flame, desc: 'Conjugate thermal gradient and supersonic flow particles' },
    { id: 'exploded', label: 'Exploded Assembly View', icon: Maximize2, desc: 'Disassembled 5-stage rotor, stator, and planetary gear casing' },
    { id: 'inspection', label: 'CAD Coordinate Reticle', icon: Compass, desc: 'Engineering dimensional crosshairs and real-time hover telemetry' },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>SIMULATION SYSTEM // LIVING DIGITAL TWIN</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
            Digital Twin Calibration Console
          </h1>
          <p className="text-xs text-[var(--color-silver)] mt-1">
            Configure the 3D WebGL turbomachinery and planetary gear simulation parameters, default visual inspection mode, and performance tiers.
          </p>
        </div>

        {hasUnsavedChanges && (
          <button
            type="button"
            onClick={handleReset}
            className="eng-btn eng-btn-ghost !text-xs !py-2 !px-3 text-amber hover:text-amber-dim"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REVERT</span>
          </button>
        )}
      </div>

      {hasUnsavedChanges && (
        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs font-mono text-amber-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
          <span>UNCOMMITTED CHANGES // Save your updates to re-calibrate the public 3D twin.</span>
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
        {/* Core Engine State */}
        <div className="eng-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Box className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Primary 3D WebGL Engine State
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white font-display">
                  3D Digital Twin Engine
                </div>
                <div className="text-[0.65rem] font-mono text-[var(--color-silver)] mt-0.5">
                  When disabled, renders fallback engineering schematic
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, scene_enabled: !settings.scene_enabled })
                }
                className={`eng-btn !py-1 !px-3 !text-[10px] ${
                  settings.scene_enabled !== false
                    ? 'eng-btn-secondary text-emerald-400 border-emerald-800'
                    : 'eng-btn-ghost text-amber'
                }`}
              >
                {settings.scene_enabled !== false ? 'ONLINE' : 'BYPASS'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white font-display">
                  Mesh Auto-Rotation
                </div>
                <div className="text-[0.65rem] font-mono text-[var(--color-silver)] mt-0.5">
                  Continuously rotate 3D turbine assembly
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, scene_auto_rotate: !settings.scene_auto_rotate })
                }
                className={`eng-btn !py-1 !px-3 !text-[10px] ${
                  settings.scene_auto_rotate !== false
                    ? 'eng-btn-secondary text-emerald-400 border-emerald-800'
                    : 'eng-btn-ghost text-[var(--color-silver)]'
                }`}
              >
                {settings.scene_auto_rotate !== false ? 'ACTIVE' : 'STATIC'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                GPU PERFORMANCE & QUALITY TIER
              </label>
              <select
                value={settings.scene_quality || 'high'}
                onChange={(e) =>
                  setSettings({ ...settings, scene_quality: e.target.value as QualityLevel })
                }
                className="eng-input eng-select text-xs font-mono"
              >
                <option value="low">LOW // Performance Priority (Coarse Meshes)</option>
                <option value="medium">MEDIUM // Balanced Fidelity (Laptops)</option>
                <option value="high">HIGH // Dedicated Hardware (PBR Antialiasing)</option>
                <option value="ultra">ULTRA // Engineering Lab Quality (High DPR)</option>
              </select>
            </div>

            <div>
              <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                ROTATION VELOCITY TIER
              </label>
              <select
                value={settings.animation_speed || 'medium'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    animation_speed: e.target.value as 'low' | 'medium' | 'high',
                  })
                }
                className="eng-input eng-select text-xs font-mono"
              >
                <option value="low">SLOW // Precision Engineering Inspection</option>
                <option value="medium">STANDARD // Dynamic Living Assembly</option>
                <option value="high">HIGH // High-Velocity Turbomachinery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Default Visual Inspection Mode */}
        <div className="eng-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Layers className="w-4 h-4 text-[var(--color-cyan)]" />
            <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
              Default Entry Visual Mode
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {defaultStates.map((st) => {
              const Icon = st.icon;
              const isSelected = (settings.twin_default_state || 'realistic') === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, twin_default_state: st.id })}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-cyan)] bg-[rgba(0,212,255,0.08)] shadow-[0_0_20px_rgba(0,212,255,0.15)]'
                      : 'border-white/[0.06] bg-surface/50 hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? 'text-[var(--color-cyan)]' : 'text-[var(--color-silver)]'
                      }`}
                    />
                    <span
                      className={`text-xs font-bold font-display ${
                        isSelected ? 'text-white' : 'text-text-secondary'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                  <p className="text-[0.65rem] text-[var(--color-silver)] font-body leading-relaxed">
                    {st.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info banner */}
        <div className="p-4 rounded-lg bg-[rgba(0,212,255,0.03)] border border-[rgba(0,212,255,0.15)] flex items-start gap-3">
          <Info className="w-4 h-4 text-[var(--color-cyan)] flex-shrink-0 mt-0.5" />
          <p className="text-[0.7rem] text-[var(--color-silver)] leading-relaxed font-mono">
            BOUNDED STABILITY ASSURANCE // Parameters in this console are bounded within physics-safe WebGL limits. Modifying rotation velocity, default shader states, or quality levels will never crash client GPUs or corrupt 3D geometries.
          </p>
        </div>

        {/* Action Save Bar */}
        <div className="eng-card p-4 flex items-center justify-between sticky bottom-4 z-20 shadow-2xl bg-surface/95 backdrop-blur-md">
          <div className="text-[0.65rem] font-mono text-[var(--color-silver)]">
            {hasUnsavedChanges ? (
              <span className="text-amber flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                CALIBRATION PENDING COMMIT
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                DIGITAL TWIN SYNCHRONIZED
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="eng-btn eng-btn-primary !px-6 !py-2.5 text-xs font-mono"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'CALIBRATING...' : 'SAVE DIGITAL TWIN SETTINGS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
