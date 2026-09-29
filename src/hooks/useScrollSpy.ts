import { useEffect, useState } from 'react';

/**
 * Hook for detecting which section is currently visible in the viewport.
 */
export function useScrollSpy(
  sectionIds: string[],
  options: { offset?: number; threshold?: number } = {}
): string | null {
  const { offset = 100, threshold = 0.3 } = options;
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${offset}px 0px -${Math.floor(window.innerHeight * (1 - threshold))}px 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, offset, threshold]);

  return activeSection;
}
