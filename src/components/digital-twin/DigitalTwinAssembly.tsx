import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './useDigitalTwinStore';
import { StructuralGimbal } from './StructuralGimbal';
import { CentralCore } from './CentralCore';
import { InternalLattice } from './InternalLattice';
import { FlowField } from './FlowField';
import { InspectionOverlays } from './InspectionOverlays';

interface AssemblyProps {
  pointerPos?: { x: number; y: number };
}

export function DigitalTwinAssembly({ pointerPos = { x: 0, y: 0 } }: AssemblyProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { activeState, explodedProgress, autoRotate } = useDigitalTwinStore();

  useFrame((clockState, delta) => {
    if (!groupRef.current) return;

    // Steady overall Y-axis rotation when autoRotate is active
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.12;
    }

    // Subtle living breathing scale pulse
    const breathe = 1 + Math.sin(clockState.clock.elapsedTime * 1.4) * 0.015;
    groupRef.current.scale.setScalar(breathe);

    // Damped pointer tilt (clamp +/- 8 deg, ~0.14 rad)
    const targetTiltX = -pointerPos.y * 0.14;
    const targetTiltZ = pointerPos.x * 0.14;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetTiltX,
      0.08
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetTiltZ,
      0.08
    );
  });

  const isInspection = activeState === 'inspection';
  const isAnalysis = activeState === 'analysis';

  return (
    <group ref={groupRef}>
      {/* ─── Engineered Lighting Environment ─── */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[8, 10, 8]} intensity={1.8} color="#F8FAFC" />
      <directionalLight position={[-8, -6, -6]} intensity={0.6} color="#38BDF8" />
      <pointLight
        position={[0, 0, 0]}
        intensity={isInspection ? 2.0 : 1.2}
        color={isInspection ? '#F59E0B' : '#00D4FF'}
      />

      {/* ─── Digital Twin Subsystems ─── */}
      <CentralCore state={activeState} explodedProgress={explodedProgress} />
      <InternalLattice state={activeState} explodedProgress={explodedProgress} />
      <StructuralGimbal state={activeState} explodedProgress={explodedProgress} />
      <FlowField state={activeState} />
      <InspectionOverlays state={activeState} />
    </group>
  );
}
