import { useState, useEffect } from 'react';
import {
  fetchSiteSettings,
  updateSiteSettings,
  fetchSections,
} from '@/lib/portfolioService';
import type { SiteSettings, PortfolioSection } from '@/lib/types';
import { CORE_NAV_ITEMS } from '@/lib/constants';
import {
  Navigation,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Layers,
  RotateCcw,
} from 'lucide-react';

interface NavSectionConfig {
  id: string;
  defaultLabel: string;
  currentLabel: string;
  visible: boolean;
  order: number;
  isDynamic?: boolean;
}

export default function AdminNavigation() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [sections, setSections] = useState<NavSectionConfig[]>([]);
  const [initialData, setInitialData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchSiteSettings(), fetchSections()]).then(([sRes, secRes]) => {
      if (mounted) {
        const siteSett: Partial<SiteSettings> = sRes.data || {};
        const visibilityMap = siteSett.section_visibility || {};
        const labelsMap = siteSett.navigation_labels || {};
        const orderList = siteSett.navigation_order || [];


        // Build list from core nav items
        const list: NavSectionConfig[] = CORE_NAV_ITEMS.map((item, idx) => ({
          id: item.id,
          defaultLabel: item.label,
          currentLabel: labelsMap[item.id] || item.label,
          visible: visibilityMap[item.id] !== false, // default true
          order: orderList.indexOf(item.id) !== -1 ? orderList.indexOf(item.id) + 1 : idx + 1,
          isDynamic: false,
        }));

        // Include any dynamic sections
        if (secRes.data) {
          secRes.data.forEach((ds: PortfolioSection) => {
            const id = ds.slug || ds.id;
            list.push({
              id,
              defaultLabel: ds.name,
              currentLabel: labelsMap[id] || ds.name,
              visible: visibilityMap[id] !== false && ds.enabled,
              order:
                orderList.indexOf(id) !== -1
                  ? orderList.indexOf(id) + 1
                  : list.length + 1,
              isDynamic: true,
            });
          });
        }

        list.sort((a, b) => a.order - b.order);

        setSettings(siteSett);
        setSections(list);
        setInitialData(JSON.stringify(list));
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const hasUnsavedChanges = JSON.stringify(sections) !== initialData;

  const handleToggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, currentLabel: newLabel } : s))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);

    // Re-assign order numbers
    updated.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setSections(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const visibilityMap: Record<string, boolean> = {};
      const labelsMap: Record<string, string> = {};
      const orderList: string[] = [];

      sections.forEach((s) => {
        visibilityMap[s.id] = s.visible;
        labelsMap[s.id] = s.currentLabel;
        orderList.push(s.id);
      });

      const updatedSettings = {
        ...settings,
        section_visibility: visibilityMap,
        navigation_labels: labelsMap,
        navigation_order: orderList,
      };

      await updateSiteSettings(settings.id || 'site_settings', updatedSettings);
      setSettings(updatedSettings);
      setInitialData(JSON.stringify(sections));
      setFeedback({
        type: 'success',
        message: 'NAVIGATION & VISIBILITY RULES COMMITTED // Synchronized with live portfolio.',
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
    if (confirm('REVERT RULES // Discard uncommitted changes to navigation ordering and labels?')) {
      if (initialData) {
        setSections(JSON.parse(initialData));
      }
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-mono text-[var(--color-cyan)] tracking-wider">
          LOADING NAVIGATION ARCHITECTURE...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" />
            <span>PORTFOLIO STRUCTURE // NAVIGATION & VISIBILITY</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
            Navigation & Section Visibility
          </h1>
          <p className="text-xs text-[var(--color-silver)] mt-1">
            Toggle visibility of portfolio sections, customize navigation menu labels, and adjust display sequence.
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
          <span>UNCOMMITTED CHANGES // Save your updates to reconfigure the public navigation bar.</span>
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

      <form onSubmit={handleSave} className="space-y-4">
        <div className="eng-card overflow-hidden">
          <div className="p-4 bg-void/60 border-b border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-[var(--color-silver)] uppercase tracking-wider">
            <div className="flex items-center gap-4">
              <span className="w-8 text-center">ORDER</span>
              <span>SECTION IDENTIFIER & NAVIGATION LABEL</span>
            </div>
            <div className="flex items-center gap-6">
              <span>VISIBILITY STATE</span>
              <span className="w-16 text-center">REORDER</span>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  sec.visible ? 'hover:bg-white/[0.01]' : 'opacity-50 bg-black/30'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <span className="font-mono text-xs font-bold text-[var(--color-cyan)] w-8 text-center">
                    {String(sec.order).padStart(2, '0')}
                  </span>

                  <div className="flex-1 max-w-sm">
                    <input
                      type="text"
                      value={sec.currentLabel}
                      onChange={(e) => handleLabelChange(sec.id, e.target.value)}
                      className="eng-input !py-1.5 !px-3 text-xs font-mono"
                      title="Edit public navigation label"
                    />
                    <div className="text-[9px] font-mono text-text-tertiary mt-0.5 flex items-center gap-2">
                      <span>ANCHOR: #{sec.id}</span>
                      {sec.isDynamic && (
                        <span className="text-[var(--color-cyan)]">DYNAMIC CMS SECTOR</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Visibility Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(sec.id)}
                    className={`eng-btn !py-1 !px-2.5 !text-[10px] flex items-center gap-1.5 ${
                      sec.visible
                        ? 'eng-btn-secondary text-emerald-400 border-emerald-800'
                        : 'eng-btn-ghost text-amber'
                    }`}
                  >
                    {sec.visible ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>VISIBLE</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>HIDDEN</span>
                      </>
                    )}
                  </button>

                  {/* Reorder Arrows */}
                  <div className="flex items-center gap-1 w-16 justify-center">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 rounded hover:bg-white/[0.08] disabled:opacity-20 text-[var(--color-silver)] hover:text-white"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 rounded hover:bg-white/[0.08] disabled:opacity-20 text-[var(--color-silver)] hover:text-white"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                NAVIGATION SYNCHRONIZED
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="eng-btn eng-btn-primary !px-6 !py-2.5 text-xs font-mono"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'UPDATING NAVIGATION...' : 'SAVE NAVIGATION RULES'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
