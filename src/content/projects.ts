export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: 'CAD' | 'CAE' | 'Simulation' | 'Research' | 'Automation' | 'AI × Engineering';
  accentType: 'mechanical' | 'neural' | 'fusion';
  description: string;
  longDescription?: string;
  tags: string[];
  thumbnail: string;
  titleBlock: {
    drawnBy: string;
    rev: string;
    date: string;
    scale: string;
    material?: string;
    toolchain?: string;
    tolerance?: string;
  };
  metrics?: { label: string; value: string }[];
  featured?: boolean;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'p-1',
    slug: 'compact-gearbox-housing',
    title: 'Compact Gearbox Housing — Topology-Optimized',
    category: 'Simulation',
    accentType: 'mechanical',
    description: 'Redesigned a high-torque gearbox housing using topology optimization to reduce structural mass by 38% while holding a 2.4 factor of safety under peak torque shock loads.',
    longDescription: 'Applied ANSYS Mechanical topology optimization algorithms to systematically eliminate non-load-bearing volume from a dual-stage epicyclic reduction gearbox housing. Validated resultant organic rib structures against baseline CAD via multi-axial FEA static structural and harmonic vibration studies. Re-drafted machined casting geometry in SolidWorks respecting 5-axis CNC machining draft angles and minimum wall thickness constraints.',
    tags: ['SolidWorks', 'ANSYS Mechanical', 'Topology Optimization', 'FEA'],
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    titleBlock: {
      drawnBy: 'A.G.',
      rev: '03',
      date: '2026.01',
      scale: 'NTS',
      material: 'AlSi10Mg Alloy',
      toolchain: 'SolidWorks 2025 · ANSYS 2025 R1',
      tolerance: 'ISO 2768-mH',
    },
    metrics: [
      { label: 'Mass Reduction', value: '-38%' },
      { label: 'Factor of Safety', value: '2.4 FOS' },
      { label: 'Torsional Rigidity', value: '+14%' },
    ],
    featured: true,
  },
  {
    id: 'p-2',
    slug: 'agentic-inspection-assistant',
    title: 'Agentic CMM Inspection Assistant',
    category: 'AI × Engineering',
    accentType: 'neural',
    description: 'Autonomous agentic workflow parsing CMM inspection coordinate reports, flagging out-of-tolerance dimensions against drawing GD&T, and synthesizing nonconformance reports automatically.',
    longDescription: 'Developed a local LLM agent pipeline using Python and LangChain integrated with Coordinate Measuring Machine (CMM) ASCII point datasets. The system extracts nominal vs. measured coordinates, evaluates ASME Y14.5 geometric tolerances (true position, runout, cylindricity), identifies process drift tendencies, and generates ready-for-audit QA non-conformance documentation in seconds.',
    tags: ['Python', 'LLM Agents', 'GD&T', 'Metrology Automation'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    titleBlock: {
      drawnBy: 'A.G.',
      rev: '01',
      date: '2026.05',
      scale: 'N/A',
      material: 'Software / Agentic Pipeline',
      toolchain: 'Python 3.12 · Claude API · NumPy',
      tolerance: '±0.001 mm Eval',
    },
    metrics: [
      { label: 'Review Time Cut', value: '45m → 3m' },
      { label: 'False Positive Rate', value: '< 0.2%' },
      { label: 'GD&T Compliance', value: 'ASME Y14.5' },
    ],
    featured: true,
  },
  {
    id: 'p-3',
    slug: 'aerodynamic-diffuser-cfd',
    title: 'High-Downforce Venturi Diffuser Aerodynamics',
    category: 'CAE',
    accentType: 'mechanical',
    description: 'Conducted steady-state and transient conjugate CFD simulations in ANSYS Fluent to optimize ground-effect vortex generation and boundary layer separation prevention.',
    longDescription: 'Executed full polyhedral meshing with 18 prism boundary layers achieving y+ < 1 for accurate wall resolution in the SST k-omega turbulence model. Iterated through 14 strakes and expansion ramp profiles to maximize rear downforce efficiency without triggering turbulent detachment across ride-height sweeps from 15mm to 45mm.',
    tags: ['ANSYS Fluent', 'CFD', 'Aerodynamics', 'Turbulence Modeling'],
    thumbnail: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    titleBlock: {
      drawnBy: 'A.G.',
      rev: '04',
      date: '2025.11',
      scale: '1:5',
      material: 'Carbon Fiber Prepreg (T700)',
      toolchain: 'ANSYS Fluent 2024 · SpaceClaim',
      tolerance: '±0.05 mm Aero Profile',
    },
    metrics: [
      { label: 'Downforce Gain', value: '+22.4%' },
      { label: 'L/D Ratio', value: '3.82' },
      { label: 'Mesh Resolution', value: '8.4M Cells' },
    ],
    featured: true,
  },
  {
    id: 'p-4',
    slug: 'automated-pneumatic-palletizer',
    title: 'Dual-Axis PLC Automated Palletizing Station',
    category: 'Automation',
    accentType: 'mechanical',
    description: 'Engineered pneumatic pick-and-place logic, safety interlocks, and sensor telemetry in Siemens TIA Portal S7-1200 with Factory I/O hardware-in-the-loop validation.',
    longDescription: 'Designed IEC 61131-3 compliant Structured Text and Ladder Logic routines for automated assembly handling. Integrated pneumatic vacuum end-effectors, optical part-sorting arrays, safety light curtains (SIL 2), and Modbus TCP telemetry broadcasting cycle times and fault states directly to an edge monitoring node.',
    tags: ['Siemens TIA Portal', 'PLC Ladder Logic', 'S7-1200', 'Pneumatics'],
    thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    titleBlock: {
      drawnBy: 'A.G.',
      rev: '02',
      date: '2025.08',
      scale: '1:1',
      material: 'Extruded Al 6061-T6 Frame',
      toolchain: 'TIA Portal V18 · Factory I/O',
      tolerance: 'Repeatability ±0.2 mm',
    },
    metrics: [
      { label: 'Throughput', value: '42 units/min' },
      { label: 'Uptime Reliability', value: '99.8%' },
      { label: 'Cycle Time', value: '1.42s' },
    ],
    featured: true,
  },
  {
    id: 'p-5',
    slug: 'thermal-stress-ev-battery-pack',
    title: 'Conjugate Thermal Simulation of EV Cell Enclosure',
    category: 'Simulation',
    accentType: 'mechanical',
    description: 'Thermo-fluidic conjugate heat transfer analysis of serpentine liquid cooling plates for 4680 cylindrical lithium-ion modules during continuous 3C discharge.',
    longDescription: 'Modelled non-uniform internal heat generation within 4680 cell bundles under high ambient ambient conditions (45°C). Evaluated coolant flow distribution in multi-pass extruded channels to maintain cell-to-cell delta T below 3.5°C, suppressing thermal runaway risk while mitigating pumping parasitic losses.',
    tags: ['ANSYS Icepak', 'Thermal Analysis', 'Heat Exchangers', 'EV Battery'],
    thumbnail: 'https://images.unsplash.com/photo-1558441719-8b489c634a10?auto=format&fit=crop&w=800&q=80',
    titleBlock: {
      drawnBy: 'A.G.',
      rev: '02',
      date: '2025.10',
      scale: '1:2',
      material: 'Al 3003 Cold Plate + Glycol/H2O',
      toolchain: 'ANSYS Fluent · SolidWorks Simulation',
      tolerance: 'ΔT ≤ 3.5°C across cells',
    },
    metrics: [
      { label: 'Max Temp Kept', value: '< 38.2°C' },
      { label: 'Max Cell ΔT', value: '2.8°C' },
      { label: 'Pressure Drop', value: '14.2 kPa' },
    ],
    featured: false,
  },
  {
    id: 'p-6',
    slug: 'neural-surrogate-cfd-optimizer',
    title: 'Neural Surrogate Model for Real-Time Aero Optimization',
    category: 'AI × Engineering',
    accentType: 'neural',
    description: 'Trained a Physics-Informed Neural Network (PINN) surrogate model to predict 2D airfoil pressure coefficients within milliseconds, accelerating genetic search loops.',
    longDescription: 'Trained a deep neural network on parametric OpenFOAM velocity-pressure fields. By substituting the full Navier-Stokes solver with the neural surrogate inside a multi-objective genetic optimization loop, airfoil drag minimization was completed in 12 minutes instead of 38 hours of cluster compute.',
    tags: ['PyTorch', 'PINNs', 'OpenFOAM', 'Surrogate Optimization'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    titleBlock: {
      drawnBy: 'A.G.',
      rev: '01',
      date: '2026.02',
      scale: 'N/A',
      material: 'PyTorch / GPU Tensor Compute',
      toolchain: 'PyTorch 2.3 · OpenFOAM v2312',
      tolerance: 'R² = 0.994 Fit Accuracy',
    },
    metrics: [
      { label: 'Speedup', value: '190× Faster' },
      { label: 'Prediction Error', value: '< 1.2%' },
      { label: 'Epochs Converged', value: '450' },
    ],
    featured: true,
  },
];
