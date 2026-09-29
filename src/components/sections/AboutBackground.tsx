import { useRef, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceQuality } from '@/hooks/useDeviceQuality';

export default function AboutBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const { isMobile, quality } = useDeviceQuality();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * Math.min(window.devicePixelRatio, 2);
      canvas.height = height * Math.min(window.devicePixelRatio, 2);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
    };

    resize();
    window.addEventListener('resize', resize);

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      // ─── 1. Blueprint Grid (Subtle Blue / Cyan ISO Blueprint) ───
      const majorStep = isMobile ? 80 : 100;
      const minorStep = isMobile ? 20 : 25;

      // Minor grid
      ctx.strokeStyle = 'rgba(0, 180, 216, 0.025)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += minorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += minorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Major grid
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let x = 0; x <= width; x += majorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += majorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // ─── 2. CAD Drafting Dimension Lines & Orthographic Projection Arcs ───
      if (!isMobile && quality !== 'low') {
        const pulse = 0.08 + Math.sin(frame * 0.02) * 0.04;

        // Drafting Arc 1 (Top Left blueprint feature)
        ctx.strokeStyle = `rgba(0, 212, 255, ${pulse})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(80, 120, 90, 0, Math.PI * 0.65);
        ctx.stroke();

        // Radial dimension line
        ctx.beginPath();
        ctx.moveTo(80, 120);
        ctx.lineTo(140, 190);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = `rgba(0, 212, 255, ${pulse * 1.5})`;
        ctx.font = '8px monospace';
        ctx.fillText('R90.00 [DATUM-A]', 145, 195);

        // Drafting Arc 2 (Bottom Right blueprint feature)
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.arc(width - 120, height - 160, 140, Math.PI, Math.PI * 1.6);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillText('Ø 280.00 TOL: ±0.002', width - 210, height - 165);

        // Orthogonal Datum Guides
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 120);
        ctx.lineTo(width, 120);
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isMobile, quality, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
