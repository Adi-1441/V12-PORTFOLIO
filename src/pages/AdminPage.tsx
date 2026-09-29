import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS, ProjectItem } from '@/content/projects';
import { TitleBlock } from '@/components/ui/TitleBlock';
import { Lock, ArrowLeft, Mail, Database, Activity, Trash2, CheckCircle2 } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'status'>('projects');

  // Contact form messages retrieved from client storage
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projectList, setProjectList] = useState<ProjectItem[]>(PROJECTS);

  // Form for quick project creation
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'CAD' | 'CAE' | 'Simulation' | 'Research' | 'Automation' | 'AI × Engineering'>('Simulation');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    // Check session
    const auth = sessionStorage.getItem('mechnexus_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    // Load stored messages
    try {
      const stored = JSON.parse(localStorage.getItem('mechnexus_messages') || '[]');
      setMessages(stored);
    } catch {
      setMessages([]);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default engineering gate passphrase: mechnexus2026 or admin
    if (passphrase === 'mechnexus2026' || passphrase === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('mechnexus_admin_auth', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect passphrase.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mechnexus_admin_auth');
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem('mechnexus_messages', JSON.stringify(updated));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newProj: ProjectItem = {
      id: `p-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: newTitle,
      category: newCategory,
      accentType: newCategory.includes('AI') ? 'neural' : 'mechanical',
      description: newDesc,
      tags: ['Custom Spec', 'Mechanical Design'],
      thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      titleBlock: {
        drawnBy: 'A.G.',
        rev: '01',
        date: new Date().toISOString().slice(0, 7).replace('-', '.'),
        scale: 'NTS',
      },
    };

    setProjectList([newProj, ...projectList]);
    setNewTitle('');
    setNewDesc('');
  };

  // ─── GATE VIEW (Pre-auth) ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-void text-text-primary flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-xl bg-surface border border-hairline p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="font-mono text-xs text-copper-300 uppercase tracking-widest flex items-center gap-1.5">
              <Lock size={12} />
              <span>ACCESS RESTRICTED</span>
            </div>
            <h1 className="font-display text-xl font-semibold text-text-primary">
              MechNexus Console
            </h1>
            <p className="font-body text-xs text-text-secondary">
              Internal management interface for site maintenance and messages.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block font-mono text-xs text-text-tertiary uppercase">
                Passphrase
              </label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter passphrase"
                autoFocus
                className="w-full px-3.5 py-2 rounded-lg bg-void border border-hairline focus:border-copper-300 focus:outline-none text-text-primary font-mono text-sm"
              />
            </div>

            {errorMsg && (
              <p className="font-mono text-xs text-status-error">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-elevated hover:bg-elevated-hover border border-hairline text-text-primary font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              AUTHENTICATE
            </button>
          </form>

          <div className="pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-text-tertiary">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft size={12} />
              <span>RETURN HOME</span>
            </button>
            <span>DEFAULT: mechnexus2026</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD VIEW (Post-auth) ───
  return (
    <div className="min-h-screen bg-void text-text-primary">
      {/* Top Console Bar */}
      <header className="border-b border-hairline bg-surface px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="font-display font-semibold text-base">
            <span>MECH</span>
            <span className="text-hairline opacity-60">│</span>
            <span>NEXUS</span>
            <span className="font-mono text-xs text-copper-300 ml-2">ADMIN CONSOLE</span>
          </div>
          <span className="hidden sm:inline font-mono text-xs text-text-tertiary">
            Signed in · {messages.length} messages · {projectList.length} projects published
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/work')}
            className="font-mono text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            VIEW WORK HUB
          </button>
          <button
            onClick={handleLogout}
            className="font-mono text-xs text-status-error/80 hover:text-status-error transition-colors cursor-pointer"
          >
            SIGN OUT
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-hairline pb-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-surface text-copper-300 border-t border-x border-hairline font-medium'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Database size={14} />
            <span>MANAGE PROJECTS ({projectList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-surface text-copper-300 border-t border-x border-hairline font-medium'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Mail size={14} />
            <span>MESSAGES INBOX ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'status'
                ? 'bg-surface text-copper-300 border-t border-x border-hairline font-medium'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Activity size={14} />
            <span>TELEMETRY & BUILD STATUS</span>
          </button>
        </div>

        {/* ─── TAB 1: PROJECTS ─── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Add Project Quick Form */}
            <div className="p-6 rounded-xl bg-surface border border-hairline space-y-4">
              <h3 className="font-display text-lg font-medium text-text-primary">
                Add Engineering Project Record
              </h3>
              <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs text-text-tertiary uppercase mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Centrifugal Impeller Blade Optimization"
                    className="w-full px-3 py-2 rounded-lg bg-void border border-hairline text-text-primary font-body text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-text-tertiary uppercase mb-1">
                    Discipline
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-void border border-hairline text-text-primary font-mono text-xs"
                  >
                    <option value="CAD">CAD</option>
                    <option value="CAE">CAE</option>
                    <option value="Simulation">Simulation</option>
                    <option value="Research">Research</option>
                    <option value="Automation">Automation</option>
                    <option value="AI × Engineering">AI × Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-text-tertiary uppercase mb-1">
                    Summary
                  </label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Brief description of FEA/CFD/CAD methodology"
                    className="w-full px-3 py-2 rounded-lg bg-void border border-hairline text-text-primary font-body text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-elevated hover:bg-elevated-hover border border-hairline font-mono text-xs text-copper-300 uppercase tracking-wider cursor-pointer"
                  >
                    INSERT PROJECT SPECIFICATION
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Projects Table */}
            <div className="rounded-xl bg-surface border border-hairline overflow-hidden">
              <table className="w-full text-left font-body text-sm">
                <thead className="bg-elevated font-mono text-xs text-text-tertiary uppercase border-b border-hairline">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Discipline</th>
                    <th className="p-4">Revision</th>
                    <th className="p-4">Drawn By</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {projectList.map((p) => (
                    <tr key={p.id} className="hover:bg-elevated/30 transition-colors">
                      <td className="p-4 font-medium text-text-primary">{p.title}</td>
                      <td className="p-4 font-mono text-xs text-copper-300">{p.category}</td>
                      <td className="p-4 font-mono text-xs">{p.titleBlock.rev}</td>
                      <td className="p-4 font-mono text-xs text-text-tertiary">{p.titleBlock.drawnBy}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setProjectList(projectList.filter((item) => item.id !== p.id))}
                          className="text-status-error/80 hover:text-status-error p-1 font-mono text-xs cursor-pointer"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 2: MESSAGES INBOX ─── */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-surface border border-hairline font-mono text-xs text-text-tertiary">
                NO INCOMING CONTACT TRANSMISSIONS RECORDED YET.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-xl bg-surface border border-hairline flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 font-mono text-xs text-text-tertiary">
                        <span className="font-semibold text-text-primary">{m.name}</span>
                        <span>·</span>
                        <span className="text-copper-300">{m.email}</span>
                        <span>·</span>
                        <span>{new Date(m.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="font-body text-sm text-text-secondary leading-relaxed">
                        {m.message}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="self-start text-text-tertiary hover:text-status-error transition-colors p-2 cursor-pointer"
                      title="Archive message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: STATUS & TELEMETRY ─── */}
        {activeTab === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-surface border border-hairline space-y-4">
              <h3 className="font-display text-lg font-medium text-text-primary">
                Build & Runtime Telemetry
              </h3>
              <div className="space-y-2 font-mono text-xs text-text-secondary">
                <div className="flex justify-between py-1.5 border-b border-hairline">
                  <span className="text-text-tertiary">ENVIRONMENT</span>
                  <span className="text-text-primary">Vite 8.3 / React 19 Client</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-hairline">
                  <span className="text-text-tertiary">RENDER ENGINE</span>
                  <span className="text-copper-300">Three.js WebGL / R3F</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-hairline">
                  <span className="text-text-tertiary">VERSION HASH</span>
                  <span className="text-text-primary">SHA: a7f89d4 (v1.2.0)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-hairline">
                  <span className="text-text-tertiary">SYS TIME</span>
                  <span className="text-text-primary">{new Date().toISOString()}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-text-tertiary">GATE SECURITY</span>
                  <span className="text-status-online">ACTIVE (PASSKEY VERIFIED)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-surface border border-hairline space-y-4">
              <h3 className="font-display text-lg font-medium text-text-primary">
                Design System Specification
              </h3>
              <div className="space-y-2 font-mono text-xs text-text-tertiary">
                <p>• Primary Mechanical Accent: <span className="text-copper-300 font-bold">#D4844A</span></p>
                <p>• Neural / AI Accent: <span className="text-violet-300 font-bold">#A855F7</span></p>
                <p>• Surface: <span className="text-text-secondary">#131218</span> / Void: <span className="text-text-secondary">#0B0A10</span></p>
                <p>• Signature Ease: cubic-bezier(0.16, 1, 0.3, 1)</p>
                <p>• Typography: Space Grotesk / Inter / JetBrains Mono</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
