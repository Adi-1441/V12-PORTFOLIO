import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DigitalTwinState } from './DigitalTwinTypes';

interface CentralCoreProps {
  state: DigitalTwinState;
  explodedProgress: number;
}

export function CentralCore({ state, explodedProgress }: CentralCoreProps) {
  const coreRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (!coreRef.current) return;

    // Slow, weighted precision tumbling
    coreRef.current.rotation.x += delta * 0.22;
    coreRef.current.rotation.y += delta * 0.35;

    // Exploded view separation
    const targetY = -explodedProgress * 0.65;
    coreRef.current.position.y = THREE.MathUtils.lerp(coreRef.current.position.y, targetY, 0.08);

    if (innerRef.current) {
      innerRef.current.rotation.z -= delta * 0.5;
    }
  });

  const isWire = state === 'wireframe' || state === 'blueprint';
  const isXray = state === 'xray';
  const isBlueprint = state === 'blueprint';
  const isAnalysis = state === 'analysis';
  const isInspection = state === 'inspection';

  const outerColor = isBlueprint
    ? '#00D4FF'
    : isAnalysis
    ? '#F59E0B' // Von Mises peak stress indicator
    : isXray
    ? '#00D4FF'
    : '#1E2330'; // Dark titanium alloy

  const innerColor = isInspection ? '#F59E0B' : '#00D4FF';

  return (
    <group ref={coreRef}>
      {/* ─── Outer Faceted Sensor Shell (Dodecahedron) ─── */}
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[0.68, 0]} />
        <meshPhysicalMaterial
          color={outerColor}
          metalness={isXray ? 0.2 : 0.88}
          roughness={isXray ? 0.8 : 0.28}
          transparent={isXray || isWire}
          opacity={isXray ? 0.4 : isWire ? 0.8 : 0.96}
          wireframe={isWire}
          clearcoat={0.4}
        />
      </mesh>

      {/* Outer Shell Precision Edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.DodecahedronGeometry(0.685, 0)]} />
        <lineBasicMaterial
          color={isInspection ? '#F59E0B' : '#00D4FF'}
          transparent
          opacity={isBlueprint ? 0.95 : 0.4}
          linewidth={1.5}
        />
      </lineSegments>

      {/* ─── Inner Optical Waveguide Core (Icosahedron) ─── */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color={innerColor}
          emissive={innerColor}
          emissiveIntensity={isXray ? 1.2 : 0.4}
          wireframe={isWire || isBlueprint}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* ─── Orthogonal Fluid & Signal Ports ─── */}
      {[
        [0.72, 0, 0],
        [-0.72, 0, 0],
        [0, 0.72, 0],
        [0, -0.72, 0],
        [0, 0, 0.72],
        [0, 0, -0.72],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial
            color={isInspection ? '#F59E0B' : '#38BDF8'}
            emissive={isInspection ? '#F59E0B' : '#00D4FF'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
