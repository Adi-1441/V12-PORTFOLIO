import { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { useDeviceQuality } from '@/hooks/useDeviceQuality';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getCappedPixelRatio, isWebGLSupported } from '@/lib/utils';
import type { SceneViewState } from '@/lib/types';
import { Layers, Box, Eye, FileCode2, Maximize2 } from 'lucide-react';

export type ExtendedViewState = SceneViewState | 'exploded';

// ════════════════════════════════════════════════════════════════════════════
//   FUTURISTIC ENGINEERING DIGITAL TWIN CORE — TURBOMACHINERY & GIMBAL SYSTEM
// ════════════════════════════════════════════════════════════════════════════

// ─── 1. Central Aerodynamic Rotor / Turbine Impeller ───
function ImpellerRotor({
  viewState,
  isHovered,
  explosionOffset,
}: {
  viewState: ExtendedViewState;
  isHovered: boolean;
  explosionOffset: number;
}) {
  const rotorRef = useRef<THREE.Group>(null);
  const bladeCount = 12;

  useFrame((_state, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.z += 1.2 * delta;
    }
  });

  // Rotor blade shape
  const bladeGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.35, -0.04);
    shape.quadraticCurveTo(0.65, 0.12, 1.05, 0.05);
    shape.lineTo(1.15, -0.05);
    shape.quadraticCurveTo(0.7, 0.0, 0.35, -0.08);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    });
  }, []);

  const isWire = viewState === 'wireframe' || viewState === 'blueprint';
  const isXray = viewState === 'xray';

  const bladeMaterial = useMemo(() => {
    if (isWire) {
      return new THREE.MeshBasicMaterial({
        color: viewState === 'blueprint' ? '#00b4d8' : '#00d4ff',
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });
    }
    if (isXray) {
      return new THREE.MeshStandardMaterial({
        color: '#1d4ed8',
        metalness: 0.4,
        roughness: 0.6,
        transparent: true,
        opacity: 0.45,
        emissive: '#00d4ff',
        emissiveIntensity: 0.2,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#4b5563', // Precision Aerospace Grade-5 Titanium
      metalness: 0.94,
      roughness: 0.18,
      emissive: isHovered ? '#00d4ff' : '#050c18',
      emissiveIntensity: isHovered ? 0.2 : 0.02,
      envMapIntensity: 1.4,
    });
  }, [viewState, isWire, isXray, isHovered]);

  const hubMaterial = useMemo(() => {
    if (isWire) {
      return new THREE.MeshBasicMaterial({
        color: '#00d4ff',
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
    }
    if (isXray) {
      return new THREE.MeshStandardMaterial({
        color: '#0f172a',
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7,
        emissive: '#00d4ff',
        emissiveIntensity: 0.3,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#2d3748',
      metalness: 0.96,
      roughness: 0.12,
      emissive: isHovered ? '#00d4ff' : '#000000',
      emissiveIntensity: isHovered ? 0.15 : 0,
      envMapIntensity: 1.6,
    });
  }, [viewState, isWire, isXray, isHovered]);

  return (
    <group ref={rotorRef} position={[0, 0, explosionOffset * 0.2]}>
      {/* Central Aerodynamic Hub */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.45, isWire ? 16 : 32]} />
        <primitive object={hubMaterial} attach="material" />
        {isWire && <Edges threshold={20} color="#00d4ff" />}
      </mesh>

      {/* Center Precision Nosecone */}
      <mesh position={[0, 0, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.38, 0.35, isWire ? 16 : 32]} />
        <primitive object={hubMaterial} attach="material" />
      </mesh>

      {/* Radially Arrayed Impeller Vanes */}
      {Array.from({ length: bladeCount }).map((_, i) => {
        const angle = (i * Math.PI * 2) / bladeCount;
        return (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh
              geometry={bladeGeo}
              position={[0, 0, -0.11]}
              rotation={[0.3, 0.1, 0]}
              castShadow
              receiveShadow
            >
              <primitive object={bladeMaterial} attach="material" />
              {isWire && <Edges threshold={20} color="#00d4ff" />}
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── 2. Precision Bearing Assembly with Spherical Rollers ───
function BearingAssembly({
  viewState,
  explosionOffset,
}: {
  viewState: ExtendedViewState;
  explosionOffset: number;
}) {
  const rollerCount = 10;
  const isWire = viewState === 'wireframe' || viewState === 'blueprint';

  return (
    <group position={[0, 0, -0.28 - explosionOffset * 0.4]}>
      {/* Inner Race Ring */}
      <mesh>
        <torusGeometry args={[0.48, 0.04, 12, isWire ? 24 : 48]} />
        <meshStandardMaterial
          color={isWire ? '#00d4ff' : '#64748b'}
          metalness={0.9}
          roughness={0.1}
          wireframe={isWire}
        />
      </mesh>

      {/* Spherical Bearing Rollers */}
      {Array.from({ length: rollerCount }).map((_, i) => {
        const angle = (i * Math.PI * 2) / rollerCount;
        const x = Math.cos(angle) * 0.58;
        const y = Math.sin(angle) * 0.58;
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[0.055, isWire ? 8 : 16, isWire ? 8 : 16]} />
            <meshStandardMaterial
              color={isWire ? '#38bdf8' : '#cbd5e1'}
              metalness={0.98}
              roughness={0.05}
              wireframe={isWire}
            />
          </mesh>
        );
      })}

      {/* Outer Race Ring */}
      <mesh>
        <torusGeometry args={[0.68, 0.05, 12, isWire ? 24 : 48]} />
        <meshStandardMaterial
          color={isWire ? '#00d4ff' : '#475569'}
          metalness={0.9}
          roughness={0.1}
          wireframe={isWire}
        />
      </mesh>
    </group>
  );
}

// ─── 3. Multi-Axis Stator & Concentric Gimbal Guidance Rings ───
function GimbalGuidanceRings({
  viewState,
  isHovered,
  explosionOffset,
}: {
  viewState: ExtendedViewState;
  isHovered: boolean;
  explosionOffset: number;
}) {
  const pitchRingRef = useRef<THREE.Group>(null);
  const yawRingRef = useRef<THREE.Group>(null);
  const isWire = viewState === 'wireframe' || viewState === 'blueprint';

  useFrame((_state, delta) => {
    if (pitchRingRef.current) {
      pitchRingRef.current.rotation.x += 0.25 * delta;
      pitchRingRef.current.rotation.y += 0.15 * delta;
    }
    if (yawRingRef.current) {
      yawRingRef.current.rotation.y -= 0.35 * delta;
      yawRingRef.current.rotation.z += 0.1 * delta;
    }
  });

  const ringMaterial = useMemo(() => {
    if (isWire) {
      return new THREE.MeshBasicMaterial({
        color: viewState === 'blueprint' ? '#0284c7' : '#00d4ff',
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
    }
    if (viewState === 'xray') {
      return new THREE.MeshStandardMaterial({
        color: '#1e3a8a',
        transparent: true,
        opacity: 0.4,
        emissive: '#00d4ff',
        emissiveIntensity: 0.2,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#334155',
      metalness: 0.92,
      roughness: 0.2,
      emissive: isHovered ? '#00d4ff' : '#0a101d',
      emissiveIntensity: isHovered ? 0.15 : 0.02,
      envMapIntensity: 1.2,
    });
  }, [viewState, isWire, isHovered]);

  return (
    <>
      {/* Primary Inner Gimbal Ring (Pitch Axis) */}
      <group ref={pitchRingRef} position={[0, 0, explosionOffset * 0.6]}>
        <mesh castShadow>
          <torusGeometry args={[1.35, 0.035, 12, isWire ? 32 : 64]} />
          <primitive object={ringMaterial} attach="material" />
          {isWire && <Edges threshold={20} color="#00d4ff" />}
        </mesh>
        {/* Vernier scale marker studs */}
        {[-1.35, 1.35].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.14, 12]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Secondary Outer Gimbal Ring (Yaw / Measurement Axis) */}
      <group ref={yawRingRef} position={[0, 0, -explosionOffset * 0.6]}>
        <mesh castShadow>
          <torusGeometry args={[1.65, 0.04, 12, isWire ? 36 : 72]} />
          <primitive object={ringMaterial} attach="material" />
          {isWire && <Edges threshold={20} color="#00d4ff" />}
        </mesh>
        {/* Coordinate indicator pips */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(angle) * 1.65, Math.sin(angle) * 1.65, 0]}
          >
            <boxGeometry args={[0.06, 0.06, 0.06]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </>
  );
}

// ─── 4. Outer Generative Topology Stator Shroud ───
function StatorShroud({
  viewState,
  isHovered,
  explosionOffset,
}: {
  viewState: ExtendedViewState;
  isHovered: boolean;
  explosionOffset: number;
}) {
  const shroudRef = useRef<THREE.Group>(null);
  const isWire = viewState === 'wireframe' || viewState === 'blueprint';
  const isXray = viewState === 'xray';

  useFrame((_state, delta) => {
    if (shroudRef.current) {
      shroudRef.current.rotation.z -= 0.15 * delta;
    }
  });

  const shroudMaterial = useMemo(() => {
    if (isWire) {
      return new THREE.MeshBasicMaterial({
        color: viewState === 'blueprint' ? '#0369a1' : '#00d4ff',
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
    }
    if (isXray) {
      return new THREE.MeshStandardMaterial({
        color: '#0f172a',
        transparent: true,
        opacity: 0.22,
        roughness: 0.3,
        emissive: '#00d4ff',
        emissiveIntensity: 0.1,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#1e293b',
      metalness: 0.88,
      roughness: 0.25,
      emissive: isHovered ? '#00d4ff' : '#050b14',
      emissiveIntensity: isHovered ? 0.08 : 0.01,
      envMapIntensity: 1.1,
    });
  }, [viewState, isWire, isXray, isHovered]);

  return (
    <group ref={shroudRef} position={[0, 0, explosionOffset * 0.9]}>
      {/* Outer Hexagonal Cylindrical Shroud */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.9, 1.95, 0.5, 8, 1, true]} />
        <primitive object={shroudMaterial} attach="material" />
        <Edges threshold={15} color="#00d4ff" />
      </mesh>

      {/* Aerodynamic Structural Struts connecting to hub */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.025, 0.025, 1.1, 8]} />
              <meshStandardMaterial
                color={isWire ? '#00d4ff' : '#475569'}
                metalness={0.9}
                roughness={0.2}
                wireframe={isWire}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── 5. Dynamic Laser Telemetry Scan Ring ───
function LaserTelemetryRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      // Oscillate axially through the core like an optical coordinate scanner
      ringRef.current.position.z = Math.sin(state.clock.elapsedTime * 1.5) * 1.1;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <mesh ref={ringRef}>
      <ringGeometry args={[1.88, 1.94, 64]} />
      <meshBasicMaterial
        color="#00d4ff"
        side={THREE.DoubleSide}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

// ─── Main Digital Twin Core Assembly ───
function DigitalTwinCore({
  viewState,
  onStateChange,
}: {
  viewState: ExtendedViewState;
  onStateChange: (state: ExtendedViewState) => void;
}) {
  const coreGroup = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentExplosion, setCurrentExplosion] = useState(0);

  // Smooth explosion transition
  useFrame((_state, delta) => {
    const targetExplosion = viewState === 'exploded' ? 1.0 : 0.0;
    setCurrentExplosion((prev) => THREE.MathUtils.lerp(prev, targetExplosion, delta * 4));

    if (coreGroup.current) {
      coreGroup.current.rotation.x = Math.sin(_state.clock.elapsedTime * 0.4) * 0.06;
      coreGroup.current.rotation.y += 0.25 * delta;
    }
  });

  const handleClick = () => {
    const sequence: ExtendedViewState[] = ['metallic', 'wireframe', 'xray', 'blueprint', 'exploded'];
    const idx = sequence.indexOf(viewState);
    const nextState = sequence[(idx + 1) % sequence.length];
    onStateChange(nextState);
  };

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.35}>
      <group
        ref={coreGroup}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        rotation={[0.3, 0.4, 0]}
        scale={1.05}
      >
        {/* Impeller Rotor */}
        <ImpellerRotor
          viewState={viewState}
          isHovered={isHovered}
          explosionOffset={currentExplosion}
        />

        {/* Angular Bearing Race */}
        <BearingAssembly
          viewState={viewState}
          explosionOffset={currentExplosion}
        />

        {/* Gimbal Guidance Coordinate Rings */}
        <GimbalGuidanceRings
          viewState={viewState}
          isHovered={isHovered}
          explosionOffset={currentExplosion}
        />

        {/* Outer Generative Stator Shroud */}
        <StatorShroud
          viewState={viewState}
          isHovered={isHovered}
          explosionOffset={currentExplosion}
        />

        {/* Optical Scanning Line */}
        <LaserTelemetryRing />
      </group>
    </Float>
  );
}

// ─── Scene Lighting ───
function CoreLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 6]} intensity={1.4} castShadow color="#ffffff" />
      <directionalLight position={[-6, -4, -4]} intensity={0.8} color="#00d4ff" />
      <pointLight position={[0, 0, 3]} intensity={0.6} color="#40e0ff" distance={8} />
      <pointLight position={[0, -2, -3]} intensity={0.4} color="#f97316" distance={6} />
    </>
  );
}

// ─── WebGL Fallback ───
function WebGLFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[rgba(10,12,18,0.7)] rounded-2xl border border-[rgba(0,212,255,0.2)]">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Precision Blueprint Schematics Fallback */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--color-cyan)] opacity-70">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={50 + Math.cos(angle) * 22}
                y1={50 + Math.sin(angle) * 22}
                x2={50 + Math.cos(angle) * 36}
                y2={50 + Math.sin(angle) * 36}
                stroke="currentColor"
                strokeWidth="1.2"
              />
            );
          })}
        </svg>
      </div>
      <div className="mt-4 text-center">
        <div className="text-xs font-mono text-[var(--color-cyan)] font-bold tracking-widest uppercase">
          DIGITAL TWIN SCHEMATIC
        </div>
        <div className="text-[0.65rem] font-mono text-[var(--color-gunmetal)] mt-1">
          PRECISION ROTOR CORE // 2D COMPATIBILITY MODE
        </div>
      </div>
    </div>
  );
}

