import { useState, useEffect, useCallback } from 'react';
import {
  insertItem,
  updateItem,
  deleteItem,
  uploadMediaFile,
} from '@/lib/portfolioService';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { STORAGE_PATHS, SOFTWARE_LIST, SKILL_CATEGORIES } from '@/lib/constants';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';

export interface ManagerConfig {
  table: string;
  title: string;
  subtitle: string;
  sectorBadge: string;
  storagePath: string;
  hasSoftware?: boolean;
  hasDomain?: boolean;
  hasStatus?: boolean;
  hasCertFields?: boolean;
  hasProficiency?: boolean;
  hasConnectionFields?: boolean;
}

export default function AdminContentManager({ config }: { config: ManagerConfig }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const loadData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(config.table)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (err: unknown) {
      console.error(`Error loading ${config.table}:`, err);
    } finally {
      setLoading(false);
    }
  }, [config.table]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingItem({
      title: '',
      name: '',
      short_description: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      engineering_domain: '',
      software: [],
      tags: [],
      thumbnail: '',
      file_url: '',
      credential_id: '',
      credential_url: '',
      issuer: '',
      proficiency: 80,
      platform: 'LinkedIn',
      url: '',
      status: 'ongoing',
      featured: false,
      enabled: true,
      display_order: items.length + 1,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName = 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const path = `${config.storagePath}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { url, error } = await uploadMediaFile('portfolio', path, file);

      if (error) throw new Error(error);
      if (url) {
        setEditingItem((prev: any) => ({ ...prev, [fieldName]: url }));
        setFeedback({ type: 'success', message: 'ASSET UPLOADED // Remember to save changes.' });
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const payload = {
      ...editingItem,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingItem.id) {
        const { success, error } = await updateItem(config.table, editingItem.id, payload);
        if (!success) throw new Error(error || 'Update failed');
      } else {
        const { error } = await insertItem(config.table, {
          ...payload,
          created_at: new Date().toISOString(),
        });
        if (error) throw new Error(error);
      }

      setFeedback({ type: 'success', message: 'RECORD COMMITTED // Database updated.' });
      setModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Save operation failed',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('CONFIRM DELETION // Remove this item from database?')) {
      await deleteItem(config.table, id);
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1">
            SECTOR // {config.sectorBadge}
          </div>
          <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
            {config.title}
          </h1>
          <p className="text-xs text-[var(--color-silver)] mt-1">
            {config.subtitle}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="eng-btn eng-btn-primary !text-xs !py-2.5 !px-4 font-mono flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW RECORD</span>
        </button>
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

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="eng-card p-12 text-center">
          <Layers className="w-10 h-10 text-[var(--color-gunmetal)] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[var(--color-pure-white)] font-display mb-1">
            NO RECORDS STORED IN {config.table.toUpperCase()}
          </h3>
          <p className="text-xs text-[var(--color-silver)] max-w-sm mx-auto mb-4">
            Initialize your first entry to showcase verified mechanical engineering assets.
          </p>
          <button onClick={handleOpenCreate} className="eng-btn eng-btn-secondary !text-xs !py-2">
            Add Record
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="eng-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[rgba(0,212,255,0.3)] transition-all"
            >
              <div className="flex items-start sm:items-center gap-4">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title || item.name}
                    className="w-16 h-12 object-cover rounded border border-[rgba(255,255,255,0.08)] flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.15)] flex items-center justify-center text-[var(--color-cyan)] flex-shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
                    {item.title || item.name}
                  </h3>
                  <div className="text-[0.65rem] font-mono text-[var(--color-silver)] mt-0.5 flex flex-wrap items-center gap-2">
                    {item.category && <span>{item.category}</span>}
                    {item.date && <span>· {item.date}</span>}
                    {item.issuer && <span>· {item.issuer}</span>}
                    {config.hasProficiency && item.proficiency && (
                      <span className="text-[var(--color-cyan)]">· {item.proficiency}%</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[var(--color-silver)] hover:text-white"
                  title="Edit Record"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-red-400 hover:bg-red-950/20"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && editingItem && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content !max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)] mb-4">
              <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
                {editingItem.id ? `Edit ${config.title}` : `New ${config.title}`}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[var(--color-silver)] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                  TITLE / IDENTIFIER *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title ?? editingItem.name ?? ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      title: e.target.value,
                      name: e.target.value,
                    })
                  }
                  className="eng-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                    CATEGORY
                  </label>
                  {config.hasProficiency ? (
                    <select
                      value={editingItem.category || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, category: e.target.value })
                      }
                      className="eng-input eng-select text-xs font-mono"
                    >
                      <option value="">Select Category</option>
                      {SKILL_CATEGORIES.map((cat: string) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editingItem.category || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, category: e.target.value })
                      }
                      className="eng-input"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                    DATE / RECORD TIMESTAMP
                  </label>
                  <input
                    type="date"
                    value={editingItem.date || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, date: e.target.value })
                    }
                    className="eng-input"
                  />
                </div>
              </div>

              {config.hasDomain && (
                <div>
                  <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                    ENGINEERING DOMAIN
                  </label>
                  <input
                    type="text"
                    value={editingItem.engineering_domain || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, engineering_domain: e.target.value })
                    }
                    placeholder="e.g. Finite Element Analysis (FEA)"
                    className="eng-input"
                  />
                </div>
              )}

              {config.hasCertFields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                      ISSUING ORGANIZATION
                    </label>
                    <input
                      type="text"
                      value={editingItem.issuer || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, issuer: e.target.value })
                      }
                      placeholder="e.g. Dassault Systèmes / ASME"
                      className="eng-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                      CREDENTIAL ID
                    </label>
                    <input
                      type="text"
                      value={editingItem.credential_id || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, credential_id: e.target.value })
                      }
                      placeholder="e.g. C-12894X7"
                      className="eng-input"
                    />
                  </div>
                </div>
              )}

              {config.hasProficiency && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[0.65rem] font-mono text-[var(--color-silver)] uppercase">
                      PROFICIENCY LEVEL
                    </label>
                    <span className="text-xs font-mono text-[var(--color-cyan)]">
                      {editingItem.proficiency || 80}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={editingItem.proficiency || 80}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        proficiency: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-[var(--color-cyan)] cursor-pointer"
                  />
                </div>
              )}

              {config.hasConnectionFields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                      PLATFORM
                    </label>
                    <input
                      type="text"
                      value={editingItem.platform || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, platform: e.target.value })
                      }
                      placeholder="e.g. LinkedIn / GitHub / ResearchGate"
                      className="eng-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                      PROFILE URL
                    </label>
                    <input
                      type="url"
                      value={editingItem.url || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, url: e.target.value })
                      }
                      placeholder="https://..."
                      className="eng-input"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                  BRIEF SUMMARY
                </label>
                <textarea
                  rows={2}
                  value={editingItem.short_description || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, short_description: e.target.value })
                  }
                  className="eng-input eng-textarea"
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                  DETAILED SPECIFICATIONS / DESCRIPTION
                </label>
                <textarea
                  rows={4}
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="eng-input eng-textarea"
                />
              </div>

              {/* Asset Upload */}
              <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-[var(--color-silver)]">
                  <span>ATTACHED ASSET // </span>
                  <span className="text-[var(--color-cyan)]">
                    {editingItem.thumbnail || editingItem.file_url
                      ? 'FILE ATTACHED'
                      : 'NO ATTACHMENT'}
                  </span>
                </div>

                <label className="eng-btn eng-btn-secondary !text-xs !py-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'UPLOADING...' : 'Upload File / Image'}</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, config.hasCertFields ? 'file_url' : 'thumbnail')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="eng-btn eng-btn-ghost !text-xs !py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="eng-btn eng-btn-primary !text-xs !py-2 !px-4"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Commit Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
