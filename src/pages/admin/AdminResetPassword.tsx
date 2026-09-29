import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowRight, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function AdminResetPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setStatus('error');
        setMessage(error.message);
      } else {
        setStatus('success');
        setMessage('PASSWORD RESET TRANSMITTED // Check provided email address for secure token.');
      }
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Transmission failed');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 eng-grid" />

      <div className="w-full max-w-md relative z-10 eng-card p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center text-[var(--color-cyan)] mb-3">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="text-[0.65rem] font-mono text-[var(--color-cyan)] tracking-widest uppercase mb-1">
            KEY RECOVERY PROTOCOL
          </div>
          <h1 className="text-xl font-bold font-display text-[var(--color-pure-white)]">
            Reset Password
          </h1>
          <p className="text-xs text-[var(--color-silver)] mt-1">
            Dispatch a password recovery dispatch to your registered administrative email.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
              status === 'success'
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-red-950/40 border-red-800 text-red-300'
            }`}
          >
            {status === 'success' ? (
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
            )}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
              REGISTERED ADMIN EMAIL
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

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="eng-btn eng-btn-primary w-full !py-3 text-xs font-mono tracking-wider mt-4"
          >
            <span>{status === 'submitting' ? 'DISPATCHING...' : 'SEND RECOVERY LINK'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[0.7rem] font-mono text-[var(--color-silver)]">
          <Link to="/admin/login" className="hover:text-[var(--color-cyan)]">
            ← Back to Login
          </Link>
          <Link to="/" className="hover:text-[var(--color-cyan)]">
            Digital Twin Home
          </Link>
        </div>
      </div>
    </div>
  );
}
