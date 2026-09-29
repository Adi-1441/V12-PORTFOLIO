import { useState, useEffect } from 'react';
import {
  fetchContactInfo,
  updateContactInfo,
  insertItem,
} from '@/lib/portfolioService';
import type { ContactInfo } from '@/lib/types';
import { Mail, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminContact() {
  const [contact, setContact] = useState<Partial<ContactInfo>>({
    heading: 'Initiate Technical Collaboration',
    description:
      'Available for mechanical design consulting, finite element simulation projects, fluid flow optimizations, and automation control system design.',
    email: '',
    phone: '',
    location: 'India',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    fetchContactInfo().then(({ data }) => {
      if (mounted) {
        if (data) setContact(data);
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
      if (contact.id) {
        const { success, error } = await updateContactInfo(contact.id, contact);
        if (!success) throw new Error(error || 'Failed to update contact info');
      } else {
        const { data, error } = await insertItem('contact_info', contact);
        if (error) throw new Error(error);
        if (data) setContact(data);
      }
      setFeedback({ type: 'success', message: 'COMMUNICATION PARAMETERS COMMITTED // Settings saved.' });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Save failed',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <div className="text-xs font-mono text-[var(--color-cyan)] uppercase tracking-wider mb-1">
          COMMUNICATION REPOSITORIES
        </div>
        <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
          Contact Console Configuration
        </h1>
        <p className="text-xs text-[var(--color-silver)] mt-1">
          Manage coordinates, communication heading, email channels, and collaboration briefs displayed in the public contact terminal.
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

      <form onSubmit={handleSave} className="eng-card p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
          <Mail className="w-4 h-4 text-[var(--color-cyan)]" />
          <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)]">
            Communication Channel Specs
          </h3>
        </div>

        <div>
          <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
            HEADER BANNER TEXT
          </label>
          <input
            type="text"
            required
            value={contact.heading || ''}
            onChange={(e) => setContact({ ...contact, heading: e.target.value })}
            className="eng-input"
          />
        </div>

        <div>
          <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
            COLLABORATION BRIEF / DESCRIPTION
          </label>
          <textarea
            rows={3}
            value={contact.description || ''}
            onChange={(e) => setContact({ ...contact, description: e.target.value })}
            className="eng-input eng-textarea"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              PRIMARY EMAIL
            </label>
            <input
              type="email"
              value={contact.email || ''}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="engineer@domain.com"
              className="eng-input"
            />
          </div>

          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              TELEPHONE
            </label>
            <input
              type="text"
              value={contact.phone || ''}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className="eng-input"
            />
          </div>

          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              GEOGRAPHIC LOCATION
            </label>
            <input
              type="text"
              value={contact.location || ''}
              onChange={(e) => setContact({ ...contact, location: e.target.value })}
              className="eng-input"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="eng-btn eng-btn-primary !px-6 !py-2.5 text-xs font-mono"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'UPDATING...' : 'COMMIT SETTINGS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
