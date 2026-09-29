import { useState, useEffect } from 'react';
import type { DeviceCapabilities } from '@/lib/types';
import { detectQualityLevel, isWebGLSupported } from '@/lib/utils';

/**
 * Hook to detect device capabilities and auto-select quality.
 */
export function useDeviceQuality(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    quality: 'medium',
    isMobile: false,
    isTablet: false,
    supportsWebGL: true,
    prefersReducedMotion: false,
    gpuTier: 2,
    pixelRatio: 1,
  });

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const isTablet =
      /iPad|Android/i.test(navigator.userAgent) &&
      !/Mobile/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsWebGL = isWebGLSupported();
    const quality = detectQualityLevel();

    setCapabilities({
      quality,
      isMobile,
      isTablet,
      supportsWebGL,
      prefersReducedMotion,
      gpuTier: quality === 'ultra' ? 3 : quality === 'high' ? 2 : quality === 'medium' ? 1 : 0,
      pixelRatio: window.devicePixelRatio || 1,
    });
  }, []);

  return capabilities;
}