// ─── Exported Hero Scene Component ───
export default function HeroScene3D() {
  const { quality, supportsWebGL } = useDeviceQuality();
  const prefersReducedMotion = useReducedMotion();
  const [viewState, setViewState] = useState<ExtendedViewState>('metallic');
  const dpr = getCappedPixelRatio(quality);

  if (!supportsWebGL) {
    return <WebGLFallback />;
  }

  const modes: { id: ExtendedViewState; label: string; icon: typeof Layers }[] = [
    { id: 'metallic', label: 'METALLIC', icon: Box },
    { id: 'wireframe', label: 'CAD WIRE', icon: Layers },
    { id: 'xray', label: 'X-RAY', icon: Eye },
    { id: 'blueprint', label: 'BLUEPRINT', icon: FileCode2 },
    { id: 'exploded', label: 'EXPLODED', icon: Maximize2 },
  ];

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] flex flex-col items-center justify-center">
      {/* 3D Canvas */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 0, 4.6], fov: 42 }}
          gl={{
            antialias: quality !== 'low',
            alpha: true,
            powerPreference: quality === 'low' ? 'low-power' : 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <CoreLighting />
            <DigitalTwinCore viewState={viewState} onStateChange={setViewState} />
            <Environment preset="night" environmentIntensity={0.6} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={!prefersReducedMotion && viewState !== 'exploded'}
              autoRotateSpeed={0.4}
              maxPolarAngle={Math.PI * 0.75}
              minPolarAngle={Math.PI * 0.25}
              dampingFactor={0.06}
              enableDamping
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Engineering HUD View-State Selector Switcher */}
      <div className="w-full px-2 sm:px-4 mt-2 flex flex-col items-center gap-1.5 z-20">
        <div className="flex items-center gap-1 bg-[rgba(10,12,18,0.85)] border border-[rgba(0,212,255,0.2)] p-1 rounded-lg backdrop-blur-md shadow-lg max-w-full overflow-x-auto scrollbar-none">
          {modes.map((mode) => {
            const isSelected = viewState === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setViewState(mode.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[0.62rem] font-mono tracking-wider transition-all cursor-pointer flex-shrink-0 ${
                  isSelected
                    ? 'bg-[var(--color-cyan)] text-black font-bold shadow-[0_0_8px_var(--color-cyan)]'
                    : 'text-[var(--color-silver)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                }`}
                title={`Switch visualization to ${mode.label}`}
              >
                <Icon className="w-3 h-3" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Real-time Telemetry Status Bar */}
        <div className="flex items-center gap-3 text-[0.58rem] font-mono text-[var(--color-gunmetal)]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
            CORE: TURBOMACHINERY ROTOR
          </span>
          <span>&bull;</span>
          <span>MODE: {viewState.toUpperCase()}</span>
          <span>&bull;</span>
          <span className="hidden sm:inline">DRAG TO ORBIT // CLICK TO CYCLE</span>
        </div>
      </div>
    </div>
  );
}
