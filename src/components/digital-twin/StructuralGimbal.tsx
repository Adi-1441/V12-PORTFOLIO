import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DigitalTwinState } from './DigitalTwinTypes';

interface StructuralGimbalProps {
  state: DigitalTwinState;
  explodedProgress: number;
}

export function StructuralGimbal({ state, explodedProgress }: StructuralGimbalProps) {
  const ringYawRef = useRef<THREE.Group>(null!);
  const ringPitchRef = useRef<THREE.Group>(null!);
  const ringRollRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    const isIdle = state === 'idle';
    const speedMult = isIdle ? 0.6 : 1.0;

    // Independent engineering rotational periods on mechanical gimbal axes
    if (ringYawRef.current) {
      ringYawRef.current.rotation.y += delta * 0.28 * speedMult;
    }
    if (ringPitchRef.current) {
      ringPitchRef.current.rotation.x += delta * 0.42 * speedMult;
    }
    if (ringRollRef.current) {
      ringRollRef.current.rotation.z += delta * 0.18 * speedMult;
    }

    // Exploded view axial separation
    const sep = explodedProgress * 0.95;
    if (ringYawRef.current) {
      ringYawRef.current.position.y = THREE.MathUtils.lerp(ringYawRef.current.position.y, sep * 0.7, 0.08);
    }
    if (ringPitchRef.current) {
      ringPitchRef.current.position.x = THREE.MathUtils.lerp(ringPitchRef.current.position.x, -sep * 0.8, 0.08);
    }
    if (ringRollRef.current) {
      ringRollRef.current.position.z = THREE.MathUtils.lerp(ringRollRef.current.position.z, sep * 1.1, 0.08);
    }
  });

  // Visual state styling parameters
  const isWire = state === 'wireframe' || state === 'blueprint';
  const isXray = state === 'xray';
  const isBlueprint = state === 'blueprint';
  const isAnalysis = state === 'analysis';
  const isInspection = state === 'inspection';

  const ringColor = isBlueprint
    ? '#00D4FF'
    : isAnalysis
    ? '#38BDF8'
    : isXray
    ? '#00D4FF'
    : '#A0AEC0'; // Titanium grey

  const ringOpacity = isXray ? 0.35 : isWire ? 0.85 : 0.95;
  const metalness = isXray ? 0.1 : 0.92;
  const roughness = isXray ? 0.9 : 0.24;

  return (
    <group>
      {/* ─── Outer Ring 1: Primary Gimbal (Radius ~1.95) ─── */}
      <group ref={ringYawRef}>
        <mesh>
          <torusGeometry args={[1.95, 0.055, 24, 80]} />
          <meshPhysicalMaterial
            color={ringColor}
            metalness={metalness}
            roughness={roughness}
            transparent={isXray || isWire}
            opacity={ringOpacity}
            wireframe={isWire}
            clearcoat={0.3}
          />
        </mesh>
        {/* Machined Chamfer Edges */}
        <lineSegments>
          <edgesGeometry args={[new THREE.TorusGeometry(1.95, 0.056, 12, 48)]} />
          <lineBasicMaterial
            color={isInspection ? '#F59E0B' : '#00D4FF'}
            transparent
            opacity={isBlueprint ? 0.9 : 0.45}
            linewidth={1.2}
          />
        </lineSegments>
        {/* Sensor Nodes mounted at 90-degree points */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.95, Math.sin(angle) * 1.95, 0]}
          >
            <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
            <meshStandardMaterial
              color={isInspection ? '#F59E0B' : '#00D4FF'}
              emissive={isInspection ? '#F59E0B' : '#00D4FF'}
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* ─── Middle Ring 2: Conformal Pitch Carrier (Radius ~1.58) ─── */}
      <group ref={ringPitchRef}>
        <mesh>
          <torusGeometry args={[1.58, 0.05, 20, 72]} />
          <meshPhysicalMaterial
            color={isAnalysis ? '#10B981' : ringColor}
            metalness={metalness}
            roughness={roughness}
            transparent={isXray || isWire}
            opacity={ringOpacity}
            wireframe={isWire}
            clearcoat={0.3}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.TorusGeometry(1.58, 0.051, 10, 40)]} />
          <lineBasicMaterial
            color={isInspection ? '#F59E0B' : '#00D4FF'}
            transparent
            opacity={0.4}
          />
        </lineSegments>
      </group>

      {/* ─── Inner Ring 3: Core Stabilizer (Radius ~1.22) ─── */}
      <group ref={ringRollRef}>
        <mesh>
          <torusGeometry args={[1.22, 0.045, 18, 64]} />
          <meshPhysicalMaterial
            color={isAnalysis ? '#F59E0B' : ringColor}
            metalness={metalness}
            roughness={roughness}
            transparent={isXray || isWire}
            opacity={ringOpacity}
            wireframe={isWire}
            clearcoat={0.3}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.TorusGeometry(1.22, 0.046, 8, 32)]} />
          <lineBasicMaterial color="#00D4FF" transparent opacity={0.35} />
        </lineSegments>
      </group>
    </group>
  );
}
