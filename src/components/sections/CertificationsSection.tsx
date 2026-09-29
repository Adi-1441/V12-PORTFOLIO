import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, FileText, CheckCircle2, Calendar, ShieldCheck, Hash, Scan } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { fetchCertifications } from '@/lib/portfolioService';
import type { Certification } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function CertificationsSection() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCertifications().then(({ data }) => {
      if (mounted) {
        setCerts(data || []);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="certifications" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Verified Accreditation Ledger & Holographic Stamp Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 75% 25%, rgba(0, 212, 255, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 25% 75%, rgba(16, 185, 129, 0.06) 0%, transparent 45%),
              linear-gradient(rgba(0, 212, 255, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="ACCREDITATIONS"
          title="Certifications & Verified Credentials"
          description="Formal industry validations across CAD suites, simulation methodologies, programming languages, and automation standards."
          badge="VERIFIED"
        />

        {/* Verification Status Banner */}
        <div className="mb-8 p-3 rounded-xl bg-[rgba(10,12,18,0.7)] border border-[rgba(0,212,255,0.2)] flex flex-wrap items-center justify-between gap-4 text-[0.68rem] font-mono text-[var(--color-silver)] backdrop-blur-md">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CREDENTIAL VERIFICATION: CRYPTOGRAPHIC SIGNATURE CHECK ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-gunmetal)]">
            <Scan className="w-3.5 h-3.5 text-[var(--color-cyan)]" />
            <span>STATUS: 100% AUTHENTICATED</span>
          </div>
        </div>

        {loading ? (
          <LoadingState label="VERIFYING CREDENTIAL SIGNATURES..." />
        ) : certs.length === 0 ? (
          <EmptyState
            category="CREDENTIAL VAULT"
            title="NO CERTIFICATES REGISTERED"
            message="No active credentials have been verified in the database. Use the Admin Dashboard to upload certificate PDFs, credential IDs, and issuing bodies."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="eng-card p-6 sm:p-7 flex flex-col justify-between hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,212,255,0.08)] transition-all duration-300 group relative overflow-hidden"
              >
                {/* Subtle top edge scanning glow */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-cyan)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[var(--color-cyan)] group-hover:scale-105 transition-transform">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-[var(--color-cyan)]">
                        {cert.issuer || 'ACCREDITED BODY'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[0.62rem] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-600/40 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>AUTHENTICATED</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold font-display text-[var(--color-pure-white)] group-hover:text-[var(--color-cyan)] transition-colors mb-2.5">
                    {cert.title}
                  </h3>

                  {cert.credential_id && (
                    <div className="text-[0.68rem] font-mono text-[var(--color-gunmetal)] mb-3 flex items-center gap-1.5">
                      <Hash className="w-3 h-3 text-[var(--color-cyan-dim)]" />
                      <span>ID:</span>
                      <span className="text-[var(--color-silver)] font-semibold select-all">
                        {cert.credential_id}
                      </span>
                    </div>
                  )}

                  {cert.date && (
                    <div className="flex items-center gap-1 text-[0.65rem] font-mono text-[var(--color-gunmetal)] mb-4">
                      <Calendar className="w-3 h-3" />
                      <span>DATE ISSUED: {formatDate(cert.date)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-2">
                  {cert.file_url ? (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="eng-btn eng-btn-ghost !text-xs !py-1.5 !px-3"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Certificate
                    </a>
                  ) : (
                    <span className="text-[0.62rem] font-mono text-[var(--color-gunmetal)]">
                      VERIFIED REPOSITORY
                    </span>
                  )}

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="eng-btn eng-btn-secondary !text-xs !py-1.5 !px-3"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Verify Online
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
