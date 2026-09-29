import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Binary, ExternalLink, Calendar, Workflow, Activity, Terminal } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { fetchPlcPrograms } from '@/lib/portfolioService';
import type { PlcProgram } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function PlcSection() {
  const [programs, setPrograms] = useState<PlcProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchPlcPrograms().then(({ data }) => {
      if (mounted) {
        setPrograms(data || []);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="plc" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Industrial Automation Ladder Bus Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 80% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 45%),
              linear-gradient(rgba(0, 212, 255, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 32px 32px, 32px 32px',
          }}
        />
        {/* Vertical power rails for ladder logic visual feel */}
        <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-[rgba(0,212,255,0.15)]" />
        <div className="absolute right-8 top-0 bottom-0 w-[2px] bg-[rgba(0,212,255,0.15)]" />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="AUTOMATION & CONTROL"
          title="PLC Programming & Industrial Robotics"
          description="Deterministic control sequences, ladder logic, structured text architectures, SCADA supervision, and robotic actuator synchronization."
          badge="AUTOMATION"
        />

        {/* Industrial I/O Bus Status Banner */}
        <div className="mb-8 p-3 rounded-xl bg-[rgba(10,12,18,0.7)] border border-[rgba(0,212,255,0.2)] flex flex-wrap items-center justify-between gap-4 text-[0.68rem] font-mono text-[var(--color-silver)] backdrop-blur-md">
          <div className="flex items-center gap-2 text-[var(--color-cyan)]">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>PLC SCAN CYCLE: DETERMINISTIC // IEC 61131-3 STANDARD</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-gunmetal)]">
            <Terminal className="w-3.5 h-3.5 text-[var(--color-cyan)]" />
            <span>LANGUAGES: LD &bull; ST &bull; FBD &bull; SFC</span>
          </div>
        </div>

        {loading ? (
          <LoadingState label="ACQUIRING PLC CONTROL SYSTEM LOGS..." />
        ) : programs.length === 0 ? (
          <EmptyState
            category="AUTOMATION ARCHIVE"
            title="NO PLC ROUTINES LOGGED"
            message="No PLC automation programs are currently registered in the database. Use the Admin Dashboard to record ladder logic scripts, CODESYS programs, and robotic motion routines."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="eng-card flex flex-col justify-between hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,212,255,0.08)] transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between text-[0.65rem] font-mono text-[var(--color-gunmetal)] mb-3">
                    <div className="flex items-center gap-1.5 text-[var(--color-cyan)] font-semibold">
                      <Workflow className="w-3.5 h-3.5" />
                      <span>{item.category || 'PLC LOGIC'}</span>
                    </div>
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.date)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold font-display text-[var(--color-pure-white)] group-hover:text-[var(--color-cyan)] transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[var(--color-silver)] mb-4 leading-relaxed line-clamp-3">
                    {item.short_description || item.description}
                  </p>

                  {item.software && item.software.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.software.map((sw) => (
                        <span
                          key={sw}
                          className="px-2.5 py-0.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[0.62rem] font-mono text-[var(--color-platinum)]"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] mt-2">
                  <div className="flex items-center gap-1.5 text-[0.65rem] font-mono text-[var(--color-cyan-dim)]">
                    <Binary className="w-3.5 h-3.5" />
                    <span>LADDER / ST LOGIC</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.external_links?.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="eng-btn eng-btn-ghost !text-xs !py-1 !px-2.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.label || 'Code / Logic'}
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
