import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Box,
  Microscope,
  Binary,
  Award,
  Wrench,
  BookOpen,
  Layers,
  ArrowRight,
  Activity,
} from 'lucide-react';
import {
  fetchProjects,
  fetchCadCae,
  fetchResearch,
  fetchPlcPrograms,
  fetchCertifications,
  fetchSkills,
  fetchArticles,
  fetchSections,
} from '@/lib/portfolioService';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    projects: 0,
    cadCae: 0,
    research: 0,
    plc: 0,
    certifications: 0,
    skills: 0,
    articles: 0,
    sections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchProjects(),
      fetchCadCae(),
      fetchResearch(),
      fetchPlcPrograms(),
      fetchCertifications(),
      fetchSkills(),
      fetchArticles(),
      fetchSections(),
    ]).then(([p, c, r, plc, certs, sk, art, sec]) => {
      if (mounted) {
        setCounts({
          projects: p.data?.length || 0,
          cadCae: c.data?.length || 0,
          research: r.data?.length || 0,
          plc: plc.data?.length || 0,
          certifications: certs.data?.length || 0,
          skills: sk.data?.length || 0,
          articles: art.data?.length || 0,
          sections: sec.data?.length || 0,
        });
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const cards = [
    { label: 'Projects', count: counts.projects, path: '/admin/projects', icon: FolderGit2 },
    { label: 'CAD & CAE Studies', count: counts.cadCae, path: '/admin/cad-cae', icon: Box },
    { label: 'Research Papers', count: counts.research, path: '/admin/research', icon: Microscope },
    { label: 'PLC Automation', count: counts.plc, path: '/admin/plc', icon: Binary },
    { label: 'Certifications', count: counts.certifications, path: '/admin/certifications', icon: Award },
    { label: 'Skills Arsenal', count: counts.skills, path: '/admin/skills', icon: Wrench },
    { label: 'Articles', count: counts.articles, path: '/admin/articles', icon: BookOpen },
    { label: 'Dynamic Sections', count: counts.sections, path: '/admin/sections', icon: Layers },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-cyan)] mb-1">
          <Activity className="w-3.5 h-3.5" />
          <span>SYSTEM DASHBOARD OVERVIEW</span>
        </div>
        <h1 className="text-2xl font-bold font-display text-[var(--color-pure-white)]">
          Telemetry & Engineering Content Status
        </h1>
        <p className="text-xs text-[var(--color-silver)] mt-1">
          Manage database-backed digital twin assets, CAD files, publications, and dynamic sections.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.path}
              className="eng-card p-5 hover:border-[rgba(0,212,255,0.4)] transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.15)] flex items-center justify-center text-[var(--color-cyan)] group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold font-mono text-[var(--color-pure-white)]">
                  {loading ? '—' : card.count}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-[var(--color-platinum)] group-hover:text-[var(--color-cyan)] transition-colors mb-1 font-display">
                  {card.label}
                </div>
                <div className="flex items-center justify-between text-[0.6rem] font-mono text-[var(--color-silver)]">
                  <span>MANAGE SECTOR</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Operations Guide */}
      <div className="eng-card p-6 border-l-2 border-l-[var(--color-cyan)]">
        <h3 className="text-sm font-bold font-display text-[var(--color-pure-white)] mb-2">
          Adithya G — Portfolio Maintenance Guide
        </h3>
        <p className="text-xs text-[var(--color-silver)] leading-relaxed mb-3">
          All published sections directly synchronize with the Supabase database. If records are empty, the public portfolio maintains clean zero-telemetry empty states without fabricated demo data.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/profile" className="eng-btn eng-btn-secondary !text-xs !py-1.5 !px-3">
            Edit Profile & Bio
          </Link>
          <Link to="/admin/profile-photo" className="eng-btn eng-btn-ghost !text-xs !py-1.5 !px-3">
            Profile Photo
          </Link>
          <Link to="/admin/introduction" className="eng-btn eng-btn-ghost !text-xs !py-1.5 !px-3">
            Edit Introduction
          </Link>
          <Link to="/admin/about" className="eng-btn eng-btn-ghost !text-xs !py-1.5 !px-3">
            Edit About
          </Link>
          <Link to="/admin/resume" className="eng-btn eng-btn-ghost !text-xs !py-1.5 !px-3">
            Resume & CV
          </Link>
          <Link to="/admin/navigation" className="eng-btn eng-btn-ghost !text-xs !py-1.5 !px-3">
            Navigation & Visibility
          </Link>
          <Link to="/admin/settings" className="eng-btn eng-btn-ghost !text-xs !py-1.5 !px-3">
            3D & Site Settings
          </Link>
          <Link to="/admin/sections" className="eng-btn eng-btn-ghost !text-xs !py-1.5 !px-3">
            Dynamic Sections
          </Link>
        </div>
      </div>
    </div>
  );
}
