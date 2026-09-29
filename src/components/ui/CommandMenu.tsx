import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Compass,
  Layers,
  Box,
  Cpu,
  FileCode2,
  Activity,
  Award,
  BookOpen,
  Mail,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { scrollToSection } from '@/lib/utils';
import { useDigitalTwinStore } from '../digital-twin/useDigitalTwinStore';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { setState: setTwinState } = useDigitalTwinStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNav = (id: string) => {
    onClose();
    if (window.location.pathname !== '/work') {
      navigate(`/work#${id}`);
    } else {
      scrollToSection(id);
    }
  };

  const navItems = [
    { label: 'About Engineer & Identity', id: 'about', icon: Compass },
    { label: 'Engineering Capability Matrix', id: 'skills', icon: Cpu },
    { label: 'Verified Project Archives', id: 'projects', icon: Box },
    { label: 'Research Publications & Lab', id: 'research', icon: Activity },
    { label: 'CAD & Computational CAE', id: 'cad-cae', icon: Layers },
    { label: 'PLC & Mechatronics Automation', id: 'plc', icon: FileCode2 },
    { label: 'Verified Engineering Certifications', id: 'certifications', icon: Award },
    { label: 'AI × Engineering Computational Systems', id: 'ai-engineering', icon: Cpu },
    { label: 'Technical Documentation & Articles', id: 'articles', icon: BookOpen },
    { label: 'Engineering Dossier / Resume', id: 'resume', icon: FileCode2 },
    { label: 'Professional Engineering Connections', id: 'connections', icon: ExternalLink },
    { label: 'Secure Communication Channel', id: 'contact', icon: Mail },
  ];

  const filteredNav = navItems.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-void/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-xl bg-surface border border-cyan/40 shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_24px_rgba(0,212,255,0.15)] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline bg-elevated/40">
          <Search size={16} className="text-cyan" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to an engineering sector..."
            autoFocus
            className="w-full bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none font-mono text-sm"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-text-tertiary hover:text-text-primary cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Quick Sectors */}
          <div>
            <div className="px-2 py-1 font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
              NAVIGATION ROUTING
            </div>
            <div className="space-y-1 mt-1">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-elevated hover:text-cyan transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className="text-text-tertiary group-hover:text-cyan" />
                      <span className="font-mono text-xs text-text-secondary group-hover:text-text-primary">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-text-tertiary group-hover:text-cyan">
                      #{item.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick 3D Core Mode Commands */}
          <div className="pt-2 border-t border-hairline">
            <div className="px-2 py-1 font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
              DIGITAL TWIN STATES
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-1 font-mono text-xs">
              <button
                onClick={() => {
                  setTwinState('blueprint');
                  onClose();
                }}
                className="px-3 py-2 rounded bg-elevated/40 hover:bg-elevated text-text-secondary hover:text-cyan text-left cursor-pointer"
              >
                MODE: CAD BLUEPRINT
              </button>
              <button
                onClick={() => {
                  setTwinState('inspection');
                  onClose();
                }}
                className="px-3 py-2 rounded bg-elevated/40 hover:bg-elevated text-text-secondary hover:text-amber text-left cursor-pointer"
              >
                MODE: GD&T INSPECTION
              </button>
              <button
                onClick={() => {
                  setTwinState('flow');
                  onClose();
                }}
                className="px-3 py-2 rounded bg-elevated/40 hover:bg-elevated text-text-secondary hover:text-cyan text-left cursor-pointer"
              >
                MODE: FLOW STREAMLINES
              </button>
              <button
                onClick={() => {
                  setTwinState('analysis');
                  onClose();
                }}
                className="px-3 py-2 rounded bg-elevated/40 hover:bg-elevated text-text-secondary hover:text-blue text-left cursor-pointer"
              >
                MODE: FEA VON MISES
              </button>
            </div>
          </div>

          {/* Admin Shortcut */}
          <div className="pt-2 border-t border-hairline">
            <button
              onClick={() => {
                onClose();
                navigate('/admin/login');
              }}
              className="w-full px-3 py-2 rounded bg-surface hover:bg-elevated border border-hairline flex items-center justify-between font-mono text-xs text-text-tertiary hover:text-cyan cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-amber" />
                <span>ADMINISTRATIVE CMS PORTAL</span>
              </div>
              <span>/admin/login</span>
            </button>
          </div>
        </div>

        {/* Footer Shortcut Helper */}
        <div className="px-4 py-2 bg-void border-t border-hairline flex items-center justify-between font-mono text-[10px] text-text-tertiary">
          <span>SELECT: ENTER · CLOSE: ESC</span>
          <span>MECHNEXUS COMMAND OS</span>
        </div>
      </div>
    </div>
  );
}
