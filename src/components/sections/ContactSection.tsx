import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, Radio, Shield, Signal } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { fetchContactInfo, fetchProfile, sendContactMessage } from '@/lib/portfolioService';
import type { ContactInfo, Profile } from '@/lib/types';

export default function ContactSection() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchContactInfo().then(({ data }) => {
      if (mounted && data) setContactInfo(data);
    });
    fetchProfile().then(({ data }) => {
      if (mounted && data) setProfile(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Real configured recipient email (never fake placeholder)
  const configuredEmail = contactInfo?.email || profile?.email || '';
  const phone = contactInfo?.phone || profile?.phone;
  const location = contactInfo?.location || profile?.location || 'India';
  const heading = contactInfo?.heading || 'Initiate Technical Collaboration';
  const description =
    contactInfo?.description ||
    'Direct communication channel for mechanical design consulting, finite element simulation verification, thermal/CFD modeling, and automation architectures.';

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!formData.name.trim()) {
      setStatus('error');
      setStatusMessage('TRANSMISSION FAILED — PLEASE PROVIDE YOUR IDENTIFIER / NAME');
      return;
    }

    if (!validateEmail(formData.email.trim())) {
      setStatus('error');
      setStatusMessage('TRANSMISSION FAILED — ENTER A VALID RETURN ADDRESS');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 8) {
      setStatus('error');
      setStatusMessage('TRANSMISSION FAILED — MESSAGE MUST CONTAIN ADEQUATE TECHNICAL DETAIL');
      return;
    }

    setStatus('submitting');
    setStatusMessage('TRANSMITTING...');

    try {
      const { success, error } = await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Engineering Collaboration Inquiry',
        message: formData.message.trim(),
        recipientEmail: configuredEmail || undefined,
      });

      if (!success) {
        throw new Error(error || 'Server dispatch error');
      }

      setStatus('success');
      setStatusMessage('MESSAGE TRANSMITTED // Telemetry packet delivered to engineer inbox.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      console.error('[Contact Transmission]', err);
      setStatus('error');
      setStatusMessage(
        err instanceof Error && err.message
          ? `TRANSMISSION FAILED — TRY AGAIN (${err.message})`
          : 'TRANSMISSION FAILED — TRY AGAIN'
      );
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Secure Communication Grid & Signal Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 80% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
              linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
          }}
        />
        {/* Subtle horizontal signal beam */}
        <div
          className="absolute left-0 right-0 h-px top-1/3 bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.25)] to-transparent"
          style={{ animation: 'pulseGlow 4s ease-in-out infinite' }}
        />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="COMMUNICATION CONSOLE"
          title="Direct Inquiries & Collaboration"
          description={description}
          badge="SECURE CHANNEL"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channel Coordinates */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 eng-card p-6 md:p-8 flex flex-col justify-between relative group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Signal className="w-24 h-24 text-[var(--color-cyan)]" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-4 h-4 text-[var(--color-cyan)] animate-pulse" />
                <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-cyan)]">
                  TELEMETRY LINK: ACTIVE
                </span>
              </div>

              <h3 className="text-xl font-bold font-display text-[var(--color-pure-white)] mb-2">
                {heading}
              </h3>
              <p className="text-xs text-[var(--color-silver)] leading-relaxed mb-6">
                Verified channel for research collaborations, engineering recruitment, CAD/CAE technical evaluations, and prototyping consultations.
              </p>

              <div className="space-y-4">
                {/* Electronic Mail */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.2)] transition-colors">
                  <div className="w-9 h-9 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[var(--color-cyan)] flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.6rem] font-mono text-[var(--color-gunmetal)] uppercase tracking-wider">
                      ELECTRONIC MAIL CHANNEL
                    </div>
                    {configuredEmail ? (
                      <a
                        href={`mailto:${configuredEmail}`}
                        className="text-xs font-mono text-[var(--color-platinum)] hover:text-[var(--color-cyan)] break-all transition-colors"
                      >
                        {configuredEmail}
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-[var(--color-titanium)]">
                        [DIRECT TRANSMISSION CONSOLE ACTIVE]
                      </span>
                    )}
                  </div>
                </div>

                {/* Telephone if configured */}
                {phone && (
                  <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.2)] transition-colors">
                    <div className="w-9 h-9 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[var(--color-cyan)] flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-mono text-[var(--color-gunmetal)] uppercase tracking-wider">
                        TELECOMMUNICATION
                      </div>
                      <span className="text-xs font-mono text-[var(--color-platinum)]">
                        {phone}
                      </span>
                    </div>
                  </div>
                )}

                {/* Location Coordinates */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.2)] transition-colors">
                  <div className="w-9 h-9 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[var(--color-cyan)] flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[0.6rem] font-mono text-[var(--color-gunmetal)] uppercase tracking-wider">
                      PRIMARY LAB COORDINATES
                    </div>
                    <span className="text-xs font-mono text-[var(--color-platinum)]">
                      {location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[0.6rem] font-mono text-[var(--color-gunmetal)]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                END-TO-END VERIFIED
              </span>
              <span>NOMINAL 24H SLA</span>
            </div>
          </motion.div>

          {/* Right Column: High-Precision Transmission Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 eng-card p-6 md:p-8 relative"
          >
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-cyan)] shadow-[0_0_8px_var(--color-cyan)]" />
                <span className="text-xs font-mono font-bold text-[var(--color-pure-white)] uppercase tracking-wider">
                  ENGINEERING DISPATCH TERMINAL
                </span>
              </div>
              <span className="text-[0.6rem] font-mono text-[var(--color-gunmetal)]">
                PROTOCOL // SMTP-EDGE-V12
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                    IDENTIFIER / NAME *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={status === 'submitting'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Robert Vance"
                    className="eng-input"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                    RETURN ADDRESS / EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={status === 'submitting'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. contact@institution.org"
                    className="eng-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                  DISPATCH SUBJECT
                </label>
                <input
                  type="text"
                  disabled={status === 'submitting'}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. FEA Meshing Verification Collaboration"
                  className="eng-input"
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-mono text-[var(--color-silver)] uppercase mb-1.5">
                  TECHNICAL BRIEF / MESSAGE *
                </label>
                <textarea
                  required
                  rows={4}
                  disabled={status === 'submitting'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Specify project parameters, boundary conditions, simulation requirements, or collaboration scope..."
                  className="eng-input eng-textarea"
                />
              </div>

              {/* Status Indicator */}
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-lg border text-xs font-mono flex items-center gap-2.5 ${
                    status === 'success'
                      ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300'
                      : status === 'error'
                      ? 'bg-red-950/40 border-red-600/60 text-red-300'
                      : 'bg-cyan-950/40 border-cyan-600/60 text-cyan-300'
                  }`}
                >
                  {status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  ) : status === 'error' ? (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin flex-shrink-0" />
                  )}
                  <span className="font-medium tracking-wide">
                    {statusMessage ||
                      (status === 'submitting'
                        ? 'TRANSMITTING...'
                        : status === 'success'
                        ? 'MESSAGE TRANSMITTED'
                        : 'TRANSMISSION FAILED — TRY AGAIN')}
                  </span>
                </motion.div>
              )}

              {/* Submit Button with Exact Required States */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="eng-btn eng-btn-primary w-full !py-3.5 font-mono tracking-wider text-xs transition-all active:scale-[0.99]"
              >
                <Send className={`w-4 h-4 ${status === 'submitting' ? 'animate-bounce' : ''}`} />
                <span>
                  {status === 'submitting'
                    ? 'TRANSMITTING...'
                    : status === 'success'
                    ? 'MESSAGE TRANSMITTED'
                    : status === 'error'
                    ? 'TRANSMISSION FAILED — TRY AGAIN'
                    : 'TRANSMIT DISPATCH →'}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
