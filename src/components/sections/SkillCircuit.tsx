import { useState } from 'react';

interface SkillNode {
  id: string;
  name: string;
  category: 'mechanical' | 'neural' | 'fusion';
  level: string;
  x: number; // percentage in circuit container
  y: number;
  connections: string[];
}

const NODES: SkillNode[] = [
  // Mechanical Core (Copper)
  { id: 'cad', name: 'CAD / SolidWorks', category: 'mechanical', level: 'Advanced', x: 18, y: 25, connections: ['fea', 'gd_t', 'plc'] },
  { id: 'fea', name: 'FEA / ANSYS Mech', category: 'mechanical', level: 'Specialist', x: 38, y: 22, connections: ['cad', 'cfd', 'thermal', 'topology'] },
  { id: 'cfd', name: 'CFD / Fluent', category: 'mechanical', level: 'Advanced', x: 28, y: 55, connections: ['fea', 'thermal', 'pinn'] },
  { id: 'thermal', name: 'Thermal Simulation', category: 'mechanical', level: 'Proficient', x: 44, y: 68, connections: ['cfd', 'fea'] },
  { id: 'gd_t', name: 'GD&T / ASME Y14.5', category: 'mechanical', level: 'Advanced', x: 14, y: 78, connections: ['cad', 'inspection_ai'] },
  { id: 'topology', name: 'Topology Optimization', category: 'mechanical', level: 'Proficient', x: 52, y: 32, connections: ['fea', 'pinn'] },

  // Convergence Bridge (Fusion)
  { id: 'plc', name: 'PLC / TIA Portal', category: 'fusion', level: 'Industrial', x: 42, y: 84, connections: ['cad', 'automation', 'edge_iot'] },
  { id: 'automation', name: 'Factory Automation', category: 'fusion', level: 'Advanced', x: 62, y: 75, connections: ['plc', 'inspection_ai'] },
  { id: 'edge_iot', name: 'Edge Telemetry & OPC UA', category: 'fusion', level: 'Proficient', x: 68, y: 90, connections: ['plc', 'python'] },

  // Neural / AI (Violet)
  { id: 'python', name: 'Python Engineering Stack', category: 'neural', level: 'Advanced', x: 74, y: 52, connections: ['edge_iot', 'agents', 'pinn'] },
  { id: 'agents', name: 'LLM Agents & Tool Use', category: 'neural', level: 'Applied', x: 86, y: 34, connections: ['python', 'inspection_ai'] },
  { id: 'inspection_ai', name: 'Agentic Metrology', category: 'neural', level: 'Applied', x: 80, y: 78, connections: ['agents', 'gd_t', 'automation'] },
  { id: 'pinn', name: 'PINNs & Physics Surrogates', category: 'neural', level: 'Research', x: 65, y: 22, connections: ['python', 'cfd', 'topology'] },
];

export function SkillCircuit() {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const activeNode = NODES.find((n) => n.id === activeNodeId);
  const connectedIds = activeNode ? [activeNode.id, ...activeNode.connections] : [];

  return (
    <div className="relative w-full rounded-2xl bg-surface border border-hairline p-6 md:p-8 overflow-hidden">
      {/* Circuit Header / Instruction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-hairline">
        <div>
          <h3 className="font-display text-xl font-medium text-text-primary">
            Interactive Engineering Circuit
          </h3>
          <p className="font-body text-xs text-text-secondary mt-0.5">
            Hover any node to trace functional cross-disciplinary dependencies.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-copper-300" />
            <span className="text-text-secondary">Mechanical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-copper-300 to-violet-300" />
            <span className="text-text-secondary">Convergence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-300" />
            <span className="text-text-secondary">Neural / AI</span>
          </div>
        </div>
      </div>

      {/* Circuit Board Interactive Canvas */}
      <div className="relative w-full h-[400px] sm:h-[460px] bg-void/70 rounded-xl border border-hairline overflow-hidden drafting-grid">
        {/* SVG Interconnecting Traces */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {NODES.map((node) =>
            node.connections.map((targetId) => {
              const targetNode = NODES.find((n) => n.id === targetId);
              if (!targetNode || targetNode.id < node.id) return null; // Render each pair once

              const isDirectlyConnected =
                activeNodeId &&
                ((activeNodeId === node.id && targetNode.id === targetId) ||
                  (activeNodeId === targetNode.id && node.id === node.id) ||
                  (connectedIds.includes(node.id) && connectedIds.includes(targetNode.id)));

              // Determine trace stroke color
              let strokeColor = 'rgba(245, 243, 240, 0.08)';
              if (isDirectlyConnected) {
                if (node.category === 'neural' && targetNode.category === 'neural') {
                  strokeColor = '#A855F7';
                } else if (node.category === 'mechanical' && targetNode.category === 'mechanical') {
                  strokeColor = '#D4844A';
                } else {
                  strokeColor = '#F2A65A';
                }
              }

              return (
                <line
                  key={`${node.id}-${targetNode.id}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${targetNode.x}%`}
                  y2={`${targetNode.y}%`}
                  stroke={strokeColor}
                  strokeWidth={isDirectlyConnected ? 2 : 1}
                  strokeDasharray={isDirectlyConnected ? 'none' : '4 4'}
                  className="transition-colors duration-200"
                />
              );
            })
          )}
        </svg>

        {/* Interactive Skill Nodes */}
        {NODES.map((node) => {
          const isActive = activeNodeId === node.id;
          const isConnected = connectedIds.includes(node.id);
          const isDimmed = activeNodeId && !isConnected;

          const dotBg =
            node.category === 'mechanical'
              ? 'bg-copper-300'
              : node.category === 'neural'
              ? 'bg-violet-300'
              : 'bg-fusion';

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setActiveNodeId(node.id)}
              onMouseLeave={() => setActiveNodeId(null)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-all duration-200 ${
                isDimmed ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <div
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md transition-all ${
                  isActive
                    ? 'border-text-primary bg-elevated shadow-lg scale-110'
                    : isConnected
                    ? 'border-copper-300/80 bg-surface'
                    : 'border-hairline bg-surface/90 hover:border-text-secondary/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${dotBg} shrink-0`} />
                <span className="font-mono text-xs font-medium text-text-primary whitespace-nowrap">
                  {node.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Node Detail Callout */}
      <div className="mt-4 pt-3 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-text-tertiary">
        <div>
          {activeNode ? (
            <span className="text-text-primary">
              SELECTED: <strong className="text-copper-300">{activeNode.name}</strong> · LEVEL: {activeNode.level} · DISCIPLINE: {activeNode.category.toUpperCase()}
            </span>
          ) : (
            <span>STATUS: HOVER ANY NODE TO INSPECT CROSS-LINKAGES</span>
          )}
        </div>
        <span className="text-text-tertiary mt-1 sm:mt-0">IEC / ASME CERTIFIED TOOLCHAINS</span>
      </div>
    </div>
  );
}
