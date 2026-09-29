import { useState, useEffect } from 'react';
import {
  fetchSections,
  insertItem,
  updateItem,
  deleteItem,
} from '@/lib/portfolioService';
import type { PortfolioSection, SectionContentType } from '@/lib/types';
import { generateSlug } from '@/lib/utils';
import { Layers, Plus, Trash2, Edit3, Save, X, Eye, EyeOff } from 'lucide-react';

export default function AdminSections() {
  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Partial<PortfolioSection> | null>(null);

  const loadSections = async () => {
    setLoading(true);
    const { data } = await fetchSections();
    setSections(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleOpenCreate = () => {
    setEditingSection({
      name: '',
      slug: '',
      description: '',
      content_type: 'grid',
      enabled: true,
      visible_in_navigation: true,
      navigation_order: sections.length + 1,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection?.name) return;

    const payload = {
      ...editingSection,
      slug: editingSection.slug || generateSlug(editingSection.name),
      updated_at: new Date().toISOString(),
    };

    if (editingSection.id) {
      await updateItem('portfolio_sections', editingSection.id, payload);
    } else {
      await insertItem('portfolio_sections', {
        ...payload,
        created_at: new Date().toISOString(),
      });
    }

    setModalOpen(false);
    setEditingSection(null);
    loadSections();
  };

  const handleDelete = async (id: string) => {
    if (confirm('CONFIRM DELETION // Remove this dynamic section from database?')) {
      await deleteItem('portfolio_sections', id);
      loadSections();
    }
  };

  const toggleVisibility = async (section: PortfolioSection) => {
    await updateItem('portfolio_sections', section.id, {
      enabled: !section.enabled,
    });
    loadSections();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1">
            DYNAMIC SECTION ARCHITECTURE
          </div>
          <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
            Dynamic Section Builder
          </h1>
          <p className="text-xs text-[var(--color-silver)] mt-1">
            Extend your portfolio with fully configurable engineering sectors, custom navigation nodes, and item containers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="eng-btn eng-btn-primary !text-xs !py-2.5 !px-4 font-mono flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>INITIALIZE SECTOR</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin" />
        </div>
      ) : sections.length === 0 ? (
        <div className="eng-card p-12 text-center">
          <Layers className="w-10 h-10 text-[var(--color-gunmetal)] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[var(--color-pure-white)] font-display mb-1">
            NO DYNAMIC SECTIONS CREATED
          </h3>
          <p className="text-xs text-[var(--color-silver)] max-w-sm mx-auto mb-4">
            Initialize your first dynamic section to display specialized mechanical engineering portfolios.
          </p>
          <button onClick={handleOpenCreate} className="eng-btn eng-btn-secondary !text-xs !py-2">
            Create Custom Section
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="eng-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[rgba(0,212,255,0.3)] transition-all"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.15)] flex items-center justify-center text-[var(--color-cyan)] flex-shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
                      {section.name}
                    </h3>
                    <span className="text-[0.6rem] font-mono text-[var(--color-cyan)] px-1.5 py-0.5 rounded bg-[rgba(0,212,255,0.06)]">
                      #{section.slug}
                    </span>
                  </div>
                  <div className="text-[0.65rem] font-mono text-[var(--color-silver)] mt-0.5">
                    LAYOUT // {section.content_type?.toUpperCase()} · ORDER: {section.navigation_order}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => toggleVisibility(section)}
                  className={`p-2 rounded-md border text-xs font-mono transition-colors ${
                    section.enabled
                      ? 'border-emerald-800 bg-emerald-950/40 text-emerald-400'
                      : 'border-[rgba(255,255,255,0.08)] text-[var(--color-gunmetal)]'
                  }`}
                  title={section.enabled ? 'Section Enabled' : 'Section Disabled'}
                >
                  {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setEditingSection(section);
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[var(--color-silver)] hover:text-white"
                  title="Edit Specifications"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(section.id)}
                  className="p-2 rounded-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-red-400 hover:bg-red-950/20"
                  title="Delete Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && editingSection && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)] mb-4">
              <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
                {editingSection.id ? 'Edit Dynamic Section' : 'Create New Dynamic Section'}
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
                  SECTION TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={editingSection.name || ''}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      name: e.target.value,
                      slug: editingSection.slug || generateSlug(e.target.value),
                    })
                  }
                  placeholder="e.g. Additive Manufacturing & Rapid Prototyping"
                  className="eng-input"
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                  URL SLUG *
                </label>
                <input
                  type="text"
                  required
                  value={editingSection.slug || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, slug: generateSlug(e.target.value) })
                  }
                  placeholder="additive-manufacturing"
                  className="eng-input"
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={editingSection.description || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, description: e.target.value })
                  }
                  placeholder="Briefly describe the engineering scope of this section..."
                  className="eng-input eng-textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                    LAYOUT PATTERN
                  </label>
                  <select
                    value={editingSection.content_type || 'grid'}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        content_type: e.target.value as SectionContentType,
                      })
                    }
                    className="eng-input eng-select text-xs font-mono"
                  >
                    <option value="grid">Grid (Cards)</option>
                    <option value="list">List</option>
                    <option value="timeline">Timeline</option>
                    <option value="gallery">Gallery</option>
                    <option value="document">Document View</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1">
                    NAVIGATION ORDER
                  </label>
                  <input
                    type="number"
                    value={editingSection.navigation_order || 0}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        navigation_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="eng-input"
                  />
                </div>
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
                  <span>Commit Section</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
