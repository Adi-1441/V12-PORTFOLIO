import { useDigitalTwinStore } from './useDigitalTwinStore';
import type { DigitalTwinState } from './DigitalTwinTypes';
import {
  Layers,
  Box,
  Eye,
  FileCode2,
  Wind,
  Search,
  Minimize2,
  Activity,
  Play,
  Pause,
} from 'lucide-react';

const STATES: { id: DigitalTwinState; label: string; icon: any }[] = [
  { id: 'realistic', label: 'REALISTIC', icon: Box },
  { id: 'wireframe', label: 'WIREFRAME', icon: Layers },
  { id: 'xray', label: 'X-RAY', icon: Eye },
  { id: 'blueprint', label: 'BLUEPRINT', icon: FileCode2 },
  { id: 'flow', label: 'FLOW FIELD', icon: Wind },
  { id: 'inspection', label: 'INSPECTION', icon: Search },
  { id: 'exploded', label: 'EXPLODED', icon: Minimize2 },
  { id: 'analysis', label: 'ANALYSIS', icon: Activity },
];

export function DigitalTwinHUD() {
  const {
    activeState,
    explodedProgress,
    autoRotate,
    sensorTelemetry,
    setState,
    toggleExploded,
    toggleAutoRotate,
  } = useDigitalTwinStore();

  return (
    <div className="w-full flex flex-col items-center gap-3 pt-3 pb-2 select-none font-mono text-xs">
      {/* ─── State Selection Strip (9 States) ─── */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-surface/90 border border-hairline backdrop-blur-md max-w-2xl">
        {STATES.map((s) => {
          const isActive = activeState === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setState(s.id)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-elevated text-cyan border border-cyan/40 shadow-[0_0_12px_rgba(0,212,255,0.2)] font-medium'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-elevated/40'
              }`}
            >
              <Icon size={12} className={isActive ? 'text-cyan' : 'text-text-tertiary'} />
              <span className="text-[11px] tracking-wider">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Secondary Mechanical Toggles & Telemetry Readout ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full max-w-2xl px-2 text-[11px] text-text-tertiary">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleExploded}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              explodedProgress > 0
                ? 'border-amber/50 bg-amber/10 text-amber'
                : 'border-hairline text-text-tertiary hover:text-text-secondary bg-surface'
            }`}
          >
            {explodedProgress > 0 ? 'COLLAPSE ASSEMBLY' : 'EXPLODE ASSEMBLY'}
          </button>

          <button
            onClick={toggleAutoRotate}
            className="p-1.5 rounded border border-hairline bg-surface text-text-tertiary hover:text-text-secondary cursor-pointer"
            title={autoRotate ? 'Pause Rotation' : 'Resume Rotation'}
          >
            {autoRotate ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>

        {/* Live Engineering Telemetry */}
        <div className="flex items-center gap-3">
          <span>
            TEMP: <strong className="text-text-secondary">{sensorTelemetry.temp}°C</strong>
          </span>
          <span className="text-text-tertiary/40">·</span>
          <span>
            STRESS: <strong className="text-cyan">{sensorTelemetry.stressMpa} MPa</strong>
          </span>
          <span className="text-text-tertiary/40">·</span>
          <span className="flex items-center gap-1.5 text-status-online">
            <span className="w-1.5 h-1.5 rounded-full bg-status-online animate-pulse" />
            <span>NOMINAL</span>
          </span>
        </div>
      </div>
    </div>
  );
}
