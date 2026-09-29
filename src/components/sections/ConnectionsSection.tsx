import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink, Network, ShieldCheck, Share2 } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { fetchConnections } from '@/lib/portfolioService';
import type { Connection } from '@/lib/types';

export default function ConnectionsSection() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchConnections().then(({ data }) => {
      if (mounted) {
        setConnections(data || []);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="connections" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Professional Engineering Network Linkages Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
              linear-gradient(rgba(0, 212, 255, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 36px 36px, 36px 36px',
          }}
        />
        {/* Subtle horizontal network bus */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.2)] to-transparent" />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="NETWORK NODES"
          title="Professional Connections & Ecosystem"
          description="Verified engineering repositories, research networks, professional affiliations, and collaborative communication pipelines."
          badge="COLLABORATION"
        />

        {/* Network Telemetry Status Banner */}
        <div className="mb-8 p-3 rounded-xl bg-[rgba(10,12,18,0.7)] border border-[rgba(0,212,255,0.2)] flex flex-wrap items-center justify-between gap-4 text-[0.68rem] font-mono text-[var(--color-silver)] backdrop-blur-md">
          <div className="flex items-center gap-2 text-[var(--color-cyan)]">
            <Network className="w-3.5 h-3.5" />
            <span>NODE STATUS: ONLINE &bull; GLOBAL ENGINEERING REACH</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AUTHENTICATED REPOSITORIES ONLY</span>
          </div>
        </div>

        {loading ? (
          <LoadingState label="QUERYING NETWORK NODES..." />
        ) : connections.length === 0 ? (
          <EmptyState
            category="NETWORK PROTOCOL"
            title="NO EXTERNAL CONNECTIONS CONFIGURED"
            message="No external platform links are currently registered in the database. Use the Admin Dashboard to add verified links for LinkedIn, GitHub, and research repositories."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {connections.map((conn, index) => (
              <motion.a
                key={conn.id}
                href={conn.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="eng-card p-5 sm:p-6 flex flex-col justify-between group hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300 relative overflow-hidden"
              >
                {/* Top glow trace */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-cyan)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[var(--color-cyan)] group-hover:scale-110 transition-transform">
                      <Globe className="w-5 h-5" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-[var(--color-gunmetal)] group-hover:text-[var(--color-cyan)] transition-colors" />
                  </div>

                  <h3 className="text-base font-bold font-display text-[var(--color-pure-white)] group-hover:text-[var(--color-cyan)] transition-colors mb-1">
                    {conn.name}
                  </h3>

                  <div className="text-[0.68rem] font-mono text-[var(--color-cyan-dim)] uppercase tracking-wider mb-2 font-semibold">
                    {conn.platform}
                  </div>

                  {conn.description && (
                    <p className="text-xs text-[var(--color-silver)] line-clamp-2 leading-relaxed">
                      {conn.description}
                    </p>
                  )}
                </div>

                <div className="pt-3.5 border-t border-[rgba(255,255,255,0.06)] mt-4 flex items-center justify-between text-[0.68rem] font-mono text-[var(--color-cyan)] font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>CONNECT NODE</span>
                  <span>→</span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
