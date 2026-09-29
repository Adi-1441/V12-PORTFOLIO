import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  User,
  Camera,
  Sparkles,
  BookOpen,
  FileText,
  Box,
  Navigation,
  Sliders,
  Layers,
  FolderGit2,
  Microscope,
  Binary,
  Award,
  Wrench,
  Globe,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Cpu,
  Brain,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [loading, isAuthenticated, navigate]);

  const navItems = [
    // ── System Overview
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    // ── Profile & Identity
    { label: 'Profile & Bio', path: '/admin/profile', icon: User },
    { label: 'Profile Photo', path: '/admin/profile-photo', icon: Camera },
    // ── Page Content Editors
    { label: 'Introduction Page', path: '/admin/introduction', icon: Sparkles },
    { label: 'About Section', path: '/admin/about', icon: BookOpen },
    { label: 'Resume & CV', path: '/admin/resume', icon: FileText },
    { label: 'Digital Twin 3D', path: '/admin/digital-twin', icon: Box },
    // ── Site Configuration
    { label: 'Navigation & Visibility', path: '/admin/navigation', icon: Navigation },
    { label: 'Site & 3D Settings', path: '/admin/settings', icon: Sliders },
    { label: 'Dynamic Sections', path: '/admin/sections', icon: Layers },
    // ── Portfolio Content Sectors
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'CAD & CAE', path: '/admin/cad-cae', icon: Box },
    { label: 'Research', path: '/admin/research', icon: Microscope },
    { label: 'PLC Automation', path: '/admin/plc', icon: Binary },
    { label: 'Certifications', path: '/admin/certifications', icon: Award },
    { label: 'Skills Arsenal', path: '/admin/skills', icon: Wrench },
    { label: 'AI × Engineering', path: '/admin/ai-engineering', icon: Brain },
    { label: 'Articles', path: '/admin/articles', icon: BookOpen },
    { label: 'Connections', path: '/admin/connections', icon: Globe },
    { label: 'Contact Settings', path: '/admin/contact', icon: Mail },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[var(--color-cyan)] border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-[var(--color-cyan)] tracking-wider">
            VERIFYING CREDENTIAL SIGNATURES...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="flex items-center justify-between gap-2 mb-8 pb-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[var(--color-cyan)]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold font-display text-[var(--color-pure-white)]">
                V12 CMS
              </div>
              <div className="text-[0.6rem] font-mono text-[var(--color-cyan)]">
                CONTROL CENTER
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-[var(--color-silver)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[rgba(0,212,255,0.1)] text-[var(--color-cyan)] border border-[rgba(0,212,255,0.25)] font-semibold'
                      : 'text-[var(--color-silver)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-[var(--color-platinum)] hover:text-[var(--color-cyan)] transition-colors mb-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </a>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs font-mono text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md bg-[rgba(255,255,255,0.05)] text-[var(--color-silver)]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs font-mono text-[var(--color-silver)] hidden sm:block">
              SESSION //{' '}
              <span className="text-[var(--color-cyan)]">{user?.email || 'AUTHENTICATED'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800 text-[0.65rem] font-mono text-emerald-400">
              SUPABASE CONNECTED
            </div>
          </div>
        </header>

        {/* Nested Sub-route views */}
        <Outlet />
      </div>
    </div>
  );
}
