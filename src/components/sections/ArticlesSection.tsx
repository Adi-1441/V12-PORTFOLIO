import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Calendar, Tag, FileText, Bookmark } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { fetchArticles } from '@/lib/portfolioService';
import type { Article } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchArticles().then(({ data }) => {
      if (mounted) {
        setArticles(data || []);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="articles" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Technical Documentation Dossier Environment */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 45%),
              linear-gradient(rgba(0, 212, 255, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 36px 36px, 36px 36px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="PUBLICATIONS & LOGS"
          title="Technical Articles & Insights"
          description="Expository write-ups on finite element methods, mechanical design rationales, CFD meshing best practices, and automation architectures."
          badge="DISPATCHES"
        />

        {/* Index Status Banner */}
        <div className="mb-8 p-3 rounded-xl bg-[rgba(10,12,18,0.7)] border border-[rgba(0,212,255,0.2)] flex flex-wrap items-center justify-between gap-4 text-[0.68rem] font-mono text-[var(--color-silver)] backdrop-blur-md">
          <div className="flex items-center gap-2 text-[var(--color-cyan)]">
            <Bookmark className="w-3.5 h-3.5" />
            <span>DOCUMENTATION INDEX: TECHNICAL ARCHIVE &bull; DISPATCH LEDGER</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-gunmetal)]">
            <FileText className="w-3.5 h-3.5 text-[var(--color-cyan-dim)]" />
            <span>STATUS: INDEXED &bull; OPEN ACCESS</span>
          </div>
        </div>

        {loading ? (
          <LoadingState label="ACCESSING ARTICLE REPOSITORIES..." />
        ) : articles.length === 0 ? (
          <EmptyState
            category="ARTICLE ARCHIVE"
            title="NO ARTICLES PUBLISHED"
            message="No technical articles have been published in the database. Use the Admin Dashboard to write and broadcast engineering articles."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => {
              const docIndex = String(index + 1).padStart(2, '0');
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="eng-card flex flex-col justify-between hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,212,255,0.08)] transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between text-[0.65rem] font-mono text-[var(--color-gunmetal)] mb-3">
                      <div className="flex items-center gap-1.5 text-[var(--color-cyan)] font-semibold">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>DISPATCH // {docIndex}</span>
                      </div>
                      {article.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.date)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold font-display text-[var(--color-pure-white)] group-hover:text-[var(--color-cyan)] transition-colors mb-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[var(--color-silver)] mb-4 leading-relaxed line-clamp-3">
                      {article.short_description}
                    </p>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[0.6rem] font-mono text-[var(--color-platinum)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] mt-2">
                    <span className="text-[0.65rem] font-mono text-[var(--color-silver)]">
                      ENGINEERING DOSSIER
                    </span>

                    {article.external_url ? (
                      <a
                        href={article.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="eng-btn eng-btn-ghost !text-xs !py-1 !px-2.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Read Full Article
                      </a>
                    ) : (
                      <span className="text-[0.6rem] font-mono text-[var(--color-gunmetal)]">
                        INTERNAL ARCHIVE
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
