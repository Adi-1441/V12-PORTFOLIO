import { useRef, useEffect, useMemo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceQuality } from '@/hooks/useDeviceQuality';

interface TelemetryPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  label?: string;
}

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const { quality, isMobile } = useDeviceQuality();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const config = useMemo(() => {
    return {
      gridSpacing: isMobile ? 50 : 36,
      gridOpacity: 0.035,
      nodeCount: isMobile ? 18 : 36,
      enableTelemetry: quality !== 'low',
      enableScanning: !isMobile && quality !== 'low',
    };
  }, [quality, isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * Math.min(window.devicePixelRatio, 2);
      canvas.height = height * Math.min(window.devicePixelRatio, 2);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Seed telemetry nodes
    const telemetryNodes: TelemetryPoint[] = Array.from({ length: config.nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.15,
      label: i % 4 === 0 ? `PT_${(i + 1).toString().padStart(2, '0')}` : undefined,
    }));

    let scanY = 0;
    let frame = 0;

    const render = () => {
      if (prefersReducedMotion) {
        ctx.clearRect(0, 0, width, height);
        drawGrid(ctx, width, height, config.gridSpacing, config.gridOpacity);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      frame++;

      // Mouse smoothing for subtle parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      const offsetX = (mouseRef.current.x / width - 0.5) * 15;
      const offsetY = (mouseRef.current.y / height - 0.5) * 15;

      ctx.save();
      ctx.translate(offsetX, offsetY);

      // ─── 1. Engineering Command Center Coordinate Grid ───
      drawGrid(ctx, width, height, config.gridSpacing, config.gridOpacity);

      // ─── 2. Coordinate Grid Intersections & Calibrated Crosshairs ───
      ctx.fillStyle = 'rgba(0, 212, 255, 0.25)';
      ctx.font = '8px monospace';

      for (let x = config.gridSpacing; x < width; x += config.gridSpacing * 2) {
        for (let y = config.gridSpacing; y < height; y += config.gridSpacing * 2) {
          const distToMouse = Math.hypot(mouseRef.current.x - x, mouseRef.current.y - y);
          if (distToMouse < 180) {
            const glow = 1 - distToMouse / 180;
            // Draw crosshair at active intersection
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 + glow * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(x - 4, y);
            ctx.lineTo(x + 4, y);
            ctx.moveTo(x, y - 4);
            ctx.lineTo(x, y + 4);
            ctx.stroke();
          }
        }
      }

      // ─── 3. Telemetry Nodes & Structural Links ───
      telemetryNodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        ctx.fillStyle = `rgba(0, 212, 255, ${node.opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        if (node.label && !isMobile) {
          ctx.fillStyle = `rgba(138, 138, 162, ${node.opacity * 0.8})`;
          ctx.fillText(node.label, node.x + 5, node.y - 4);
        }
      });

      // Connect near nodes with subtle engineering vectors
      for (let i = 0; i < telemetryNodes.length; i++) {
        for (let j = i + 1; j < telemetryNodes.length; j++) {
          const dx = telemetryNodes[i].x - telemetryNodes[j].x;
          const dy = telemetryNodes[i].y - telemetryNodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 110) {
            const opacity = (1 - dist / 110) * 0.12;
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(telemetryNodes[i].x, telemetryNodes[i].y);
            ctx.lineTo(telemetryNodes[j].x, telemetryNodes[j].y);
            ctx.stroke();
          }
        }
      }

      // ─── 4. Vertical Optical Scanning Sweep ───
      if (config.enableScanning) {
        scanY += 0.75;
        if (scanY > height + 60) scanY = -60;

        const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
        scanGrad.addColorStop(0, 'rgba(0, 212, 255, 0)');
        scanGrad.addColorStop(0.5, 'rgba(0, 212, 255, 0.035)');
        scanGrad.addColorStop(1, 'rgba(0, 212, 255, 0)');

        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 30, width, 60);

        // Thin bright scan laser beam
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      }

      ctx.restore();

      // ─── 5. Technical Laboratory HUD Frame Markers ───
      if (!isMobile) {
        drawLaboratoryHUD(ctx, width, height, frame);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config, prefersReducedMotion, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spacing: number,
  opacity: number
) {
  ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
  ctx.lineWidth = 0.5;

  ctx.beginPath();
  for (let x = 0; x <= width; x += spacing) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += spacing) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
}

function drawLaboratoryHUD(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number
) {
  const margin = 24;
  const bracketLen = 32;
  const pulse = 0.12 + Math.sin(frame * 0.03) * 0.05;

  ctx.strokeStyle = `rgba(0, 212, 255, ${pulse})`;
  ctx.lineWidth = 1;

  // Top-left corner bracket
  ctx.beginPath();
  ctx.moveTo(margin, margin + bracketLen);
  ctx.lineTo(margin, margin);
  ctx.lineTo(margin + bracketLen, margin);
  ctx.stroke();

  // Top-right corner bracket
  ctx.beginPath();
  ctx.moveTo(width - margin - bracketLen, margin);
  ctx.lineTo(width - margin, margin);
  ctx.lineTo(width - margin, margin + bracketLen);
  ctx.stroke();

  // Bottom-left corner bracket
  ctx.beginPath();
  ctx.moveTo(margin, height - margin - bracketLen);
  ctx.lineTo(margin, height - margin);
  ctx.lineTo(margin + bracketLen, height - margin);
  ctx.stroke();

  // Bottom-right corner bracket
  ctx.beginPath();
  ctx.moveTo(width - margin - bracketLen, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.lineTo(width - margin, height - margin - bracketLen);
  ctx.stroke();
}
