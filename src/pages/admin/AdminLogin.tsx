import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Mail, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate('/admin');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background CAD grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 eng-grid" />

      <div className="w-full max-w-md relative z-10 eng-card p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center text-[var(--color-cyan)] mb-3 shadow-[0_0_20px_rgba(0,212,255,0.15)]">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-[0.65rem] font-mono text-[var(--color-cyan)] tracking-widest uppercase mb-1">
            CONTROL ACCESS PORTAL
          </div>
          <h1 className="text-xl font-bold font-display text-[var(--color-pure-white)]">
            Admin Authentication
          </h1>
          <p className="text-xs text-[var(--color-silver)] mt-1">
            V12 Mechanical Engineering CMS & Digital Twin Console
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs font-mono text-red-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              SECURITY CREDENTIAL // EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--color-gunmetal)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domain.com"
                className="eng-input !pl-10 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[0.65rem] font-mono text-[var(--color-silver)] uppercase">
                AUTHORIZATION KEY // PASSWORD
              </label>
              <Link
                to="/admin/reset-password"
                className="text-[0.65rem] font-mono text-[var(--color-cyan)] hover:underline"
              >
                Reset Key?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--color-gunmetal)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="eng-input !pl-10 text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="eng-btn eng-btn-primary w-full !py-3 text-xs font-mono tracking-wider mt-4"
          >
            <span>{loading ? 'AUTHENTICATING...' : 'ACCESS CONSOLE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)] text-center">
          <Link
            to="/"
            className="text-[0.7rem] font-mono text-[var(--color-silver)] hover:text-[var(--color-cyan)] transition-colors"
          >
            ← Return to Public Digital Twin
          </Link>
        </div>
      </div>
    </div>
  );
}
