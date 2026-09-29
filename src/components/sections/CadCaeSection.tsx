import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Layers, ExternalLink, Calendar, Compass, Grid, GitCommit } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { fetchCadCae } from '@/lib/portfolioService';
import type { CadCae } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function CadCaeSection() {
  const [items, setItems] = useState<CadCae[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCadCae().then(({ data }) => {
      if (mounted) {
        setItems(data || []);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="cad-cae" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: CAD/CAE Wireframe & Simulation Mesh Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
              linear-gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
          }}
        />
        {/* Isometric drafting guide ray */}
        <div
          className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(0,212,255,0.18)] to-transparent"
        />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="COMPUTATIONAL GEOMETRY"
          title="CAD & CAE Simulation Laboratory"
          description="High-precision parametric models, finite element structural verification, mesh independence studies, and boundary condition calibrations."
          badge="MULTI-PHYSICS"
        />

        {/* Telemetry Coordinate HUD Banner */}
        <div className="mb-8 p-3 rounded-xl bg-[rgba(10,12,18,0.7)] border border-[rgba(0,212,255,0.2)] flex flex-wrap items-center justify-between gap-4 text-[0.68rem] font-mono text-[var(--color-silver)] backdrop-blur-md">
          <div className="flex items-center gap-2 text-[var(--color-cyan)]">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '15s' }} />
            <span>COORDINATE DATUM: CARTESIAN [X, Y, Z] &bull; CYLINDRICAL [R, θ, Z]</span>
          </div>
          <div className="flex items-center gap-3 text-[var(--color-gunmetal)]">
            <span>MESH SOLVER: TET10 / HEX8</span>
            <span>&bull;</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Grid className="w-3 h-3" /> CONVERGENCE VERIFIED
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingState label="FETCHING CAD/CAE SIMULATION DATA..." />
        ) : items.length === 0 ? (
          <EmptyState
            category="CAD & CAE SYSTEM"
            title="NO CAD/CAE STUDIES LOGGED"
            message="No computational analyses or 3D models are currently registered in the database. Use the Admin Dashboard to upload CAD files, FEA stress maps, and CAE simulation studies."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="eng-card flex flex-col justify-between hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(0,212,255,0.1)] transition-all duration-300 group"
              >
                <div>
                  {item.thumbnail ? (
                    <div className="relative aspect-video w-full overflow-hidden bg-[rgba(10,12,18,0.95)] border-b border-[rgba(255,255,255,0.08)]">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[rgba(10,12,18,0.85)] border border-[rgba(0,212,255,0.3)] text-[0.62rem] font-mono text-[var(--color-cyan)] font-semibold backdrop-blur-sm">
                        FEA / CAD STUDY
                      </div>
                      <div className="absolute bottom-2 right-2 text-[0.55rem] font-mono text-[var(--color-silver)] bg-[rgba(0,0,0,0.8)] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.1)]">
                        BOUNDARY SPECS CONFIGURED
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[21/9] w-full bg-[rgba(10,12,18,0.85)] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-center p-6 eng-grid">
                      <div className="flex items-center gap-2.5 text-[var(--color-cyan)]">
                        <Box className="w-8 h-8 opacity-75 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col text-left">
                          <span className="text-[0.7rem] font-mono tracking-widest uppercase font-bold">
                            CAD / MESH MODEL
                          </span>
                          <span className="text-[0.55rem] font-mono text-[var(--color-gunmetal)]">
                            ISO-10303 STEP / IGES SPEC
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between text-[0.65rem] font-mono text-[var(--color-gunmetal)] mb-2.5">
                      <span className="text-[var(--color-cyan-dim)] font-semibold">
                        {item.category || 'STRUCTURAL ANALYSIS'}
                      </span>
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.date)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-display text-[var(--color-pure-white)] group-hover:text-[var(--color-cyan)] transition-colors mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[var(--color-silver)] mb-4 leading-relaxed">
                      {item.short_description || item.description}
                    </p>

                    {item.engineering_details && (
                      <div className="p-3.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(0,212,255,0.15)] text-[0.7rem] font-mono text-[var(--color-cyan-dim)] mb-4">
                        <div className="flex items-center gap-1 text-[0.6rem] text-[var(--color-gunmetal)] uppercase mb-1 font-bold">
                          <GitCommit className="w-3 h-3 text-[var(--color-cyan)]" />
                          BOUNDARY CONDITIONS & SIMULATION TOLERANCES
                        </div>
                        {item.engineering_details}
                      </div>
                    )}

                    {item.software && item.software.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {item.software.map((sw) => (
                          <span
                            key={sw}
                            className="px-2.5 py-0.5 rounded bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.18)] text-[0.62rem] font-mono text-[var(--color-cyan)]"
                          >
                            {sw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] mt-2">
                  <div className="flex items-center gap-1.5 text-[0.65rem] font-mono text-[var(--color-silver)]">
                    <Layers className="w-3.5 h-3.5 text-[var(--color-cyan)]" />
                    <span>FINITE ELEMENT REPOSITORY</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.external_links?.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="eng-btn eng-btn-ghost !text-xs !py-1.5 !px-3"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.label || 'View Study'}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
