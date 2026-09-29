/* ═══════════════════════════════════════════
   V12 PORTFOLIO — UTILITY FUNCTIONS
   ═══════════════════════════════════════════ */

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from './constants';

/**
 * Generate a URL-safe slug from a string.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format a date string for display.
 */
export function formatDate(date: string | undefined): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

/**
 * Format a date for relative display (e.g., "2 days ago").
 */
export function formatRelativeDate(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(date);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Validate a file for upload.
 */
export function validateFile(
  file: File,
  options: {
    acceptedTypes?: string[];
    maxSizeMB?: number;
  } = {}
): { valid: boolean; error?: string } {
  const { acceptedTypes = ACCEPTED_IMAGE_TYPES, maxSizeMB = MAX_IMAGE_SIZE_MB } = options;

  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Accepted: ${acceptedTypes.map((t: string) => t.split('/')[1]).join(', ')}`,
    };
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB (got ${sizeMB.toFixed(1)}MB)`,
    };
  }

  return { valid: true };
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a unique ID.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Truncate text with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

/**
 * Smooth scroll to an element by ID.
 */
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Check if WebGL is supported.
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Detect device quality level.
 */
export function detectQualityLevel(): 'low' | 'medium' | 'high' | 'ultra' {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 'low';

  // Check device memory (if available)
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory && nav.deviceMemory < 4) return 'low';
  if (nav.deviceMemory && nav.deviceMemory < 8) return 'medium';

  // Check hardware concurrency
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return 'low';
  if (cores <= 4) return 'medium';

  // Check pixel ratio for high-DPI displays
  const dpr = window.devicePixelRatio || 1;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) return dpr > 2 ? 'medium' : 'low';
  if (dpr >= 2 && cores >= 8) return 'ultra';
  return 'high';
}

/**
 * Get capped pixel ratio based on quality level.
 */
export function getCappedPixelRatio(quality: string): number {
  const dpr = window.devicePixelRatio || 1;
  switch (quality) {
    case 'low': return Math.min(dpr, 1);
    case 'medium': return Math.min(dpr, 1.5);
    case 'high': return Math.min(dpr, 2);
    case 'ultra': return Math.min(dpr, 2.5);
    default: return Math.min(dpr, 2);
  }
}

/**
 * Create a className merger (simple version).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
