import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, ExternalLink, Calendar, FileText } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { fetchSectionItems } from '@/lib/portfolioService';
import type { PortfolioSection, SectionItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function DynamicSection({ section }: { section: PortfolioSection }) {
  const [items, setItems] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchSectionItems(section.id).then(({ data }) => {
      if (mounted) {
        setItems(data || []);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [section.id]);

  if (!section.enabled) return null;

  return (
    <section id={section.slug} className="section-padding relative">
      <div className="section-container relative z-10">
        <SectionHeader
          label={`SECTOR // ${section.slug.toUpperCase()}`}
          title={section.name}
          description={section.description}
          badge="DYNAMIC"
        />

        {loading ? (
          <LoadingState label={`LOADING SECTOR ${section.name.toUpperCase()}...`} />
        ) : items.length === 0 ? (
          <EmptyState
            category={`SECTION // ${section.name}`}
            title="NO ENTRIES IN DYNAMIC SECTOR"
            message={`Section "${section.name}" is currently active, but no items have been added yet in the Admin CMS.`}
          />
        ) : section.content_type === 'timeline' ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="eng-card p-6 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.15)] flex items-center justify-center text-[var(--color-cyan)] flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold font-display text-[var(--color-pure-white)]">
                      {item.title}
                    </h3>
                    {item.date && (
                      <span className="text-xs font-mono text-[var(--color-cyan)]">
                        {formatDate(item.date)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-silver)] leading-relaxed">
                    {item.description || item.short_description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="eng-card flex flex-col justify-between"
              >
                <div>
                  {item.thumbnail ? (
                    <div className="aspect-video w-full overflow-hidden bg-[rgba(10,10,15,0.8)] border-b border-[rgba(255,255,255,0.06)]">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[21/9] w-full bg-[rgba(10,10,15,0.8)] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[var(--color-cyan)] eng-grid">
                      <Layers className="w-8 h-8 opacity-60" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between text-[0.65rem] font-mono text-[var(--color-gunmetal)] mb-2">
                      <span>{item.category || section.name}</span>
                      {item.date && <span>{formatDate(item.date)}</span>}
                    </div>

                    <h3 className="text-base font-bold font-display text-[var(--color-pure-white)] mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[var(--color-silver)] mb-4 leading-relaxed line-clamp-3">
                      {item.short_description || item.description}
                    </p>

                    {item.software && item.software.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.software.map((sw) => (
                          <span
                            key={sw}
                            className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[0.6rem] font-mono text-[var(--color-platinum)]"
                          >
                            {sw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] mt-2">
                  <span className="text-[0.65rem] font-mono text-[var(--color-silver)]">
                    DYNAMIC RECORD
                  </span>

                  <div className="flex items-center gap-2">
                    {item.external_links?.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="eng-btn eng-btn-ghost !text-xs !py-1 !px-2.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {link.label || 'Link'}
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
