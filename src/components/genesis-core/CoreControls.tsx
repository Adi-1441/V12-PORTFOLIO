import { useCoreState, CoreState, CoreView, CoreMaterialType } from './useCoreState';

const STATES: { id: CoreState; label: string; number: string }[] = [
  { id: 'mechanical', label: 'MECHANICAL', number: '01' },
  { id: 'fusion', label: 'FUSION', number: '02' },
  { id: 'neural', label: 'NEURAL', number: '03' },
];

const MATERIALS: { id: CoreMaterialType; label: string; spec: string }[] = [
  { id: 'copper', label: 'Cu', spec: 'UNS C10100 Oxygen-Free Copper' },
  { id: 'titanium', label: 'Ti', spec: 'Grade 5 Ti-6Al-4V Alloy' },
  { id: 'aluminum', label: 'Al', spec: 'Aerospace Al 7075-T6' },
  { id: 'carbon', label: 'C-F', spec: 'T700 Toray Carbon Composite' },
];

export function CoreControls() {
  const { state, view, material, overdrive, setState, toggleView, setMaterial } = useCoreState();

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-lg mx-auto pt-2 pb-4 select-none">
      {/* ─── State Progression Selector (Genuine Cycle: 01, 02, 03) ─── */}
      <div className="flex items-center gap-1.5 p-1 bg-surface border border-hairline rounded-lg">
        {STATES.map((s) => {
          const isActive = state === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setState(s.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-elevated text-text-primary border border-hairline shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-elevated/40'
              }`}
            >
              <span className={`text-[10px] ${isActive ? (s.id === 'mechanical' ? 'text-copper-300' : s.id === 'neural' ? 'text-violet-300' : 'text-text-primary') : 'text-text-tertiary'}`}>
                {s.number}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── View Toggles & Engineering Material Switcher ─── */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
        {/* Blueprint Toggle */}
        <button
          onClick={() => toggleView('blueprint')}
          className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
            view === 'blueprint'
              ? 'border-copper-300/60 bg-copper-500/10 text-copper-100'
              : 'border-hairline text-text-tertiary hover:text-text-secondary bg-surface'
          }`}
          title="Toggle CAD blueprint wireframe & dimension overlays"
        >
          BLUEPRINT
        </button>

        {/* Exploded View Toggle */}
        <button
          onClick={() => toggleView('exploded')}
          className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
            view === 'exploded'
              ? 'border-violet-300/60 bg-violet-500/10 text-violet-100'
              : 'border-hairline text-text-tertiary hover:text-text-secondary bg-surface'
          }`}
          title="Separate layered assemblies along axes"
        >
          EXPLODED
        </button>

        <span className="text-text-tertiary/40">|</span>

        {/* Material Selection (PBR Material properties) */}
        <div className="flex items-center gap-1 bg-surface border border-hairline rounded px-1.5 py-0.5">
          <span className="text-[10px] text-text-tertiary uppercase mr-1">Mat:</span>
          {MATERIALS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMaterial(m.id)}
              className={`px-1.5 py-0.5 text-[11px] rounded transition-colors cursor-pointer ${
                material === m.id
                  ? 'bg-elevated text-copper-300 font-medium'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
              title={m.spec}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real Engineering Dimension & Tolerance Callout */}
      <div className="text-[11px] font-mono text-text-tertiary flex items-center gap-3">
        <span>⌀ 340mm</span>
        <span className="text-text-tertiary/40">·</span>
        <span>TOL: ±0.02mm</span>
        <span className="text-text-tertiary/40">·</span>
        <span className="text-copper-300/80">
          {view === 'blueprint'
            ? 'MODE: WIREFRAME_SCHEMATIC'
            : view === 'exploded'
            ? 'MODE: AXIAL_DISASSEMBLY'
            : overdrive
            ? 'STATUS: OVERDRIVE_ENGAGED'
            : 'STATUS: NOMINAL'}
        </span>
      </div>
    </div>
  );
}
