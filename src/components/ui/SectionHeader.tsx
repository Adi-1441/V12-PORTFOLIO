import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  badge?: string;
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  badge,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`section-header ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="section-label">{label}</span>
        {badge && (
          <span className="eng-badge eng-badge-cyan text-[0.6rem]">
            {badge}
          </span>
        )}
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-title"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-description"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
